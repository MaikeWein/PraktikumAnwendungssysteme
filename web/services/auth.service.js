"use strict";

// Wie heisst der Service
var objc = angular.module('app.authservice', []);
// Wie soll die Variable heissen
objc.provider('$authapp', function () {
    this.$get = function ($resource) {
        return $resource('', {}, {
            'login': {
                method: 'POST',
                url: '/publicapi/login',
                params: {}
            },
            'register': {
                method: 'POST',
                url: '/publicapi/registration',
                params: {}
            },
            'checkToken': {
                method: 'GET',
                url: '/publicapi/checktoken',
                params: {}
            },
            'updateProfile': {
                method: 'PUT',
                url: '/publicapi/profile',
                params: {}
            },
            'deleteProfile': {
                method: 'DELETE',
                url: '/publicapi/profile',
                params: {}
            },
            'getGebaeck': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/gebaeck',
                params: {}
            },
            'getGeschmack': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/geschmack',
                params: {}
            },
            'getFuellung': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/fuellung',
                params: {}
            },
            'getToppings': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/toppings',
                params: {}
            },
            'createBestellung': {
                method: 'POST',
                url: '/publicapi/bestellung',
                params: {}
            },
            'getBestellungen': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/bestellung',
                params: {}
            },
            'deleteBestellungen': {
                method: 'DELETE',
                isArray:true,
                url: '/publicapi/bestellung',
                params: {}
            },








        });
    };
});
//# sourceMappingURL=appservice.js.map