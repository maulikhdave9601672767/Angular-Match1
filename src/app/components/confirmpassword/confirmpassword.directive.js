(function() {
    'use strict';

    angular
        .module('web')
        .directive('confirmpasswordValidation', confirmpasswordValidation);

    /* @ngInject */
    function confirmpasswordValidation() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
              passwords: '@'

            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
      //    console.log('scope.password ',scope.password);
          ctrl.$parsers.unshift(function(viewValue, $scope) {
        //   console.log(viewValue);
        //    console.log(scope.password);
             var noMatch = viewValue != scope.passwords
             ctrl.$setValidity('noMatch', !noMatch);
             return (noMatch)?noMatch:!noMatch;
           });

           scope.$watch("passwords", function(value) {
             ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
           });
        }
    }


})();
