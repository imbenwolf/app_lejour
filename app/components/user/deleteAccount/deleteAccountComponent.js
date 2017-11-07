angular.module('lejour.user.delete', [])
  .config(function ($routeProvider) {
    $routeProvider
    /**
     * route for the logout
     */
      .when('/user/delete', {
        templateUrl: '/app/components/user/deleteAccount/deleteAccountComponent.html',
        controller: 'deleteController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }
        }
      });
  })
  /**
   * create the mainController and inject Angular's $scope
   */
  .controller('deleteController', function ($rootScope, $scope, $location, $mdToast, currentAuth, Auth) {
    $rootScope.title = "Account löschen";

    /**
     * method for logging out and displaying snackbar
     */
    $scope.delete = function () {
      if ($scope.deleteAccpuntForm.$invalid) {
        $mdToast.showSimple('Alle Felder müssen korrekt ausgefüllt sein!');
      } else {
        if ($scope.password !== $scope.repeatPassword) {
          $mdToast.showSimple('Passwörter müssen übereinstimmen!');
        } else {
          Auth.$signInWithEmailAndPassword(currentAuth.email, $scope.password).then(function () {
            Auth.$deleteUser().then(function () {
              $location.path("/");
              $mdToast.showSimple('Account löschen erfolgreich!');
            }).catch(function (error) {
              console.log(error);
              $mdToast.showSimple('Account löschen fehlgeschlagen!');
            });
          }).catch(function (error) {
            console.log(error);
            $mdToast.showSimple('Account löschen fehlgeschlagen!');
          });
        }
      }
    }
  });