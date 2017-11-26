(function() {
    'use strict';

    angular
        .module('web')
        .service('_', _);

    _.$inject = ['$window'];

    /* @ngInject */
    function _($window) {
      return $window._;
    }
})();
