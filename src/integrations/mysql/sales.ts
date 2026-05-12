import mysqlClient from "./client";
import type { Sale, CreateSaleData, UpdateSaleData, InsurancePolicy, CreatePolicyData, SalesStats, ExpiringPolicy } from "./types";
import type { ResultSetHeader } from "mysql2";

export class SalesService {
  async createSale(data: CreateSaleData): Promise<Sale> {
    const result = (await mysqlClient.insert("sales", data)) as ResultSetHeader;
    
    const sale = (await mysqlClient.getOne(
      "SELECT * FROM sales WHERE id = ?",
      [result.insertId]
    )) as Sale;

    return sale;
  }

  async getSaleById(id: string): Promise<Sale | null> {
    const sale = (await mysqlClient.getOne(
      "SELECT * FROM sales WHERE id = ?",
      [id]
    )) as Sale;

    return sale;
  }

  async getAllSales(limit = 50, offset = 0): Promise<Sale[]> {
    const sales = (await mysqlClient.query(
      "SELECT * FROM sales ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    )) as Sale[];

    return sales;
  }

  async updateSale(id: string, data: UpdateSaleData): Promise<Sale | null> {
    await mysqlClient.update("sales", data, { id });
    
    const updatedSale = await this.getSaleById(id);
    return updatedSale;
  }

  async deleteSale(id: string): Promise<boolean> {
    const result = (await mysqlClient.delete("sales", { id })) as ResultSetHeader;
    return result.affectedRows > 0;
  }

  async getSalesByStatus(status: "pending" | "confirmed" | "cancelled"): Promise<Sale[]> {
    const sales = (await mysqlClient.query(
      "SELECT * FROM sales WHERE status = ? ORDER BY created_at DESC",
      [status]
    )) as Sale[];

    return sales;
  }

  async confirmSale(saleId: string, startDate?: string): Promise<InsurancePolicy | null> {
    // Mettre à jour le statut de la vente
    await this.updateSale(saleId, { status: "confirmed" });

    // Créer la police d'assurance
    const sale = await this.getSaleById(saleId);
    if (!sale) return null;

    const policyData: CreatePolicyData = {
      sale_id: saleId,
      client_name: sale.client_name,
      client_phone: sale.client_phone || "",
      vehicle_brand: sale.vehicle_brand,
      vehicle_model: sale.vehicle_model,
      formula: sale.formula,
      start_date: startDate || new Date().toISOString().split("T")[0],
      end_date: this.calculateEndDate(startDate || new Date().toISOString().split("T")[0], sale.duration_months),
      duration_months: sale.duration_months,
      premium_amount: sale.premium_paid,
    };

    const policyResult = (await mysqlClient.insert("insurance_policies", policyData)) as ResultSetHeader;
    
    const policy = (await mysqlClient.getOne(
      "SELECT * FROM insurance_policies WHERE id = ?",
      [policyResult.insertId]
    )) as InsurancePolicy;

    return policy;
  }

  private calculateEndDate(startDate: string, durationMonths: number): string {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    return end.toISOString().split("T")[0];
  }

  async getSalesStats(dateRange?: { start: string; end: string }): Promise<SalesStats[]> {
    let query = "SELECT * FROM sales_stats";
    const params: any[] = [];

    if (dateRange) {
      query += " WHERE sale_date BETWEEN ? AND ?";
      params.push(dateRange.start, dateRange.end);
    }

    query += " ORDER BY sale_date DESC";

    const stats = (await mysqlClient.query(query, params)) as SalesStats[];
    return stats;
  }

  async searchSales(searchTerm: string): Promise<Sale[]> {
    const sales = (await mysqlClient.query(
      `SELECT * FROM sales 
       WHERE client_name LIKE ? 
       OR client_phone LIKE ? 
       OR vehicle_brand LIKE ? 
       OR vehicle_model LIKE ?
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    )) as Sale[];

    return sales;
  }

  async getSalesByUser(userId: string): Promise<Sale[]> {
    const sales = (await mysqlClient.query(
      "SELECT * FROM sales WHERE created_by = ? ORDER BY created_at DESC",
      [userId]
    )) as Sale[];

    return sales;
  }

  async getTotalRevenue(): Promise<number> {
    const result = (await mysqlClient.getOne(
      "SELECT SUM(premium_paid) as total FROM sales WHERE status = 'confirmed'"
    )) as { total: number };

    return result.total || 0;
  }

  async getPendingSalesCount(): Promise<number> {
    const result = (await mysqlClient.getOne(
      "SELECT COUNT(*) as count FROM sales WHERE status = 'pending'"
    )) as { count: number };

    return result.count || 0;
  }
}

export const salesService = new SalesService();
