CREATE DATABASE bike_store;
USE bike_store;

-- ===========================================
-- 1. TABLA CLIENTE
-- ===========================================
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150)
);

-- ===========================================
-- 2. TABLA CATEGORIA
-- ===========================================
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- ===========================================
-- 3. TABLA MARCA
-- ===========================================
CREATE TABLE marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- ===========================================
-- 4. TABLA PRODUCTO
-- ===========================================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    id_marca INT,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_producto VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
        ON DELETE SET NULL,
	FOREIGN KEY (id_marca) REFERENCES marca(id_marca)
        ON DELETE SET NULL
);

-- ===========================================
-- 5. TABLA PEDIDO
-- ===========================================
CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_pedido DECIMAL(10,2) NOT NULL,
    nombre VARCHAR (100),
    correo VARCHAR (100),
    telefono VARCHAR(100),
    direccion VARCHAR (100),
    estado ENUM('Pendiente','Pagado','Enviado','Entregado','Cancelado') DEFAULT 'Pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON DELETE CASCADE
);

-- ===========================================
-- 6. TABLA DETALLE_PEDIDO
-- ===========================================
CREATE TABLE detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        ON DELETE CASCADE
);

-- ===========================================
-- 7. TABLA ADMINISTRADOR
-- ===========================================
CREATE TABLE administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

INSERT INTO cliente (nombre, email, contrasena, telefono, direccion) VALUES
('Juan Pérez', 'juan@email.com',
 '$2b$10$yLzxLtsSUMtZk0RqlF5GIO2zyxOPKQUN2hXgF3VW4ikjH/SY10yxe', -- Contraseña: user
 '3001112233', 'Calle 10 #20-30');
 
 INSERT INTO administrador (nombre, email, contrasena) VALUE
 ('Admin', 'adminbikestore@email.com', '$2b$10$by8gzgrw0pb5jiXnY6jeCOwYgD2M7KZp8qjaGVWrsqhiIlOZFvKQ2'); -- Contraseña: admin
 
 INSERT INTO categoria (nombre) VALUES
 ('Montaña (MTB)'),
 ('Rutas'),
 ('Eléctricas'),
 ('Gravel');
 
INSERT INTO producto (id_categoria, nombre, marca, descripcion, precio, imagen_producto)
VALUES (
    1, 'BMC Fourstroke 01 ONE', 'BMC',
    
    'Cuadro: Carbono Premium 01 con sistema Autodrop (tija automática)
	Tamaño de rueda: 29 pulgadas
	Suspensión: Delantera y trasera Fox Factory SC, 100 mm de recorrido
	Transmisión: SRAM XX SL Eagle Transmission, 12 velocidades electrónicas
	Frenos: SRAM Level Ultimate, hidráulicos de disco
	Peso aproximado: 10.5 kg
	Ángulo de dirección: 66.5° (agresivo para mayor estabilidad en descensos)
	Rines y llantas: DT Swiss XRC 1200 Carbon, 29” × 2.4” Maxxis Recon Race',
    
    23000000, '/uploads/BMC_Fourstroke_01_ONE.jpg'
);

INSERT INTO marca (nombre) VALUES
('Scott'),
('Orbea'),
('BMC'),
('Trek'),
('Giant'),
('Specialized');