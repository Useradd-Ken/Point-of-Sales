-- CubeTech POS System Database Schema

CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL
);

INSERT INTO Categories (CategoryName)
VALUES
('Shoes'),
('Hoodies'),
('Shirts'),
('Caps');

-- =========================
-- Products Table
-- =========================
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    ImageURL VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (CategoryID)
    REFERENCES Categories(CategoryID)
);

--Populated the website

INSERT INTO Products
(CategoryID, ProductName, Price, StockQuantity, ImageURL)
VALUES

(1, 'Nike Retro', 2499.00, 12, '/Shoes.jpg'),
(1, 'Adidas Run', 2199.00, 8, '/Shoes.jpg'),
(1, 'Street Kicks', 1899.00, 5, '/Shoes.jpg'),
(1, 'Classic Leather', 2799.00, 10, '/Shoes.jpg'),
(1, 'Urban Flex', 1999.00, 6, '/Shoes.jpg'),
(2, 'Black Hoodie', 1299.00, 9, '/Hoodie.jpg'),
(2, 'Oversized Hoodie', 1499.00, 4, '/Hoodie.jpg'),
(2, 'Winter Hoodie', 1699.00, 7, '/Hoodie.jpg'),
(2, 'Street Hoodie', 1399.00, 3, '/Hoodie.jpg'),
(2, 'Zip Hoodie', 1599.00, 11, '/Hoodie.jpg'),
(3, 'Plain White Tee', 499.00, 15, '/Shirt.jpg'),
(3, 'Graphic Tee', 699.00, 6, '/Shirt.jpg'),
(3, 'Oversized Tee', 799.00, 9, '/Shirt.jpg'),
(3, 'Vintage Shirt', 899.00, 4, '/Shirt.jpg'),
(3, 'Minimal Tee', 599.00, 8, '/Shirt.jpg'),
(4, 'Snapback', 499.00, 10, '/Caps.jpg'),
(4, 'Baseball Cap', 399.00, 7, '/Caps.jpg'),
(4, 'Dad Hat', 349.00, 5, '/Caps.jpg'),
(4, 'Street Cap', 549.00, 6, '/Caps.jpg'),
(4, 'Vintage Cap', 599.00, 3, '/Caps.jpg');

-- =========================
-- Sales Table
-- =========================
CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ReceiptNumber VARCHAR(50) UNIQUE NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SalesDetails Table
-- =========================
CREATE TABLE SalesDetails (
    SaleDetailID INT AUTO_INCREMENT PRIMARY KEY,
    SaleID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

