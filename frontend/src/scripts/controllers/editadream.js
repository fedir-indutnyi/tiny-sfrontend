'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('editadreamCtrl', function ($rootScope, $scope, Ideastartuplist, $location) {
    

      $scope.editidea = function(modelselected, typeselected) {
        //this code to make data in standard format
         $location.path("/editadream");
         console.log("selected " +  modelselected.ideatitle);
         $rootScope.selected_idea = modelselected;
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
        
    };

  
  
       $scope.myFunctionEditDream = function(selecteddream) {
            var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
            Ideastartuplist.prototype$updateAttributes(
               { id: selecteddream.id }, 
                   { 
                                "created": date,
                                "discussionopen": "true",
                                "ideadescription": selecteddream.ideadescription,
                                "ideatitle": selecteddream.ideatitle,
                                "visibleglobally":selecteddream.visibleglobally
                   }, function(err, responceSuccess){
                        console.log('successfully edited'); 
                         $location.path("/mydreams");
                   }
               );
                  
   
       };
   
 // console.log($scope.Ideastartuplist);
    
  });
  

  
  
  