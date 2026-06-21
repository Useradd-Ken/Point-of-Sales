-- CubeTech POS System Database Schema

CREATE DATABASE IF NOT EXISTS cubetech_pos;
USE cubetech_pos;


CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Needs to store hashed passwords (e.g., bcrypt)
    Role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (Username, Password, Role) VALUES
('admin_user@gmail.com', 'hashed_password_here', 'admin'),
('cashier_user@gmail.com', 'hashed_password_here', 'cashier');


CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL, 
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    ImageURL VARCHAR(255),        
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Products (ProductName, Price, StockQuantity, ImageURL) VALUES
('Oversized Essential Hoodie - Jet Black', 850.00, 10, '/h1.jpg'),
('Vintage Graphic Hoodie - Cream', 950, 20, '/h2.jpg'),
('Minimalist Embroidered Hoodie - Navy Blue', 1000.00, 30, '/h3.jpg'),
('Athletic Fleece Zip-Up Hoodie - Heather Grey', 1200.95, 40, '/h4.jpg'),
('Streetwear Acid-Wash Hoodie - Charcoal', 1400.99, 15, '/h5.jpg'),
('J6 Hoodie', 1499.00, 10, '/h6.jpg'),
('J7 Hoodie', 999.99, 12, '/h7.jpg'),
('J8 Hoodie', 1600.00, 8, '/h8.jpg'),
('J9 Hoodie', 1500.00, 9, '/h9.jpg'),
('J10 Hoodie', 1100.00, 11, '/h10.jpg');

-- 3. Sales Table (Linked to Users to track who made the sale)
CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ReceiptNumber VARCHAR(50) NOT NULL UNIQUE,
    TotalAmount DECIMAL(10,2) NOT NULL,
    UserID INT NOT NULL,               
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
);