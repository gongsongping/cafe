// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js ,'ngIOS9UIWebViewPatch'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'ngResource','ngCordova','ngFileUpload']) //'firebase',

.run(function($ionicPlatform, $http, $window, $rootScope, $state, $resource) {
  // $rootScope.baseUrl = "http://localhost:3000"
  //  $rootScope.baseUrl = "http://162.243.143.15"
  $rootScope.baseUrl = "http://changiif.com"
  $rootScope.$on('qiniuUPdate', function() {
    $resource('http://changiif.com/uptoken').get().$promise.then(function(data) {
      $window.localStorage.qiniuToken = data.uptoken
      // console.log('qiniuT  ' + $window.localStorage.qiniuToken)
    })
  })
  $rootScope.$broadcast('qiniuUPdate')
  if ($window.localStorage.token) {
    $http.defaults.headers.common["Authorization"] = "Token token=" + $window.localStorage.token
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault()
    }
  })
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider,$ionicConfigProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // RestangularProvider.setBaseUrl("http://162.243.143.15/api")
  // RestangularProvider.setBaseUrl("http://localhost:3000/api")
  $ionicConfigProvider.tabs.position("bottom") //Places them at the bottom for all OS
  $ionicConfigProvider.views.swipeBackEnabled(false)
  $ionicConfigProvider.views.forwardCache(true)
  // $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('forms', {
    url: "/forms",
    // cache: false,
    // abstract: true,
    views: {
      '@': {
        templateUrl: 'templates/forms.html',
        controller: 'FormsCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    // cache: false,
    views: {
      '@': {
        templateUrl: 'templates/form-login.html',
        controller: 'FormsCtrl'
      }
    }
  })

  .state('signup', {
    url: '/signup',
    // cache: false,
    views: {
      '@': {
        templateUrl: 'templates/form-signup.html',
        controller: 'FormsCtrl'
      }
    }
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    cache: false,
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.uphoto', {
    url: '/uphoto',
    cache: false,
    views: {
      'tab-uphoto': {
        templateUrl: 'templates/tab-uphoto.html',
        controller: 'UphotoCtrl'
      }
    }
  })
  .state('tab.cafe', {
    url: '/cafe',
    // cache: false,
    views: {
      'tab-cafe': {
        templateUrl: 'templates/tab-cafe.html',
        controller: 'CafeCtrl'
      }
    }
  })
  .state('tab.cafe-users-id', {
    url: '/cafe/users/:id',
    // cache: false,
    views: {
      'tab-cafe': {
        templateUrl: 'templates/cafe-users-id.html',
        controller: 'UsersIdCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.account-userup', {
    url: '/account/userup',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/account-userup.html',
        controller: 'UserupCtrl'
      }
    }
  })

  .state('tab.message', {
    url: '/message',
    // cache: false,
    abstract: true,
    views: {
      'tab-message': {
        templateUrl: 'templates/tab-message.html',
        controller: 'MessageCtrl'
      }
    }
  })
  .state('tab.message.mes1', {
    url: '/mes1',
    cache: false,
    views: {
      'message-mes@tab.message': {
        templateUrl: 'templates/mes1.html'
        // controller: 'MessageCtrl'
      }
    }
  })
  .state('tab.message.mes2', {
    url: '/mes2',
    // cache: false,
    views: {
      'message-mes@tab.message': {
        templateUrl: 'templates/mes2.html'
        // controller: 'MessageCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/cafe');

});
