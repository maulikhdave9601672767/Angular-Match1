(function() {
    'use strict';

    angular
        .module('web')
        .controller('ListAccountController', ListAccountController);

    ListAccountController.$inject = ['Restangular','$state', '$stateParams', '_', '$rootScope','sweet'];

    function ListAccountController(Restangular, $state,$stateParams, _, $rootScope,sweet) {
        var vm = this;
        vm.getAccoutDetails=getAccoutDetails;
        vm.go=go;
        vm.printme=printme;
        vm.delete=deleted;
        function getAccoutDetails() {
          Restangular.all('AccountDetails?pagesize=' + vm.options.pageSize + '&pageNumber='+vm.options.page)
          .getList().then(function (accountdetails) {
            var data=Restangular.stripRestangular(accountdetails.data);
                vm.accountdetails=data[0].result;
               vm.options.totalItems=data[0].recordCount;
           });
          }

          function go(id) {
            if (!id) {
                $state.go('secure.account.edit',{'id':'new'});
                return;
            }
            $state.go('secure.account.edit',{'id':id});
          }

        function printme() {
           window.print();
        }
          function deleted(id) {
            sweet.show({
              title: "Are you sure?",
              text: "Are you really want to delete this ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false},
              function(){
                Restangular.one('AccountDetails',id).remove().then(function (response) {
                  var message='';
                  response= Restangular.stripRestangular(response.data);
                  if (response.statusCode==200) {
                    message='AccountDetails was deleted sucessfully.'
                  }
                  else {
                    message=response.error;
                  }
                  sweet.show({
                    title: '',
                    text: message,
                    confirmButtonColor: '#5cb85c',
                    confirmButtonText: 'OK',
                    closeOnConfirm: true,
                  }, function() {
                    getAccoutDetails();
                  });
                }).catch(function (err) {
                  vm.failed=true;
                });

              });
          }
        activate();

        function activate() {
          vm.options = {};
               vm.pageSize = 8;
               vm.options.pageSize =10;
               vm.options.page = 1;
               getAccoutDetails()
               vm.sortType = 'name'; // set the default sort type
               vm.sortReverse = false; // set the default sort order
        }
    }
})();
