(function() {
  'use strict';

  angular
  .module('web')
  .controller('EditChangePassword', EditChangePassword);

  EditChangePassword.$inject = ['Restangular','$state','$stateParams','$rootScope','sweet','auth','$window','_'];

  /* @ngInject */
  function EditChangePassword(Restangular,$state,$stateParams,$rootScope,sweet,auth,$window,_) {
    var vm = this;
    vm.save=save;
    function save(form) {
      _.forEach(form.$error.required, function (element, index) {
        if (!_.isUndefined(element)) {
          element.$setDirty();
        }
      });
      if (Object.keys(form.$error).length > 0) {
        return;
      }
      changePassword();
    }
    function changePassword(){
      var ids=$rootScope.user.UserId;
      if ($stateParams.id!='user') {
        ids=$stateParams.id
      }

      vm.user.userId=ids;
      Restangular.all('account/ChangePassword').post(vm.user).then(function (response) {
        response=Restangular.stripRestangular( response);

        var message="";
        if (response.statusText=='OK') {
          message="Password updated sucessfully."
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
          //  auth.logout();

             $window.history.back();
          }
        });
      });
    }
    activate();

    function activate() {
      vm.user={};

  // if ($state.id=='user') {
  //   vm.
  // }
      ///vm.user.newpassword="";
      //  vm.user=$rootScope.user;
    }
  }
})();
