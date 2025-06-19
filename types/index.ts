export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  description?: string
}

export interface OrderItem extends MenuItem {
  quantity: number
}

export interface CompletedOrder {
  id: string
  customerName: string
  items: OrderItem[]
  total: number
  orderType: "Dine In" | "Take Out"
  timestamp: Date
  status: "Completed" | "Pending" | "Cancelled"
}

export type SidebarView = "menu" | "orders" | "sales" | "inventory" | "profile"
