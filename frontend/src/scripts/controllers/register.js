'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */

angular.module('clientside4startupApp').controller('registerCtrl', function ($rootScope, $scope, Userprofile, $location) {

    $scope.myFunctionNewUser = function() {

        var image = upload();

      //register new user
          Userprofile.create({
              email: $scope.newuser.email,
              password: $scope.newuser.password,
              username: $scope.newuser.username,
              location: $scope.newuser.location,
              image: image
          }, function(err, userInstance) {
            console.log(userInstance);
            console.log("Error status:" + err);
            // this is on success of registration
             $scope.credentials = {
              email: $scope.newuser.email,
              password: $scope.newuser.password
             };

                        //login newly created user

                       $rootScope.loginResult = Userprofile.login($scope.credentials,
                          function() {
                            // success
                              console.log ('Congratulations: ' + $rootScope.loginResult.id);
                              $location.path("/");
                          }, function(res) {
                            // error
                            console.log ('Login Failed: ' + $rootScope.loginResult.id);
                          }
                     );
          });






    };
 // console.log($scope.Ideastartuplist);

  });




