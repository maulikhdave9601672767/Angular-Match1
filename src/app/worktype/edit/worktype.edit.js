(function() {
    'use strict';

    angular
        .module('web')
        .controller('EditWorkTypeController', EditWorkTypeController);

    EditWorkTypeController.$inject = ['Restangular','$stateParams','$state','$rootScope','sweet','_'];
EditWorkTypeController
    /* @ngInject */
    function EditWorkTypeController(Restangular,$stateParams,$state,$rootScope,sweet,_) {
        var vm = this;
       vm.save=save;
       function getWorkType() {
         Restangular.one('WorkType', $stateParams.id).get().then(function(item){
           var data=Restangular.stripRestangular(item.data);
           vm.worktype=data.result;
           vm.failed=false;
         }).catch(function (ex) {
           vm.failed=true;
           console.log(ex);
         });
       }

       function saveWorkType(){
         Restangular.all('WorkType').post(vm.worktype).then(function(response){
           response=Restangular.stripRestangular( response)
           var message="";
           if (response.data.statusCode==409 || response.data==false) {
             response.status=response.data.statusCode;
                message=response.data.error;
           }
          else if (response.statusText=='OK') {
             message="WorkType saved sucessfully."
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
                 $state.go('secure.worktype.list');
               }
             });

           }).catch(function (ex) {
             vm.failed=true;
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
         if ($stateParams.id!='new') {
           vm.worktype.workTypeId=$stateParams.id;
         }
          saveWorkType();
       }
       activate();

       function activate() {
         if ($rootScope.user.Role!='Admin') {
           $state.go('secure.transaction.list');
         }
         vm.worktype={}

         if ($stateParams.id!= 'new') {
           getWorkType();
         }
       }
    }
})();
