(function () {
  'use strict';

  angular
    .module('web')
    .controller('LoginController', loginController);

  loginController.$inject = ['auth', '$state', '$stateParams', '$rootScope'];

  /* @ngInject */
  function loginController(auth, $state, $stateParams, $rootScope) {
    var vm = this;

    vm.login = function (form) {

      if (Object.keys(form.$error).length > 0 && form.$error.hasOwnProperty('required')) {
        _.forEach(form.$error.required, function (element, index) {
          element.$setDirty();
        });
        return;
      }
      auth
        .login(vm.user, vm.where, vm.rememberMe);
    }

    vm.onCLickForgotpassword = function () {
      $state.go('forgotpassword');
    }
    activate();

    function activate() {
      vm.user = {
        username: '',
        password: ''
      };
      vm.rememberMe = false;
      vm.where = {
        url: $stateParams.url,
        params: $stateParams.params
      }
    }
    activate();
    function activate() {
      if (angular.isDefined($rootScope.user) && angular.isDefined($rootScope.user.id)) {
        $state.go('secure.transaction.list');
      }

    }
  }
})();
