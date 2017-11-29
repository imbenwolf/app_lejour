angular.module('lejour.firebase.firestore', [
  'lejour.firebase.config',
  'firebase'
])

  .factory('Firestore', function ($q) {
    var firestore = firebase.firestore();

    firestore.$getUserDatabase = function () {
      return firestore.collection('users');
    };

    firestore.$createUserWithEmailAndRole = function (email, role) {
      return firestore.$getUserDatabase().add({
        email: email,
        role: role
      })
    };

    firestore.$getUserWithId = function (id) {
      return firestore.$getUserDatabase().doc(id);
    };

    firestore.$getUserWithEmail = function (email) {
      var defer = $q.defer();
      firestore.$getUserDatabase().where("email", "==", email).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          firestore.$getUserWithId(doc.id).get().then(function (doc) {
            defer.resolve(doc.data());
          });
        });
      });
      return defer.promise;
    };

    firestore.$deleteUserWithEmail = function (email) {
      return firestore.$getUserDatabase().where("email", "==", email).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          firestore.$getUserWithId(doc.id).delete();
        });
      });
    };

    firestore.$getApprentices = function () {
      return firestore.$getUserDatabase().where("role", "==", "apprentice").get();
    };

    firestore.$getApprenticesWithEmail = function (email) {
      var emailFrontCode = email.slice(0, email.length - 1);
      var emailEndCode = email.slice(email.length - 1, email.length);

      var startCode = email;
      var endCode = emailFrontCode + String.fromCharCode(emailEndCode.charCodeAt(0) + 1);

      return firestore.$getUserDatabase().where("role", "==", "apprentice")
        .where("email", ">=", startCode)
        .where("email", "<", endCode)
        .get();
    };

    firestore.$getFirst50Apprentices = function () {
      return firestore.$getUserDatabase().where("role", "==", "apprentice")
        .limit(50)
        .get();
    };

    firestore.$getFollowStatusOfMentorsWithEmailFromApprenticeWithEmail = function (mentorEmail, apprenticeEmail) {
      var defer = $q.defer();
      firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var mentorObject = doc.data();
          var result = {};
          if (typeof mentorObject.apprentices === 'undefined' || typeof mentorObject.apprentices[apprenticeEmail] === 'undefined') {
            result.status = "unrequested";
          } else {
            if (mentorObject.apprentices[apprenticeEmail]) {
              result.status = "confirmed";
            } else {
              result.status = "unconfirmed";
            }
          }
          defer.resolve(result);
        });
      });
      return defer.promise;
    };

    firestore.$followApprenticeWithEmailFromMentorWithEmail = function (mentorEmail, apprenticeEmail) {
      return firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var updateUpprentices = {};
          updateUpprentices["apprentices." + apprenticeEmail.replace(/\./g, "###")] = false;
          return firestore.$getUserWithId(doc.id).update(updateUpprentices);
        });
      });
    };

    firestore.$getConfirmedApprenticesFromMentorWithEmail = function (mentorEmail) {
      var defer = $q.defer();
      var confirmedApprentices = [];
      firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var apprentices = doc.data().apprentices;
          angular.forEach(apprentices, function (confirmed, apprenticeEmail) {
            if (confirmed) {
              firestore.$getUserWithEmail(apprenticeEmail.replace(/###/g, ".")).then(function (confirmedApprentice) {
                confirmedApprentices.push(confirmedApprentice);
              });
            }
          });
          defer.resolve(confirmedApprentices);
        });
      });
      return defer.promise;
    };

    firestore.$getUnconfirmedApprenticesFromMentorWithEmail = function (mentorEmail) {
      var defer = $q.defer();
      var unconfirmedApprentices = [];
      firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var apprentices = doc.data().apprentices;
          angular.forEach(apprentices, function (confirmed, apprenticeEmail) {
            if (!confirmed) {
              firestore.$getUserWithEmail(apprenticeEmail.replace(/###/g, ".")).then(function (unconfirmedApprentice) {
                unconfirmedApprentices.push(unconfirmedApprentice);
              });
            }
          });
          defer.resolve(unconfirmedApprentices);
        });
      });
      return defer.promise;
    };

    firestore.$getJournalsOfConfirmedApprenticesFromMentorWithEmail = function (mentorEmail) {
      var defer = $q.defer();
      var journals = {};
      firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var apprentices = doc.data().apprentices;
          angular.forEach(apprentices, function (confirmed, apprenticeEmail) {
            apprenticeEmail = apprenticeEmail.replace(/###/g, ".");
            if (confirmed) {
              journals[apprenticeEmail] = [];
              firestore.$getJournalsWithEmail(apprenticeEmail).then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  var journalObject = doc.data();
                  journalObject.id = doc.id;
                  journals[apprenticeEmail].push(journalObject);
                });
                defer.resolve(journals);
              });
            }
          });
        });
      });
      return defer.promise;
    };

    firestore.$getUnconfirmedMentorsFromApprenticeWithEmail = function (apprenticeEmail) {
      return firestore.$getUserDatabase().where("apprentices." + apprenticeEmail.replace(/\./g, "###"), "==", false).get();
    };

    firestore.$getConfirmedMentorsFromApprenticeWithEmail = function (apprenticeEmail) {
      return firestore.$getUserDatabase().where("apprentices." + apprenticeEmail.replace(/\./g, "###"), "==", true).get();
    };

    firestore.$isMentorWithEmailConfirmedByApprenticeWithEmail = function (apprenticeEmail, mentorEmail) {
      var defer = $q.defer();
      var result = {};
      firestore.$getUserDatabase().where("email", "==", mentorEmail)
        .where("apprentices." + apprenticeEmail.replace(/\./g, "###"), "==", true).get().then(function (querySnapshot) {
        result = !querySnapshot.empty;
        defer.resolve(result);
      });
      return defer.promise;
    };

    firestore.$acceptMentorWithEmailFromApprenticeWithEmail = function (mentorEmail, apprenticeEmail) {
      return firestore.$getUserDatabase().where("email", "==", mentorEmail).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var updateUpprentices = {};
          updateUpprentices["apprentices." + apprenticeEmail.replace(/\./g, "###")] = true;
          return firestore.$getUserWithId(doc.id).update(updateUpprentices);
        });
      });
    };

    firestore.$getJournalDatabase = function () {
      return firestore.collection('journals');
    };

    firestore.$createJournal = function (title, date, text, author) {
      return firestore.$getJournalDatabase().add({
        title: title,
        date: date,
        text: text,
        author: author
      })
    };

    firestore.$getJournalWithId = function (id) {
      return firestore.$getJournalDatabase().doc(id);
    };

    firestore.$getJournalDataWithId = function (id) {
      return firestore.$getJournalWithId(id).get();
    };

    firestore.$getJournalsWithEmail = function (email) {
      return firestore.$getJournalDatabase().where("author", "==", email).get();
    };

    firestore.$updateJournalWithId = function (id, title, date, text, author) {
      return firestore.$getJournalWithId(id).set({
        title: title,
        date: date,
        text: text,
        author: author
      })
    };

    firestore.$deleteJournalWithId = function (id) {
      return firestore.$getJournalWithId(id).delete();
    };

    firestore.$getCommentDatabaseFromJournalWithId = function (id) {
      return firestore.$getJournalWithId(id).collection('comments');
    };

    firestore.$addCommentToJournalWithId = function (id, author, text) {
      return firestore.$getCommentDatabaseFromJournalWithId(id).add({
        author: author,
        text: text,
        date: new Date(Date.now())
      })
    };

    firestore.$getCommentsFromJournalWithId = function (id) {
      return firestore.$getCommentDatabaseFromJournalWithId(id).get();
    };

    return firestore;
  });