angular.module('lejour.home', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/home'
      })

      .when('/home', {
        templateUrl: '/app/components/home/homeComponent.html',
        controller: 'homeController',
        resolve: {
          "currentAuth": function (Auth) {
            return Auth.$requireSignInWithRole();
          }
        }
      })
  })
  .controller('homeController', function ($rootScope, $scope, currentAuth, Firestore, $mdToast) {
    $rootScope.title = "Home";

    $scope.role = currentAuth.role;

    $scope.toggle = {};

    if ($scope.role === "apprentice") {
      $scope.journals = [];

      Firestore.$getJournalsWithEmail(currentAuth.email)
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var journalObject = doc.data();
            journalObject.id = doc.id;
            $scope.$apply(function() {
              $scope.journals.push(journalObject);
            });
          });
        })
        .catch(function () {
          $mdToast.showSimple('Konnte nicht Journals aus der Datenbank holen. Versuchen Sie es später noch einmal');
        });
    }

    if ($scope.role === "mentor") {
      $scope.journalsPerApprentices = null;

      Firestore.$getJournalsOfConfirmedApprenticesFromMentorWithEmail(currentAuth.email)
        .then(function (journalsPerApprentices) {
          $scope.journalsPerApprentices = journalsPerApprentices;
        })
        .catch(function () {
          $mdToast.showSimple('Konnte nicht Journals aus der Datenbank holen. Versuchen Sie es später noch einmal');
        });
    }
  });