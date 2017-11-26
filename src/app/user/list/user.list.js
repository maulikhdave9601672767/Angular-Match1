(function() {
  'use strict';

  angular
  .module('web')
  .controller('ListUserController', ListUserController);

  ListUserController.$inject = ['Restangular','$state','$rootScope','sweet','$window','_'];

  /* @ngInject */
  function ListUserController(Restangular,$state,$rootScope,sweet,$window,_) {
    var vm = this;
    vm.getUser=getUser;
    vm.go=go;
    vm.decode=decode;
    vm.delete=deleted;
    vm.printme=printme;
    vm.changepassword=changepassword;
    function changepassword(id) {
      $state.go('secure.changepassword',{id:id});
    }
    function printme() {
       window.print();
    }
    function decode(str) {
      if (str==undefined || str=="" || str==null) {
        return;
      }
      var output=str.replace('-','+').replace('_','/');

      switch (output.length % 4) {
        case 0:
        break;
        case 2:
        output+='==';
        break;
        case 3:
        output+='=';
        break;
        default:
        throw 'Illegal base64url string';
      }
      return $window.atob(output);
    }

    function getUser() {
      Restangular.all('account/UserList?pagesize=' + vm.options.pageSize + '&pageNumber='+(vm.options.page))
      .getList().then(function (user) {
        var data=Restangular.stripRestangular(user.data);
        vm.user=data[0].result;
        vm.options.totalItems=data[0].recordCount;
      });
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
          Restangular.one('account/DeleteById',id).remove().then(function (response) {
            var message='';
            response= Restangular.stripRestangular(response.data);
            if (response.statusCode==200) {
              message='User was deleted sucessfully.'
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
              getUser();
            });
          }).catch(function (err) {
            vm.failed=true;
          });
        });
      }

      function userDeactivate(id) {

        sweet.show({
          title: "Are you sure?",
          text: "If you decativate user then user will unable to login and all active session will destroy.Are you really want to decativate this ?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, decativate it!",
          closeOnConfirm: false
        },
        function () {
          vm.usr.isactive=false;
          Restangular.one('user').customPUT(vm.usr, id).then(function(response){
            response=Restangular.stripRestangular( response);
            var message="";
            if (response.statusText=='OK') {
              message="User decativated sucessfully."
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
              vm.failed=false;
              if (response.status!==409 && response.status!==500 ) {
                getUser();
              }
            });

          }).catch(function (ex) {
            vm.failed=true;
            console.log(ex);
          });
        });
      }
      function go(id){
        $state.go('secure.user.edit',{'id':id});
      }
      activate();

      function activate() {
        vm.usr={};
        if ($rootScope.user.Role!='Admin') {
          $state.go('secure.transaction.list');
        }
        vm.options = {};
        vm.pageSize = 8;
        vm.options.pageSize =10;
        vm.options.page = 1;
        getUser();
      }
    }
  })();
