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


const server = app.listen(config.serverPort,config.serverUrl,()=> {
    console.log(`Servidor corriendo en el puerto ${config.serverPort}`);
    connection.query(`UPDATE users SET token='no token', logged=0`,(error,results)=>{
        console.log(__dirname);
        if (error){
            console.log('no se pudo inicializar la base');
        }
        console.log('base inicializada');
    })
});


const io=socketIO(server);

/*
io.use((socket, next) => {
    // Llama al middleware y pásale el socket u otros datos necesarios
    tokenValidations.validarToken((req,res,next) => {
        if (error) {
            // Maneja el error, por ejemplo, puedes usar 'next' con un argumento de error
            console.log('token invalido');
        }
        // Puedes hacer algo con los datos si es necesario
        console.log('Token válido:', data);
        next();
    });
});
*/
/*
io.use((socket, next) => {
    // Llama al middleware y pásale el socket u otros datos necesarios
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
    //busca en la base de datos el nombre de usuario emisor mediante su token
    tokenValidations.getNombreByToken(sessionId)
    .then((nombreUsuario) => {
        emisorUser=nombreUsuario;
        console.log('Usuario conectado:'+emisorUser);
        socket.emit(`getIdentity`,emisorUser);
        socket.join(emisorUser);
        // En este bloque .then(), puedes acceder al nombre de usuario resuelto
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
        
        //busca en la base de datos el token del usuario receptor dado su nombre de usuario
        tokenValidations.getTokenByUsername(destination)
        .then((token) => {
            destinationToken=token;
            // En este bloque .then(), puedes acceder al nombre de usuario resuelto
            console.log('Token usuario receptor:', destinationToken);
            // Puedes continuar con la lógica usando el nombre de usuario
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
    socket.on('getMessages',(callback)=>{
        let messages;
        console.log('Mensaje recibido: /getMessages');
        dbOperations.getMessages(emisorUser)
        .then((results)=>{
            messages=results;
            console.log(messages);
            console.log('Devolviendo mensajes de ' + emisorUser +':');

            callback(messages);
            //io.emit('obtenerAmigos', amigos);
        })
        .catch((error)=>{
            console.log(error);
        });
        
        // Reenviar el mensaje a todos los clientes conectados
    })

    socket.on('verAmigos', (callback) => {
        let amigos;
        console.log('Mensaje recibido:', callback);
        dbOperations.getAmigos(emisorUser)
        .then((results)=>{
            amigos=results;
            console.log(results);
            console.log('Amigos de ' + emisorUser +':');
            console.log(amigos);
            callback(amigos);
            //io.emit('obtenerAmigos', amigos);
        })
        .catch((error)=>{
            console.log(error);
            })
    })
});