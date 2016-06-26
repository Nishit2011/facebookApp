'use strict';

angular.module('ngSocial.facebook', ['ngRoute','ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'facebookCtrl'
  });
}])


.config(function($facebookProvider) {
  $facebookProvider.setAppId('990295124390378');
  $facebookProvider.setPermissions("email,public_profile,user_posts,publish_actions");
})

.run(function($rootScope){
	(function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

})


.controller('facebookCtrl',['$scope','$facebook', function($scope, $facebook) {

	$scope.isLoggedIn =false;
	$scope.login = function(){
		$facebook.login().then(function(){
			$scope.isLoggedIn = true;
			refresh();

			});
	}


		$scope.logout = function(){
			$facebook.logout().then(function(){
				$scope.isLoggedIn = false;
				refresh();

				});
	}

function refresh(){
	$facebook.api("/me?fields= first_name,last_name,email,gender,locale,link").then(function(response){
		console.log(response);
		$scope.userInfo = response;
		$scope.welcomeMsg ="Welcome " +response.first_name+""+response.last_name;
		$scope.isLoggedIn = true;


		$facebook.api('/me/picture').then(function(response){
			$scope.picture = response.data.url;
			$facebook.api('/me/permissions').then(function(response){
				$scope.permissions = response.data;
				$facebook.api('/me/posts').then(function(response){
					console.log("res--->"+response.data);
					$scope.posts = response.data;

					});
				});
		});

	},
	function(err){
		$scope.welcomeMsg ="Please Log In";
	}
	);
}

$scope.postStatus =function(){

	var body = this.body;
	$facebook.api('/me/feed','post',{message:body}).then(function(response){
		$scope.msg ="Thanks For Posting";
		refresh();
		});
}
refresh();
}]);