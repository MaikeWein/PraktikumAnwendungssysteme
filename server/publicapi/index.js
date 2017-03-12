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

    // Gebäck daten Holen

    router.get('/gebaeck',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Daten Holen

                    database.GEBAECK.findAll()
                        .then(function (gebaeck) {
                            res.send(gebaeck);
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }


    });

    // Geschmack daten Holen

    router.get('/geschmack',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Daten Holen

                    database.GESCHMACK.findAll()
                        .then(function (GESCHMACK) {
                            res.send(GESCHMACK);
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }


    });


    // Füllung daten Holen

    router.get('/fuellung',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Daten Holen

                    database.FUELLUNG.findAll()
                        .then(function (FUELLUNG) {
                            res.send(FUELLUNG);
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }


    });


    // Toppings daten Holen

    router.get('/toppings',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Daten Holen

                    database.TOPPINGS.findAll()
                        .then(function (TOPPINGS) {
                            res.send(TOPPINGS);
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }


    });

    router.post('/bestellung',function (req,res) {

        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Erstellen

                    var daten = req.body;

                    database.BESTELLUNG.create(daten)
                        .then(function (databack) {

                        var ArrToppings = [];


                            for(var i = 0 ; i < daten.toppings.length; i++){

                                ArrToppings.push(daten.toppings[i].id)
                            }
                            databack.addToppings(ArrToppings).then(function (err,data) {

                                res.send({data:'finish'});
                            });

                        });
                }
            });
        }else{
            res.send({err:'error'});
        }


    });


    // Hole alle Bestellungen

    router.get('/bestellung',function (req,res) {
        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    // Logik zur Daten Holen

                    database.BESTELLUNG.findAll({where:{userId:decoded.id},include:{all:true}})
                        .then(function (BESTELLUNG) {
                            res.send(BESTELLUNG);
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }
    })


    router.delete('/bestellung',function (req,res) {
        // Prüfen ob Token vom Client gesendet wurde

        if(typeof req.query.token !== "undefined"){

            // Prüfen ist der Token Valide

            var token = req.query.token;

            jwt.verify(token, 'IchBinEinSignaturSchluessel', function(err, decoded) {
                if (err) {

                    res.send({'err': 'token not valid'});

                } else {

                    var best = req.query;


                    // Lösche die Bestellung nach ID und Benutzer
                    database.BESTELLUNG.findOne({where:{$and:{id:best.id,userId:decoded.id}}})
                        .then(function (BESTELLUNG) {

                            BESTELLUNG.destroy().then(function () {

                                database.BESTELLUNG.findAll({where:{userId:decoded.id},include:{all:true}})
                                    .then(function (BESTELLUNG) {
                                        res.send(BESTELLUNG);
                                    });
                            });
                        });
                }
            });
        }else{
            res.send({err:'error'});
        }
    })


}
