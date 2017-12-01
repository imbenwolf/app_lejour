angular.module('lejour.user.follow', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/follow', {
        templateUrl: 'app/components/user/follow/followComponent.html',
        controller: 'followController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignInWithRole();
          }
        }
      });
  })
  .controller('followController', function ($rootScope, $scope, $location, $routeParams, $mdToast, currentAuth, Firestore, $q) {
    $rootScope.title = 'Abonnements';

    $scope.role = currentAuth.role;

    $scope.confirmedConnectionsText = "";
    $scope.unconfirmedConnectionsText = "";
    $scope.confirmedConnections = [];
    $scope.unconfirmedConnections = [];

    if ($scope.role === "apprentice") {
      $scope.unconfirmedConnectionsText = "Unbestätigte Lehrmeister";
      $scope.confirmedConnectionsText = "Bestätigte Lehrmeister";

      Firestore.$getConfirmedMentorsFromApprenticeWithEmail(currentAuth.email)
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              $scope.$apply(function () {
                $scope.confirmedConnections.push(doc.data());
              });
            });
          }
        })
        .catch(function () {
          $mdToast.showSimple('Konnte nicht Lehrmeister aus der Datenbank holen. Versuchen Sie es später noch einmal');
        });
      Firestore.$getUnconfirmedMentorsFromApprenticeWithEmail(currentAuth.email)
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(function (doc) {
              $scope.$apply(function () {
                $scope.unconfirmedConnections.push(doc.data());
              });
            });
          }
        })
        .catch(function () {
          $mdToast.showSimple('Konnte nicht Lehrmeister aus der Datenbank holen. Versuchen Sie es später noch einmal');
        });

      $scope.accept = function (mentorEmail) {
        Firestore.$acceptMentorWithEmailFromApprenticeWithEmail(mentorEmail, currentAuth.email)
          .then(function () {
            $mdToast.showSimple('Annahme erfolgreich!');
          }).catch(function () {
          $mdToast.showSimple('Annahme fehlgeschlagen!');
        });
      }
    } else {
      $scope.unconfirmedConnectionsText = "Unbestätigte Lehrlinge";
      $scope.confirmedConnectionsText = "Bestätigte Lehrlinge";

      $scope.selectedApprentice = null;

      Firestore.$getConfirmedApprenticesFromMentorWithEmail(currentAuth.email).then(function (confirmedApprentices) {
        $scope.confirmedConnections = confirmedApprentices;
      });

      Firestore.$getUnconfirmedApprenticesFromMentorWithEmail(currentAuth.email).then(function (unconfirmedApprentices) {
        $scope.unconfirmedConnections = unconfirmedApprentices;
      });

      $scope.querySearch = function (query) {
        var deferred = $q.defer();
        var apprentices = [];
        if (query) {
          Firestore.$getApprenticesWithEmail(query).then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              apprentices.push(doc.data());
            });
            deferred.resolve(apprentices);
          });
        } else {
          Firestore.$getFirst50Apprentices().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              apprentices.push(doc.data());
            });
            deferred.resolve(apprentices);
          });
        }
        return deferred.promise;
      };

      $scope.selectedItemChange = function (item) {
        if (typeof item === 'undefined') {
          $scope.selectedApprentice = null;
        } else {
          $scope.selectedApprentice = item;
          Firestore.$getFollowStatusOfMentorsWithEmailFromApprenticeWithEmail(currentAuth.email, $scope.selectedApprentice.email).then(function (result) {
            $scope.selectedApprentice.status = result.status;
          });
        }
      };

      $scope.follow = function () {
        Firestore.$followApprenticeWithEmailFromMentorWithEmail(currentAuth.email, $scope.selectedApprentice.email)
          .then(function () {
            $mdToast.showSimple('Anfrage erfolgreich!');
          })
          .catch(function () {
            $mdToast.showSimple('Anfrage fehlgeschlagen!');
          });
      }
    }
  });