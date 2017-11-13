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
            return Auth.$requireSignIn();
          }
        }
      })
  })
  .controller('homeController', function ($rootScope, $scope, currentAuth, Firestore, $mdToast) {
    $rootScope.title = "Home";

    $scope.journals = [];

    $scope.test = "test";

    Firestore.$getJournalsByAuthor(currentAuth.email)
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $scope.$apply(function() {
            $scope.journals.push(doc.data());
          });
        });
      })
      .catch(function () {
        $mdToast.showSimple('Konnte nicht alle Journals aus der Datenbank holen. Versuchen Sie es später noch einmal');
      });
  });