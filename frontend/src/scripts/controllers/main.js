'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('MainCtrl', function ($rootScope, $scope, Userprofile, $location, LoopBackAuth) {
  
    $scope.logoutuser = function(){
        console.log("user to be logout");
        Userprofile.logout().$promise.then(function() {
             // $location.go('login');
             console.log("User successfull logged off");
             $rootScope.loginResult = null;
            }).catch(function(error){
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
            //  $location.go('login');
    });
    };
 
  });
  

  
  
  