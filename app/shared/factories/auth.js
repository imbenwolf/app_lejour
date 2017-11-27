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

    Auth.$requireSignInWithRole = function () {
      var defer = $q.defer();
      Auth.$requireSignIn().then(function (user) {
        Firestore.$getUserWithEmail(user.email).then(function (doc) {
          user.role = doc.role;
          defer.resolve(user);
        });
      }).catch(function(error) {
        defer.reject(error);
      });
      return defer.promise;
    };

    Auth.$requireSignInAndAuthorOrFollowingApprenticeOfValidJournalWithId = function (journalId) {
      var defer = $q.defer();
      Auth.$requireSignIn().then(function (user) {
        Firestore.$getUserWithEmail(user.email).then(function (doc) {
          user.role = doc.role;
          Firestore.$getJournalDataWithId(journalId).then(function (doc) {
            if (doc.exists) {
              var author = doc.data().author;
              if (user.role === 'apprentice') {
                if (user.email === author) {
                  defer.resolve(user);
                } else {
                  defer.reject("NOT_AUTHORIZED");
                }
              } else {
                Firestore.$isMentorWithEmailConfirmedByApprenticeWithEmail(author, user.email).then(function (result) {
                  if (result === true) {
                    defer.resolve(user);
                  } else {
                    defer.reject("NOT_AUTHORIZED");
                  }
                });
              }
            } else {
              defer.reject("INVALID_JOURNAL_ID");
            }
          });
        });
      });
      return defer.promise;
    };

    Auth.$requireSignInAndApprenticeAuthorOfValidJournalWithId = function (journalId) {
      var defer = $q.defer();
      Auth.$requireSignIn().then(function (user) {
        Firestore.$getUserWithEmail(user.email).then(function (doc) {
          user.role = doc.role;
          Firestore.$getJournalDataWithId(journalId).then(function (doc) {
            if (doc.exists) {
              var author = doc.data().author;
              if (user.role === 'apprentice') {
                if (user.email === author) {
                  defer.resolve(user);
                } else {
                  console.log(user.email + "!=" + author);
                  defer.reject("NOT_AUTHORIZED");
                }
              } else {
                defer.reject("NOT_AUTHORIZED");
              }
            } else {
              defer.reject("INVALID_JOURNAL_ID");
            }
          });
        });
      });
      return defer.promise;
    };

    Auth.$requireSignInAndApprentice = function() {
      var defer = $q.defer();
      Auth.$requireSignInWithRole().then(function (user) {
        if (user.role === 'apprentice') {
          defer.resolve(user);
        } else {
          defer.reject("NOT_AUTHORIZED");
        }
      });
      return defer.promise;
    };

    return Auth;
  });