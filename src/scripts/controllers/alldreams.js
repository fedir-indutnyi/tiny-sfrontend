'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */

angular.module('clientside4startupApp')
  .controller('alldreamsCtrl', function ($scope, $rootScope, Ideastartuplist, Userprofile, $location) {
      $rootScope.selected_idea = {};
      $scope.globaldreams = Ideastartuplist.find({
        filter: { 
            limit: 1000,  
            where: {recordtype: "dream", visibleglobally:true},
            order: 'id DESC' ,
            include: "userprofile"
        }
      });
      
      //прогнатся по глобалАйдеас и подцепить Юзернеймы
      
      
     
      
  });
