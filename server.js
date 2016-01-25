/* Reto-2-Backend-CU2016 
 * 
 * Enero 2016 - HackSpace.la
 * Brayan Cruces Castillo
 *
 */


// Modulos 
var Hapi = require('hapi');
var Vision = require('vision');
var Path = require('path');
var H2o2 = require('h2o2'); // Comunicacion con Steam Web API
var Wreck = require('wreck'); // Leer JSON


var SteamID = require('steamid');

var server = new Hapi.Server();

// My key
var SteamAPIKey = '99F44A562B42CD25E33699FEBF407773'; 

// Conexion
server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});

server.register(Vision, function () {});

server.register(H2o2, function () {});

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'templates')
});


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('home');
        
    }
});

server.route({
    method: 'GET',
    path: '/{nickname}',
    handler: function (request, reply)  {
    	

        reply.proxy({ 

	        mapUri: function (request, callback) {

	        	console.log('Accediendo al API de Steam.');
	        	callback(null, 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+SteamAPIKey+'&vanityurl='+request.params.nickname);
	        }, 

	        onResponse: function (err, res, request, reply, settings, ttl) {

	        	console.log('Recibiendo respuesta');
	        	Wreck.read(res, { json: true }, function (err, payload) {

	        		    console.log('Manipulamos el payload (json), y lo enviamos a la vista.')
                        
                        // Verificar existencia
	        		    if (payload.response.success == 1) {
                           var sid = new SteamID(payload.response.steamid);
                           var SteamID_new = sid.getSteam2RenderedID();

	        		       reply.view('index', { nickname: request.params.nickname, steamid64: payload.response.steamid, steamid: SteamID_new });
	        		    }

	        		    else{
                          reply.view('no-id', { nickname: request.params.nickname });

	        		    }              

	                });
	        } 
        });


        
        

    }
});





// ============================================================ // 

//Info de conexion en consola 
server.start(() => {
    console.log('Servidor corriendo en:', server.info.uri);
});