// Filesys zuzugreifen mit fs kann man dateien manipulieren
var fs = require("fs");
// Path macht aus web => c://....
var path = require("path");

// Framework zu zugriff auf die Datenbank....
var Sequelize = require("sequelize");

// Erstellen von eines Config Objects für die DatebankConnection

/*
var sequelize = new Sequelize('projectarbeituni', 'app', 'ikrdeveloper68309', {
    host: 'code-garage-solutions.de',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});*/

var sequelize = new Sequelize('postgres://app:ikrdeveloper68309@code-garage-solutions.de:5432/projectarbeituni');

var db = {};


// Importieren aller Datanbank Modele (Datenbank Blaupausen) in das db Object...

fs
    .readdirSync(__dirname +"/models")
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname+"/models", file));

        db[model.name] = model;
    });

// Erkennung von Beziehungen zwischen den einzelnen Modelen (Blaupausen) und Auflösungen

Object.keys(db).forEach(function (modelName) {

    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;







