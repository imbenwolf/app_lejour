angular.module('lejour.firebase.config', [
  'lejour.environment.dev',
  'firebase'
])
  .config(function (firebaseEnvironment) {
    var config = {
      apiKey: firebaseEnvironment['apiKey'],
      authDomain: firebaseEnvironment['authDomain'],
      databaseURL: firebaseEnvironment['databaseURL'],
      projectId: firebaseEnvironment['projectId'],
      storageBucket: firebaseEnvironment['storageBucket'],
      messagingSenderId: firebaseEnvironment['messagingSenderId']
    };
    firebase.initializeApp(config);
  });
