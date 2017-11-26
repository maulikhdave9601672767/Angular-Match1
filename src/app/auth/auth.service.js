
(function() {
  'use strict';
  angular
  .module('web')
  .factory('auth', auth);

  auth.$inject = ['$http','$rootScope', '$log', 'authUrl', '$localStorage', '$cookies','$window',
  '$state','sweet'];
  /* @ngInject */
  function auth($http, $rootScope, $log, authUrl, $localStorage, $cookies, $window,
    $state,sweet) {
      $rootScope.loginFlag = true;
      var service = {
        login: login,
        tryAndLogin: tryAndLogin,
        logout: logout,
        token: getToken,
        updateAccessToken: updateAccessToken
      };
      activate();
      return service;

      function login(user,where,persist) {
        if ($rootScope.loginFlag) {
          $rootScope.loginFlag = false;
          if(!user){
            $rootScope.loginFlag = true;
            return;
          }
          // var daaata={
          //   "UserName":"lokesh",
          //   "Password":"lokesh@123"
          // }
          return $http.post(authUrl,user).then(function (token) {

            $log.log(token);
            if ( token.data.statusCode==400) {
              $rootScope.$broadcast('login-failed');
              $rootScope.loginFlag = true;
              sweet.show({
                title: '',
                text: "Oops! Username or Password incorrect. ",
                confirmButtonColor: '#5cb85c',
                confirmButtonText: 'OK',
                closeOnConfirm: true,
              }, function() {
              });
              return;
            }
            var decompressToken = token.data.access_token;
            setValue('token',decompressToken,persist);
            if(decompressToken){
              debugger;
              var decodedToken = angular.fromJson(urlBase64Decode(decompressToken));
              $rootScope.user = decodedToken;

              $rootScope.user.Role= urlBase64Decode($rootScope.user.Role);
              $rootScope.user.UserName= urlBase64Decode($rootScope.user.UserName);
              console.log("user payload");
              console.log($rootScope.user);
              $rootScope.token = token;
              //  rolesAndPermission()
              if (where && where.url) {
                $state.go(where.url, where.params);
              }
              else {
                if($state.$current.self.name == 'login' && token.status == 200){
                  tryAndLogin();
                  //    $state.go('secure.home');
                }
              }
            }
          }).catch(function (ex) {
            $rootScope.loginFlag = true;
            sweet.show({
              title: '',
              text: "Oops! We are not able to connect to the server. Please refresh the page or try again later. If this continues, please contact your system administrator. ",
              confirmButtonColor: '#5cb85c',
              confirmButtonText: 'OK',
              closeOnConfirm: true,
            }, function() {
            });
            $rootScope.loginFlag = true;
            $log.log(ex);
            return ex;
          });
        }
      }
      function logout() {
        delete $rootScope.user;
        $rootScope.loginFlag = true;
        delete $rootScope.token;
        delete $rootScope.permissions;
        delete $rootScope.roles;
        clearAll();
        $state.go('login');
      }

      function urlBase64Decode(str) {
        try {
          if (str) {

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
          else {
            logout();
          }
        } catch (e) {
          logout();
        }

      }

      function tryAndLogin(token,where,cb) {
        token = token || getValue('token');

        $rootScope.user = extractUser(token);
        if (!$rootScope.user || $rootScope.user =="") {
          logout();
          return;
          //  $state.go('login');
        }
        $rootScope.user.Role= urlBase64Decode($rootScope.user.Role);
        $rootScope.user.UserName= urlBase64Decode($rootScope.user.UserName);
        $rootScope.token = token;
        if (token && $rootScope.user ) {
          //  rolesAndPermission();
          if( where && where.url) {
            $state.go(where.url, where.params);
          } else {
            if($state.$current.self.name === 'login' ){
              $state.go('secure.transaction.list');
            }
          }
        } else {
          $rootScope.$broadcast('login-failed');
          $state.go('login');
        }
      }

      function extractUser(token) {
        if (!token) {
          return '';
        }
        var user={};
        if (typeof token != 'undefined') {
          var encoded=token;
          user = angular.fromJson(urlBase64Decode(encoded));
        }
        return user;
      }

      function getToken() {
        return getValue('token');
      }

      function clearAll(){
        $localStorage.$reset();
      }

      function setValue(key,value,persist) {
        if(persist) {
          $log.log('saving to localStorage');
          $localStorage[key] = value;
          var date = new Date();
          var now = new Date();
          var time = now.getTime();
          var days = 7;
          time += 24 * 60 * 60 * 1000 * days;
          now.setTime(time);
          $cookies.putObject("auth0", 'looging', { expires: now });
        } else {
          $log.log('saving to sessionStorage');
          $localStorage[key] = value;
          $cookies.putObject("auth0", 'looging');
          // $cookies.putObject(key, value);
        }
      }

      function getValue(key) {
        return $localStorage[key];
      }

      // function rolesAndPermission() {
      //   var permissions=[];
      //   var roles=[];
      //   _.forEach($rootScope.user.roles,function (m,p) {
      //     roles.push(m.name)
      //     _.forEach(m.permissions,function(perm,indx){
      //       permissions.push(perm)
      //     });
      //   });
      //   $rootScope.permissions=_.uniq(permissions);
      //   $rootScope.roles=_.uniq(roles);
      // }
      function activate() {
        var startStateChange= $rootScope.$on('$stateChangeStart',function (event,toState,toParams) {
          if (toState.data && toState.data.requireLogin && !$rootScope.user) {
            event.preventDefault();
            $log.log('Go to login');
            $state.go('login',{'url':toState.name,'params':toParams});
          } else {
            if ($rootScope.user &&$rootScope.user.isfirstTimeLogin==true) {
              if (toState.name!='secure.changepassword') {
                event.preventDefault();
                $state.go('secure.changepassword');
              }
            }
            $log.log('user already logged in: ');
            //$log.log($rootScope.user);
          }
        });
        if(startStateChange){
          $log.log('Hooked up to startStateChange event sucessfully');
        }
      }
      function updateAccessToken(token, cb) {
        if (!_.isUndefined(token.data.access_token)) {
          var decompressToken = token.data.access_token;
          setValue('token', decompressToken, true);
          var token = getValue('token');
          $rootScope.user = extractUser(token);
          $rootScope.user.Role= urlBase64Decode($rootScope.user.Role);
          $rootScope.user.UserName= urlBase64Decode($rootScope.user.UserName);
          $rootScope.token = token;
          //  rolesAndPermission();
          cb('yes');
        }
        cb(null);
      }
    }
  })();
