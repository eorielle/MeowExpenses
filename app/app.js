var app = angular.module('meowExpenses',['ngRoute']);
app.config(function ($routeProvider, $locationProvider, $httpProvider){


  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401){
          $location.url('/login');
          console.log("error 401");
        }

        return $q.reject(response);
      }
    };
  });


  $routeProvider

//Routes
  .when('/', {
    //controller:'MainController',
    templateUrl:'home/index.html'
  })

  .when('/signup',{
    controller:'SignupController',
    templateUrl:'account/signup.html'
  })

  .when('/login',{
    controller:'LoginController',
    templateUrl:'account/login.html'
  })

  .when('/reports',{
    //controller:'ReportsController',
    templateUrl:'reports/index.html'
  });

  //.otherwise({redirectTo:'/'});
});


app.controller('LoginController', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  // Register the login() function
  $scope.login = function(){
    console.log($scope.user.username);
    console.log($scope.user.password);
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $scope.alerts.push({type:'succes', msg: 'Authentication successful!'});
      $rootScope.message = 'Authentication successful!';
      $location.url('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
      $scope.alerts.push({type:'danger', msg: 'Authentication failed.'});
    });
  };
})

.controller('SignupController', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.signup = function(){
    console.log($scope.user.username);
    console.log($scope.user.password);

    $http.post('/signup', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      //$scope.alerts.push({type:'succes', msg: 'Sign up successful!'});
      $rootScope.message = 'Authentication successful!';
      $location.url('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Sign up failed.';
      $location.url('/signup');
      //$scope.alerts.push({type:'danger', msg: 'Authentication failed.'});
    });
  };
})
;
