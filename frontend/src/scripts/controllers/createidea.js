'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('createideaCtrl', function ($rootScope, $scope, Ideastartuplist, $location) {
    

    
    $scope.myFunctionAddIdea = function() {
        //this code to make data in standard format
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
        
        $scope.ideasall = Ideastartuplist.create({
                                "created": date,
                                "createdbyid": $rootScope.loginResult.userId,
                                "discussionopen": "true",
                                "estimatedbudget": "0",
                                "estimatedbudgetcurrecy": "USD",
                                "estimatedteamsize": "0",
                                "estimatedtimeinmonths": "0",
                                "ideadescription": $scope.idea.description,
                                "ideatitle": $scope.idea.title,
                                "visibleglobally":false,
                                "originalideaid": 0,
                                "startupsize": "string",
                                "recordtype":"idea"
                                });
       $location.path("/allideas");
    };
 // console.log($scope.Ideastartuplist);
   
  });
  

  
  
  