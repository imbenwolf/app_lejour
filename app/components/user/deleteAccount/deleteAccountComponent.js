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
      if ($scope.deleteAccpuntForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      } else {
        if ($scope.password !== $scope.repeatPassword) {
          $mdToast.showSimple('Passwörter müssen übereinstimmen!');
        } else {
          $scope.email = currentAuth.email;
          Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function () {
            Auth.$deleteUser().then(function () {
              Firestore.$deleteUserWithEmail($scope.email).then(function() {
                $location.path("/");
                $mdToast.showSimple('Account löschen erfolgreich!');
              }).catch(function() {
                Auth.$createUserWithEmailAndPassword($scope.email, $scope.password);
                $mdToast.showSimple('Account löschen fehlgeschlagen!');
              });
            }).catch(function() {
              $mdToast.showSimple('Account löschen fehlgeschlagen!');
            });
          }).catch(function() {
            $mdToast.showSimple('Account löschen fehlgeschlagen!');
          });
        }
      }
    }
  });