angular.module('lejour.config', [
  'ngMaterial',
  'ngRoute',
  'ngMessages'
])
  .config(function ($mdThemingProvider) {
    /**
     * theming for website
     */
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo', {
        'default': '500'
      })
      .accentPalette('blue', {
        'default': '600'
      })
      .warnPalette('deep-orange', {
        'default': '500'
      })
      .backgroundPalette('grey', {
        'default': '100'
      });

    $mdThemingProvider.enableBrowserColor();
  });