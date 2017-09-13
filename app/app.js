
/* TODO: Set module name for Angular*/

var app = angular.module('blankApp', ['ngRoute','firebase','angulartics',
                                            'angulartics.google.analytics']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {             /* TODO: Set pathName for $routeProvider */
            template: '<home></home>',
            controller: 'homeController'
        })
        .when('/path2', {            /* TODO: Set pathName for $routeProvider */
            template: '<path2></path2>',
            controller: 'path2Controller'
        })
        .when('/path3', {            /* TODO: Set pathName for $routeProvider */
            template: '<path3></path3>',
            controller: 'path3Controller'
        })
        .otherwise('/home');        /* TODO: Set pathName for $routeProvider */
});


