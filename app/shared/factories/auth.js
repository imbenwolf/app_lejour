angular.module('lejour.firebase.auth', [
  'lejour.firebase.config'
])

  .factory('Auth', function ($q, $firebaseAuth) {
    var Auth = $firebaseAuth();

    Auth.$requireSignOut = function () {
      var defer = $q.defer();
      Auth.$waitForSignIn().then(function (user) {
        if (user === null) {
          defer.resolve();
        } else {
          defer.reject("AUTH_FORBIDDEN");
        }
      });
      return defer.promise;
    };

    return Auth;
  });