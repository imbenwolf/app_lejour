angular.module('lejour.user.login', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/login', {
        templateUrl: 'app/components/user/login/loginComponent.html',
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
        Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function() {
          $location.path("/");
          $mdToast.showSimple('Login erfolgreich!');
        }).catch(function (error) {
          var message;
          switch (error.code) {
            case "auth/invalid-email":
              message = "Diese Email ist nicht valid!";
              break;
            case "auth/user-disabled":
              message = "Dieses Account ist gesperrt worden!";
              break;
            case "auth/user-not-found":
            case "auth/wrong-password":
            default:
              message = "Login fehlgeschlagen!"
          }
          $mdToast.showSimple(message);
        });
      }
    }
  });