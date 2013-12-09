'use strict';

/* Services */

angular.module('vmoServices', []).
  factory('socket', function ($rootScope) {
    //var socket = io.connect('http://108.241.35.53');
    var socket = io.connect('http://192.168.11.103');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
		  console.log ( "on" ) ;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
		  console.log ( "Emit" );
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });