angular.module('lejour.user.login', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/login', {
        templateUrl: '/app/components/user/login/loginComponent.html',
        controller: 'loginController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignOut();
          }
        }
      })
  })
  .controller('loginController', function ($rootScope, $scope, $location, $mdToast, Auth) {
    $rootScope.title = "Login";

    $scope.login = function () {
      if ($scope.loginForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      }
      else {
        Auth.$signInWithEmailAndPassword(email, password).then(function() {
          $location.path("/");
          $mdToast.showSimple('Login erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Login fehlgeschlagen!');
        });
      }
    }
  });