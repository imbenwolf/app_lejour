angular.module('lejour', [
  'lejour.config',
  'lejour.firebase.auth',
  'lejour.toolbar',
  'lejour.home',
  'lejour.404',
  'lejour.user.changePassword',
  'lejour.user.login',
  'lejour.user.logout',
  'lejour.user.register',
  'lejour.user.delete'
])
  .run(function ($rootScope, $location, Auth) {
    $rootScope.title = '';

    Auth.$onAuthStateChanged(function (user) {
      $rootScope.isLoggedIn = !!user;
    });

    $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/user/login");
      }
      else if (error === "AUTH_FORBIDDEN") {
        $location.path("/");
      }
    });
  });