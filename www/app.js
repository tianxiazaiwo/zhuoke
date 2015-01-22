define(['route-resolver','oc-lazy-load'], function () {
    /**
     * configure the main app module
     * @type {*|module}
     */
    app = angular.module('app', ['ngRoute', 'routeResolver','oc.lazyLoad', 'ionic', 'pasvaz.bindonce'])
        .run(function($ionicPlatform, $rootScope) {
          $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
            if (window.wizSpinner) {
              $rootScope.$on('$viewHistory.historyChange', function(e, data) {
                window.wizSpinner.setBackPreventingText('');
              });
            }

            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.disableScroll(true);
            }

          });
        })
        .config(function ($injector, $routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $animateProvider, $ionicNavBarConfig) {
          /**
           * configure the ocLazyLoader to use requireJS as the loader
           */
          $ocLazyLoadProvider.config({
            asyncLoader: require
          });

          /**
           * override angular default module api for creating components
           * @type {Function|register|register|register}
           */
          app.controller = $controllerProvider.register;
          app.service = $provide.service;
          app.factory = $provide.factory;
          app.filter = $filterProvider.register;
          app.directive = $compileProvider.directive;

          /**
           * disable navbar animation
           */
          $ionicNavBarConfig.transition = 'no-animation';


          /**
           * get referance to the route method of routeResolverProvider
           * @type {*}
           */
          var route = routeResolverProvider.route;


          $stateProvider
            .state('dingcan', {
              url: '/dingcan',
              abstract: true,
              views: {
                'main': route.resolve(['data.OrderMngr', 'data.DishMngr'])
              }
            })
            .state('dingcan.homepage', {
              url: '/homepage/:shopId',
              views: {
                'main@': route.resolve('dingcan.homepage')
              }
            })
            .state('dingcan.modify', {
              url: '/modify/:shopId',
              views: {
                'main@': route.resolve('dingcan.homepage')
              }
            })

            .state('dingzuo', {
              url: '/dingzuo',
              abstract: true,
              views: {
                'main': route.resolve(['data.OrderMngr', 'data.DishMngr'])
              }
            })
            .state('dingzuo.form', {
              url: '/form/:shopId',
              views: {
                'main@': route.resolve('dingzuo.homepage')
              }
            })
            .state('dingzuo.modify', {
              url: '/modify/:shopId',
              views: {
                'main@': route.resolve('dingzuo.homepage')
              }
            })
            .state('dingzuo.confirm', {
              url: '/confirm/:shopId',
              views: {
                'main@': route.resolve('dingzuo.confirm')
              }
            })
            .state('dingzuo.phonebind', {
              url: '/phonebind/:phone/:shop_id',
              views: {
                'main@': route.resolve('dingzuo.phonebind')
              }
            })
            .state('dingzuo.compelete', {
              url: '/compelete',
              views: {
                'main@': route.resolve('dingzuo.compelete')
              }
            })


            .state('orders', {
              url: '/orders',
              abstract: true
            })
            .state('orders.my-orders', {
              url: '/my-orders',
              views: {
                'main@': route.resolve('orders.my-orders', ['LsAPI', 'data.OrderMngr'])
              }
            })
            .state('orders.detail', {
              url: '/detail/:orderId',
              views: {
                'main@': route.resolve('orders.detail', ['LsAPI', 'data.OrderMngr'])
              }
            })

          //$urlRouterProvider.otherwise('/dingcan/homepage/284368');
        });

    return app;
});