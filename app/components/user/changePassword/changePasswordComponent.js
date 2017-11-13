angular.module('lejour.user.changePassword', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/change-password', {
        templateUrl: '/app/components/user/changePassword/changePasswordComponent.html',
        controller: 'changePasswordController',
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
          }).catch(function () {
            $mdToast.showSimple('Passwort ändern fehlgeschlagen!');
          });
        }).catch(function () {
          $mdToast.showSimple('Passwort ändern fehlgeschlagen!');
        });
      }
    };
  });