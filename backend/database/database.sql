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