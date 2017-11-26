(function() {
  'use strict';

  angular
  .module('web')
  .controller('EditUserController', EditUserController);

  EditUserController.$inject = ['Restangular','$stateParams','$state','$rootScope','sweet','$q','_'];

  /* @ngInject */
  function EditUserController(Restangular,$stateParams,$state,$rootScope,sweet,$q,_) {
    var vm = this;
    vm.save=save;

    function getuser(){
      var deferred= $q.defer();
      Restangular.one('account/GetUserById',$stateParams.id)
      .get().then(function (user) {
        var data=Restangular.stripRestangular(user.data);
        deferred.resolve(data.data);
      });
      return deferred.promise;
    }

    function save(form) {
      _.forEach(form.$error.required, function (element, index) {
        if (!_.isUndefined(element)) {
          element.$setDirty();
        }
      });
      if (Object.keys(form.$error).length > 0) {
        return;
      }
        saveUser();
    }

    function saveUser() {
      Restangular.all('account/Register').post(vm.user).then(function(response){
        var message="";
        response=Restangular.stripRestangular( response)
        var message="";
        if (response.data.statusCode==409 || response.data==false) {
          response.status=response.data.statusCode;
             message=response.data.error;
        }
      else if (response.data.statusCode==200) {
          message="User saved sucessfully."
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
              $state.go('secure.user.list');
            }
          });

        }).catch(function (ex) {
          vm.failed=true;
          console.log(ex);
        });
    }

    activate();
    function activate() {
      if ($rootScope.user.Role!='Admin') {
        $state.go('secure.transaction.list');
      }

      vm.user={};
      vm.isedit=false;
        if ($stateParams.id!='new') {
          vm.isedit=true;
          getuser().then(function (user) {
            vm.user=user;
          })
        }

    }
  }
})();
