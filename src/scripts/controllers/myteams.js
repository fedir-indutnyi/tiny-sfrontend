'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp')
  .controller('myteamsCtrl', function ($rootScope, $scope, Userprofile, $location) {
    //$scope.userprofiles = Userprofile.query();
    
    $scope.userprofiles = Userprofile.find({
        filter: { limit: 100, where: {'isteam' : true, 'teammembers': {like: '%|' + $rootScope.loginResult.userId + 'a|%'} } , order: 'id DESC' }
      });
      console.log('%|' + $rootScope.loginResult.userId + 'a|%');
      
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
