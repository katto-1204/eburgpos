-- eBURG POS System - Sample Data
-- Run this after schema.sql to populate with test data

-- Insert Admin Account
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admin (username, password_hash, email, full_name) VALUES
('admin', '$2a$10$rKxZvF5Z5Z5Z5Z5Z5Z5Z5eMqK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'admin@eburg.com', 'System Administrator');

-- Insert Cashier Accounts
-- Password: cashier123 (hashed with bcrypt)
INSERT INTO cashier (username, password_hash, email, full_name) VALUES
('cashier', '$2a$10$rKxZvF5Z5Z5Z5Z5Z5Z5Z5eMqK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'cashier@eburg.com', 'John Doe'),
('cashier2', '$2a$10$rKxZvF5Z5Z5Z5Z5Z5Z5Z5eMqK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'cashier2@eburg.com', 'Jane Smith');

-- Insert Categories
INSERT INTO category (name, description, display_order) VALUES
('Burgers', 'Delicious burger selections', 1),
('Drinks', 'Refreshing beverages', 2),
('Sides', 'Tasty side dishes', 3),
('Add-ons', 'Extra toppings and sauces', 4),
('Combos', 'Value meal combinations', 5);

-- Insert Products
INSERT INTO product (name, description, price, category_id, item_code, image_url) VALUES
-- Burgers
('Classic Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 45.00, 1, 'BRG001', '/images/classic-burger.jpg'),
('Cheese Burger', 'Classic burger with melted cheese', 55.00, 1, 'BRG002', '/images/cheese-burger.jpg'),
('Double Burger', 'Two beef patties for extra satisfaction', 75.00, 1, 'BRG003', '/images/double-burger.jpg'),
('Bacon Burger', 'Topped with crispy bacon strips', 65.00, 1, 'BRG004', '/images/bacon-burger.jpg'),
('Mushroom Swiss Burger', 'Sautéed mushrooms and Swiss cheese', 70.00, 1, 'BRG005', '/images/mushroom-burger.jpg'),
('BBQ Burger', 'Smoky BBQ sauce with onion rings', 68.00, 1, 'BRG006', '/images/bbq-burger.jpg'),
('Spicy Burger', 'Hot and spicy with jalapeños', 60.00, 1, 'BRG007', '/images/spicy-burger.jpg'),
('Veggie Burger', 'Plant-based patty with fresh veggies', 55.00, 1, 'BRG008', '/images/veggie-burger.jpg'),

-- Drinks
('Coke Regular', 'Coca-Cola 12oz', 25.00, 2, 'DRK001', '/images/coke.jpg'),
('Coke Zero', 'Coca-Cola Zero Sugar 12oz', 25.00, 2, 'DRK002', '/images/coke-zero.jpg'),
('Sprite', 'Sprite 12oz', 25.00, 2, 'DRK003', '/images/sprite.jpg'),
('Royal', 'Royal Tru-Orange 12oz', 25.00, 2, 'DRK004', '/images/royal.jpg'),
('Iced Tea', 'Freshly brewed iced tea', 20.00, 2, 'DRK005', '/images/iced-tea.jpg'),
('Bottled Water', 'Purified drinking water', 15.00, 2, 'DRK006', '/images/water.jpg'),
('Orange Juice', 'Fresh orange juice', 30.00, 2, 'DRK007', '/images/orange-juice.jpg'),
('Lemonade', 'Homemade lemonade', 28.00, 2, 'DRK008', '/images/lemonade.jpg'),

-- Sides
('French Fries', 'Crispy golden fries', 35.00, 3, 'SID001', '/images/fries.jpg'),
('Onion Rings', 'Breaded and fried onion rings', 40.00, 3, 'SID002', '/images/onion-rings.jpg'),
('Chicken Nuggets', '6-piece chicken nuggets', 50.00, 3, 'SID003', '/images/nuggets.jpg'),
('Mozzarella Sticks', '5-piece mozzarella sticks', 55.00, 3, 'SID004', '/images/mozzarella.jpg'),
('Coleslaw', 'Fresh coleslaw salad', 30.00, 3, 'SID005', '/images/coleslaw.jpg'),

-- Add-ons
('Extra Cheese', 'Additional cheese slice', 10.00, 4, 'ADD001', '/images/cheese.jpg'),
('Extra Bacon', 'Additional bacon strips', 15.00, 4, 'ADD002', '/images/bacon.jpg'),
('Extra Patty', 'Additional beef patty', 25.00, 4, 'ADD003', '/images/patty.jpg'),
('Ketchup', 'Tomato ketchup packet', 5.00, 4, 'ADD004', '/images/ketchup.jpg'),
('Mayo', 'Mayonnaise packet', 5.00, 4, 'ADD005', '/images/mayo.jpg'),
('BBQ Sauce', 'BBQ sauce packet', 5.00, 4, 'ADD006', '/images/bbq-sauce.jpg'),

-- Combos
('Burger Meal A', 'Classic Burger + Fries + Drink', 95.00, 5, 'CMB001', '/images/meal-a.jpg'),
('Burger Meal B', 'Cheese Burger + Fries + Drink', 105.00, 5, 'CMB002', '/images/meal-b.jpg'),
('Family Pack', '4 Burgers + 2 Fries + 4 Drinks', 350.00, 5, 'CMB003', '/images/family-pack.jpg');

-- Insert Inventory for all products
INSERT INTO inventory (product_id, admin_id, quantity_in_stock, minimum_threshold, last_restock_date)
SELECT 
    product_id,
    1, -- admin_id
    CASE 
        WHEN category_id = 1 THEN 50  -- Burgers
        WHEN category_id = 2 THEN 100 -- Drinks
        WHEN category_id = 3 THEN 75  -- Sides
        WHEN category_id = 4 THEN 200 -- Add-ons
        WHEN category_id = 5 THEN 30  -- Combos
    END as quantity_in_stock,
    CASE 
        WHEN category_id = 1 THEN 10  -- Burgers
        WHEN category_id = 2 THEN 20  -- Drinks
        WHEN category_id = 3 THEN 15  -- Sides
        WHEN category_id = 4 THEN 50  -- Add-ons
        WHEN category_id = 5 THEN 5   -- Combos
    END as minimum_threshold,
    CURRENT_TIMESTAMP
FROM product;

-- Insert Sample Customers
INSERT INTO customer (first_name, last_name, email, phone_number, address) VALUES
('Juan', 'Dela Cruz', 'juan.delacruz@email.com', '09171234567', '123 Main St, Manila'),
('Maria', 'Santos', 'maria.santos@email.com', '09181234567', '456 Rizal Ave, Quezon City'),
('Pedro', 'Reyes', 'pedro.reyes@email.com', '09191234567', '789 Bonifacio St, Makati'),
('Ana', 'Garcia', 'ana.garcia@email.com', '09201234567', '321 Luna St, Pasig'),
('Jose', 'Fernandez', 'jose.fernandez@email.com', '09211234567', '654 Aguinaldo Ave, Cavite');

-- Insert Sample Orders (Last 7 days)
INSERT INTO orders (customer_id, customer_name, order_date, status, total_amount, cashier_id) VALUES
(1, 'Juan Dela Cruz', CURRENT_TIMESTAMP - INTERVAL '6 days', 'Completed', 150.00, 1),
(2, 'Maria Santos', CURRENT_TIMESTAMP - INTERVAL '6 days', 'Completed', 95.00, 1),
(3, 'Pedro Reyes', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Completed', 200.00, 1),
(4, 'Ana Garcia', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Completed', 105.00, 2),
(1, 'Juan Dela Cruz', CURRENT_TIMESTAMP - INTERVAL '4 days', 'Completed', 175.00, 1),
(5, 'Jose Fernandez', CURRENT_TIMESTAMP - INTERVAL '4 days', 'Completed', 350.00, 2),
(2, 'Maria Santos', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Completed', 120.00, 1),
(3, 'Pedro Reyes', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Completed', 95.00, 1),
(4, 'Ana Garcia', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Completed', 140.00, 2),
(1, 'Juan Dela Cruz', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Completed', 105.00, 1),
(5, 'Jose Fernandez', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Completed', 95.00, 2),
(2, 'Maria Santos', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Completed', 180.00, 1),
(NULL, 'Walk-in Customer', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Completed', 95.00, 1),
(NULL, 'Walk-in Customer', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'In Preparation', 150.00, 2),
(3, 'Pedro Reyes', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'Pending', 105.00, 1);

-- Insert Order Products for the orders
-- Order 1: Classic Burger Meal + Extra Cheese
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(1, 28, 1, 95.00),  -- Burger Meal A
(1, 23, 1, 10.00),  -- Extra Cheese
(1, 9, 2, 25.00);   -- Coke Regular

-- Order 2: Burger Meal A
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(2, 28, 1, 95.00);

-- Order 3: Double Burger + Fries + Drinks
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(3, 3, 2, 75.00),   -- Double Burger
(3, 17, 2, 35.00),  -- French Fries
(3, 9, 2, 25.00);   -- Coke

-- Order 4: Burger Meal B
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(4, 29, 1, 105.00);

-- Order 5: Bacon Burger + Sides
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(5, 4, 2, 65.00),   -- Bacon Burger
(5, 17, 1, 35.00),  -- Fries
(5, 11, 2, 25.00);  -- Sprite

-- Order 6: Family Pack
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(6, 30, 1, 350.00);

-- Continue with more sample orders...
INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(7, 28, 1, 95.00),
(7, 18, 1, 40.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(8, 28, 1, 95.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(9, 29, 1, 105.00),
(9, 17, 1, 35.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(10, 29, 1, 105.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(11, 28, 1, 95.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(12, 5, 2, 70.00),
(12, 17, 1, 35.00),
(12, 13, 2, 20.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(13, 28, 1, 95.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(14, 3, 2, 75.00);

INSERT INTO order_product (order_id, product_id, quantity, unit_price) VALUES
(15, 29, 1, 105.00);

-- Insert Payments for completed orders
INSERT INTO payment (order_id, payment_date, amount_paid, payment_method, payment_status) 
SELECT 
    order_id,
    order_date,
    total_amount,
    CASE 
        WHEN order_id % 3 = 0 THEN 'Card'
        WHEN order_id % 5 = 0 THEN 'GCash'
        ELSE 'Cash'
    END,
    'Completed'
FROM orders
WHERE status = 'Completed';

-- Insert some activity logs
INSERT INTO activity_log (user_id, user_type, action_type, table_name, description) VALUES
(1, 'Admin', 'LOGIN', NULL, 'Admin logged in successfully'),
(1, 'Cashier', 'LOGIN', NULL, 'Cashier logged in successfully'),
(1, 'Admin', 'CREATE', 'product', 'Added new product: Classic Burger'),
(1, 'Admin', 'UPDATE', 'inventory', 'Restocked inventory for product ID 1'),
(1, 'Cashier', 'CREATE', 'orders', 'Created new order #1'),
(1, 'Admin', 'GENERATE_REPORT', 'orders', 'Generated daily sales report');

-- Update some inventory to show low stock items
UPDATE inventory SET quantity_in_stock = 8 WHERE product_id = 1;  -- Classic Burger low
UPDATE inventory SET quantity_in_stock = 5 WHERE product_id = 3;  -- Double Burger very low
UPDATE inventory SET quantity_in_stock = 18 WHERE product_id = 9; -- Coke near threshold

-- Verify data
SELECT 'Categories' as table_name, COUNT(*) as count FROM category
UNION ALL
SELECT 'Products', COUNT(*) FROM product
UNION ALL
SELECT 'Inventory Items', COUNT(*) FROM inventory
UNION ALL
SELECT 'Customers', COUNT(*) FROM customer
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Products', COUNT(*) FROM order_product
UNION ALL
SELECT 'Payments', COUNT(*) FROM payment
UNION ALL
SELECT 'Admins', COUNT(*) FROM admin
UNION ALL
SELECT 'Cashiers', COUNT(*) FROM cashier
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM activity_log;

-- Show low stock items
SELECT * FROM low_stock_items;

-- Show sales summary
SELECT * FROM daily_sales_summary LIMIT 7;
