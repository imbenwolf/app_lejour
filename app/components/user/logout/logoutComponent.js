angular.module('lejour.user.logout', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/logout', {
        templateUrl: 'app/components/user/logout/logoutComponent.html',
        controller: 'logoutController',
        resolve: {
          "currentAuth": function (Auth) {
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