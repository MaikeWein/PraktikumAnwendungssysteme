/**
 * Created by kaceria on 16.02.2017.
 */
var jwt = require('jsonwebtoken');

module.exports = function (router, database) {


    // Anbindung Schnittstelle für Registration von Benutzern...

    router.post('/registration',function (req,res) {

        if(typeof req.body.email !== "undefined" &&  typeof req.body.password !== "undefined"){

            /*
            *
            *     database.USER.findOne({where:{email:'silvia....'}}) Suche einen Datensatz WHERE email="silvia..."
            *     database.USER.findAll({salutation:false}) Suche alle Datensätze die Mänlich sidn
            *     database.create({email:"",password:""})
            *     database.USER.findOne({where:{id:1}}).then(function(user){ user.update({firstname:"basan"})....
            *     database.USER.findOne({where:{id:1}}).then(function(user){ user.delete ....
            * */


            database.USER.findOne({where:{email:req.body.email}})
                .then(function (data) {

                    if(data == null){

                        // Verschlüsseln des Passwords mittels Hashverfahren und Salting gegen Angriffe auf die Datenbank

                        var pass = req.body.email + req.body.password;

                        // Module von NodeJS zum erzeugen eines Hashes
                        const crypto = require('crypto');

                        // Geheimer Schlüssel zum Salten vom Hash
                        const secret = '0ebb03d529ba50e437416345447e0a6b78617b613aedc8cc4cefacc3d842e9e9';


                        const hash = crypto.createHmac('sha256', secret)
                            .update(pass)
                            .digest('hex');

                        req.body.password = hash;

                        // Crypt....... und Prüfung ob Nutzer Vorhanden...



                        // WICHTIG Hier erstellen wir einen Benutzer .... Daten werden vom Client Gesendet die stecken in req.body

                        /**
                         *
                         *   req.body = {
             *
             *   "email":"silvia.yilidz@gmx.de",
             *   "password":"123testjuhu"
             *
             *   }
                         */


                        database.USER.create(req.body)
                            .then(function (data) {


                                var token = jwt.sign(data.dataValues, 'IchBinEinSignaturSchluessel', {expiresIn: "1h"});

                                // Rückgabe des Tokens und des Profiles an den Client
                                res.send({profile:data,token:token});

                            })
                            .error(function (err) {
                                res.send(err);
                            });

                    }else{
                        res.send({err:'user exist'});
                    }

                }).error(function (err) {
                 res.send(err);
                });

        }else{
            res.send({err:'error'});
        }
    });
    router.post('/login',function (req,res) {
        if(typeof req.body.email !== "undefined" &&  typeof req.body.password !== "undefined"){

            // Zum prüfen ob der Nutzer valide ist muss das Passwort wieder Gahasht werden um ein vergleich durchführen zu können.
            var pass = req.body.email + req.body.password;

            // Module von NodeJS zum erzeugen eines Hashes
            const crypto = require('crypto');

            // Geheimer Schlüssel zum Salten vom Hash
            const secret = '0ebb03d529ba50e437416345447e0a6b78617b613aedc8cc4cefacc3d842e9e9';


            const hash = crypto.createHmac('sha256', secret)
                .update(pass)
                .digest('hex');

            req.body.password = hash;


            // Prüfen ob Passwort und Nutzer Vorhanden

            database.USER.findOne({where:{$and:[{email:req.body.email},{password:req.body.password}]}})
                .then(function (data) {

                    // Falls nicht vorhanden no Access zurückgeben...

                    if(data == null){
                        res.send({err:'no access'});
                        return;
                    }

                    // Erstellen einer Eintrittskarte durch einen Token

                    var token = jwt.sign(data.dataValues, 'IchBinEinSignaturSchluessel', {expiresIn: "1h"});

                    // Rückgabe des Tokens und des Profiles an den Client
                    res.send({profile:data,token:token});

                }).error(function (err) {
                   res.send(err);
                 });
        }else{
            res.send({err:'no access'});
        }
    });
    router.get('/checktoken',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Extrahiere den Benutzer aus dem Token

                    // Hole den Aktuellen Nutzer aus der Datenbank und schicke zurück

                    database.USER.findOne({where:{id:decoded.id}})
                        .then(function (data) {
                            res.send({profile:data});
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }
    });


    // Aktualisieren von Profil

    router.put('/profile',function (req,res) {
        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    var profile = req.body;

                    // Extrahiere den Benutzer aus dem Token

                    // Hole den Aktuellen Nutzer aus der Datenbank und schicke zurück

                    database.USER.findOne({where:{id:profile.id}})
                        .then(function (user) {

                            user.update(
                                profile
                            )
                                .then(function (data) {

                                    res.send(data);
                                })
                                .error(function (err) {
                                    res.send(err);
                                });
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }
    });
    router.delete('/profile',function (req,res) {
        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    var profile = req.query;

                    // Extrahiere den Benutzer aus dem Token

                    // Hole den Aktuellen Nutzer aus der Datenbank und schicke zurück

                    database.USER.findOne({where:{id:profile.id}})
                        .then(function (user) {

                            user.destroy().then(function () {

                                res.send({data:'delete'});
                            });
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }
    });

}
