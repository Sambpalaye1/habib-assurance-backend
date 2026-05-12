// 🔒 SYSTÈME D'AUTHENTIFICATION SÉCURISÉ - NIVEAU EXPERT SENIOR
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const secureDB = require('./database-secure');

class SecureAuth {
    constructor() {
        this.jwtKeys = this.generateJWTKeys();
        this.failedAttempts = new Map();
        this.tokenBlacklist = new Set();
        this.sessions = new Map();
        this.keyRotationInterval = 24 * 60 * 60 * 1000; // 24 heures
        this.maxFailedAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        
        this.initKeyRotation();
        this.initCleanup();
    }

    generateJWTKeys() {
        return {
            current: crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
            }),
            previous: null
        };
    }

    async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateTokens(payload) {
        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            ...payload,
            iat: now,
            jti: crypto.randomUUID(),
            type: 'access'
        };

        const accessToken = jwt.sign(tokenPayload, this.jwtKeys.current.privateKey, {
            algorithm: 'RS256',
            expiresIn: '15m',
            issuer: 'habib-assurance.com',
            audience: 'habib-assurance-api'
        });

        const refreshTokenPayload = {
            ...payload,
            iat: now,
            jti: crypto.randomUUID(),
            type: 'refresh'
        };

        const refreshToken = jwt.sign(refreshTokenPayload, this.jwtKeys.current.privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d',
            issuer: 'habib-assurance.com',
            audience: 'habib-assurance-api'
        });

        // Stocker la session
        this.sessions.set(tokenPayload.jti, {
            userId: payload.userId,
            createdAt: now,
            lastActivity: now,
            ip: payload.ip,
            userAgent: payload.userAgent
        });

        return { accessToken, refreshToken };
    }

    verifyToken(token, type = 'access') {
        try {
            // Vérifier blacklist
            if (this.tokenBlacklist.has(token)) {
                throw new Error('Token révoqué');
            }

            // Essayer avec la clé actuelle
            let decoded;
            try {
                decoded = jwt.verify(token, this.jwtKeys.current.publicKey, {
                    algorithms: ['RS256'],
                    issuer: 'habib-assurance.com',
                    audience: 'habib-assurance-api'
                });
            } catch (error) {
                // Essayer avec la clé précédente si rotation
                if (this.jwtKeys.previous) {
                    decoded = jwt.verify(token, this.jwtKeys.previous.publicKey, {
                        algorithms: ['RS256'],
                        issuer: 'habib-assurance.com',
                        audience: 'habib-assurance-api'
                    });
                } else {
                    throw error;
                }
            }

            // Vérifier le type de token
            if (decoded.type !== type) {
                throw new Error('Type de token invalide');
            }

            // Vérifier la session
            const session = this.sessions.get(decoded.jti);
            if (!session) {
                throw new Error('Session invalide');
            }

            // Mettre à jour l'activité
            session.lastActivity = Math.floor(Date.now() / 1000);

            return decoded;
        } catch (error) {
            this.logSecurityEvent('TOKEN_VERIFICATION_FAILED', {
                error: error.message,
                token: token.substring(0, 20) + '...'
            });
            throw error;
        }
    }

    async login(email, password, ip, userAgent) {
        // Vérifier lockout
        if (this.isAccountLocked(email)) {
            throw new Error('Compte temporairement verrouillé. Réessayez plus tard.');
        }

        try {
            // Récupérer l'utilisateur
            const users = await secureDB.getUserByEmail(email);
            if (!users || users.length === 0) {
                this.recordFailedAttempt(email, ip);
                throw new Error('Email ou mot de passe incorrect');
            }

            const user = users[0];

            // Vérifier si le compte est actif
            if (user.status !== 'active') {
                throw new Error('Compte inactif');
            }

            // Vérifier le mot de passe
            const isValidPassword = await this.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                this.recordFailedAttempt(email, ip);
                throw new Error('Email ou mot de passe incorrect');
            }

            // Réinitialiser les tentatives échouées
            this.resetFailedAttempts(email);

            // Générer les tokens
            const tokens = this.generateTokens({
                userId: user.id,
                email: user.email,
                role: user.role,
                ip,
                userAgent
            });

            // Mettre à jour last_login
            await this.updateLastLogin(user.id);

            this.logSecurityEvent('LOGIN_SUCCESS', {
                userId: user.id,
                email,
                ip,
                userAgent
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                tokens
            };
        } catch (error) {
            this.logSecurityEvent('LOGIN_FAILED', {
                email,
                ip,
                userAgent,
                error: error.message
            });
            throw error;
        }
    }

    async logout(accessToken) {
        try {
            const decoded = jwt.decode(accessToken);
            if (decoded) {
                // Ajouter à la blacklist
                this.tokenBlacklist.add(accessToken);
                
                // Supprimer la session
                this.sessions.delete(decoded.jti);

                this.logSecurityEvent('LOGOUT_SUCCESS', {
                    userId: decoded.userId,
                    jti: decoded.jti
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async refreshToken(refreshToken, ip, userAgent) {
        try {
            const decoded = this.verifyToken(refreshToken, 'refresh');

            // Générer de nouveaux tokens
            const newTokens = this.generateTokens({
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                ip,
                userAgent
            });

            // Ajouter l'ancien refresh token à la blacklist
            this.tokenBlacklist.add(refreshToken);

            this.logSecurityEvent('TOKEN_REFRESH_SUCCESS', {
                userId: decoded.userId
            });

            return newTokens;
        } catch (error) {
            this.logSecurityEvent('TOKEN_REFRESH_FAILED', {
                error: error.message
            });
            throw error;
        }
    }

    isAccountLocked(email) {
        const attempts = this.failedAttempts.get(email);
        if (!attempts) return false;

        const now = Date.now();
        const lockoutEnd = attempts.lastAttempt + this.lockoutDuration;

        return attempts.count >= this.maxFailedAttempts && now < lockoutEnd;
    }

    recordFailedAttempt(email, ip) {
        const now = Date.now();
        const attempts = this.failedAttempts.get(email) || {
            count: 0,
            lastAttempt: 0,
            ips: new Set()
        };

        attempts.count++;
        attempts.lastAttempt = now;
        attempts.ips.add(ip);

        this.failedAttempts.set(email, attempts);

        this.logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
            email,
            ip,
            attemptCount: attempts.count,
            timestamp: new Date().toISOString()
        });

        // Alert si seuil dépassé
        if (attempts.count >= this.maxFailedAttempts) {
            this.logSecurityEvent('ACCOUNT_LOCKED', {
                email,
                ip,
                attemptCount: attempts.count
            });
        }
    }

    resetFailedAttempts(email) {
        this.failedAttempts.delete(email);
    }

    async updateLastLogin(userId) {
        try {
            await secureDB.query(
                'UPDATE users SET last_login = NOW() WHERE id = ?',
                [userId]
            );
        } catch (error) {
            console.error('Failed to update last login:', error);
        }
    }

    initKeyRotation() {
        setInterval(() => {
            this.rotateKeys();
        }, this.keyRotationInterval);
    }

    rotateKeys() {
        console.log('🔄 Rotating JWT keys...');
        
        // Sauvegarder l'ancienne clé
        this.jwtKeys.previous = this.jwtKeys.current;
        
        // Générer une nouvelle clé
        this.jwtKeys.current = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        // Nettoyer l'ancienne clé après 1 heure
        setTimeout(() => {
            this.jwtKeys.previous = null;
        }, 60 * 60 * 1000);

        this.logSecurityEvent('JWT_KEYS_ROTATED', {
            timestamp: new Date().toISOString()
        });
    }

    initCleanup() {
        // Nettoyage périodique
        setInterval(() => {
            this.cleanup();
        }, 60 * 60 * 1000); // Chaque heure
    }

    cleanup() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        // Nettoyer les sessions expirées
        for (const [jti, session] of this.sessions.entries()) {
            if (now - (session.lastActivity * 1000) > oneHour) {
                this.sessions.delete(jti);
            }
        }

        // Nettoyer les tentatives échouées expirées
        for (const [email, attempts] of this.failedAttempts.entries()) {
            if (now - attempts.lastAttempt > oneHour) {
                this.failedAttempts.delete(email);
            }
        }

        // Nettoyer la blacklist (garder 7 jours)
        const blacklistArray = Array.from(this.tokenBlacklist);
        this.tokenBlacklist.clear();
        
        blacklistArray.forEach(token => {
            try {
                const decoded = jwt.decode(token);
                if (decoded && (now - (decoded.iat * 1000)) < sevenDays) {
                    this.tokenBlacklist.add(token);
                }
            } catch (error) {
                // Ignorer les tokens invalides
            }
        });

        console.log('🧹 Security cleanup completed');
    }

    logSecurityEvent(event, data) {
        console.error(`🚨 SECURITY EVENT - ${event}:`, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    // Middleware d'authentification
    requireAuth() {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return res.status(401).json({ error: 'Token manquant' });
                }

                const token = authHeader.substring(7);
                const decoded = this.verifyToken(token);

                // Ajouter les infos utilisateur à la requête
                req.user = {
                    id: decoded.userId,
                    email: decoded.email,
                    role: decoded.role
                };

                next();
            } catch (error) {
                res.status(401).json({ error: 'Token invalide' });
            }
        };
    }

    requireRole(role) {
        return (req, res, next) => {
            if (!req.user || req.user.role !== role) {
                return res.status(403).json({ error: 'Permissions insuffisantes' });
            }
            next();
        };
    }

    // Méthodes utilitaires
    async createUser(userData) {
        const hashedPassword = await this.hashPassword(userData.password);
        
        const result = await secureDB.query(
            `INSERT INTO users (email, password_hash, name, role, created_at) 
             VALUES (?, ?, ?, 'user', NOW())`,
            [userData.email, hashedPassword, userData.name]
        );

        return result.insertId;
    }

    async getUserById(userId) {
        const users = await secureDB.query(
            `SELECT id, email, name, role, created_at, last_login 
             FROM users 
             WHERE id = ? AND deleted_at IS NULL`,
            [userId]
        );

        return users.length > 0 ? users[0] : null;
    }
}

// Singleton
const secureAuth = new SecureAuth();

module.exports = secureAuth;
