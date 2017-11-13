angular.module('lejour.user.logout', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/logout', {
        templateUrl: '/app/components/user/logout/logoutComponent.html',
        controller: 'logoutController',
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
  .controller('logoutController', function ($rootScope, $location, $mdToast, Auth) {

    Auth.$signOut().then(function () {
      $location.path("/user/login");
      $mdToast.showSimple('Logout erfolgreich!');
    }).catch(function () {
      $mdToast.showSimple('Logout fehlgeschlagen!');
    });
  });