CREATE DATABASE BusTracking DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE BusTracking;

CREATE TABLE Coperativa (
    id INT NOT NULL AUTO_INCREMENT,
    RUC VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NULL UNIQUE,
    direccion VARCHAR(100) NULL,
    telefono1 VARCHAR(20) NULL,
    telefono2 VARCHAR(20) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Ruta (
    id INT NOT NULL AUTO_INCREMENT,
    desde VARCHAR(50) NULL,
    hasta VARCHAR(50) NULL,
    PRIMARY KEY (id)
);
ALTER TABLE Ruta ADD CONSTRAINT unicidadRuta UNIQUE (desde, hasta);

CREATE TABLE Parada (
    id INT NOT NULL AUTO_INCREMENT,
    idRuta INT NULL,
    numero INT NULL,
    nombre VARCHAR(50) NULL,
    latitud VARCHAR(255) NULL,
    longitud VARCHAR(255) NULL,
    tiempoEstimado INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Unidad (
    id INT NOT NULL AUTO_INCREMENT,
    idCoperativa INT NOT NULL,
    placa VARCHAR(10) NULL UNIQUE,
    numero INT NULL,
    anoFabricacion INT NULL,
    registroMunicipal VARCHAR(10) NULL,
    idTipoUnidad INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE AsignacionRuta (
    id INT NOT NULL AUTO_INCREMENT,
    idRuta INT NOT NULL,
    idUnidad INT NOT NULL,
    diaSemana INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE TipoUnidad (
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(20) NOT NULL UNIQUE,
    urlIcono VARCHAR(500) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Persona (
    id INT NOT NULL AUTO_INCREMENT,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(50) NULL,
    apellidos VARCHAR(50) NULL,
    idGenero INT NULL,
    direccion VARCHAR(100) NULL,
    telefono1 VARCHAR(20) NULL,
    telefono2 VARCHAR(20) NULL,
    correoElectronico VARCHAR(100) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Genero (
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(20) NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE Cuenta (
    id INT NOT NULL AUTO_INCREMENT,
    idPersona INT NULL,
    idRol INT NULL,
    idCoperativa INT NULL,
    clave BLOB NULL,
    PRIMARY KEY (id)
);

ALTER TABLE Cuenta ADD CONSTRAINT unicidadCuenta UNIQUE (idPersona, idRol, idCoperativa);

CREATE TABLE Rol (
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(50) NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE Auditoria (
    id INT NOT NULL AUTO_INCREMENT,
    comando TEXT NOT NULL,
    nuevo TEXT NULL,
    anterior TEXT NULL,
    PRIMARY KEY (id)
) ENGINE myISAM;

CREATE TABLE Expresion (
    id INT NOT NULL AUTO_INCREMENT,
    idRemitente INT NOT NULL,
    idBus INT NULL,
    contenido VARCHAR(500) NULL,
    respuesta VARCHAR(500) NULL,
    idCalificacion INT NULL,
    idAdjunto INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Calificacion (
    id INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(50) NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE Adjunto (
    id INT NOT NULL AUTO_INCREMENT,
	tipoArchivo VARCHAR(255) NULL,
	nombreArchivo VARCHAR(255) NULL,
	adjunto LONGBLOB NULL,
	PRIMARY KEY (id)
) ENGINE myISAM;

CREATE TABLE Posiciones (
    id INT NOT NULL AUTO_INCREMENT,
	idUnidad INT NULL,
	tiempo DATETIME NULL,
    latitud VARCHAR(255) NULL,
    longitud VARCHAR(255) NULL,
	PRIMARY KEY (id)
) ENGINE myISAM;