'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp')
  .controller('mydreamsCtrl', function ($rootScope, $scope, Ideastartuplist, $location) {
      //console.log($rootScope.loginResult.userId);
      $rootScope.selected_idea = {};
      $scope.allmydreams = Ideastartuplist.find({
        filter: { 
          limit: 1000,   
          where: { createdbyid:  parseInt($rootScope.loginResult.userId), recordtype:"dream" }, 
          order: 'id DESC' }
      });
     
     

    
  });
