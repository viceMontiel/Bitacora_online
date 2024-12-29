create database if not exists bitacorasdb;

use bitacorasdb;

create table Usuario(
    id INT NOT NULL UNIQUE AUTO_INCREMENT,
    nombre VARCHAR(30) DEFAULT NULL,
    apellido VARCHAR(30) DEFAULT NULL,
    cargo VARCHAR(20) NOT NULL DEFAULT 'analista',
    correo VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE Evento (
    id INT NOT NULL UNIQUE AUTO_INCREMENT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    programa VARCHAR(50) DEFAULT NULL,
    descripcion TEXT DEFAULT NULL,
    id_Usuario INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id)
);

CREATE TABLE Imagen (
    id INT NOT NULL UNIQUE AUTO_INCREMENT, 
    archivo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	id_Evento INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id_Evento) REFERENCES Evento(id)
);