'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */

angular.module('clientside4startupApp')
  .controller('allideasCtrl', function ($scope, $rootScope, Ideastartuplist, Userprofile, $location) {
      //$scope.allideas = Ideastartuplist.query();
      $scope.globalideas = Ideastartuplist.find({
        filter: {
            limit: 1000,  
            where: {recordtype: "idea", visibleglobally:true},
            order: 'id DESC' ,
            include: "userprofile"
        }
      });

          //прогнатся по глобалАйдеас и подцепить Юзернеймы
      
      
       //open comments
      $rootScope.selected_idea_id = 0;
      $scope.comments = function(selected_id ) {
        
         $rootScope.selected_idea_id  =selected_id;
          
        
     //$rootScope.selected_idea_id = [selected_id];
     //   $rootScope.selected_idea_id.push({selected_id});
        //$rootScope.selected_idea_id = selected_id;
        //console.log(selected_id);
        //selected_idea_id = selected_id;
        console.log("selected " + $rootScope.selected_idea_id  );
      };
     
      
  });
