angular.module('lejour.home', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/home'
      })

      .when('/home', {
        templateUrl: '/app/components/home/homeComponent.html',
        controller: 'homeController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignInWithRole();
          }
        }
      })
  })
  .controller('homeController', function ($rootScope, $scope, currentAuth, Firestore, $mdToast) {
    $rootScope.title = "Home";

    $scope.journals = [];

    Firestore.$getJournalsWithEmail(currentAuth.email)
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var journalObject = doc.data();
          journalObject.id = doc.id;
          $scope.$apply(function() {
            $scope.journals.push(journalObject);
          });
        });
      })
      .catch(function () {
        $mdToast.showSimple('Konnte nicht Journals aus der Datenbank holen. Versuchen Sie es später noch einmal');
      });

    $scope.editJournal = function (journalId) {
      $location.path("/journal/edit/"+journalId);
    }
  });