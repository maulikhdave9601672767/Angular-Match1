(function() {
    'use strict';

    angular
        .module('web')
        .controller('EditForgetPassword', EditForgetPassword);

    EditForgetPassword.$inject = ['Restangular','sweet','$state','_'];

    /* @ngInject */
    function EditForgetPassword(Restangular,sweet,$state,_) {
        var vm = this;
        vm.login=login;
        function login() {
          $state.go('login');
        }
        vm.forgotpassword=forgotpassword
        function forgotpassword(form) {
          _.forEach(form.$error.required, function (element, index) {
              if (!_.isUndefined(element)) {
                  element.$setDirty();
              }
          });
          if (Object.keys(form.$error).length > 0) {
            return;
          }
          Restangular.one('user/forgotpassword',vm.user.username).get().then(function (response) {
            response=Restangular.stripRestangular( response);
            var message="";
            if (response.statusText=='OK') {
              message="Account details sent to your email Id.Please follow the instruction."
            }
            else {
              message=response.data;
            }
              sweet.show({
                title: '',
                text: message,
                confirmButtonColor: '#5cb85c',
                confirmButtonText: 'OK',
                closeOnConfirm: true,
              }, function() {
                if (response.status!==409 && response.status!==500 ) {
                $state.go('login');
                // $window.history.back();
                }
              });
          });
        }
        activate();

        function activate() {

        }
    }
})();
