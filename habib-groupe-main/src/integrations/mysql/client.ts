import mysql from 'mysql2/promise';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

class MySQLClient {
  private connection: mysql.Connection | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'habib_assurance'
    };
  }

  async connect(): Promise<mysql.Connection> {
    if (!this.connection) {
      try {
        this.connection = await mysql.createConnection(this.config);
        console.log('Connected to MySQL database');
      } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
      }
    }
    return this.connection;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('Disconnected from MySQL database');
    }
  }

  async query(sql: string, params?: any[]): Promise<RowDataPacket[] | ResultSetHeader> {
    const connection = await this.connect();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as RowDataPacket[] | ResultSetHeader;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  async getOne(sql: string, params?: any[]): Promise<RowDataPacket | null> {
    const rows = await this.query(sql, params) as RowDataPacket[];
    return rows.length > 0 ? rows[0] : null;
  }

  async insert(table: string, data: Record<string, any>): Promise<ResultSetHeader> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values) as ResultSetHeader;
    
    return result;
  }

  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<ResultSetHeader> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const result = await this.query(sql, [...values, ...whereValues]) as ResultSetHeader;
    
    return result;
  }

  async delete(table: string, where: Record<string, any>): Promise<ResultSetHeader> {
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');
    
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.query(sql, whereValues) as ResultSetHeader;
    
    return result;
  }

  async transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
    const connection = await this.connect();
    await connection.beginTransaction();
    
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
}

// Singleton instance
const mysqlClient = new MySQLClient();

export default mysqlClient;
export type { DatabaseConfig };
