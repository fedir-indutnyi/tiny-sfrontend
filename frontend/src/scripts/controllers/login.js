'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('loginCtrl', function ($rootScope, $scope, Userprofile, $location) {
    $scope.submit = function() {
      console.log("rememberMe me value: " + $scope.credentials.rememberMe );
    $rootScope.loginResult = Userprofile.login({ rememberMe: $scope.credentials.rememberMe }, $scope.credentials,
          function() {
            // success
              console.log ('Congratulations: ' + $rootScope.loginResult.id);
              $location.path("/allideas");
          }, function(res) {
            // error
            console.log ('Login Failed: ' + $rootScope.loginResult.id);
          }
     )};
     
 
  });
  

  
  
  