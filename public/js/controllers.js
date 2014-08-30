'use strict';

var vmoControllers = angular.module('vmoControllers', []);
 
vmoControllers.controller('Stream6Controller', ['$scope',
  function($scope) {
    $scope.$on('SECS', function(msg) {
      $scope.Stream6Message = msg
    });
}]);

vmoControllers.controller('IndexController', ['$scope',
  function($scope) {
    $scope.message = '';
}]);

vmoControllers.controller('ConsoleController', ['$scope',
  function($scope) {
    console.log("console controller"); 
	$('#videoContainer').bind("click",function(e) {
	});	
    $('#videoContainer').mouseover( function(e) {
		$('#videoContainer').bind("click",function(e) {
           var parentOffset = $(this).parent().offset(); 
           //or $(this).offset(); if you really just want the current element's offset
           var relX = e.pageX - parentOffset.left - 16 ;
           var relY = e.pageY - parentOffset.top;		
           console.log ( "left: " + relX + ", top: " + relY );
		  
		});
      });
    $("#videoContainer").mouseout(function() {
	  $('#videoContainer').unbind("click",function(e) {
	  });
    });  	  	
}]);

vmoControllers.controller('ChromeController', ['$scope','$http','socket',  

  function($scope, $http, socket) {
  
  
    $scope.submitPost = function () {
	console.log($scope.form);
      $http.post('/api/step', $scope.form).
        success(function(data) {
          console.log("Done");
        });
    };
  
  
    // Socket listeners
    // ================
    socket.on('init', function (data) {
      console.log('init');
    });

	socket.on('secs', function ( secs ) {
       $rootScope.$broadcast('SECS', secs.msg );
	});
    socket.on('message', function (message) {
	  //console.log(message);
	  $scope.firstStep = message.control.firstStep ;
	  $scope.lastStep = message.control.lastStep ;
	  $scope.step = message.control.step ;
	  $scope.lotid = message.wip.lotid ;
	  $scope.stage = message.wip.stage ;
	  $scope.recipe = message.wip.recipe ;
	  $scope.process1 = message.sequence[0].process ;
	  $scope.periods1 = message.sequence[0].periods ;
	  $scope.set1 = message.sequence[0].set ;
	  $scope.description1 = message.sequence[0].description ;
	  $scope.process2 = message.sequence[1].process ;
	  $scope.periods2 = message.sequence[1].periods ;
	  $scope.set2 = message.sequence[1].set ;
	  $scope.description2 = message.sequence[1].description ;
	  $scope.process3 = message.sequence[2].process ;
	  $scope.periods3 = message.sequence[2].periods ;
	  $scope.set3 = message.sequence[2].set ;
	  $scope.description3 = message.sequence[2].description ;
	  $scope.process4 = message.sequence[3].process ;
	  $scope.periods4 = message.sequence[3].periods ;
	  $scope.set4 = message.sequence[3].set ;
	  $scope.description4 = message.sequence[3].description ;
	  $scope.process5 = message.sequence[4].process ;
	  $scope.periods5 = message.sequence[4].periods ;
	  $scope.set5 = message.sequence[4].set ;
	  $scope.description5 = message.sequence[4].description ;
	  $scope.process6 = message.sequence[5].process ;
	  $scope.periods6 = message.sequence[5].periods ;
	  $scope.set6 = message.sequence[5].set ;
	  $scope.description6 = message.sequence[5].description ;
	  $scope.process7 = message.sequence[6].process ;
	  $scope.periods7 = message.sequence[6].periods ;
	  $scope.set7 = message.sequence[6].set ;
	  $scope.description7 = message.sequence[6].description ;
	  $scope.process8 = message.sequence[7].process ;
	  $scope.periods8 = message.sequence[7].periods ;
	  $scope.set8 = message.sequence[7].set ;
	  $scope.description8 = message.sequence[7].description ;
	  $scope.process9 = message.sequence[8].process ;
	  $scope.periods9 = message.sequence[8].periods ;
	  $scope.set9 = message.sequence[8].set ;
	  $scope.description9 = message.sequence[8].description ;
	  $scope.process10 = message.sequence[9].process ;
	  $scope.periods10 = message.sequence[9].periods ;
	  $scope.set10 = message.sequence[9].set ;
	  $scope.description10 = message.sequence[9].description ;
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