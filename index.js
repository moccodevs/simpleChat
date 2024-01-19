const express = require('express');
const cors = require('cors');
const app = express();
const PORT= 3000;
const URL = '192.168.1.47';
const user = require('./user/loginRoutes');
const dotenv = require ('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const loginValidations= require('./user/loginValidations');
const tokenValidations= require('./user/tokenValidations');

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


const server = app.listen(PORT,URL,()=> {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
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
    

io.on('connection', (socket) => {
    let sessionCookie = socket.handshake.headers.cookie;
    sessionCookie = decodeURIComponent(sessionCookie);
    const startIndex = sessionCookie.indexOf(":") + 1;
    const endIndex = sessionCookie.indexOf(".", startIndex);
    const sessionId = sessionCookie.slice(startIndex, endIndex);

    console.log('Nuevo usuario conectado socket:'+sessionId);
    socket.emit(`getIdentity`,sessionId);
    socket.join(sessionId);
    socket.on('toServer', (msg)=>{
        console.log('mensaje recibido:');
        console.log(msg);
        const {userToken,destination,message}=msg;
        
        console.log(destination);
        console.log(message);
        //socket.emit(destination,message);
        io.to(destination).emit('receiveMessage', message);
    })
        
    
    // Manejar mensajes enviados por el cliente
    /*
    socket.on('sendMessage', (message) => {
        console.log('Mensaje recibido:', message);
        
        // Reenviar el mensaje a todos los clientes conectados
        io.emit('receiveMessage', { user: 'OtroUsuario', message: message });
    });
    // Manejar desconexiones de usuarios
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
    */
});