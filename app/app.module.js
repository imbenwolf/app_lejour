angular.module('lejour', [
  'lejour.config',
  'lejour.firebase.auth',
  'lejour.firebase.firestore',
  'lejour.toolbar',
  'lejour.home',
  'lejour.error.404',
  'lejour.user.changePassword',
  'lejour.user.login',
  'lejour.user.logout',
  'lejour.user.register',
  'lejour.user.delete',
  'lejour.user.follow',
  'lejour.journal.write',
  'lejour.journal.edit',
  'lejour.journal.delete',
  'lejour.journal.view'
])
  .run(function ($rootScope, $location, Auth, $mdToast) {
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
      } else if (error === "NOT_AUTHORIZED") {
        $location.path("/");
        $mdToast.showSimple("Sie sind nicht authorisiert, diese Seite aufzurufen!")
      } else if (error === "INVALID_JOURNAL_ID") {
        $location.path("/");
        $mdToast.showSimple("Dieses Journal existiert nicht!")
      } else {
        $location.path("/user/login");
      }
    });

    $rootScope.navigateTo = function(path) {
      $location.path(path);
    }
  });