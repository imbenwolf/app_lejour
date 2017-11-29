angular.module('lejour.toolbar', [])
  .run(function ($rootScope, $mdMenu, $location) {
    $rootScope.$on("$routeChangeStart", function () {
      $mdMenu.hide();
      $rootScope.onWhichPage();
    });

    $rootScope.isOnPage = {
      home: false,
      changePassword: false,
      deleteAccount: false
    };

    $rootScope.resetPages = function () {
      angular.forEach($rootScope.isOnPage, function (value, key) {
        $rootScope.isOnPage[key] = false;
      });
    };

    $rootScope.onWhichPage = function () {
      $rootScope.resetPages();
      switch ($location.path()) {
        case "/home":
          $rootScope.isOnPage.home = true;
          break;
        case "/user/follow":
          $rootScope.isOnPage.follow = true;
          break;
        case "/user/change-password":
          $rootScope.isOnPage.changePassword = true;
          break;
        case "/user/delete":
          $rootScope.isOnPage.deleteAccount = true;
          break;
      }
    };
  })
  .component('toolbar', {
    templateUrl: '/app/shared/toolbar/toolbarComponent.html',
    controller: function () {}
  });