(function () {

	'use strict';

	angular.module('web')
		.directive('back', back);

	back.$inject =['$window'];

	function back($window) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				elem.bind('click', function () {
					$window.history.back();
				});
			}
		};
	}
})();
