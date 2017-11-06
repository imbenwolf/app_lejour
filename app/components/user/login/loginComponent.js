angular.module('lejour.user.login', [])
  .config(function ($routeProvider) {
    $routeProvider
    /**
     * route for the login page
     */
      .when('/user/login', {
        templateUrl: '/app/components/user/login/loginComponent.html',
        controller: 'loginController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignOut();
          }
        }
      })
  })
  /**
   * create the mainController and inject Angular's $scope
   */
  .controller('loginController', function ($rootScope, $scope, $location, $mdToast, Auth) {
    $rootScope.title = "Login";

    /**
     * method for logging in with validation and displaying snackbar
     * @returns {boolean}
     */
    $scope.login = function () {
      var email = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      if (email === "" || password === "") {
        $mdToast.showSimple('Alle Felder müssen ausgefüllt sein!');
        return false;
      }
      else {
        Auth.$signInWithEmailAndPassword(email, password).then(function (user) {
          $rootScope.email = user.email;
          $rootScope.isLoggedIn = true;
          $location.path("/");
          $mdToast.showSimple('Login erfolgreich!');
        }).catch(function () {
          $mdToast.showSimple('Login fehlgeschlagen!');
        });
      }
    }
  });