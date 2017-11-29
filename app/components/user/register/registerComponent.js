angular.module('lejour.user.register', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/register', {
        templateUrl: '/app/components/user/register/registerComponent.html',
        controller: 'registerController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignOut();
          }
        }
      });
  })
  .controller('registerController', function ($rootScope, $scope, $location, $mdToast, Auth, Firestore) {
    $rootScope.title = 'Registrierung';

    $scope.role = 'apprentice';

    $scope.register = function () {
      if ($scope.registerForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
          .then(function () {
            Firestore.$createUserWithEmailAndRole($scope.email, $scope.role)
              .then(function() {
                $location.path("/");
                $mdToast.showSimple('Registrierung erfolgreich!');
              })
              .catch(function() {
                Auth.$deleteUser();
                $mdToast.showSimple('Registrierung fehlgeschlagen!');
              });
          }).catch(function () {
          $mdToast.showSimple('Registrierung fehlgeschlagen!');
        });
      }
    };
  });