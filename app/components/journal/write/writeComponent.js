angular.module('lejour.journal.write', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/write', {
        templateUrl: '/app/components/journal/editJournalComponent.html',
        controller: 'writeController',
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
  .controller('writeController', function ($rootScope, $scope, $location, $mdToast, currentAuth, Auth, Firestore) {
    $rootScope.title = "Journal schreiben";

    $scope.save = function () {
      if ($scope.editJournalForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Firestore.$createJournal($scope.journal.title, $scope.journal.date, $scope.journal.text, currentAuth.email).then(function () {
          $location.path("/");
          $mdToast.showSimple('Journal schreiben erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Passwort ändern fehlgeschlagen!');
        });
      }
    };
  });