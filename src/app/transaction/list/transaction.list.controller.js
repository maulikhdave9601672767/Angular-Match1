(function() {
  'use strict';

  angular
  .module('web')
  .controller('ListTransactionController', ListTransactionController);

  ListTransactionController.$inject = ['Restangular','$state', '$stateParams', '_', '$rootScope','sweet'];

  function ListTransactionController(Restangular, $state,$stateParams, _, $rootScope,sweet) {
    var vm = this;
    vm.getTransaction=getTransaction;
    vm.go=go;
    vm.delete=deleted;
    vm.printme=printme;
    vm.search=search;
    vm.total=total;
    vm.profitLossCalculation=profitLossCalculation;
    function getWorkType(cb){
      Restangular.all('WorkType?pagesize=1000&pageNumber=1')
      .getList().then(function (wrktyoe) {
        var data=Restangular.stripRestangular(wrktyoe.data);
        cb(data[0].result);
      });
    }
    function getAccountDetails(cb){
      Restangular.all('AccountDetails?pagesize=1000&pageNumber=1')
      .getList().then(function (wrktyoe) {
        var data=Restangular.stripRestangular(wrktyoe.data);
        cb(data[0].result);
      });
    }
    function getTransaction() {
      vm.pagingSize=parseInt(vm.options.pageSize );
      //  vm.options.pageSize=parseInt(vm.options.pageSize);
      //'department?pagesize=' + vm.options.pageSize + '&page='+(vm.options.page-1)
      if (angular.isUndefined(vm.searchText)) {
        vm.searchText='';
      }
      var query = 'Transaction?pagesize=';

      query = query.concat((vm.options.pageSize||10),'&pageNumber=',(vm.options.page||1) ,'&accountId=',(vm.accountDetailsId||''), '&worktypeid=', (vm.workTypeId||''), '&searchText=', (vm.searchText||''));
      Restangular.all(query)
      // 'Transaction?pagesize=' + vm.options.pageSize + '&pageNumber='+vm.options.page+'&worktypeid='+vm.workTypeId+'&searchText='+vm.searchText
      .getList().then(function (transaction) {

        var data=Restangular.stripRestangular(transaction.data);
        if (data.length) {
          vm.transactiondetails=data[0].result;
          vm.transactionProfitLossdetails=data[0].profitLossDetails;
          vm.options.totalItems=data[0].recordCount;
        }else{
          vm.transactiondetails=[];
          vm.transactionProfitLossdetails=[];
          vm.options.totalItems=0;
        }

      });
    }
    function search() {
      vm.options.page=1;
      getTransaction();
    }
    function printme() {
      window.print();
    }

    function total() {
      return _.sumBy((vm.transactionProfitLossdetails||[]), function (item) {
        return item.totalAmount||0;
      })||0;
    }
    function profitLossCalculation(transactiontype){
      if(!transactiontype){
        transactiontype="All";
      }
      Restangular.all('Transaction/GetProfitLoss/'+vm.accountDetailsId+'/'+transactiontype)
      .getList().then(function (wrktyoe) {
        var data=Restangular.stripRestangular(wrktyoe.data);
        vm.transactionProfitLossdetails=data[0].result;
      });
    }
    function go(id) {
      if (!id) {
        $state.go('secure.transaction.edit',{'id':'new'});
        return;
      }
      $state.go('secure.transaction.edit',{'id':id});
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
          Restangular.one('Transaction',id).remove().then(function (response) {
            var message='';
            response= Restangular.stripRestangular(response.data);
            if (response.statusCode==200) {
              message='Transaction was deleted sucessfully.'
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
              getTransaction();
            });
          }).catch(function (err) {
            vm.failed=true;
          });
        });
      }
      
      activate();

      function activate() {
        vm.workTypelist=[];
        vm.accountDetailsList=[];
        getAccountDetails(function (data) {
          vm.accountDetailsList=data;
        })
        getWorkType(function (data) {
          vm.workTypelist=data;
        })
        vm.pagingSize=10;
        vm.options = {};
        vm.pageSize = 8;
        vm.options.pageSize ='10';
        vm.options.page = 1;
        getTransaction()
        vm.sortType = 'name'; // set the default sort type
        vm.sortReverse = false; // set the default sort order
      }
    }
  })();
