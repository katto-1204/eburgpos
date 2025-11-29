-- eBURG POS System Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS order_product CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS cashier CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

-- Customer Table
CREATE TABLE customer (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE admin (
  admin_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  full_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Cashier Table
CREATE TABLE cashier (
  cashier_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  full_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Category Table
CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Table
CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category_id INT REFERENCES category(category_id) ON DELETE SET NULL,
  image_url VARCHAR(255),
  item_code VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customer(customer_id) ON DELETE SET NULL,
  customer_name VARCHAR(100),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  cashier_id INT REFERENCES cashier(cashier_id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('Pending', 'In Preparation', 'Ready for Pickup', 'Completed', 'Cancelled'))
);

-- OrderProduct Table (Junction Table)
CREATE TABLE order_product (
  order_product_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Table
CREATE TABLE payment (
  payment_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid >= 0),
  payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Completed',
  transaction_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('Cash', 'Card', 'GCash', 'PayMaya', 'Other')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('Pending', 'Completed', 'Failed', 'Refunded'))
);

-- Inventory Table
CREATE TABLE inventory (
  item_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL UNIQUE REFERENCES product(product_id) ON DELETE CASCADE,
  admin_id INT REFERENCES admin(admin_id) ON DELETE SET NULL,
  quantity_in_stock INT NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
  minimum_threshold INT DEFAULT 10 CHECK (minimum_threshold >= 0),
  last_restock_date TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log Table
CREATE TABLE activity_log (
  log_id SERIAL PRIMARY KEY,
  user_id INT,
  user_type VARCHAR(20),
  action_type VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  description TEXT,
  old_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_user_type CHECK (user_type IN ('Admin', 'Cashier'))
);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_cashier_id ON orders(cashier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_product_order_id ON order_product(order_id);
CREATE INDEX idx_order_product_product_id ON order_product(product_id);
CREATE INDEX idx_payment_order_id ON payment(order_id);
CREATE INDEX idx_product_category_id ON product(category_id);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id, user_type);
CREATE INDEX idx_activity_log_date ON activity_log(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON customer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update inventory on order
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Always deduct stock when order_product is inserted (order is confirmed)
    UPDATE inventory
    SET quantity_in_stock = GREATEST(0, quantity_in_stock - NEW.quantity),
        last_updated = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic inventory update
CREATE TRIGGER trigger_update_inventory
    AFTER INSERT ON order_product
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_on_order();

-- Create function to restore inventory on order cancellation
CREATE OR REPLACE FUNCTION restore_inventory_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    -- Restore stock when order is cancelled
    IF OLD.status != 'Cancelled' AND NEW.status = 'Cancelled' THEN
        UPDATE inventory i
        SET quantity_in_stock = quantity_in_stock + op.quantity,
            last_updated = CURRENT_TIMESTAMP
        FROM order_product op
        WHERE i.product_id = op.product_id
        AND op.order_id = NEW.order_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for inventory restoration
CREATE TRIGGER trigger_restore_inventory
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_inventory_on_cancel();

-- Create view for low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
    p.product_id,
    p.name,
    p.item_code,
    c.name as category_name,
    i.quantity_in_stock,
    i.minimum_threshold,
    i.last_restock_date,
    (i.minimum_threshold - i.quantity_in_stock) as shortage_amount
FROM product p
JOIN inventory i ON p.product_id = i.product_id
LEFT JOIN category c ON p.category_id = c.category_id
WHERE i.quantity_in_stock <= i.minimum_threshold
AND p.is_active = TRUE
ORDER BY i.quantity_in_stock ASC;

-- Create view for sales summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(order_date) as sale_date,
    COUNT(order_id) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders
WHERE status = 'Completed'
GROUP BY DATE(order_date)
ORDER BY sale_date DESC;

-- Create view for product sales performance
CREATE OR REPLACE VIEW product_sales_performance AS
SELECT 
    p.product_id,
    p.name,
    p.item_code,
    c.name as category_name,
    COUNT(op.order_product_id) as times_ordered,
    SUM(op.quantity) as total_quantity_sold,
    SUM(op.subtotal) as total_revenue,
    AVG(op.unit_price) as average_price
FROM product p
LEFT JOIN order_product op ON p.product_id = op.product_id
LEFT JOIN orders o ON op.order_id = o.order_id
LEFT JOIN category c ON p.category_id = c.category_id
WHERE o.status = 'Completed' OR o.status IS NULL
GROUP BY p.product_id, p.name, p.item_code, c.name
ORDER BY total_quantity_sold DESC NULLS LAST;

-- Grant permissions (adjust as needed for your Supabase setup)
-- These are examples - configure based on your RLS policies

COMMENT ON TABLE customer IS 'Stores customer information';
COMMENT ON TABLE admin IS 'Stores admin/manager user accounts';
COMMENT ON TABLE cashier IS 'Stores cashier user accounts';
COMMENT ON TABLE category IS 'Product categories';
COMMENT ON TABLE product IS 'Product catalog';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_product IS 'Order line items';
COMMENT ON TABLE payment IS 'Payment transactions';
COMMENT ON TABLE inventory IS 'Product inventory levels';
COMMENT ON TABLE activity_log IS 'System activity audit log';
