-- Script SQL para crear la base de datos de la tienda online
-- Ejecutar manualmente en tu base de datos MariaDB en AWS RDS

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio INT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_nombre (nombre)
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nombre (nombre)
);

-- Tabla de pedidos (para relacionar productos y clientes)
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    monto_total INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_pedido)
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, precio, categoria, stock, descripcion) VALUES
('Laptop HP Pavilion', 899990, 'Electrónicos', 15, 'Laptop con procesador Intel i5, 8GB RAM, 256GB SSD'),
('Mouse Inalámbrico Logitech', 29990, 'Accesorios', 50, 'Mouse ergonómico con conectividad Bluetooth'),
('Teclado Mecánico RGB', 79990, 'Accesorios', 25, 'Teclado mecánico con iluminación RGB personalizable'),
('Monitor 24" Samsung', 199990, 'Electrónicos', 20, 'Monitor Full HD con panel IPS'),
('Auriculares Sony WH-1000XM4', 349990, 'Audio', 10, 'Auriculares con cancelación de ruido activa');

INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('María González', 'maria.gonzalez@email.com', '+56 9 1234 5678', 'Providencia 123, Santiago, Chile'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '+56 9 8765 4321', 'Las Condes 456, Santiago, Chile'),
('Ana Martínez', 'ana.martinez@email.com', '+56 9 5555 7777', 'Ñuñoa 789, Santiago, Chile');

INSERT INTO pedidos (cliente_id, producto_id, cantidad, monto_total) VALUES
(1, 1, 1, 899990),
(1, 2, 2, 59980),
(2, 3, 1, 79990),
(3, 4, 1, 199990),
(2, 5, 1, 349990);