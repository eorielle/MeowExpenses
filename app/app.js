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
          $rootScope.logged = false;
          console.log($scope.logged);
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
    controller:'MainController',
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
    controller:'ReportsController',
    templateUrl:'reports/index.html'
  });

  //.otherwise({redirectTo:'/'});
});
app.controller('MainController', function($scope){

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
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $scope.alerts.push({type:'succes', msg: 'Authentication successful!'});
      $rootScope.message = 'Authentication successful!';
      $rootScope.logged = true;
      console.log($scope.logged);
      $location.path('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $rootScope.logged = false;
      console.log($scope.logged);
      $location.path('/login');
      $scope.alerts.push({type:'danger', msg: 'Authentication failed.'});
    });
  };
})

.controller('SignupController', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.signup = function(){

    $http.post('/signup', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      //$scope.alerts.push({type:'succes', msg: 'Sign up successful!'});
      $rootScope.message = 'Authentication successful!';
      $rootScope.logged = true;
      console.log($scope.logged);
      $location.path('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Sign up failed.';
      $rootScope.logged = false;
      console.log($scope.logged);
      $location.path('/signup');
      //$scope.alerts.push({type:'danger', msg: 'Authentication failed.'});
    });
  };
})

.controller('ReportsController', function($scope, $rootScope, $http, getreports){
  $scope.currencies = [
    {name:'EUR', symbol:'€'},
    {name:'USD', symbol:'$'},
    {name:'CNY', symbol:'Y'}
  ];
  $scope.report={
    currency:null,
    amout:'0.00',
    supplier:'',
    purpose:'',
    date:'',
    invoiceURL:''
  };

  getreports.success(function(data){
    console.log('Success !!! :D');
    console.log(data.length);
    $scope.reports = data;
  });

  $scope.addReport = function(){
    $http.post('/addreport',$scope.report)
    .success(function(){
      $rootScope.message='New report added';
      $location.path('/reports');
    })
    .error(function(){
      $rootScope.message = 'Add new report failed';
      $location.path('/reports');
    });
  };
})
;

app.factory('getreports', function($http){
  return $http.post('/getreports')
  .success(function(data){
    return data;
  })
  .error(function(err){
    return err;
  });
});
