angular.module('lejour.firebase.firestore', [
  'lejour.firebase.config',
  'firebase'
])

  .factory('Firestore', function () {
    var firestore = firebase.firestore();

    firestore.$getUserDatabase = function () {
      return firestore.collection('users');
    };

    firestore.$createUserWithEmailAndRole = function(email, role) {
      return firestore.$getUserDatabase().add({
        email: email,
        role: role
      })
    };

    firestore.$getUserWithId = function (id) {
      return firestore.$getUserDatabase().doc(id);
    };

    firestore.$deleteUserWithEmail = function (email) {
      return firestore.$getUserDatabase().where("email", "==", email).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          firestore.$getUserWithId(doc.id).delete();
        });
      });
    };

    return firestore;
  });