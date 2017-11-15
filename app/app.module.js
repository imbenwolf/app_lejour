angular.module('lejour', [
  'lejour.config',
  'lejour.firebase.auth',
  'lejour.firebase.firestore',
  'lejour.toolbar',
  'lejour.home',
  'lejour.404',
  'lejour.user.changePassword',
  'lejour.user.login',
  'lejour.user.logout',
  'lejour.user.register',
  'lejour.user.delete',
  'lejour.journal.write',
  'lejour.journal.edit',
  'lejour.journal.delete',
  'lejour.journal.view'
])
  .run(function ($rootScope, $location, Auth) {
    $rootScope.title = '';

    Auth.$onAuthStateChanged(function (user) {
      $rootScope.isLoggedIn = !!user;
    });

    $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path("/user/login");
      }
      else if (error === "AUTH_FORBIDDEN") {
        $location.path("/");
      }
    });

    $rootScope.navigateTo = function(path) {
      $location.path(path);
    }
  });