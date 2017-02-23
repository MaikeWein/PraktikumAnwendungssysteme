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
        });
    };
});
//# sourceMappingURL=appservice.js.map