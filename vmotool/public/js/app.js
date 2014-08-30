'use strict';

// Declare app level module which depends on filters, and services
var vmo = angular.module('VMOTool', [
  'ngRoute',
  'vmoControllers'
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

function GemController( $scope, $http, $timeout ) {
  $http.get('/api/gem').
    success(function(data, status, headers, config) {
      $scope.GemMessage = data.gem ;
    });
	$scope.ToolName = "Balzer" ;
	$scope.Step = 3 ;
	$scope.Time = 20.0 ;
	$scope.Pressure = 4 ;
	$scope.RF = 2345 ;              
	$scope.Name = 'Sputtering' ;
	$scope.Helium = 8.0 ;
	$scope.Voltage = 1800 ;
	$scope.Temp = 55 ;
	$scope.Lotid = 'X12345.1' ;
	$scope.Stage = 'POLY' ;
	$scope.PPID = 'Sputter' ;
	$scope.LoadLock = 'A' ;

	var timer;
	$scope.adjust = function() {
		timer = $timeout(function() {
			$scope.Step++ ;
			if ( $scope.Step > 10 ) $scope.Step = 1 ;
			$scope.Time++ ;
			if ( $scope.Time > 60.0 ) $scope.Time = 0.0 ;
			$scope.Pressure-- ;
			if ( $scope.Pressure < 2 ) $scope.Pressure = 20 ;
			$scope.RF = $scope.RF + 100 ;
			if  ( $scope.RF > 3000 ) $scope.RF = 2000 ;              
			$scope.Name = 'COOL-POLY-N' ;
			$scope.Helium = $scope.Helium == 8.0 ? 9.0 : 8.0 ;
			$scope.Voltage = $scope.Voltage == 1800 ? 1799 : 1800 ;
			$scope.Temp++ ;
			if ( $scope.Temp > 100 ) $scope.Temp = 40 ;
			$scope.Lotid = 'X12345.1' ;
			$scope.Stage = 'POLY' ;
			$scope.PPID = 'COOL-POLY-N' ;
			$scope.LoadLock = $scope.LoadLock == 'A' ? 'B' : 'A' ;	
			
			$scope.adjust() ;
			// $timeout.cancel(timer);
		}, 5000) ;
	  };
	  			$scope.adjust() ;
	};