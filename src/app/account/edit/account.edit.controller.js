(function() {
    'use strict';

    angular
        .module('web')
        .controller('EditAccountController', EditAccountController);

    EditAccountController.$inject = ['Restangular','$stateParams','$state','sweet','_'];

    /* @ngInject */
    function EditAccountController(Restangular,$stateParams,$state,sweet,_) {
        var vm = this;
        vm.save=save;
        function getAccoutDetails(){
          Restangular.one('AccountDetails', $stateParams.id).get().then(function(item){
        var data=Restangular.stripRestangular(item.data);
          vm.accountdetails=data.result
          }).catch(function (ex) {
            console.log(ex);
          });
        }

        function save(form){
          _.forEach(form.$error.required, function (element, index) {
              if (!_.isUndefined(element)) {
                  element.$setDirty();
              }
          });
          if (Object.keys(form.$error).length > 0) {
            return;
          }
          // if ($stateParams.id!='new') {
          //     vm.accountdetails=$stateParams.id
          // }
              saveAccoutDetails();
        }

        function saveAccoutDetails(){
          console.log(vm.accountdetails);
          Restangular.all('AccountDetails').post(vm.accountdetails).then(function(response){
            var message="";
            response=Restangular.stripRestangular( response)
            var message="";
            if (response.data.statusCode==409 || response.data==false) {
              response.status=response.data.statusCode;
                 message=response.data.error;
            }
          else if (response.data.statusCode==200) {
              message="Account details saved sucessfully."
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
                  $state.go('secure.account.list');
                }
              });

            });
        }
        activate();
        function activate() {
          vm.accountdetails={}

          if ($stateParams.id!= 'new') {
            getAccoutDetails()
          }
        }
    }
})();
