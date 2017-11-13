angular.module('lejour.journal.edit', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/edit/:journalId', {
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
  .controller('editController', function ($rootScope, $scope, $routeParams, $location, $mdToast, currentAuth, Firestore) {
    $rootScope.title = "Journal bearbeiten";

    Firestore.$getJournalWithId($routeParams.journalId).get()
      .then(function (doc) {
        if (doc.exists) {
          $scope.$apply(function () {
            $scope.journal = doc.data();
          });
        } else {
          $rootScope.navigateTo("/");
          $mdToast.showSimple('Es gibt kein Journal mit der ID: ' + $routeParams.journalId);
        }
      }).catch(function () {
      $rootScope.navigateTo("/");
      $mdToast.showSimple('Das Journal konnte nicht aus der Datenbank gelesen werden!');
    });

    $scope.save = function () {
      if ($scope.editJournalForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Firestore.$updateJournalWithId($routeParams.journalId, $scope.journal.title, $scope.journal.date, $scope.journal.text, currentAuth.email).then(function () {
          $location.path("/");
          $mdToast.showSimple('Journal speichern erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Journal speichern fehlgeschlagen!');
        });
      }
    };
  });