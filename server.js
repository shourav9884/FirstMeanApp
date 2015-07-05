var ex=require("express");
var app=ex();
var mongo=require("mongojs");
var db=mongo("contactlist",["contactlist"]);	
var bp=require("body-parser");
var http = require('http').Server(app);
var socket=require("socket.io")(http);


// app.get('/',function (req,res) {
// 	res.send("from server");
// });
app.use(ex.static(__dirname + "/public"));
app.use(bp.json());
app.get('/list',function(req,res){
	db.contactlist.find(function(err,docs){
		// console.log(docs);
		res.json(docs);
	});
});
app.get("/list/:id",function(req,res){
	var id=req.params.id;
	db.contactlist.findOne({_id:mongo.ObjectId(id)},function(err,doc){
		res.json(doc);
	});
});
app.post('/list',function(req,res){
	// console.log(req.body);
	
});
app.put('/list/:id',function(req,res){
	var id=req.params.id;
	db.contactlist.findAndModify({query: {_id: mongo.ObjectId(id)},
	update: {$set: {name: req.body.name,email:req.body.email,number:req.body.number}},
	new: true},function(err,doc){
		res.json(doc);
	});
});
app.delete('/list/:id',function(req,res){
	
});
//socket program
socket.on('connection', function(io){
  console.log('a user connected');

  io.on('disconnect', function(){
    console.log('user disconnected');
  });

  io.on('add', function(msg){
  	db.contactlist.insert(msg,function(err,docs){
		socket.emit('add', "success");
	});
    
  });
  io.on('edit',function(msg){
  	// var id=req.params.id;
	db.contactlist.findAndModify({query: {_id: mongo.ObjectId(msg._id)},
	update: {$set: {name: msg.name,email:msg.email,number:msg.number}},
	new: true},function(err,doc){
		socket.emit("edit","success");
	});
	
  });
  io.on('delete',function(msg){
  	
	db.contactlist.remove({_id: mongo.ObjectId(msg.id)},function(err,doc){
		socket.emit("delete","success");
	});
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
// app.listen(3000);
// console.log("Server running on 30000...");