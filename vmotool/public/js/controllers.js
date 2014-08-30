'use strict';

var vmoControllers = angular.module('vmoControllers', []);
 
vmoControllers.controller('IndexController', ['$scope',
  function($scope) {
    $scope.message = 'Index Message';
}]);