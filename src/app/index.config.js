(function() {
  'use strict';

  angular
    .module('web')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, RestangularProvider,
      apiUrl, showErrorsConfigProvider, $httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    RestangularProvider.setBaseUrl(apiUrl);
      RestangularProvider.setFullResponse(true);
      // RestangularProvider.setRestangularFields({
      //   id: "_id"
      // });

      showErrorsConfigProvider.showSuccess(true);
      showErrorsConfigProvider.trigger('blur keypress');

    $httpProvider.interceptors.push('authInterceptor');
  }

})();
