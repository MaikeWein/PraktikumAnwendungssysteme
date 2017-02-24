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
                url: '/publicapi/profile?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'deleteProfile': {
                method: 'DELETE',
                url: '/publicapi/profile?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'getGebaeck': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/gebaeck?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'getGeschmack': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/geschmack?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'getFuellung': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/fuellung?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'getToppings': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/toppings?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'createBestellung': {
                method: 'POST',
                url: '/publicapi/bestellung?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'getBestellungen': {
                method: 'GET',
                isArray:true,
                url: '/publicapi/bestellung?token=' + localStorage.getItem('jwt'),
                params: {}
            },
            'deleteBestellungen': {
                method: 'DELETE',
                isArray:true,
                url: '/publicapi/bestellung?token=' + localStorage.getItem('jwt'),
                params: {}
            },








        });
    };
});
//# sourceMappingURL=appservice.js.map