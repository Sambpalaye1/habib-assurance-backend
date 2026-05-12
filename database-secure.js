// 🔒 CONNEXION BASE DE DONNÉES SÉCURISÉE - NIVEAU EXPERT SENIOR
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const fs = require('fs');

class SecureDatabase {
    constructor() {
        this.pool = null;
        this.connectionAttempts = new Map();
        this.maxRetries = 3;
        this.initConnection();
    }

    initConnection() {
        try {
            // Configuration SSL/TLS pour MySQL
            const sslConfig = {
                rejectUnauthorized: true,
                ca: this.loadCertificate('ca'),
                key: this.loadCertificate('client-key'),
                cert: this.loadCertificate('client-cert')
            };

            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'habib_secure',
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME || 'habib_assurance',
                ssl: sslConfig,
                connectionLimit: 10,
                acquireTimeout: 60000,
                timeout: 60000,
                reconnect: true,
                charset: 'utf8mb4',
                timezone: '+00:00',
                multipleStatements: false, // Sécurité anti-injection
                namedPlaceholders: true
            });

            // Validation de la connexion
            this.validateConnection();
        } catch (error) {
            console.error('🚨 Database connection failed:', error);
            throw new Error('Failed to initialize secure database connection');
        }
    }

    loadCertificate(type) {
        try {
            const certPath = `./certs/${type}.pem`;
            if (fs.existsSync(certPath)) {
                return fs.readFileSync(certPath);
            }
            return null; // En développement, les certs peuvent ne pas exister
        } catch (error) {
            console.warn(`⚠️ Certificate ${type} not found, using insecure connection`);
            return null;
        }
    }

    async validateConnection() {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            console.log('✅ Database connection validated successfully');
        } catch (error) {
            console.error('🚨 Database validation failed:', error);
            throw error;
        }
    }

    async query(sql, params = []) {
        const connectionId = this.generateConnectionId();
        
        try {
            // Validation anti-injection SQL
            this.validateSQLQuery(sql, params);
            
            // Rate limiting par IP si disponible
            const clientIP = this.getCurrentIP();
            if (this.isRateLimited(clientIP)) {
                throw new Error('Trop de requêtes. Réessayez plus tard.');
            }

            const connection = await this.pool.getConnection();
            
            try {
                // Log de la requête (sans données sensibles)
                this.logQuery(sql, params, connectionId);
                
                // Exécution sécurisée
                const [rows] = await connection.execute(sql, params);
                
                // Log de succès
                this.logQuerySuccess(sql, connectionId);
                
                return rows;
            } finally {
                connection.release();
            }
        } catch (error) {
            // Log d'erreur
            this.logQueryError(sql, error, connectionId);
            
            // Gestion des retries
            if (this.shouldRetry(error)) {
                return this.retryQuery(sql, params, connectionId);
            }
            
            throw error;
        }
    }

    validateSQLQuery(sql, params) {
        // Patterns d'injection SQL à détecter
        const maliciousPatterns = [
            /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXECUTE|UNION|SCRIPT|DECLARE)\s/i,
            /(\s|^)(OR|AND)\s+\d+\s*=\s*\d+/i,
            /(\s|^)(OR|AND)\s+['"].*['"]\s*=\s*['"].*['"]/i,
            /--|\/\*|\*\/|;/i,
            /(\s|^)(WAITFOR|DELAY)\s/i,
            /(\s|^)(BENCHMARK|SLEEP)\s*\(/i,
            /(\s|^)(LOAD_FILE|INTO\s+OUTFILE)\s/i
        ];

        // Validation de la requête SQL
        if (maliciousPatterns.some(pattern => pattern.test(sql))) {
            const error = new Error('Tentative d\'injection SQL détectée');
            this.logSecurityEvent('SQL_INJECTION_ATTEMPT', { sql, params });
            throw error;
        }

        // Validation des paramètres
        if (params && Array.isArray(params)) {
            params.forEach((param, index) => {
                if (typeof param === 'string') {
                    if (maliciousPatterns.some(pattern => pattern.test(param))) {
                        const error = new Error(`Paramètre malveillant détecté à l'index ${index}`);
                        this.logSecurityEvent('MALICIOUS_PARAM_DETECTED', { param, index });
                        throw error;
                    }
                }
            });
        }
    }

    detectSQLInjection(input) {
        const patterns = [
            /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXECUTE|UNION|SCRIPT|DECLARE)\s/i,
            /(\s|^)(OR|AND)\s+\d+\s*=\s*\d+/i,
            /(\s|^)(OR|AND)\s+['"].*['"]\s*=\s*['"].*['"]/i,
            /--|\/\*|\*\/|;/i,
            /(\s|^)(WAITFOR|DELAY)\s/i
        ];
        
        return patterns.some(pattern => pattern.test(input));
    }

    async transaction(callback) {
        const connection = await this.pool.getConnection();
        
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async escapeIdentifier(identifier) {
        // Échappement sécurisé des identifiants
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
            throw new Error('Identifiant invalide');
        }
        return `\`${identifier}\``;
    }

    generateConnectionId() {
        return crypto.randomBytes(16).toString('hex');
    }

    getCurrentIP() {
        // En environnement réel, obtenir l'IP du contexte de la requête
        return process.env.CLIENT_IP || 'unknown';
    }

    isRateLimited(ip) {
        const now = Date.now();
        const windowMs = 60000; // 1 minute
        const maxRequests = 100;

        if (!this.connectionAttempts.has(ip)) {
            this.connectionAttempts.set(ip, []);
        }

        const attempts = this.connectionAttempts.get(ip);
        
        // Nettoyage des anciennes tentatives
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        this.connectionAttempts.set(ip, validAttempts);

        return validAttempts.length >= maxRequests;
    }

    shouldRetry(error) {
        // Conditions pour retry
        const retryableErrors = [
            'ER_LOCK_WAIT_TIMEOUT',
            'ER_DEADLOCK_FOUND',
            'ETIMEDOUT',
            'ECONNRESET'
        ];

        return retryableErrors.some(code => error.code === code || error.message.includes(code));
    }

    async retryQuery(sql, params, connectionId) {
        const maxRetries = 3;
        const baseDelay = 1000; // 1 seconde

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await this.sleep(delay);
                
                console.log(`🔄 Retry attempt ${attempt}/${maxRetries} for query ${connectionId}`);
                return await this.query(sql, params);
            } catch (error) {
                if (attempt === maxRetries || !this.shouldRetry(error)) {
                    throw error;
                }
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logQuery(sql, params, connectionId) {
        // Log sans données sensibles
        const sanitizedParams = params.map(param => {
            if (typeof param === 'string' && param.length > 100) {
                return param.substring(0, 50) + '...';
            }
            return param;
        });

        console.log(`📊 Query ${connectionId}:`, {
            sql: sql.substring(0, 200),
            params: sanitizedParams,
            timestamp: new Date().toISOString()
        });
    }

    logQuerySuccess(sql, connectionId) {
        console.log(`✅ Query ${connectionId} completed successfully`);
    }

    logQueryError(sql, error, connectionId) {
        console.error(`❌ Query ${connectionId} failed:`, {
            sql: sql.substring(0, 200),
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }

    logSecurityEvent(event, data) {
        console.error(`🚨 SECURITY EVENT - ${event}:`, {
            ...data,
            timestamp: new Date().toISOString(),
            ip: this.getCurrentIP()
        });
    }

    // Méthodes utilitaires sécurisées
    async getUserByEmail(email) {
        const sql = `
            SELECT id, email, password_hash, created_at, last_login
            FROM users 
            WHERE email = ? AND deleted_at IS NULL
            LIMIT 1
        `;
        
        return await this.query(sql, [email]);
    }

    async createQuote(data) {
        const sql = `
            INSERT INTO insurance_quotes 
            (client_name, email, phone, vehicle_make, vehicle_model, 
             vehicle_year, coverage_type, created_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')
        `;
        
        const params = [
            data.clientName,
            data.email,
            data.phone,
            data.vehicleMake,
            data.vehicleModel,
            data.vehicleYear,
            data.coverageType
        ];
        
        return await this.query(sql, params);
    }

    async getQuoteById(quoteId, userId = null) {
        let sql = `
            SELECT id, client_name, email, phone, vehicle_make, vehicle_model,
                   vehicle_year, coverage_type, amount, status, created_at
            FROM insurance_quotes 
            WHERE id = ? AND deleted_at IS NULL
        `;
        
        const params = [quoteId];
        
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        
        sql += ' LIMIT 1';
        
        return await this.query(sql, params);
    }

    // Fermeture propre des connexions
    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('✅ Database pool closed successfully');
        }
    }
}

// Singleton pour la connexion sécurisée
const secureDB = new SecureDatabase();

module.exports = secureDB;
