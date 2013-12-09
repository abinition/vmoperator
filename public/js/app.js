'use strict';

// Declare app level module which depends on filters, and services
var vmo = angular.module('VMOperator', [
  'ngRoute',
  'vmoControllers',
  'vmoServices'
]);

vmo.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: 'IndexController'
      }).
      when('/gem', {
        templateUrl: 'partials/gem',
        controller: GemController
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
}]);

function GemController( $scope, $http ) {
  $http.get('/api/gem').
    success(function(data, status, headers, config) {
      $scope.GemMessage = data.gem ;
    });
};
  