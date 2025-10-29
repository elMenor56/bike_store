CREATE DATABASE bike_store;
USE bike_store;

-- ===========================================
-- 1. Tabla: CLIENTE
-- ===========================================
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    fecha_registro DATE DEFAULT (CURRENT_DATE),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- ===========================================
-- 2. Tabla: ADMINISTRADOR
-- ===========================================
CREATE TABLE administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

-- ===========================================
-- 3. Tabla: CATEGORIA
-- ===========================================
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- ===========================================
-- 4. Tabla: PRODUCTO
-- ===========================================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL CHECK (stock >= 0),
    imagen VARCHAR(255),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
        ON DELETE SET NULL
);

-- ===========================================
-- 5. Tabla: PEDIDO
-- ===========================================
CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    direccion_envio VARCHAR(150) NOT NULL,
    metodo_pago ENUM('tarjeta', 'transferencia', 'contra_entrega') NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON DELETE CASCADE
);

-- ===========================================
-- 6. Tabla: DETALLE_PEDIDO
-- ===========================================
CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        ON DELETE RESTRICT
);

-- ===========================================
-- 7. Tabla: RESEÑA
-- ===========================================
CREATE TABLE resena (
    id_resena INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_producto INT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_resena DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aprobada') DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON DELETE SET NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        ON DELETE SET NULL
);

INSERT INTO administrador (nombre, correo, contrasena)
VALUES (
  'Admin',
  'admin@bikestore.com',
  '$2b$10$b6hyON.Wud48raQmxsiU9Ox899SKDbnL6OetklrPlBCVViKw9Noxq'
);

-- Contraseña: admin123

INSERT INTO cliente (nombre, apellido, correo, contrasena, telefono, direccion, estado)
VALUES (
  'Ana',
  'Perez',
  'cliente@bikestore.com',
  '$2b$10$AxGP1lG9SWa5JoxxReB3deo6cnfw8A0jmuXd07BhQENYvyWF7TtbO', -- ana
  '3105556677',
  'Carrera 10 #20-30',
  'activo'
);