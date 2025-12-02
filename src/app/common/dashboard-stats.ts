export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  activeUsers: number;
  newUsersToday: number;
  lowStockProducts: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
  category: string;
}

export interface CategorySales {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByPeriod {
  period: string; // "January 2025", "Week 48", etc.
  revenue: number;
  orders: number;
  profit: number;
}
