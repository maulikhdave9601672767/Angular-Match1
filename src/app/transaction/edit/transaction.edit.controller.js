(function() {
  'use strict';

  angular
  .module('web')
  .controller('EditTransactionController', EditTransactionController);

  EditTransactionController.$inject = ['Restangular','$stateParams','$state','sweet','_'];

  /* @ngInject */
  function EditTransactionController(Restangular,$stateParams,$state,sweet,_) {
    var vm = this;
    vm.save=save;

    function getWorkType(cb) {
      Restangular.all('WorkType?pagesize=1000&pageNumber=1')
      .getList().then(function (wrktype) {
        var data=Restangular.stripRestangular(wrktype.data);
        cb(data[0].result);
      });
    }
    function geAccountDetails(cb) {
      Restangular.all('AccountDetails?pagesize=1000&pageNumber=1')
      .getList().then(function (acctdetails) {
        var data=Restangular.stripRestangular(acctdetails.data);
        cb(data[0].result);
      });
    }
    function getTransaction(){
      Restangular.one('Transaction', $stateParams.id).get().then(function(item){
      var data=Restangular.stripRestangular(item.data);
        vm.transaction=data.result;
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
        saveTrasnaction();
    }

    function saveTrasnaction(){
      Restangular.all('Transaction').post(vm.transaction).then(function(response){
        var message="";
        if (response.statusText=='OK') {
          message="Transaction details saved sucessfully."
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
            $state.go('secure.transaction.list');
          }
        });
      });
    }
    activate();
    function activate() {
      vm.accountlist=[];
      vm.workTypelist=[];
      vm.transactiondetails={}
      geAccountDetails(function (accData) {
        getWorkType(function (wrkdata) {
          vm.accountlist=accData;
          vm.workTypelist=wrkdata
        })
      });
      if ($stateParams.id!= 'new') {
        getTransaction()
      }
    }
  }
})();
