angular.module('lejour.toolbar', [])
  .run(function ($rootScope, $mdMenu, $location) {
    $rootScope.$on("$routeChangeStart", function () {
      $mdMenu.hide();
      $rootScope.onWhichPage();
    });

    $rootScope.isOnPage = {
      home: false,
      changePassword: false
    };

    $rootScope.resetPages = function () {
      angular.forEach($rootScope.isOnPage, function (value, key) {
        $rootScope.isOnPage[key] = false;
      });
    };

    /**
     * method for figuring out on which page you are (for disabled menu options)
     */
    $rootScope.onWhichPage = function () {
      $rootScope.resetPages();
      switch ($location.path()) {
        case "/":
        case "/home":
          $rootScope.isOnPage.home = true;
          break;
        case "/user/change-password":
          $rootScope.isOnPage.changePassword = true;
          break;
      }
    };
  })
  .component('toolbar', {
    templateUrl: '/app/shared/toolbar/toolbarComponent.html',
    controller: function () {
    }
  });