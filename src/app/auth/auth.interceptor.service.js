(function() {
    'use strict';

    angular
        .module('web')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$window', '$localStorage', 'sweet', '$injector'];

    /* @ngInject */
    function authInterceptor($rootScope, $window, $localStorage, sweet, $injector) {
        var service = {
          request: processRequest,
          responseError: processResponseError
        };

        return service;
        function processRequest(config) {
          var token= $rootScope.token;
          if (token) {
            config.headers['Authorization'] =  token;
          }
          return config
        }

        function processResponseError(config) {
            if (config.status === 403 || config.status === 401) {
                if (!_.isUndefined($localStorage.token)) {
                    sweet.show({
                        title: '',
                        text: config.data.message,
                        confirmButtonColor: '#5cb85c',
                        confirmButtonText: 'OK',
                        closeOnConfirm: true
                    }, function () {
                            delete $rootScope.user;
                            $localStorage.$reset();
                            $window.location.href = './';
                    });
                }
                else {
                    $window.location.href = './';
                }
            }
            return config;
          }

    }
})();
