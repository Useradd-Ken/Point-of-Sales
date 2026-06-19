-- CubeTech POS System Database Schema

CREATE DATABASE IF NOT EXISTS cubetech_pos;
USE cubetech_pos;

-- 1. Users Table (For your newly finished Login system)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Needs to store hashed passwords (e.g., bcrypt)
    Role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (Username, Password, Role) VALUES
('admin_user', 'hashed_password_here', 'admin'),
('cashier_user', 'hashed_password_here', 'cashier');

-- 2. Products Table (Fixed Category reference, tailored for Hoodies)
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL, -- e.g., 'Classic Black Hoodie'
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    ImageURL VARCHAR(255),             -- Optional: for rendering hoodie previews in your POS grid
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Products (ProductName, Price, StockQuantity, ImageURL) VALUES
('Oversized Essential Hoodie - Jet Black', 45.00, 10, '/h1.jpg'),
('Vintage Graphic Hoodie - Cream', 49.99, 20, '/h2.jpg'),
('Minimalist Embroidered Hoodie - Navy Blue', 55.00, 30, '/h3.jpg'),
('Athletic Fleece Zip-Up Hoodie - Heather Grey', 39.95, 40, '/h4.jpg'),
('Streetwear Acid-Wash Hoodie - Charcoal', 59.99, 15, '/h5.jpg');
('Athletic Fleece Zip-Up Hoodie - Heather Grey', 39.95, 50, '/h6.jpg'),
('Streetwear Acid-Wash Hoodie - Charcoal', 59.99, 5, '/h7.jpg');
('Athletic Fleece Zip-Up Hoodie - Heather Grey', 39.95, 10, '/h8.jpg'),
('Streetwear Acid-Wash Hoodie - Charcoal', 59.99, 15, '/h9.jpg');
('Athletic Fleece Zip-Up Hoodie - Heather Grey', 39.95, 60, '/h10.jpg'),

-- 3. Sales Table (Linked to Users to track who made the sale)
CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ReceiptNumber VARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(10,2) NOT NULL,
    UserID INT NOT NULL,               -- Tracks the Admin/Cashier who processed the sale
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 4. SalesDetails Table (Line items per sale)
CREATE TABLE SalesDetails (
    SaleDetailID INT AUTO_INCREMENT PRIMARY KEY,
    SaleID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,  -- Keeps historic price at time of purchase
    Subtotal DECIMAL(10,2) NOT NULL,   -- Quantity * UnitPrice
    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE RESTRICT 
    -- RESTRICT prevents a hoodie from being deleted if it's already tied to past sales receipts
);