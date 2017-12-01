angular.module('lejour.error.404', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/error/404', {
        templateUrl: 'app/components/error/404/404Component.html',
        controller: '404Controller'
      })

      .otherwise({redirectTo: '/error/404'});
  })

  .controller('404Controller', function ($rootScope) {
    $rootScope.title = "404";
  });