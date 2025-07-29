CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    birthdate DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE merch (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    product_category VARCHAR(50) NOT NULL
);

CREATE TABLE coffee (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    bean VARCHAR(50) NOT NULL,
    roast VARCHAR(50) NOT NULL,
    grind VARCHAR(50) NOT NULL
);

-- Test data for users table
INSERT INTO users (first_name, last_name, email, birthdate) VALUES
('John', 'Smith', 'john.smith@email.com', '1985-03-15'),
('Sarah', 'Johnson', 'sarah.johnson@gmail.com', '1992-07-22'),
('Michael', 'Brown', 'mike.brown@yahoo.com', '1978-11-08'),
('Emily', 'Davis', 'emily.davis@hotmail.com', '1990-01-30'),
('David', 'Wilson', 'david.wilson@email.com', '1988-05-12'),
('Jessica', 'Miller', 'jessica.miller@gmail.com', '1995-09-18'),
('Robert', 'Garcia', 'robert.garcia@company.com', '1982-12-03'),
('Ashley', 'Martinez', 'ashley.martinez@email.com', '1993-04-25'),
('Christopher', 'Anderson', 'chris.anderson@gmail.com', '1987-08-14'),
('Amanda', 'Taylor', 'amanda.taylor@yahoo.com', '1991-06-07'),
('James', 'Thomas', 'james.thomas@email.com', '1984-10-20'),
('Stephanie', 'Jackson', 'stephanie.jackson@gmail.com', '1989-02-28'),
('Matthew', 'White', 'matthew.white@hotmail.com', '1986-12-11'),
('Lauren', 'Harris', 'lauren.harris@email.com', '1994-03-05'),
('Daniel', 'Clark', 'daniel.clark@company.com', '1983-07-16');

-- Test data for merch table
INSERT INTO merch (product_name, product_category) VALUES
('Coffee Shop Logo T-Shirt', 'Apparel'),
('Ceramic Coffee Mug', 'Drinkware'),
('Insulated Travel Tumbler', 'Drinkware'),
('Coffee Bean Tote Bag', 'Accessories'),
('Barista Apron', 'Apparel'),
('Coffee Grinder Keychain', 'Accessories'),
('Hoodie with Coffee Quote', 'Apparel'),
('French Press', 'Equipment'),
('Coffee Scale', 'Equipment'),
('Espresso Cup & Saucer Set', 'Drinkware'),
('Coffee Shop Baseball Cap', 'Apparel'),
('Pour Over Coffee Dripper', 'Equipment'),
('Coffee Bean Storage Tin', 'Accessories'),
('Milk Frother', 'Equipment'),
('Coffee Shop Sticker Pack', 'Accessories'),
('Thermal Coffee Carafe', 'Equipment'),
('Barista Training Manual', 'Books'),
('Cold Brew Maker', 'Equipment'),
('Coffee Cupping Spoons', 'Equipment');

-- Test data for coffee table
INSERT INTO coffee (product_name, bean, roast, grind) VALUES
('Ethiopian Sunrise', 'Arabica', 'Light', 'Medium'),
('Colombian Supreme', 'Arabica', 'Medium', 'Fine'),
('Dark Roast Blend', 'Arabica/Robusta', 'Dark', 'Coarse'),
('Brazilian Santos', 'Arabica', 'Medium', 'Medium'),
('Guatemalan Antigua', 'Arabica', 'Medium-Dark', 'Fine'),
('Kenyan AA', 'Arabica', 'Light-Medium', 'Medium'),
('Costa Rican Tarrazú', 'Arabica', 'Medium', 'Medium'),
('Jamaica Blue Mountain', 'Arabica', 'Light', 'Fine'),
('Sumatra Mandheling', 'Arabica', 'Dark', 'Coarse'),
('Yemen Mocha', 'Arabica', 'Medium-Dark', 'Medium'),
('Hawaiian Kona', 'Arabica', 'Medium', 'Fine'),
('French Roast', 'Arabica', 'Dark', 'Coarse'),
('Italian Espresso', 'Arabica/Robusta', 'Dark', 'Extra Fine'),
('Breakfast Blend', 'Arabica', 'Light-Medium', 'Medium'),
('House Blend', 'Arabica', 'Medium', 'Medium'),
('Decaf Colombian', 'Arabica', 'Medium', 'Fine'),
('Pike Place Roast', 'Arabica', 'Medium-Dark', 'Medium'),
('Veranda Blend', 'Arabica', 'Light', 'Medium'),
('Anniversary Blend', 'Arabica', 'Medium-Dark', 'Fine'),
('Gold Coast Blend', 'Arabica', 'Dark', 'Coarse');