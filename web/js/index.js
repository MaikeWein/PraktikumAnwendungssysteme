/**
 * Created by kaceria on 15.02.2017.
 */


var app = angular.module('app',["ngRoute"]);


app.config(function ($routeProvider) {

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
        });
    $routeProvider.otherwise('/home');

    ;

});


app.controller('appCtrl', function($scope,$location,$anchorScroll){

    $scope.login=false;

    $scope.maike="ich bin die beste Entwicklerin der Welt";

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

});