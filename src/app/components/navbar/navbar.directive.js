(function() {
  'use strict';

  angular
    .module('web')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment,auth,$rootScope) {
      var vm = this;
      vm.user =$rootScope.user;
      console.log('vm.user');
      console.log(vm.user);
//vm.permissions=$rootScope.permissions;
vm.navCollapsed=false;

      vm.logout=function(){
        auth.logout();
      }
      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
