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
      var email = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      if (email === "" || password === "") {
        $mdToast.showSimple('Alle Felder müssen ausgefüllt sein!');
        return false;
      }
      else {
        Auth.$signInWithEmailAndPassword(email, password).then(function (user) {
          $location.path("/");
          $mdToast.showSimple('Login erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Login fehlgeschlagen!');
        });
      }
    }
  });