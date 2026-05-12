import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import mysqlClient from "./client";
import type { User, UserRole, AuthUser, LoginCredentials } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  async register(email: string, password: string): Promise<AuthUser> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await mysqlClient.getOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await mysqlClient.insert('users', {
      email,
      password_hash: passwordHash
    }) as any;

    // Récupérer le rôle de l'utilisateur
    const userRole = await mysqlClient.getOne(
      'SELECT role FROM user_roles WHERE user_id = ?',
      [result.insertId]
    ) as any;

    return {
      id: result.insertId,
      email,
      role: userRole?.role || 'dev',
      last_sign_in_at: new Date().toISOString()
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { email, password } = credentials;

    // Récupérer l'utilisateur
    const user = await mysqlClient.getOne(
      'SELECT id, email, password_hash, is_active FROM users WHERE email = ?',
      [email]
    ) as User;

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (!user.is_active) {
      throw new Error('Compte désactivé');
    }

    if (!user.password_hash) {
      throw new Error('Mot de passe non configuré');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Récupérer le rôle
    const userRole = await mysqlClient.getOne(
      'SELECT role FROM user_roles WHERE user_id = ?',
      [user.id]
    ) as UserRole;

    // Mettre à jour la dernière connexion
    await mysqlClient.update('users', 
      { last_sign_in_at: new Date().toISOString() },
      { id: user.id }
    );

    return {
      id: user.id,
      email: user.email,
      role: userRole?.role || 'dev',
      last_sign_in_at: new Date().toISOString()
    };
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    const user = await mysqlClient.getOne(
      'SELECT id, email, is_active FROM users WHERE id = ?',
      [userId]
    ) as User;

    if (!user || !user.is_active) {
      return null;
    }

    const userRole = await mysqlClient.getOne(
      'SELECT role FROM user_roles WHERE user_id = ?',
      [user.id]
    ) as UserRole;

    return {
      id: user.id,
      email: user.email,
      role: userRole?.role || 'dev'
    };
  }

  async hasRole(userId: string, role: 'admin' | 'dev'): Promise<boolean> {
    const userRole = await mysqlClient.getOne(
      'SELECT role FROM user_roles WHERE user_id = ? AND role = ?',
      [userId, role]
    ) as UserRole;

    return !!userRole;
  }

  generateToken(user: AuthUser): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string): AuthUser {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  async createAdminUser(email: string, password: string): Promise<void> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await mysqlClient.getOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await mysqlClient.insert('users', {
      email,
      password_hash: passwordHash
    }) as any;

    // Donner le rôle admin
    await mysqlClient.insert('user_roles', {
      user_id: result.insertId,
      role: 'admin'
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Récupérer l'utilisateur
    const user = await mysqlClient.getOne(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    ) as User;

    if (!user || !user.password_hash) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Ancien mot de passe incorrect');
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await mysqlClient.update('users', 
      { password_hash: newPasswordHash },
      { id: userId }
    );
  }
}

export const authService = new AuthService();
