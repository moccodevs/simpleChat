const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require ('dotenv');
const http=require('http');
dotenv.config();
const { connection } = require ('../config.db');
const loginValidations= require('./loginValidations');
const tokenValidations= require('./tokenValidations');
const path = require('path');
const config = require('../config.server');

app.get('/config', (req, res) => {
    console.log(config);
    const conf={
        serverUrl:`${config.serverUrl}`,
        serverPort:`${config.serverPort}`
    }
    res.status(200).json(conf);
  });

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'tu_secreto', // cadena secreta segura
    resave: false,
    saveUninitialized: true,
}));




app.get('/login',loginValidations.isSesionInactive, (req, res) => {
    const main = path.join(__dirname, '..');
    res.sendFile(main+'/public/index.html');
});
app.post('/login',loginValidations.isSesionInactive, (req, res) => {
    const sessionKey = req.sessionID;
    console.log(sessionKey);
    res.redirect('/login');
});

app.post('/validate',tokenValidations.tokenExiste,loginValidations.validarUsuario,loginValidations.isSesionInactive,loginValidations.saveTokenToDb,(req, res) => {    
    console.log('usuario logueado correctamente');
    res.status(202).redirect('/chat');
  });

app.use(tokenValidations.validarToken);



app.get('/desloguear', (req, res) => {
    console.log('deslogueando');
    const sessionKey = req.sessionID;
    console.log(sessionKey);
    res.sendFile(__dirname + '/logout.html');
});

app.post('/desloguear', (req, res) => {
    const sessionKey = req.sessionID;
    const { usuario, contrasena } = req.body;
    loginValidations.unlogUser(sessionKey,()=>{res.status(200).send('Failed to unlog')})
    .then((result) => {
        console.log(result);
        
        res.status(200).redirect('/login');
    })
    .catch((error) => {
        console.error(error); // Maneja el error aquí
    });

});

app.get('/chat', (req,res)=>{
    console.log('alguien llegó al chat');
    const main = path.join(__dirname, '..');
    res.sendFile(main+'/public/chatFront.html');
});

app.get('/testAmigos', (req,res)=>{
    console.log('alguien llegó al chat');
    const main = path.join(__dirname, '..');
    res.sendFile(main+'/public/amigos.html');
});

  /*
app.get('/login',(req,res)=>{
    console.log(req.session.cookie);

    res.json({
        text:'logged',
        token: 'token1'
        });
});
*/

app.get('/getusers', (req,res)=>{
    connection.query("SELECT * FROM `users`",
    (error,results) => {
        if (error)
            throw error;
        console.log("Se muestran los usuarios.");
        res.status(200).json(results);
    });
})

app.post('/sendMessage', (req,res)=>{
    const {contenido}=req.body;
    console.log(contenido);

    res.status(200);
})


module.exports = app;