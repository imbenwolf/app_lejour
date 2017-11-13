angular.module('lejour.journal.edit', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/edit', {
        templateUrl: '/app/components/journal/editJournalComponent.html',
        controller: 'editController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }
        }
      })
  })
  .controller('editController', function ($rootScope, $scope, $location, $mdToast, currentAuth, Auth) {
    $rootScope.title = "Journal bearbeiten";


  });