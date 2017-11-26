(function() {
    'use strict';

    angular
        .module('web')
        .directive('uiSelectRequired', uiSelectRequired);

    /* @ngInject */
    function uiSelectRequired() {
        var uiSelectRequired = {
            require: 'ngModel',
            restrict: 'A',
            link: linkFunc
        };
        return uiSelectRequired;

        function linkFunc(scope, el, attr, ctrl) {
          if (angular.isDefined(attr.multiple)) {
            scope.$watchCollection(attr.ngModel, setTouchedtoDropdown)
        }
        else {
            scope.$watch(attr.ngModel, setTouchedtoDropdown);
        }
        function setTouchedtoDropdown(newValue, oldValue) {
          if(!ctrl.$touched && isNotInitialLoad(newValue,oldValue)) ctrl.$setTouched();
        }
        function isNotInitialLoad(newValue,oldValue) {
          return newValue !== oldValue;
      }
          ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
             var determineVal;
             if (angular.isArray(modelValue)) {
               determineVal = modelValue;
             } else if (angular.isArray(viewValue)) {
                determineVal = viewValue;
             } else {
                return false;
             }
           return determineVal.length > 0;
        };

    }
  }

})();
