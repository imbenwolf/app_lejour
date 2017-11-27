angular.module('lejour.journal.delete', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/delete/:journalId', {
        templateUrl: '/app/components/journal/delete/deleteComponent.html',
        controller: 'deleteController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignIn();
          }
        }
      });
  })
  .controller('deleteController', function ($rootScope, $scope, $location, $routeParams, $mdToast, Auth, Firestore) {
    $rootScope.title = 'Journal löschen';

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

    $scope.delete = function () {
      Firestore.$deleteJournalWithId($routeParams.journalId).then(function() {
        $location.path("/");
        $mdToast.showSimple('Journal "' + $scope.journal.title + '" löschen erfolgreich!');
      }).catch(function() {
        Auth.$createUserWithEmailAndPassword($scope.email, $scope.password);
        $mdToast.showSimple('Journal "' + $scope.journal.title + '" löschen fehlgeschlagen!');
      });
    }
  });