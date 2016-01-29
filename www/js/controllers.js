angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope, Session, User, $ionicSlideBoxDelegate) {
  $rootScope.currentUser = Boolean($window.localStorage.token)
  // Form data for the login modal
  $scope.logout = function() {
    $window.localStorage.token = ''
    $rootScope.currentUser = Boolean($window.localStorage.token)
    $http.defaults.headers.common['Authorization'] = ''
    console.log($window.localStorage.token)
    $rootScope.loginErr = ''
    $rootScope.signupErr = ''
    $state.go('tab.cafe', {}, {reload: true})
    $window.location.reload()
  }
  $scope.reload =function() {
    $window.location.reload()
  }

})

.controller('FormsCtrl', function($scope, $http, $state, $rootScope, $window, $stateParams, Session, User, Qiniu, $ionicSlideBoxDelegate) {
  $rootScope.$broadcast('qiniuUPdate')
  $scope.loginData = {email: "cf1@gmail.com", password: ""}
  $scope.signupData = {name:'cf1'}; $rootScope.loginErr = ''; $rootScope.signupErr = ''
  // $ionicSlideBoxDelegate.$getByHandle('my-handle')
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.preSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }
  $scope.slideHasChanged = function($index) {
    // $ionicScrollDelegate.resize();
    console.log($ionicSlideBoxDelegate.currentIndex() + 'ddddd')
  }
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var sess = new Session($scope.loginData)
    sess.$save(function(data) {
      if (data.token) {
        $window.localStorage.token = data.token
        $rootScope.currentUser = Boolean($window.localStorage.token)
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage.token)
        $state.go('tab.cafe', {}, {reload: false})
      } else {
        console.log(data.err)
        $rootScope.loginErr = data.err
      }
    })
  }
  $scope.getFile = function(f) {
    $scope.temfile = f
  }
  $scope.avt = true
  $scope.doSignup = function() {
    if (!$scope.temfile) {$scope.avt = false; return}
    Qiniu.ngFileUp($scope.temfile).then(function (resp) {
      // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.key + JSON.stringify(resp.data))
      $scope.signupData.avatar = "http://7xj5ck.com1.z0.glb.clouddn.com/" + resp.data.key
      var user = new User({user:$scope.signupData})
      user.$save(function(data) {
        if (data.token) {
          $window.localStorage.token = data.token
          $rootScope.currentUser = Boolean($window.localStorage.token)
          $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
          console.log($window.localStorage.token)
          $state.go('tab.cafe', {}, {reload: true})
          // $window.location.reload()
        } else {
          console.log(data.err)
          $rootScope.signupErr = data.err
        }
      })
    })
  }

})

.controller('HomeCtrl', function($scope, $http, $state, $rootScope, $window, $resource, Cafe ) {
  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      Cafe.get({id:0, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        $scope.dataLength = data.photos.length
        $scope.photos = $scope.photos.concat(data.photos)
        if ($scope.page == 0){$scope.user = data.user}
        if (data.photos.length == $scope.limit) {$scope.lastId = data.photos[$scope.limit-1].id}
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }
  $scope.loadMore()
})

.controller('UphotoCtrl', function($scope, $http, $state, $rootScope, $window, Qiniu, Cafe) {
  $rootScope.$broadcast('qiniuUPdate'); $scope.cafe = {content:''}; $scope.temfiles = []
  $scope.listFiles = function(f) {
    $scope.temfile = f; //$scope.temfiles.push(f) // console.log($scope.cafe.content)
  }
  $scope.refresh = function() {
    $state.go($state.current, {}, {reload: true})
  }
  $scope.upPhoto = function() {
    Qiniu.ngFileUp($scope.temfile).then(function (resp) {
      // http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-28T06%3A11%3A25.113Z// console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.key + JSON.stringify(resp.data))
      $scope.cafe.key = resp.data.key
      var cafe = new Cafe($scope.cafe) //{key: resp.data.key, content: $scope.content})
      cafe.$save(function(data) {
        $state.go('tab.home', {}, {reload: true})
      })
    }, function (resp) {
      $scope.status= resp.status; console.log('Error status: ' + resp.status)
    }, function (evt) {
      $scope.uppercent = parseInt(100.0 * evt.loaded / evt.total)
      // console.log('progress: ' + $scope.uppercent + '% ' + evt.config.data.file.name)
    })
  }
})

.controller('CafeCtrl', function($scope, $http, $rootScope, $state, $window, $resource, Cafe) {
  $scope.photos = [];$scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    Cafe.query({page: $scope.page, lastId: $scope.lastId})
    .$promise.then(function(data) {
      var middle; data.length%2 == 0?(middle = data.length/2):(middle = (data.length+1)/2)
      $scope.photos.push(data.slice(0,middle))
      $scope.photos.push(data.slice(middle))
      // $scope.photos = $scope.photos.concat(data)
      $scope.page += 1
      $scope.$broadcast('scroll.infiniteScrollComplete')
    })
  }

})

.controller('UsersIdCtrl', function($scope, $http, $state, $rootScope, $stateParams, $window, $resource, Cafe) {
  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      Cafe.get({id:$stateParams.id, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        $scope.dataLength = data.photos.length
        $scope.photos = $scope.photos.concat(data.photos)
        if ($scope.page == 0){$scope.user = data.user}
        if (data.photos.length == $scope.limit) {$scope.lastId = data.photos[$scope.limit-1].id}
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }
  $scope.loadMore()
  $scope.options = {
    loop: true,
    setWrapperSize: true,
    autoHeight: true,
    roundLengths: true,
    freeMode: true,
    effect: 'coverflow',
    cube: {
      shadow: false,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94
    },
    nextButton: '#btn-next',
    prevButton: '#btn-prev',
    autoplay: 2000,
    speed: 500
  }
  $scope.data = {};
  $scope.$watch('data.slider', function(nv, ov) {
    $scope.slider = $scope.data.slider;
  })
})

.controller('AccountCtrl', function($scope,$http,$cordovaCamera,$cordovaCapture) {

})
.controller('UserupCtrl', function($scope, $http, $state, $rootScope, $window, $resource, Qiniu) {
  $rootScope.$broadcast('qiniuUPdate'); $scope.userupData = {}
  var Userup =  $resource($rootScope.baseUrl + '/api/userup/:id')
  Userup.get({id:0}).$promise.then(function(data) {
    // console.log(JSON.stringify(data))
    $scope.userupData.name = data.user.name
    $scope.userupData.description = data.user.description
    $scope.userupData.email = data.user.email
    $scope.userupData.avatar = data.user.avatar
  })
  $scope.getFile = function(f) {
    $scope.temfile = f
  }
  $scope.avt = true
  $scope.doUserup = function() {
    // if (!$scope.temfile) {$scope.avt = false; return}
    if ($scope.temfile){
      Qiniu.ngFileUp($scope.temfile).then(function (resp) {
        $scope.userupData.avatar = "http://7xj5ck.com1.z0.glb.clouddn.com/" + resp.data.key
        var user = new Userup($scope.userupData)
        user.$save(function(data) {
          $state.go('tab.home', {}, {reload: true})
          // $window.location.reload()
        })
      })
    } else {
      var user = new Userup($scope.userupData)
      user.$save(function(data) {
        $state.go('tab.home', {}, {reload: true})
        // $window.location.reload()
      })
    }
  }

})

.controller('MessageCtrl', function($scope, $http, $rootScope,$cordovaCamera,$cordovaCapture, $cordovaImagePicker,$resource,$cordovaInAppBrowser) {

})
