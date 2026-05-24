-- ============================================================
--  Cricket AI Platform  –  MySQL Schema
--  Run this file once to create the database & tables
--  Command:  mysql -u root -p < setup.sql
-- ============================================================

-- 1. Create database
CREATE DATABASE IF NOT EXISTS cricket_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cricket_ai;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('Admin','Analyst','Viewer') NOT NULL DEFAULT 'Analyst',
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login    TIMESTAMP    NULL,

  INDEX idx_email (email),
  INDEX idx_role  (role)
);

-- 3. Optional: audit / login-history table
CREATE TABLE IF NOT EXISTS login_history (
  id         INT       AUTO_INCREMENT PRIMARY KEY,
  user_id    INT       NOT NULL,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  logged_in_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Seed a default admin account  (password: Admin@123)
--    bcrypt hash of "Admin@123" with salt rounds = 10
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@cricketai.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Admin'
);

SELECT '✅ Schema created successfully.' AS status;
