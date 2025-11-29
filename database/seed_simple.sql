-- Simplified Seed Data for eBURG POS System
-- This version is easier to run and debug

-- 1. Insert Admin Account
INSERT INTO admin (username, password_hash, email, full_name) VALUES
('admin', 'admin123', 'admin@eburg.com', 'System Administrator');

-- 2. Insert Cashier Account
INSERT INTO cashier (username, password_hash, email, full_name) VALUES
('cashier', 'cashier123', 'cashier@eburg.com', 'John Doe');

-- 3. Insert Categories
INSERT INTO category (name, description, display_order) VALUES
('Burgers', 'Delicious burger selections', 1),
('Drinks', 'Refreshing beverages', 2),
('Sides', 'Tasty side dishes', 3);

-- 4. Insert Products
INSERT INTO product (name, description, price, category_id, item_code, image_url) VALUES
-- Burgers
('Classic Burger', 'Juicy beef patty with lettuce and tomato', 45.00, 1, 'BRG001', '/images/classic-burger.jpg'),
('Cheese Burger', 'Classic burger with melted cheese', 55.00, 1, 'BRG002', '/images/cheese-burger.jpg'),
('Double Burger', 'Two beef patties', 75.00, 1, 'BRG003', '/images/double-burger.jpg'),
-- Drinks
('Coke Regular', 'Coca-Cola 12oz', 25.00, 2, 'DRK001', '/images/coke.jpg'),
('Sprite', 'Sprite 12oz', 25.00, 2, 'DRK002', '/images/sprite.jpg'),
('Iced Tea', 'Freshly brewed iced tea', 20.00, 2, 'DRK003', '/images/iced-tea.jpg'),
-- Sides
('French Fries', 'Crispy golden fries', 35.00, 3, 'SID001', '/images/fries.jpg'),
('Onion Rings', 'Breaded onion rings', 40.00, 3, 'SID002', '/images/onion-rings.jpg');

-- 5. Insert Inventory
INSERT INTO inventory (product_id, admin_id, quantity_in_stock, minimum_threshold, last_restock_date)
VALUES
(1, 1, 50, 10, CURRENT_TIMESTAMP),
(2, 1, 50, 10, CURRENT_TIMESTAMP),
(3, 1, 50, 10, CURRENT_TIMESTAMP),
(4, 1, 100, 20, CURRENT_TIMESTAMP),
(5, 1, 100, 20, CURRENT_TIMESTAMP),
(6, 1, 100, 20, CURRENT_TIMESTAMP),
(7, 1, 75, 15, CURRENT_TIMESTAMP),
(8, 1, 75, 15, CURRENT_TIMESTAMP);

-- 6. Verify data was inserted
SELECT 'Setup Complete!' as status;
SELECT 'Categories: ' || COUNT(*) FROM category;
SELECT 'Products: ' || COUNT(*) FROM product;
SELECT 'Inventory: ' || COUNT(*) FROM inventory;
