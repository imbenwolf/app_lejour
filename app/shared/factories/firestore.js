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

    firestore.$getJournalDatabase = function() {
      return firestore.collection('journals');
    };

    firestore.$createJournal = function(title, date, text, author) {
      return firestore.$getJournalDatabase().add({
        title: title,
        date: date,
        text: text,
        author: author
      })
    };

    firestore.$getJournalsByAuthor = function(author) {
      return firestore.$getJournalDatabase().where("author", "==", author).get();
    };

    return firestore;
  });