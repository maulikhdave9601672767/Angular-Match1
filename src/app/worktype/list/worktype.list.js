(function() {
  'use strict';

  angular
  .module('web')
  .controller('ListWorkTypeController', ListWorkTypeController);

  ListWorkTypeController.$inject = ['Restangular','$state','$rootScope','sweet'];

  /* @ngInject */
  function ListWorkTypeController(Restangular,$state,$rootScope,sweet) {
    var vm = this;
    vm.getWorkType=getWorkType;
    vm.go=go;
    vm.delete=deleted;
    activate();
  vm.printme=printme;
    function getWorkType(){
      Restangular.all('WorkType?pagesize=' + vm.options.pageSize + '&pageNumber='+vm.options.page)
      .getList().then(function (wrktyoe) {
        var data=Restangular.stripRestangular(wrktyoe.data);
        vm.worktype=data[0].result;
        vm.options.totalItems=data[0].recordCount;
      });
    }
    function printme() {
       window.print();
    }
    function go(id){
      $state.go('secure.worktype.edit',{'id':id});
    }



    function deleted(workTypeId) {
      sweet.show({
        title: "Are you sure?",
        text: "Are you really want to delete this ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false},
        function(){
              Restangular.one('worktype',workTypeId).remove().then(function (response) {
                var message='';
                response= Restangular.stripRestangular(response.data);
                if (response.statusCode==200) {
                  message='WorkType was deleted sucessfully.'
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
                  getWorkType();
                });
              }).catch(function (err) {
                vm.failed=true;
              });
        });


      }

      function activate() {
        if ($rootScope.user.Role!='Admin') {
          $state.go('secure.transaction.list');
        }
        vm.options = {};
        vm.pageSize = 8;
        vm.options.pageSize =10;
        vm.options.page = 1;
        vm.sortType = 'name'; // set the default sort type
        vm.sortReverse = false; // set the default sort order
        getWorkType();
      }
    }
  })();
