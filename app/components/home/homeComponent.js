angular.module('lejour.home', [])
  .config(function ($routeProvider) {
    $routeProvider
    /**
     * route for default page
     */
      .when('/', {
        redirectTo: '/home'
      })

      /**
       * route for the home page
       */
      .when('/home', {
        templateUrl: '/app/components/home/homeComponent.html',
        controller: 'homeController',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": function (Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }
        }
      })
  })
  /**
   * create the mainController and inject Angular's $scope
   */
  .controller('homeController', function ($rootScope) {
    $rootScope.title = "Home";
  });