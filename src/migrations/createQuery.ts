// // 
// CREATE TABLE comments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     feedback VARCHAR(255),
//     email VARCHAR(255),
//     year INT,
//     name VARCHAR(255),
//     phone VARCHAR(255),
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// //  Compliment 
// CREATE TABLE compilments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     fullName VARCHAR(255),
//     province VARCHAR(255),
//     city VARCHAR(255),
//     district VARCHAR(255),
//     kebele VARCHAR(255),
//     phoneNumber VARCHAR(255),
//     reason VARCHAR(255),
//     expectedResponse VARCHAR(255),
//     complimentDate VARCHAR(255),
//     employerName VARCHAR(255),
//     responded BOOLEAN,
//     year INT,
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// // 
// CREATE TABLE employees (
//     id INT PRIMARY KEY,
//     team_id INT,
//     amharic_name VARCHAR(255),
//     oromic_name VARCHAR(255),
//     english_name VARCHAR(255),
//     oromic_position VARCHAR(255),
//     path VARCHAR(255),
//     position VARCHAR(255),
//     english_position VARCHAR(255),
//     office VARCHAR(255),
//     is_director BOOLEAN,
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// // 
// CREATE TABLE feedbacks (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     type VARCHAR(255),
//     content VARCHAR(255),
//     name VARCHAR(255),
//     email VARCHAR(255),
//     phone VARCHAR(255),
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// // 
// CREATE TABLE rates (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     CustomerService VARCHAR(255),
//     StandardService VARCHAR(255),
//     FairService VARCHAR(255),
//     ResponseForCompliment VARCHAR(255),
//     ServiceRate VARCHAR(255),
//     EmployeeId INT,
//     year INT,
//     name VARCHAR(255),
//     phone VARCHAR(255),
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// //
// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstname VARCHAR(255),
//     lastname VARCHAR(255),
//     email VARCHAR(255),
//     username VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     isSuperAdmin BOOLEAN,
//     created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
