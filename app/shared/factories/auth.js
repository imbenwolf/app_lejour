angular.module('lejour.firebase.auth', [
  'lejour.firebase.config'
])

  .factory('Auth', function ($q, $firebaseAuth, Firestore) {
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

    Auth.$requireSignInWithRole = function() {
      var defer = $q.defer();
      Auth.$requireSignIn().then(function (user) {
        console.log(user.email);
        Firestore.$getUserWithEmail(user.email).then(function(doc) {
          user.role = doc.role;
          defer.resolve(user);
        });
      });
      return defer.promise;
    };

    return Auth;
  });