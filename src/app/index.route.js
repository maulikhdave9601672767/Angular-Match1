(function() {
  'use strict';

  angular
  .module('web')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
      url: '/login',
      params: {
        url: {value: null, squash: true},
        params: {value: null, squash: true}
      },
      templateUrl: 'app/auth/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })


    .state('secure', {
      data: {
        requireLogin: true
      },
      template: "<div ui-view></div>"
    })
    .state('secure.changepassword', {
        url: '/{id}/changepassword',
        params: {
          id: {value: 'user'}
        },
        templateUrl: 'app/auth/changepassword/changepassword.edit.html',
        controller: 'EditChangePassword',
        controllerAs: 'vm'
      })

	.state('secure.worktype', {
      url: '/worktype',
      templateUrl: 'app/worktype/worktype.html',
      abstract: true,
    })
    .state('secure.worktype.list', {
      url: '/list',
      templateUrl: 'app/worktype/list/worktype.list.html',
      controller: 'ListWorkTypeController',
      controllerAs: 'vm'
    })
    .state('secure.worktype.edit', {
      url: '/{id}/edit',
      params: {
        id: {value: 'new'}
      },
      templateUrl: 'app/worktype/edit/worktype.edit.html',
      controller: 'EditWorkTypeController',
      controllerAs: 'vm'
    })
.state('secure.account', {
      url: '/account',
      templateUrl: 'app/account/account.html',
      abstract: true,
    })
    .state('secure.account.list', {
      url: '/list',
      templateUrl: 'app/account/list/account.list.html',
      controller: 'ListAccountController',
      controllerAs: 'vm'
    })
    .state('secure.account.edit', {
      url: '/{id}/edit',
      params: {
        id: {value: 'new'}
      },
      templateUrl: 'app/account/edit/account.edit.html',
      controller: 'EditAccountController',
      controllerAs: 'vm'
    })
    .state('secure.user', {
      url: '/user',
      templateUrl: 'app/user/user.html',
      abstract: true,
    })
    .state('secure.user.list', {
      url: '/list',
      templateUrl: 'app/user/list/user.list.html',
      controller: 'ListUserController',
      controllerAs: 'vm'
    })
    .state('secure.user.edit', {
      url: '/{id}/edit',
      params: {
        id: {value: 'new'}
      },
      templateUrl: 'app/user/edit/user.edit.html',
      controller: 'EditUserController',
      controllerAs: 'vm'
    })
    .state('secure.transaction', {
      url: '/transaction',
      templateUrl: 'app/transaction/transaction.html',
      abstract: true,
    })
    .state('secure.transaction.list', {
      url: '/list',
      templateUrl: 'app/transaction/list/transaction.list.html',
      controller: 'ListTransactionController',
      controllerAs: 'vm'
    })
    .state('secure.transaction.edit', {
      url: '/{id}/edit',
      params: {
        id: {value: 'new'}
      },
      templateUrl: 'app/transaction/edit/transaction.edit.html',
      controller: 'EditTransactionController',
      controllerAs: 'vm'
    });
    $urlRouterProvider.otherwise('/transaction/list');
  }

})();
