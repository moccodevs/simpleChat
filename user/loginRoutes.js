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
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'tu_secreto', // cadena secreta segura
    resave: false,
    saveUninitialized: true,
}));

app.get('/login',loginValidations.isSesionInactive, (req, res) => {
    const sessionKey = req.sessionID;
    console.log(sessionKey);
    res.sendFile(__dirname + '/index.html');
});


app.post('/validate',tokenValidations.tokenExiste,loginValidations.validarUsuario,loginValidations.isSesionInactive,loginValidations.saveTokenToDb,(req, res) => {
    
    console.log('usuario logueado correctamente');
    
    const main = path.join(__dirname, '..');

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
    console.log('deslogueando a '+ usuario+'...');
    connection.query(`UPDATE users SET token='no token', logged=0 WHERE token='${sessionKey}' AND logged=1`,
    (error,results) => {
        if (results.affectedRows>0){
            console.log('deslogueado satisfactoriamente');
            res.status(200).send(`Usuario ${usuario}  deslogueado correctamente.`); 
        }
        else{
            res.status(200).send('Failed to unlog');
        }
              
    });
});

app.get('/chat', (req,res)=>{
    console.log('alguien llegó al chat');
    const main = path.join(__dirname, '..');
    res.sendFile(main+'/public/chatFront.html');
});

app.post('/homepage', (req, res) => {
  });

app.get('/home', (req,res)=>{
    res.sendFile(__dirname + '/home.html');
})

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