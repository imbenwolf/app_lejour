angular.module('lejour.journal.write', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/write', {
        templateUrl: 'app/components/journal/editJournalComponent.html',
        controller: 'writeController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignInAndApprentice();
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
          $mdToast.showSimple('Journal speichern erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Journal speichern fehlgeschlagen!');
        });
      }
    };
  });