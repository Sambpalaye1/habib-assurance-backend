// 🔒 MIDDLEWARES DE SÉCURITÉ - NIVEAU EXPERT SENIOR
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');
const crypto = require('crypto');

// Configuration Helmet niveau enterprise
const securityConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.render.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            manifestSrc: ["'self'"],
            workerSrc: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: ['strict-origin-when-cross-origin'] },
    permissionsPolicy: {
        features: {
            camera: ["'none'"],
            microphone: ["'none'"],
            geolocation: ["'none'"],
            payment: ["'none'"],
            usb: ["'none'"],
            accelerometer: ["'none'"],
            gyroscope: ["'none'"]
        }
    }
});

// Rate limiting avancé
const createRateLimit = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + ':' + req.headers['user-agent'],
    handler: (req, res) => {
        console.warn(`🚨 Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: message, retryAfter: Math.ceil(windowMs / 1000) });
    }
});

// Rate limits spécifiques
const authLimiter = createRateLimit(15 * 60 * 1000, 5, 'Trop de tentatives de connexion. Réessayez plus tard.');
const apiLimiter = createRateLimit(60 * 1000, 100, 'Trop de requêtes API.');
const uploadLimiter = createRateLimit(60 * 1000, 10, 'Trop d\'uploads.');

// Validation et sanitization des inputs
class InputValidator {
    static sanitizeInput(input, type) {
        if (!input || typeof input !== 'string') {
            throw new Error('Input invalide');
        }

        const sanitized = input.trim().replace(/[<>]/g, '');

        switch (type) {
            case 'email':
                if (!validator.isEmail(sanitized)) {
                    throw new Error('Email invalide');
                }
                return validator.normalizeEmail(sanitized);
                
            case 'phone':
                const cleanPhone = sanitized.replace(/[^\d+]/g, '');
                if (!validator.isMobilePhone(cleanPhone, 'SN')) {
                    throw new Error('Téléphone invalide');
                }
                return cleanPhone;
                
            case 'name':
                if (!validator.matches(sanitized, /^[a-zA-Z\sàâäéèêëïîôöùûüÿç-]{2,50}$/)) {
                    throw new Error('Nom invalide');
                }
                return sanitized;
                
            case 'text':
                return DOMPurify.sanitize(sanitized, {
                    ALLOWED_TAGS: [],
                    ALLOWED_ATTR: []
                });
                
            default:
                return DOMPurify.sanitize(sanitized);
        }
    }

    static validateSQLParams(params) {
        Object.keys(params).forEach(key => {
            if (typeof params[key] === 'string') {
                const sqlPatterns = [
                    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXECUTE|UNION|SCRIPT|DECLARE)\s/i,
                    /(\s|^)(OR|AND)\s+\d+\s*=\s*\d+/i,
                    /(\s|^)(OR|AND)\s+['"].*['"]\s*=\s*['"].*['"]/i,
                    /--|\/\*|\*\/|;/i
                ];
                
                if (sqlPatterns.some(pattern => pattern.test(params[key]))) {
                    throw new Error('Paramètre SQL malveillant détecté');
                }
            }
        });
        
        return params;
    }
}

// Middleware de validation
const validateInput = (type) => {
    return (req, res, next) => {
        try {
            if (req.body && Object.keys(req.body).length > 0) {
                Object.keys(req.body).forEach(key => {
                    req.body[key] = InputValidator.sanitizeInput(req.body[key], type);
                });
            }
            
            if (req.query && Object.keys(req.query).length > 0) {
                Object.keys(req.query).forEach(key => {
                    req.query[key] = InputValidator.sanitizeInput(req.query[key], type);
                });
            }
            
            next();
        } catch (error) {
            console.error('🚨 Input validation failed:', error.message);
            res.status(400).json({ error: 'Données invalides', details: error.message });
        }
    };
};

// Middleware de logging sécurité
const securityLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            duration,
            timestamp: new Date().toISOString()
        };
        
        // Log des requêtes suspectes
        if (res.statusCode >= 400 || duration > 5000) {
            console.warn('🚨 Suspicious request:', logData);
        }
    });
    
    next();
};

// Middleware de détection d'intrusion
class IntrusionDetection {
    constructor() {
        this.suspiciousPatterns = new Map();
        this.blockedIPs = new Set();
        this.anomalyThreshold = 100;
    }

    middleware() {
        return (req, res, next) => {
            const clientIP = req.ip;
            
            // Vérification blacklist
            if (this.blockedIPs.has(clientIP)) {
                console.warn('🚨 Blocked IP access attempt:', clientIP);
                return res.status(403).json({ error: 'IP bloquée' });
            }
            
            // Détection de patterns suspects
            this.detectSuspiciousPatterns(req);
            
            // Détection d'anomalies
            this.detectAnomalies(clientIP, req.path, req.method);
            
            next();
        };
    }
    
    detectSuspiciousPatterns(req) {
        const suspicious = [
            /\.\./,
            /<script/i,
            /union.*select/i,
            /javascript:/i,
            /data:text\/html/i,
            /%3Cscript/i
        ];

        const url = req.url;
        const body = JSON.stringify(req.body);

        suspicious.forEach(pattern => {
            if (pattern.test(url) || pattern.test(body)) {
                console.warn('🚨 Suspicious pattern detected:', {
                    ip: req.ip,
                    pattern: pattern.toString(),
                    url
                });
                this.blockIP(req.ip, 3600);
            }
        });
    }
    
    detectAnomalies(ip, endpoint, method) {
        const key = `${ip}:${endpoint}:${method}`;
        const now = Date.now();
        
        if (!this.suspiciousPatterns.has(key)) {
            this.suspiciousPatterns.set(key, {
                count: 1,
                firstSeen: now,
                lastSeen: now
            });
        } else {
            const pattern = this.suspiciousPatterns.get(key);
            pattern.count++;
            pattern.lastSeen = now;
            
            if (pattern.count > this.anomalyThreshold) {
                console.warn('🚨 Anomalous activity detected:', {
                    ip,
                    endpoint,
                    method,
                    count: pattern.count
                });
                
                if (pattern.count > this.anomalyThreshold * 2) {
                    this.blockIP(ip, 7200);
                }
            }
        }
    }
    
    blockIP(ip, duration) {
        this.blockedIPs.add(ip);
        setTimeout(() => {
            this.blockedIPs.delete(ip);
        }, duration * 1000);
    }
}

const ids = new IntrusionDetection();

module.exports = {
    securityConfig,
    authLimiter,
    apiLimiter,
    uploadLimiter,
    validateInput,
    securityLogger,
    ids: ids.middleware(),
    InputValidator
};
