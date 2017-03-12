var app = angular.module('app',["ngRoute","ngMaterial",'app.authservice','ngResource','ngAnimate','drop-ng','mdSteppers','slick' ]);

app.directive('shakeThat', ['$animate', function($animate) {

        return {
            require: '^form',
            scope: {
                submit: '&',
                submitted: '='
            },
            link: function(scope, element, attrs, form) {

                // listen on submit event
                element.on('submit', function() {

                    // tell angular to update scope
                    scope.$apply(function() {

                        // everything ok -> call submit fn from controller
                        if (form.$valid) return scope.submit();

                        // show error messages on submit
                        scope.submitted = true;

                        // shake that form
                        $animate.addClass(element, 'shake', function() {
                            $animate.removeClass(element, 'shake');
                        });

                    });

                });

            }
        };}]);

app .directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);

app.config(function ($routeProvider,$mdThemingProvider) {

    var primMap = $mdThemingProvider.extendPalette('pink', {
        '500': '#DE8BA5',
        'contrastDefaultColor': 'light'
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('primMaike', primMap);


    var accentMap = $mdThemingProvider.extendPalette('green', {
        '500': '#FCBEBF',
        'contrastDefaultColor': 'light'
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('accentMaike', accentMap);


    var warningMap = $mdThemingProvider.extendPalette('green', {
        '500': '#FCBEBF',
        'contrastDefaultColor': 'light'
    });

    // Register the new color palette map with the name <code>neonRed</code>
    $mdThemingProvider.definePalette('warningMaike', warningMap);


    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
        .primaryPalette('primMaike')
        .accentPalette('accentMaike')
        .warnPalette('warningMaike');




    $routeProvider
        .when('/home', {
            controller: 'appCtrl',
            templateUrl: 'template/home/home.html',
            pageTitle: 'Home'
        })
        .when('/meinebestellungen', {
            controller: 'appCtrl',
            templateUrl: 'template/meinebestellungen/meinebestellungen.html',
            pageTitle: 'Meine Bestellungen'
        })
        .when('/neuebestellung', {
            controller: 'appCtrl',
            templateUrl: 'template/neuebestellung/neuebestellung.html',
            pageTitle: 'Neue Bestellung'
        })
        .when('/meinprofil', {
            controller: 'appCtrl',
            templateUrl: 'template/meinprofil/meinprofil.html',
            pageTitle: 'Neue Bestellung'
        });




    $routeProvider.otherwise('/home');

    ;

});


app.controller('appCtrl',appCtrl);


 function appCtrl($scope,$location,$anchorScroll,$mdDialog,$authapp,$timeout,$rootScope,$animate,$mdToast,$mdStepper){


     // Wächter wenn jemand versucht ohne Anmeldung an das Profile oder Meine Bestellung oder neue Bestellung zu holen
     // Dabei wird bei der Event Überwacht bei dem Seitenwechsel.
     // Bei jedem Seitem WEchsel wird überwacht ob ein Anmelde Token vorhanden ist und ob dieser Valide ist
     // Ist ein Token nicht Valide und der Nutzer versucht auf die Geschützen Seiten zu kommen so wird dieser auf home umgeleitet
     $scope.$on('$routeChangeStart', function(next, current) {

         var token = localStorage.getItem('jwt');

         if( token != null){

             // Überprüfe den Token

             $authapp.checkToken({token:token}).$promise.then(function (data) {

                 // Prüfen ist der Token valide


                 if(typeof data.err !== "undefined"){

                     // Nicht Valide daher vorhandenen Token Löschen
                     localStorage.removeItem('jwt');

                     if(current.$$route.originalPath == "/meinprofil" || current.$$route.originalPath == "/neuebestellung" || current.$$route.originalPath == "/meinebestellungen"){
                         $location.path('/home');
                     }
                     $('body').css('visibility','visible');
                 }else {

                     // Valide daher auf Eingelogte Maske wechseln

                     $rootScope.login = true;
                     $rootScope.profile = data.profile;
                     $('body').css('visibility','visible');
                 }
             });
         }else {

             $('body').css('visibility','visible');

           if( current.$$route.originalPath == "/meinprofil" || current.$$route.originalPath == "/neuebestellung" || current.$$route.originalPath == "/meinebestellungen"){
                 $location.path('/home');
             }
         }




     });
    $rootScope.profile = {};
    $rootScope.login=false;
    $scope.loginObj = {};
    $scope.regObj   = {};
    $rootScope.loginError = false;
     $rootScope.regError = false;
     $rootScope.gebaeck = [];
     $rootScope.geschmack = [];
     $rootScope.fuellung = [];
     $rootScope.toppings = [];

     // BestellObj für die Datenbank

     $rootScope.bestellung = {};


     // Beim Betätigen der Anmeldung
    $scope.startLogin = function () {

        // Fehler auf false setzen
        $rootScope.loginError = false;


        // Senden des Anmelde Formulars an den Server

        $authapp.login($scope.loginObj).$promise.then(function ( data) {

            // Bei Fehler bitte Shaken über eine Animationsklasse und CSS3 Animation

            if(typeof data.err !== "undefined"){

                $('md-dialog').removeClass( "shake" );

                $animate.addClass($('md-dialog'), 'shake', function() {
                    $animate.removeClass($('md-dialog'), 'shake');
                });

                $rootScope.loginError = true;
            }else{

                // Ansonsten Anmelden dabei den Login auf true setzen um Ausgblendete Items anzuzeigen
                // Dialog Schlissen
                // Profile Informationen Zwischenspeichern
                // Token zwischenspeichern in Scope sowie Localstorage (Webseiten Datebank)


                $rootScope.login = true;
                $mdDialog.hide();
                $rootScope.profile = data.profile;
                $rootScope.token = data.token;
                localStorage.setItem('jwt',data.token);
                $timeout(function () {

                    $scope.$apply();
                });
            }
        });

    };

    // Beim Regestrieren Gleiche wie bei Anmeldung...
    $scope.startRegister = function () {
        // Fehler auf false setzen
        $rootScope.regError = false;
         $authapp.register($scope.regObj).$promise.then(function ( data) {

             if(typeof data.err !== "undefined"){

                 $('md-dialog').removeClass( "shake" );

                 $animate.addClass($('md-dialog'), 'shake', function() {
                     $animate.removeClass($('md-dialog'), 'shake');
                 });
                 $rootScope.regError = true;



             }else{

                 $mdDialog.hide();
                 $rootScope.login = true;


                 $rootScope.profile = data.profile;
                 $rootScope.token = data.token;
                 localStorage.setItem('jwt',data.token);

             }
         });

     };


    // Öffnen des Login Popups durch Angular Material MDDialog
    $scope.openLogin = function ($event) {

        var parentEl = angular.element(document.body);

        $rootScope.loginError = false;
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            templateUrl: 'login.tmpl.html',
            controller:appCtrl,
            clickOutsideToClose:true
        });


    };
     // Öffnen der Registrierung Popups durch Angular Material MDDialog
    $scope.openRegister = function ($event) {
        var parentEl = angular.element(document.body);

        $rootScope.regError = false;
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            templateUrl: 'register.tmpl.html',
            controller:appCtrl,
            clickOutsideToClose:true
        });
    }
    // Öffnen der Webseite wie z.B. Mein Profile, Neue Bestellung und Meine Bestellungen

    $scope.openSite = function (sitetitle) {

        $location.path(sitetitle);
    }

    // Navigation von Home Stöbern usw. Innerhalb der Home Seite über Scroller

    $scope.gotoAnchor = function(x) {

        if($location.$$path != "/home"){
            $location.path('/home');
        }

        if ($location.hash() !== x) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };

    // Beim Laden der Seite bitte Ausführen


     $scope.init = function () {



         // Prüfen ob ein Token in der Localstorage ist (Client Datenbank)

         var token = localStorage.getItem('jwt');

         if( token != null){

            // Überprüfe den Token

             $authapp.checkToken({token:token}).$promise.then(function (data) {

                 $('body').css('visibility','visible');

                 // Prüfen ist der Token valide


                 if(typeof data.err !== "undefined"){

                     // Nicht Valide daher vorhandenen Token Löschen
                     localStorage.removeItem('jwt');

                 }else {

                     // Valide daher auf Eingelogte Maske wechseln

                     $rootScope.login = true;
                     $rootScope.profile = data.profile;
                     $rootScope.token  = localStorage.getItem('jwt');

                 }
             });
         }
     }

     // Abmelden von der Seite

     $scope.logout = function () {

         $rootScope.login = false;
         $rootScope.profile = {};
         localStorage.removeItem('jwt');
         $scope.$broadcast("closeDrop");
         $location.path('/home');
     }

     // Aktualisieren von der Seite mit Notification

     $scope.updateProfile = function () {

         $rootScope.profile.token = $rootScope.token;

         console.log(    $rootScope.profile);


         $authapp.updateProfile( $rootScope.profile).$promise.then(function (data) {

             if(typeof data.err !== "undefined"){


             }else {

                 // Senden von Notification
                 $mdToast.show($mdToast.simple().textContent('Profile wurde aktuallisiert!') .position('top left'));
             }
         });

     }

     // Profil Löschen mit Abfrage....

     $scope.deleteProfile = function (ev) {


         var confirm = $mdDialog.confirm()
             .title('Möchten Sie ihr Profil löschen ?')
             .targetEvent(ev)
             .ok('Ja Profil löschen')
             .cancel('Nein löschen abbrechen');

         $mdDialog.show(confirm).then(function() {

             $rootScope.profile.token = $rootScope.token;


             $authapp.deleteProfile( $rootScope.profile).$promise.then(function (data) {

                 if(typeof data.err !== "undefined"){


                 }else {
                     $rootScope.login = false;
                     $rootScope.profile = {};
                     localStorage.removeItem('jwt');
                     $location.path('/home');
                 }
             });
         }, function() {
         });


     }


     // Hole alle Zutaten für Neue Bestellung

     $scope.getZutaten = function () {

         var arr = [];

         arr.push($authapp.getGebaeck().$promise);
         arr.push($authapp.getGeschmack().$promise);
         arr.push($authapp.getFuellung().$promise);
         arr.push($authapp.getToppings().$promise);

         Promise.all(arr).then(function (values) {

             $rootScope.gebaeck = values[0];
             $rootScope.geschmack = values[1];
             $rootScope.fuellung = values[2];
             $rootScope.toppings = values[3];
             $timeout(function () {

                 $scope.$apply();
             });


         });


     }



     // Hilfsfunktion Gebaeck
     $scope.setGebaeck = function (id,gebaeck) {

         $rootScope.bestellung.gebaeckId = id;
         $rootScope.bestellung.gebaeck = gebaeck;
     }
     $scope.checkGebaeck = function (id,bestellung) {

         if( bestellung.gebaeckId == id){
             return true;
         }else{
             return false;
         }
     }
     $scope.checkGebaeckFinish = function (bestellung) {

         if(typeof bestellung.gebaeckId == "undefined" ){
             return true;
         }else {
             return false;
         }
     }

     // Hilfsfunktion Geschmack
     $scope.setGeschmack = function (id,geschmack) {

         $rootScope.bestellung.geschmackId = id;
         $rootScope.bestellung.geschmack = geschmack;
     }
     $scope.checkGeschmack = function (id,bestellung) {

         if( bestellung.geschmackId == id){
             return true;
         }else{
             return false;
         }
     }
     $scope.checkGeschmackFinish = function (bestellung) {

         if(typeof bestellung.geschmackId == "undefined" ){
             return true;
         }else {
             return false;
         }
     }

     // Hilfsfunktion Füllung
     $scope.setFuellung = function (id,fuellung) {

         $rootScope.bestellung.fuellungId = id;
         $rootScope.bestellung.fuellung = fuellung;
     }
     $scope.checkFuellung = function (id,bestellung) {

         if( bestellung.fuellungId == id){
             return true;
         }else{
             return false;
         }
     }
     $scope.checkFuellungFinish = function (bestellung) {

         if(typeof bestellung.fuellungId == "undefined" ){
             return true;
         }else {
             return false;
         }
     }

     // Hilfsfunktion Toppings
     $scope.setToppings = function (id,toppings) {

         if(typeof $rootScope.bestellung.toppings == "undefined"){
             $rootScope.bestellung.toppings = [];
         }

         var found = false;
         var index = 0;

         for(var i = 0 ;i < $rootScope.bestellung.toppings.length; i++ ){

             if($rootScope.bestellung.toppings[i].id == id){
                 found = true;
                 index = i;
             }
         }


         if(found == false){
             $rootScope.bestellung.toppings.push({id:id,toppings:toppings});
         }else {
             $rootScope.bestellung.toppings.splice(index,1);
         }


     }
     $scope.checkToppings = function (id,bestellung) {

         if(typeof bestellung.toppings == "undefined"){
             return false;
         }

         var found = false;

         for(var i = 0 ;i < bestellung.toppings.length; i++ ){

             if(bestellung.toppings[i].id == id){
                 found = true;
             }
         }
         return found;
     }
     $scope.checkToppingsFinish = function (bestellung) {

         if(typeof bestellung.toppings == "undefined"){
             return true;
         }

         if(bestellung.toppings.length >= 1){
             return false;
         }else {
             return true;
         }
     }


     $scope.weiter = function () {

         $mdStepper('steppercupcake').next();
     }
     $scope.zurueck = function () {
         $mdStepper('steppercupcake').back();
     }


     $scope.sendBestellung = function () {


         var promarr = [];

         promarr.push($authapp.updateProfile( $rootScope.profile).$promise);


         $rootScope.bestellung.userId = $rootScope.profile.id;
         $rootScope.bestellung.gesamtPreis =   $scope.berrechnen($rootScope.bestellung);

         $rootScope.bestellung.token = $rootScope.token;

         promarr.push($authapp.createBestellung( $rootScope.bestellung).$promise);

         Promise.all(promarr).then(function (data) {

             $location.path('/meinebestellungen');
             $timeout(function () {

                 $scope.$apply();
             });
         });


     }


     // Hole Meine Bestellungen

     $scope.getMyBestellungen = function () {

         var arr = [];

         arr.push($authapp.getBestellungen({token:$rootScope.token}).$promise);

         Promise.all(arr).then(function (values) {

             $rootScope.meinebestellungen = values[0];

             $timeout(function () {

                 $scope.$apply();
             });


         });

     }

     $scope.deleteBestellung = function (best) {

         var confirm = $mdDialog.confirm()
             .title('Möchten Sie die Bestellung löschen ?')
             .ok('Ja Bestellung löschen')
             .cancel('Nein löschen abbrechen');

         $mdDialog.show(confirm).then(function() {

             best.token= $rootScope.token;

             $authapp.deleteBestellungen( best).$promise.then(function (data) {

                 if(typeof data.err !== "undefined"){


                 }else {

                     $rootScope.meinebestellungen = data;

                     $timeout(function () {

                         $scope.$apply();
                     });
                 }
             });
         }, function() {


         });
     }

     // Calculat Gesamt Summe

     $scope.berrechnen = function (bestellung) {

         var sum = 0;

         sum = sum  + bestellung.gebaeck.preis;
         sum = sum  + bestellung.geschmack.preis;
         sum = sum  + bestellung.fuellung.preis;

         for(var i = 0; i < bestellung.toppings.length;i++){
             sum = sum  +  bestellung.toppings[i].toppings.preis;
         }


         return sum;
     }
     
};