angular.module('lejour.404', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/404', {
        templateUrl: '/app/components/404/404Component.html',
        controller: '404Controller'
      })

      .otherwise({redirectTo: '/404'});
  })

  .controller('404Controller', function ($rootScope) {
    $rootScope.title = "404";
  });