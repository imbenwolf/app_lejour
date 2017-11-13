angular.module('lejour.user.register', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/register', {
        templateUrl: '/app/components/user/register/registerComponent.html',
        controller: 'registerController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignOut();
          }
        }
      });
  })
  .controller('registerController', function ($rootScope, $scope, $location, $mdToast, Auth, Firestore) {
    $rootScope.title = 'Registierung';

    $scope.role = 'apprentice';

    $scope.register = function () {
      if ($scope.registerForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        if ($scope.password !== $scope.repeatPassword) {
          $mdToast.showSimple('Passwörter stimmen nicht überein!');
        }
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