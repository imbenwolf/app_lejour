angular.module('lejour.journal.view', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/journal/view/:journalId', {
        templateUrl: 'app/components/journal/view/viewComponent.html',
        controller: 'viewController',
        resolve: {
          "currentAuth": function (Auth, $route) {
            return Auth.$requireSignInAndAuthorOrFollowingApprenticeOfValidJournalWithId($route.current.params.journalId);
          }
        }
      });
  })
  .controller('viewController', function ($rootScope, $scope, $location, $routeParams, $mdToast, currentAuth, Firestore) {
    $rootScope.title = 'Journal lesen';

    $scope.role = currentAuth.role;

    Firestore.$getJournalDataWithId($routeParams.journalId)
      .then(function (doc) {
        if (doc.exists) {
          var journalObject = doc.data();
          journalObject.id = doc.id;
          $scope.$apply(function () {
            $scope.journal = journalObject;
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
      if ($scope.addCommentForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        var comment = $scope.journal.comment;
        $scope.journal.comment = "";
        Firestore.$addCommentToJournalWithId($routeParams.journalId, currentAuth.email, comment)
          .then(function () {
            $mdToast.showSimple('Kommentieren erfolgreich!');
          }).catch(function () {
          $mdToast.showSimple('Kommentieren fehlgeschlagen!');
        });
      }
    }
  });