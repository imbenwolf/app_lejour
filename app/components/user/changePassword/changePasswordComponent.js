angular.module('lejour.user.changePassword', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/change-password', {
        templateUrl: 'app/components/user/changePassword/changePasswordComponent.html',
        controller: 'changePasswordController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignIn();
          }
        }
      })
  })
  .controller('changePasswordController', function ($rootScope, $scope, $location, $mdToast, currentAuth, Auth) {
    $rootScope.title = "Passwort Ändern";

    $scope.changePassword = function () {
      if ($scope.changePasswordForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Auth.$signInWithEmailAndPassword(currentAuth.email, $scope.oldPassword).then(function () {
          Auth.$updatePassword($scope.newPassword).then(function () {
            $mdToast.showSimple('Passwort ändern erfolgreich!');
          });
        }).catch(function (error) {
          var message;
          switch (error.code) {
            case "auth/wrong-password":
            default:
              message = "Passwort ändern fehlgeschlagen!"
          }
          $mdToast.showSimple("ok");
        });
      }
    };
  });