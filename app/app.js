var app = angular.module('meowExpenses',['ngRoute','ui.bootstrap']).run(['$rootScope', 'sessionService', function($rootScope, sessionService){
  $rootScope.session = sessionService;
  //console.log($rootScope.session.isLoggedIn);
}]);

// -------------------------
// Configuration : Routes
// -------------------------
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

        //return $q.reject(response);
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


// -----------------------------
// Configuration : Controller
// -----------------------------
app.controller('MainController', function($scope, $rootScope, $http, $location){
  $scope.data = $rootScope.session.isLoggedIn;
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
      $rootScope.session.authSuccess(user);

      $location.path('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $rootScope.session.authFailed();

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
      $rootScope.session.authSuccess(user);

      $location.path('/reports');

    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Sign up failed.';
      $rootScope.session.authFailed();

      $location.path('/signup');
      //$scope.alerts.push({type:'danger', msg: 'Authentication failed.'});
    });
  };
})

.controller('ReportsController', function($scope, $location, $rootScope, $http, getreports){
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


  $scope.totalItems = 0;
  $scope.currentPage = 1;
  $scope.maxSize = 50;
  $scope.itemPerPage = 5;

  $scope.setPage = function (pageNo) {
    $scope.bigCurrentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.bigCurrentPage);
    getreports.getReports($scope.bigCurrentPage).success(function(data){
      console.log('Success !!! :D');
      console.log(data.result[0]);
      $scope.reports = data.result;
      $scope.bigTotalItems = data.count;
      console.log("The number of elements is : " + data.count);
    });
  };

  $scope.bigTotalItems = 0;
  $scope.bigCurrentPage = 1;

  getreports.getReports(1).success(function(data){
    console.log('Success !!! :D');
    console.log(data.result.length);
    $scope.reports = data.result;
    $scope.bigTotalItems = data.count;
    console.log("The number of elements is : " + data.count);
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


// -------------------------
// Configuration : Services
// -------------------------

app.factory('getreports', function($http){
  return {
    getReports:function(pageNo){
      return $http({
            url: '/getreports',
            method: "POST",
            data: { 'page' : pageNo }
        })
      .success(function(data){
        return data;
      })
      .error(function(err){
        return err;
      });
    }
  };

});


app.factory('sessionService', ['$rootScope', '$window', '$http', '$location',
    function ($rootScope, $window, $http, $location) {
    var session = {
        init: function () {
          if(this.currentUser !== null){
            this.isLogged = true;
          } else {
            this.resetSession();
          }
           /*$http.get('/isLogged')
              .success(function(data){
                this.isLoggedIn = true;
                this.currentUser = data;
                console.log("logged in " + this.isLoggedIn );
              })
              .error(function(err){
                this.resetSession();
                console.log("not logged in");
              });*/

        },
        resetSession: function() {
            this.currentUser = null;
            this.isLoggedIn = false;
            console.log("reset session");
        },
        /*facebookLogin: function() {
            var url = '/auth/facebook',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        },*/
        logout: function() {
            var scope = this;
            console.log("logging out");
            $http.post('/logout')
              .success(function(data){
                console.log("logging out ok");
                return $location.path('/');
              })
              .error(function(err){
                console.log("logging out err");
                return err;
              });
            scope.resetSession();
            $rootScope.$emit('session-changed');


        },
        authSuccess: function(userData) {
            this.currentUser = userData;
            this.isLoggedIn = true;
            console.log("auth success");
            $rootScope.$emit('session-changed');
        },
        authFailed: function() {
            this.resetSession();
            alert('Authentication failed');
            console.log("auth failed");
        }
    };
    session.init();
    return session;
}]);
