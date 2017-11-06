angular.module('lejour.404', [])
  .config(function ($routeProvider) {
    $routeProvider
    /**
     * route for 404 page
     */
      .when('/404', {
        templateUrl: '/app/components/404/404Component.html',
        controller: '404Controller'
      })

      /**
       * route if none of the above
       */
      .otherwise({redirectTo: '/404'});
  })
  /**
   * create the mainController and inject Angular's $scope
   */
  .controller('404Controller', function ($rootScope) {
    $rootScope.title = "404";
  });