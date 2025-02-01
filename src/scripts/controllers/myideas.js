'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp')
  .controller('myideasCtrl', function ($rootScope, $scope, Ideastartuplist, $location) {
      //$scope.allideas = Ideastartuplist.query();
      console.log($rootScope.loginResult.userId);
      $scope.allmyideas = Ideastartuplist.find({
        filter: { limit: 20,   where: { createdbyid:  parseInt($rootScope.loginResult.userId) } , order: 'id DESC' }
      });
     
    
  });
