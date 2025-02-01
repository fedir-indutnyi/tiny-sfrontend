'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp').controller('createateamCtrl', function ($rootScope, $scope, Userprofile, $location) {
    

    
    $scope.myFunctionNewTeam = function() {
        
        //Generate random password
        function makeid()
            {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            
                for( var i=0; i < 9; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
            
                return text;
            }
        console.log("This user will create a team: " +  $rootScope.loginResult.user.id);
        
        
        var newcredentials =
         {
              email: makeid() + "@no.email.com",
              password: makeid(), 
              username: $scope.newteam.username,
              teamownerid: $rootScope.loginResult.user.id,
              isteam: true,
              teammembers: "|" + $rootScope.loginResult.user.id + "a|"
          } ;
        
        console.log ("Credentials:" + newcredentials.toString());
        
       //register new user
          Userprofile.create(newcredentials, function(err, userInstance) {
            console.log("successfully created team:" + $scope.newteam.username);
            // this is on success of registration
            console.log(err);
          });
 
       
       



    };
 // console.log($scope.Ideastartuplist);
   
  });
  

  
  
  