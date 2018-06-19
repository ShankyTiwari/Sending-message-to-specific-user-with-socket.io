'use strict';

class Routes{

	constructor(app,socket){
		this.app = app;
		this.io = socket;

		/* 
			Array to store the list of users along with there respective socket id.
		*/
		this.users = []; 
	}


	appRoutes(){

		this.app.get('/', (request,response) => {
			response.render('index');
		});

	}

	socketEvents(){

		this.io.on('connection', (socket) => {

			socket.on('username', (userName) => {

		      	this.users.push({
		      		id : socket.id,
		      		userName : userName
		      	});

		      	let len = this.users.length;
		      	len--;

		      	this.io.emit('userList',this.users,this.users[len].id); 
		    });

		    socket.on('getMsg', (data) => {
		    	socket.broadcast.to(data.toid).emit('sendMsg',{
		    		msg:data.msg,
		    		name:data.name
		    	});
		    });

		    socket.on('disconnect',()=>{
		    	
		      	for(let i=0; i < this.users.length; i++){
		        	
		        	if(this.users[i].id === socket.id){
		          		this.users.splice(i,1); 
		        	}
		      	}
		      	this.io.emit('exit',this.users); 
		    });

		});

	}

	routesConfig(){
		this.appRoutes();
		this.socketEvents();
	}
}
module.exports = Routes;