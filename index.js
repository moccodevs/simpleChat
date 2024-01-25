const express = require('express');
const cors = require('cors');

const app = express();
const config = require('./config.server');
const user = require('./user/loginRoutes');
const dotenv = require ('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const loginValidations= require('./user/loginValidations');
const tokenValidations= require('./user/tokenValidations');
const dbOperations= require('./user/dbOperations');

app.use(express.static('public'));

const session = require('express-session');
app.use(session({
    secret: 'tu_secreto', // cadena secreta segura
    resave: false,
    saveUninitialized: true,
}));

//const io = socketIO(http.createServer(app));
app.use(cors());
dotenv.config();
const {connection}=require('./config.db');





app.use(user);


const server = app.listen(config.serverPort,config.serverListenUrl,()=> {
    console.log(`Servidor corriendo en "http://${config.serverListenUrl}:${config.serverPort}"`);
    connection.query(`UPDATE users SET token='no token', logged=0`,(error,results)=>{
        console.log(__dirname);
        if (error){
            console.log('Error al inicializar la base de datos');
        }
        else{
            console.log('base de datos inicializada');
        }
        
        
    })
});


const io=socketIO(server);

/*
io.use((socket, next) => {
    tokenValidations.validarToken((req,res,next) => {
        if (error) {
            console.log('token invalido');
        }
        console.log('Token válido:', data);
        next();
    });
});
*/
/*
io.use((socket, next) => {
    try{
        let sessionCookie = socket.handshake.headers.cookie;
        console.log(req);
        tokenValidations.validarToken(req,res,next);
    }
    catch(error)
    {
        sessionCookie='';
    }
    finally{
        
    }
    

    
    next();
    
});
*/

io.use((socket,next)=>{
    let sessionCookie = socket.handshake.headers.cookie;
    sessionCookie = decodeURIComponent(sessionCookie);
    const startIndex = sessionCookie.indexOf(":") + 1;
    const endIndex = sessionCookie.indexOf(".", startIndex);
    const sessionId = sessionCookie.slice(startIndex, endIndex);
    tokenValidations.validarTokenSocket(sessionId,next);
    socket.token=sessionId;
        
    }    
);

io.on('connection', (socket) => {
    const sessionId = socket.token;
    console.log('Nuevo usuario conectado socket:'+sessionId);
    

    let emisorUser;
    tokenValidations.getNombreByToken(sessionId)
    .then((nombreUsuario) => {
        emisorUser=nombreUsuario;
        console.log('Usuario conectado:'+emisorUser);
        socket.emit(`getIdentity`,emisorUser);
        socket.join(emisorUser);
    })
    .catch((error) => {
            console.log('Error:', error);
        
    });

    socket.on('toServer', (msg)=>{
        console.log('mensaje recibido:');
        msg.emisor=emisorUser;
        const {emisor,destination,message,fecha}=msg;
        console.log(msg);
        msg.emisor=emisorUser;
        let destinationToken;
        
        tokenValidations.getTokenByUsername(destination)
        .then((token) => {
            destinationToken=token;
            console.log('Token usuario receptor:', destinationToken);
        })
        .catch((error) => {
                console.log('Error:', error);
            
        })
        .then(()=>{
            console.log(message);
            //Una vez recopilados los datos necesarios, reenvía la información al usuario destino

            io.to(destination).emit('receiveMessage', {message:`${message}`,emisor:`${emisor}`,fecha:`${fecha}`});
            dbOperations.saveMsgToDb(msg)
            .then((msg)=>{
                console.log('Mensaje guardado')
            })
            .catch((error)=>{
                console.log(error);
            }
            )
        })
        
        

    })
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        
    });

    socket.on('getMessages', (destino, callback) => {
        let messages;
        console.log('Mensaje recibido: /getMessages'+destino);
        
        dbOperations.getMessages(emisorUser, destino)
            .then((results) => {
                messages = results;
                console.log('Devolviendo mensajes de ' + emisorUser + ':');
    
                callback(messages);
                // io.emit('obtenerAmigos', amigos);
            })
            .catch((error) => {
                console.log(error);
    
                callback(error);
            });
        
        // Resto del código...
    });

    socket.on('verAmigos', (callback) => {
        let usuarios;
        console.log('Mensaje recibido: verAmigos', callback);
        dbOperations.getAmigos(emisorUser)
        .then((results)=>{
            usuarios=results;
            console.log(results);
            console.log('Amigos de ' + emisorUser +':');
            console.log(usuarios);
            usuarios.forEach(usuario =>{
                if (usuario.usuario1==emisorUser){
                    usuario.amigo=usuario.usuario2;
                    
                }else{
                    usuario.amigo=usuario.usuario1;
                }
            })
           
            
            console.log(usuarios);
            callback(usuarios);
            //io.emit('obtenerAmigos', amigos);
        })
        .catch((error)=>{
            console.log(error);
            })
    })
});