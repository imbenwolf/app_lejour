angular.module('lejour.user.delete', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/delete', {
        templateUrl: '/app/components/user/deleteAccount/deleteAccountComponent.html',
        controller: 'deleteAccountController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignIn();
          }
        }
      });
  })
  .controller('deleteAccountController', function ($rootScope, $scope, $location, $mdToast, currentAuth, Auth, Firestore) {
    $rootScope.title = "Account löschen";

    $scope.delete = function () {
      if ($scope.deleteAccountForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      } else {
        Auth.$signInWithEmailAndPassword(currentAuth.email, $scope.password).then(function () {
          Auth.$deleteUser().then(function () {
            Firestore.$deleteUserWithEmail(currentAuth.email).then(function () {
              $location.path("/");
              $mdToast.showSimple('Account löschen erfolgreich!');
            });
          });
        }).catch(function (error) {
          var message;
          switch (error.code) {
            case "auth/wrong-password":
            default:
              message = "Account löschen fehlgeschlagen!"
          }
          $mdToast.showSimple(message);
        });
      }
    }
  });