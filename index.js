/**
 * Created by kaceria on 15.02.2017.
 */

// Express ist ein Modul was uns dabei Unterstützt ein Webserver aufzusetzten
var express = require('express');
// Path ist ein Modul das uns Hilf auf das Dateisystem zuzugreifen in Form von Auflösen der Absouluten Adresse bzw. c:/proje....
var path = require('path');

// Initialisierung der Servermodulus ähnlich wie erzeugung eines Object durch eine Klasse ClassTest Test = new CalssTest
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
const sequelize_fixtures = require('sequelize-fixtures');

// Aufruf der Datenbank

var database = require('./database/index');

// Sync det Daten.....

var dev = true;

// Wie werden übergebene Datenverarbeitet

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(bodyParser.json({limit: '50mb' }))


database.sequelize.sync({ force: dev }).then(function () {

    if(dev == true){
        sequelize_fixtures.loadFile('database/importData/*.json', database).then(function(){

        });
    }
});

// Configurieren dem Webserver eine Adresse http://localhost/ bitte leite den User auf den Web Ordner und gebe ihn die Daten aus... z.B. index.html
app.use('/', express.static(path.join(__dirname, 'web')));


// Aufbau von Öffentlicher Schnittstelle z.b. Für Login und Registration

require('./server/publicapi/index')(router, database);
app.use('/publicapi', router);
router = express.Router();



// Starte den Webserver unter dem PORT 3010
app.listen(3010, function () {
    console.log('Example app listening on port 3010!');
});