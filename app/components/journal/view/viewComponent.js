angular.module('lejour.journal.view', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/view/:journalId', {
        templateUrl: '/app/components/journal/view/viewComponent.html',
        controller: 'viewController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }
        }
      });
  })
  .controller('viewController', function ($rootScope, $scope, $location, $routeParams, $mdToast, currentAuth, Firestore) {
    $rootScope.title = 'Journal lesen';

    Firestore.$getJournalDataWithId($routeParams.journalId)
      .then(function (doc) {
        if (doc.exists) {
          var journalObject = doc.data();
          journalObject.id = doc.id;
          $scope.$apply(function () {
            $scope.journal = journalObject;
            console.log($scope.journal);
          });
        } else {
          $rootScope.navigateTo("/");
          $mdToast.showSimple('Es gibt kein Journal mit der ID: ' + $routeParams.journalId);
        }
      }).catch(function () {
      $rootScope.navigateTo("/");
      $mdToast.showSimple('Das Journal konnte nicht aus der Datenbank gelesen werden!');
    });

    Firestore.$getCommentDatabaseFromJournalWithId($routeParams.journalId)
      .onSnapshot(function (querySnapshot) {
        $scope.comments = [];
        querySnapshot.forEach(function (doc) {
          $scope.$apply(function () {
            $scope.comments.push(doc.data());
          });
        });
      });

    $scope.comment = function () {
      console.log($scope.journal.comment);
      if ($scope.addCommentForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Firestore.$addCommentToJournalWithId($routeParams.journalId, currentAuth.email, $scope.journal.comment)
          .then(function () {
            $mdToast.showSimple('Kommentieren erfolgreich!');
          }).catch(function () {
          $mdToast.showSimple('Kommentieren fehlgeschlagen!');
        });
      }
    }
  });