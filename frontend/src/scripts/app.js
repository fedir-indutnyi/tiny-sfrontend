'use strict';

import { API_BASE_HREF } from '../app/shared/constants';


/**
 * @ngdoc overview
 * @name clientside4startupApp
 * @description
 * # clientside4startupApp
 *
 * Main module of the application.
 */
angular
  .module('clientside4startupApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'lbServices',
    'infinite-scroll'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
     .when('/myteams', {
        templateUrl: 'views/myteams.html',
        controller: 'myteamsCtrl',
        controllerAs: 'myteams'
      })
      .when('/allideas', {
        templateUrl: 'views/allideas.html',
        controller: 'allideasCtrl',
        controllerAs: 'allideas'
      })
      .when('/alldreams', {
        templateUrl: 'views/alldreams.html',
        controller: 'alldreamsCtrl',
        controllerAs: 'alldreams'
      })
      .when('/myideas', {
        templateUrl: 'views/myideas.html',
        controller: 'myideasCtrl',
        controllerAs: 'myideas'
      })
      .when('/mydreams', {
        templateUrl: 'views/mydreams.html',
        controller: 'mydreamsCtrl',
        controllerAs: 'mydreams'
      })
      .when('/createidea', {
        templateUrl: 'views/createidea.html',
        controller: 'createideaCtrl',
        controllerAs: 'createidea'
      })
      .when('/editadream', {
        templateUrl: 'views/editadream.html',
        controller: 'editadreamCtrl',
        controllerAs: 'editadream'
      })
      .when('/createadream', {
        templateUrl: 'views/createadream.html',
        controller: 'createadreamCtrl',
        controllerAs: 'createadream'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerCtrl',
        controllerAs: 'register',
        css: ['styles/style.css', 'styles/mdb.min.css']
      })
      .when('/createateam', {
        templateUrl: 'views/createateam.html',
        controller: 'createateamCtrl',
        controllerAs: 'createateam'
      })
      .when('/ideacomments', {
        templateUrl: 'views/ideacomments.html',
        controller: 'ideacommentsCtrl',
        controllerAs: 'ideacomments'
      })
      .when('/searchresult', {
        templateUrl: 'views/searchresult.html',
        controller: 'searchresultCtrl',
        controllerAs: 'searchresult'
      })
      .when('/myprofile', {
        templateUrl: 'views/myprofile.html',
        controller: 'myprofileCtrl',
        controllerAs: 'myprofile'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
   .config(function(LoopBackResourceProvider) {

    // Use a custom auth header instead of the default 'Authorization'
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');

    // Change the URL where to access the LoopBack REST API server
    //LoopBackResourceProvider.setUrlBase('https://startupplatform-fedir-betapixel.c9users.io/api');
    LoopBackResourceProvider.setUrlBase(API_BASE_HREF);



  })
  .run(function($rootScope, Userprofile, LoopBackAuth) {

 if (LoopBackAuth.currentUserId && LoopBackAuth.currentUserData) {
    $rootScope.loginResult = {id:LoopBackAuth.currentUserId, user: {}};
    $rootScope.loginResult.user = Userprofile.findById({
        id: LoopBackAuth.currentUserId
      });

}


});
