'use strict';

/**
 * @ngdoc function
 * @name clientside4startupApp.controller:alluserprofilesCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientside4startupApp
 */
angular.module('clientside4startupApp')
  .controller('ideacommentsCtrl', function ($rootScope, $scope, Comments, Userprofile, $location) {

      console.log("Filter will be:" + $rootScope.selected_idea.id);
      
      // $scope.ideacommentsreceived = Comments.find({
      //   filter: { limit: 20,   where: { ideaid:  $rootScope.selected_idea_id }, order: 'id DESC' },
      //     include: {
      //       relation: 'Userprofile', // include the owner object
      //       scope: { // further filter the owner object
      //         fields: ['username', 'location'], // only show two fields
      //       }
      //     }
      // });
     
  //  $scope.ideacommentsreceived = Userprofile.Comments();

  $scope.ideacommentsreceived = Comments.find({
    filter: { 
      include: "userprofile",
      limit: 5,   
      where: { ideaid:  $rootScope.selected_idea.id }, 
      order: 'id DESC'     
    },
  }, function() {  });  
     
 

  $scope.submitCommentFunction = function() {
 //this code to make data in standard format
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
        
$scope.newidearesponce = Comments.create({
              userprofileId: $scope.loginResult.userId, 
              commenttext: $scope.newcomment.commenttext, 
              ideaid: $rootScope.selected_idea.id,
              commentdatetime: date,
              feedbackrank: 0
          }, function(err, commentInstance) {
            console.log(commentInstance);
            // this is on success of registration
            //refresh list
            $scope.newcomment = {};
            $scope.loadMore();
          });
          
 
 console.log($scope.newcomment.commenttext);

    };  
    

//this section for infinite loading data

$scope.loadMore = function(){
  console.log("need to load more items");
  console.log("lets load 5 more");
  
  var last = $scope.ideacommentsreceived.length;
  console.log("there are currently loaded " + last);
    //add result of one more query
    var newrecords = Comments.find({
    filter: { 
      include: "userprofile",
      limit: last + 5,     
      where: { ideaid:  $rootScope.selected_idea.id }, 
      order: 'id DESC'
    },
    }, function() { 
      $scope.ideacommentsreceived = newrecords ; 
      });  

      
 
        
        
    
  
  
};






       //open comments
      $scope.comments = function(selected_idea, rectype) {
         $rootScope.selected_idea = null;        
         $rootScope.selected_idea  =selected_idea;
         $rootScope.selected_idea_type = rectype;
          
        
     //$rootScope.selected_idea_id = [selected_id];
     //   $rootScope.selected_idea_id.push({selected_id});
        //$rootScope.selected_idea_id = selected_id;
        //console.log(selected_id);
        //selected_idea_id = selected_id;
        console.log("selected " + $rootScope.selected_idea.id  );
        $location.path("/ideacomments");
      };

    
  });
