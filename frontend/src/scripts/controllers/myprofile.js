'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('myprofileCtrl', function ($rootScope, $scope, Userprofile, $location) {
    

  
       $scope.myFunctionEditProfile = function() {
            console.log("edited profile");
            // Ideastartuplist.prototype$updateAttributes(
            //   { id: selecteddream.id }, 
            //       { 
            //                     "created": date,
            //                     "discussionopen": "true",
            //                     "ideadescription": selecteddream.ideadescription,
            //                     "ideatitle": selecteddream.ideatitle,
            //                     "visibleglobally":selecteddream.visibleglobally
            //       }, function(err, responceSuccess){
            //             console.log('successfully edited'); 
            //              $location.path("/mydreams");
            //       }
            //   );
                  
   
       };



  });
  

  
  
  