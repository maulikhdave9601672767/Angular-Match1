// (function() {
//   'use strict';
//
//   angular
//     .module('web')
//     .controller('MainController', MainController);
//
//   /** @ngInject */
//   function MainController() {
//     var vm = this;
//
//
//
//     activate();
//
//     function activate() {
//
//     }
//
//   }
// })();

(function() {
    'use strict';

    angular
        .module('web')
        .controller('MainController', MainController);

    MainController.$inject = ['Restangular'];

    /* @ngInject */
    function MainController(Restangular) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
