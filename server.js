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
    path: '/{name}',
    handler:function (request, reply) {
    	proxy: {
            host: 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+SteamAPIKey+'&vanityurl='+request.params.name
        }

        reply.view('index', { nickname: request.params.name }); //enviamos a la vista el "nickname"
        

    }
});



// ============================================================ // 

//Info de conexion en consola 
server.start(() => {
    console.log('Servidor corriendo en:', server.info.uri);
});