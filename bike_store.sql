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
 ('Montaña'),
 ('Ruta'),
 ('Eléctricas'),
 ('Gravel');
 
 INSERT INTO marca (nombre) VALUES
('Scott'),
('Orbea'),
('BMC'),
('Trek'),
('Giant'),
('Specialized'),
('Otro');
 
INSERT INTO producto (id_categoria, id_marca, nombre, descripcion, precio, imagen_producto)
VALUES 
(
	1,
    3,
    'BMC Fourstroke 01 ONE',
    'Cuadro: Carbono Premium 01 con sistema Autodrop (tija automática)\nTamaño de rueda: 29 pulgadas\nSuspensión: Fox Factory SC delantera y trasera, 100 mm de recorrido\nTransmisión: SRAM XX SL Eagle Transmission, 12 velocidades electrónicas\nFrenos: SRAM Level Ultimate hidráulicos de disco\nRines y llantas: DT Swiss XRC 1200 Carbon con Maxxis Recon Race 29x2.4"\nÁngulo de dirección: 66.5°\nPeso aproximado: 10.5 kg\nTipo de uso: XC profesional y downcountry',
    23000000, 
    '/uploads/BMC_Fourstroke_01_ONE.jpg'
),
(
	1,
    6,
    'Specialized Rockhopper Sport',
    'Cuadro: Aluminio Premium A1 con cableado interno\nHorquilla: SR Suntour XCM con 90/100 mm de recorrido y bloqueo\nTransmisión: MicroSHIFT 2x9 con cambio trasero Shimano Altus\nFrenos: Shimano hidráulicos MT200\nRines: Specialized 29" de aluminio\nLlantas: Fast Trak 29x2.35"\nPeso aproximado: 14 kg (según talla)\nTipo de uso: MTB recreativo y XC ligero',
    2500000, 
    '/uploads/Specialized_Rockhopper_Sport.webp'
),
(
	1,
    4,
    'Trek Marlin 7 Gen 3',
    'Cuadro: Aluminio Alpha Silver con guiado interno\nHorquilla: RockShox Judy con 100 mm de recorrido y bloqueo\nTransmisión: Shimano Deore 1x10 con cassette 11-46\nFrenos: Hidráulicos Tektro HD-M275\nRines: Bontrager Connection 29"\nLlantas: Bontrager XR2 29x2.2"\nÁngulo de dirección: 66.5°\nPeso aproximado: 13.5 kg\nTipo de uso: XC moderno y trail ligero',
    4769000, 
    '/uploads/Trek_Marlin_7_Gen_3.png'
),
(
	1,
    3,
    'BMC Fourstroke LT LTD', 
    'Cuadro: Carbono Premium con tija automática Autodrop\nTamaño de rueda: 29 pulgadas\nSuspensión: Fox Factory SC delantera y trasera, recorrido extendido\nTransmisión: SRAM XX SL Eagle Transmission, 12 velocidades electrónicas\nFrenos: SRAM Level Ultimate hidráulicos de disco\nRines y llantas: DT Swiss XRC 1200 Carbon con Maxxis 29x2.4"\nPeso aproximado: 10.8 kg\nÁngulo de dirección: Aproximadamente 66°\nTipo de uso: XC de alto rendimiento y downcountry',
    25600000, 
    '/uploads/BMC_Fourstroke_LT_LTD.webp'
),
(
	1,
    5,
    'Giant Talon 29 3', 
    'Cuadro: Aluminio ALUXX para XC\nHorquilla: SR Suntour XCE con 100 mm de recorrido\nTransmisión: MicroSHIFT 2x8 con cambio trasero Shimano Altus\nFrenos: Hidráulicos Tektro M275 (180 mm/160 mm)\nRines: Giant GX03V de doble pared\nLlantas: Maxxis Ikon 29x2.2"\nPeso aproximado: 13.8–14.5 kg (según talla)\nÁngulo de dirección: 69° aprox.\nTipo de uso: XC recreativo y principiantes',
    1790000, 
    '/uploads/Giant_Talon_29_3.webp'
),
(
	1,
    6,
    'Specialized Rockhopper Sport 29',
    'Cuadro: Aluminio Premium A1 con cableado interno\nHorquilla: SR Suntour XCM con 90/100 mm de recorrido y bloqueo\nTransmisión: MicroSHIFT 2x9 con cambio trasero Shimano Altus\nFrenos: Hidráulicos Shimano BR-MT200\nRines: Aluminio Specialized 29"\nLlantas: Ground Control / Fast Trak 29x2.3"\nPeso aproximado: 14 kg (según talla)\nTipo de uso: MTB recreativo y XC ligero',
    1790000, 
    '/uploads/Specialized_Rockhopper_Sport_29.webp'
),
(
	2,
    1,
    'Scott Speedster 10', 
    'Cuadro: Aluminio 6061 doble conificado con cableado interno\nHorquilla: Carbono HMF con tubo cónico 1 1/4 - 1 1/2\nTransmisión: Shimano 105 de 12 velocidades, configuración 2x12 (50/34, cassette 11-34)\nFrenos: Shimano hidráulicos de disco con rotores de 160 mm\nRuedas: Syncros Race 25 Disc\nLlantas: Schwalbe Lugano 700x32C\nPeso aproximado: 10.1 kg\nTipo de uso: Ruta endurance enfocada en comodidad y eficiencia',
    1790000, 
    '/uploads/Scott_Speedster_10.png'
),
(
	2,
    2,
    'Orbea Orca M30i',
	'Cuadro: Carbono OMR 2026 monocoque con guiado interno\nHorquilla: Orbea OMR ICR de carbono, paso de eje 12×100 mm\nTransmisión: Shimano 105 Di2 R7170 / R7150 de 12 velocidades (50/34, cassette 11-34)\nFrenos: Shimano 105 R7170 hidráulicos de disco\nRuedas: Llantas de aleación tubeless 700c de 19 mm, 28 radios\nNeumáticos: Continental Grand Prix o Vittoria Zafiro V 700×28c según versión\nManubrio / Potencia: OC Road Performance (reach 70, drop 125, potencia -6º)\nTija: Carbono SP 0.2, 27.2 mm, setback 20 mm\nSillín: Fizik Aliante R5\nGeometría: ángulo dirección ~71°-73° (depende talla), ejes trasero 12×142 mm\nExtras: Compatible con potenciómetro, cierre thru-axle, cableado interno\nTipo de uso: Ruta de alto rendimiento / entrenamiento',
    9599880, 
    '/uploads/Orbea_Orca_M30i.jpeg'
),
(
	2,
    2,
    'Orbea Orca M30',
	'Cuadro: Orbea Orca carbono OMR monocoque, 1.5″ de dirección, BB 386, compatibilidad con potenciómetro, eje trasero 12×142 mm, cableado interno\nHorquilla: Orbea Orca OMR ICR de carbono, dirección cónica 1-1/8″–1.5″, eje pasante delantero 12×100 mm\nTransmisión: Shimano 105 R7100, 12 velocidades, bielas 34×50T, cassette 11-34\nManetas: Shimano R7120\nDesviador delantero y trasero: Shimano 105 R7100\nCadena: Shimano M6100\nFrenos: Shimano R7170 hidráulico de disco\nManubrio: OC Road Performance RP31 (Reach 80, Drop 125) o versión riser RP31-R (Rise 15)\nPotencia: OC Road Performance RP23, -5°\nTija de sillín: SP 0.2 carbono, 27.2 mm con setback de 20 mm\nSillín: Fizik Aliante R5\nRuedas: Aros de aleación tubeless 700c, 19c, 28 h\nNeumáticos: Continental Grand Prix 700×28c\nGeometría: ángulo de dirección entre ~71° y ~73° según talla; trail de 57–66 mm según tamaño\nTipo de uso: Ruta de alto rendimiento / entrenamiento',
    8999880, 
    '/uploads/Orbea_Orca_M30.jpg'
),
(
	2,
    5,
    'Giant Fastroad AR Advanced 2',
	'Cuadro: Advanced-grade composite con disco y eje trasero de 12×142 mm\nHorquilla: Composite con dirección OverDrive y eje delantero 12×100 mm\nNeumáticos: Giant Gavia Fondo AR tubeless 700×40c, hasta 42 mm de ancho máximo\nRuedas: Aros Giant SR-2 con bujes Giant de aleación y eje de 12 mm\nManubrio: Giant Sport mini-rise de 31.8 mm\nPotencia: Giant Contact con 8° de ángulo (longitud según talla)\nTija: Giant D-Fuse compuesta de 350 mm\nSillín: Giant ErgoContact\nTransmisión: Shimano CUES U6000 de 10 velocidades\nCambio trasero: Shimano CUES U6000\nCassette: Shimano CS-LG40010 11-48\nCadena: KMC X10\nPedalier: FSA Omega con plato de 42 dientes (longitud de biela según talla)\nFrenos: Tektro HD-R280 con rotores Giant MPH de 160 mm adelante y atrás\nPeso: ~9.73 kg (según versión)\nExtras: Listo para tubeless, geometría para manejo cómodo, ideal para rutas mixtas y caminos "all-road".',
    9136000, 
    '/uploads/Giant_Fastroad_AR_Advanced_2.png'
),
(
	3,
    7,
    'Brompton Electric P Line Explore 12 Speed',
	'Cuadro: acero con triángulo trasero de titanio, plegable en menos de 20 segundos\nMotor: motor de buje delantero sin escobillas de 250 W, asistencia hasta 25 km/h\nBatería: 300 Wh 36 V con pantalla LED y puerto USB 5 V 1,5 A, carga completa en ~4 horas\nAutonomía: entre 30 y 70 km según el terreno (20‑45 millas)\nTransmisión: sistema de 12 velocidades Brompton (combinación de cambio de 4‑velocidades + buje de 3‑velocidades), rango del 402 %\nPlatos / Cassette: plato de 50T, piñones de 11‑13‑15‑18T\nFrenos: frenos de doble pivote Brompton caliper\nRuedas: rin simple con motor en la rueda delantera; rueda trasera con buje de 12 velocidades\nNeumáticos: Continental Contact Urban 349×35C plegables\nPeso: desde 16,3 kg con batería\nTamaño plegado: 64,26 cm (alto) × 58,42 cm (ancho) × 26,92 cm (fondo)\nExtras: guardabarros delantero y trasero, luces integradas AVY LED (dinamo), aplicación Brompton Electric para iOS y Android',
    28600000, 
    '/uploads/Brompton_Electric_P_Line_Explore_12_Speed.jpeg'
),
(
	3,
    4,
    'Trek Townie Go 5i Step-Thru', 
	'Cuadro: 6061‑T6 de aluminio con Flat Foot Technology para mayor comodidad y control\nMotor: Bosch Active Line Plus de 250 W\nPar motor: aproximadamente 50 Nm\nBatería: Bosch PowerPack 400 Wh, extraíble\nCargador: 4 AMP\nAutonomía: entre 32 y 112 km según modo de asistencia (Eco, Tour, Sport, Turbo)\nCambios: Shimano Nexus 5‑speed integrado (hub interno)\nPlato / Bielas: FSA forjado de 170 mm con plato de 38T\nCadena: KMC Z1EHX niquelada\nRuedas: llantas de aleación de 26″ × 36H\nNeumáticos: Schwalbe Fat Frank 26″ × 2.35″ tipo "balloon", con carcasa reforzada\nSuspensión: no tiene suspensión (rigidez cruiser)\nFrenos: Tektro hidráulicos de disco frontales y traseros\nManubrio: aleación curvada “custom bend” de 25.9″ de ancho y 4″ de elevación\nPotencia: vástago forjado de aleación de 25.4 mm y 80 mm de largo\nTija de sillín: microajustable de aleación, 27.2 mm × 350 mm\nSillín: ergonómico con elastómeros absorbentes de impactos\nPedales: plataforma de aleación con superficie antideslizante\nExtras: guardabarros a juego, luces LED delanteras y traseras, portaequipajes compatible, cableado interno\nCapacidad máxima de peso (bicicleta + ciclista + carga): aproximadamente 136 kg\nTipo de uso: movilidad urbana / paseo “cruiser” con asistencia eléctrica',
    9199000, 
    '/uploads/Trek_Townie_Go_5i_Step_Thru.jpg'
),
(
	3,
    7,
    'E-Bike Urbana 26″ 750 W', 
	'Cuadro: acero o aluminio con diseño urbano cómodo\nRueda: 26 pulgadas\nMotor: 750 W sin escobillas (hub motor)\nBatería: litio de ~48 V, extraíble\nAutonomía: ~40‑70 km según uso y nivel de asistencia\nModos: PAS y posiblemente acelerador\nFrenos: disco (mecánico o hidráulico)\nNeumáticos: adecuados para ciudad, pueden ser más anchos\nManubrio: postura erguida para confort\nSillín: ergonómico y tija cómoda\nExtras: luces, guardabarros, display LCD',
    1690000, 
    '/uploads/E_Bike_Urbana_26_750_W.jpg'
),
(
	4,
    3,
    'BMC URS 01 TWO', 
	'Cuadro: URS 01 Premium Carbon con Micro Travel Technology (MTT) y geometría Gravel+.\nSuspensión trasera: 10 mm con tecnología MTT (XCell) en los tirantes.\nHorquilla: URS 01 Premium Carbon con Tuned Compliance Concept Gravel, ruteo integrado (frenos y dinamo), soporte para guardabarros y portaequipaje, eje 12×100 mm.\nDirección: ICS con potencia de suspensión MTT x Redshift.\nTransmisión: SRAM Rival AXS (palancas) + GX Eagle AXS 1×12.\nPlato: 38T; Cassette: 10‑52T.\nCadena: SRAM GX Eagle.\nCambio trasero: SRAM X01 Eagle AXS.\nFrenos: SRAM Rival AXS hidráulicos (rotors 180 mm adelante, 160 mm atrás).\nManubrio: BMC HB D4 03 (aleación), 115 mm de drop, 70 mm de reach, 16° flare.\nTija de sillín: URS 01 Premium Carbon en forma D, 0 mm de offset.\nSillín: WTB Gravelier Stainless (o SL8 dependiendo versión).\nRuedas: AG 20 aluminio, tubeless ready.\nNeumáticos: WTB Raddler 40 mm.\nAlmacenamiento: espacio integrado en el tubo diagonal para una bolsa y portabidones laterales.\nPuntos de montaje: soportes para guardabarros y alforjas.\nGeometría: Gravel+, estable en terrenos mixtos.\nPeso aproximado: ~8.80 kg.\nTipo de uso: gravel de aventura, bikepacking y rutas largas.',
    1400000, 
    '/uploads/BMC_URS_01_TWO.webp'
),
(
	1,
    7,
    'MTB Básica 26″',
	'Cuadro: Acero o aluminio básico\nTamaño de rueda: 26″\nSuspensión: rígida o delantera básica\nTransmisión: 18-21 velocidades (3×6 o 3×7)\nFrenos: V-Brake\nRuedas: Aros 26″ de acero o aluminio\nNeumáticos: diseño taco o semi-taco 26×1.95 aproximadamente\nManubrio: recto tipo MTB\nTija de sillín: acero o aluminio\nSillín: básico acolchado\nPedales: plataforma de plástico o metal\nPeso aproximado: 13-16 kg\nUso: senderos ligeros, rutas recreativas o urbanos', 
    1690000,
    '/uploads/MTB_Básica_26.png'
);