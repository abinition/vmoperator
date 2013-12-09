'use strict';

var vmoControllers = angular.module('vmoControllers', []);
 
vmoControllers.controller('Stream6Controller', ['$scope',
  function($scope) {
    $scope.Stream6Message = 'S6F9 - Tool is Online.  S6F9 - Tool is Offline. S6F9 - Tool is Idle. ';
}]);

vmoControllers.controller('ConsoleController', ['$scope','socket',  

  function($scope, socket) {
    // Socket listeners
    // ================
    socket.on('init', function (data) {
      console.log('init');
    });

    socket.on('message', function (message) {
	  console.log ( "Received message");
	  $scope.step = message.sensors.step ;
	  $scope.time = message.sensors.time ;
	  $scope.chamber = message.sensors.pressure ;
	  $scope.rf = message.sensors.rf ;
	  $scope.name = message.recipe.name ;
	  $scope.loadlock = message.recipe.loadlock ;
	  $scope.id  = message.sequence.id ;
	  $scope.helium = message.sequence.pressure
	  $scope.voltage = message.sequence.voltage ;
	  $scope.temp = message.sequence.temp ;
	  $scope.lotid = message.wip.lotid ;
	  $scope.stage = message.wip.stage ;
	  $scope.recipe = message.wip.recipe ;
    });

    // Methods published to the scope
    // ==============================
    $scope.sendMessage = function () {
      socket.emit('message', {
        message: $scope.message
      });
      // clear message box
      $scope.message = '';
    };
  }
]);