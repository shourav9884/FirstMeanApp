var myApp = angular.module('myApp', []);
var t=io();
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
    var refresh=function(){
    	$http.get("/list").success(function(res){
	    	$scope.list=res;
	    });	
	    $scope.contact="";
    };
    refresh();
    $scope.addContact=function(){
    	console.log($scope.contact.name);
    	
    	t.emit('add', $scope.contact);
    	
    };
    $scope.remove=function(id){
    	console.log(id);
    	var msg={id: id};
    	t.emit('delete', msg);

    };
    $scope.updateContact=function(id){
    	$http.get("/list/"+id).success(function(res){
    		$scope.contact=res;
    	});
    };
    $scope.update=function(){
    	var id=$scope.contact._id;
    	var msg=$scope.contact;
    	t.emit('edit', $scope.contact);
    };
    t.on('add', function(msg){
    	refresh();
  	});
  	t.on('edit',function(msg){
  		refresh();
  	});
  	t.on('delete',function(msg){
  		refresh();
  	});
}]);