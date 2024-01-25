
const { connection } = require ('../config.db');

const validarUsuario = (req,res,next)=>{
    const { usuario, contrasena } = req.body;
    console.log(req.body);
    connection.query(`SELECT username FROM users WHERE pass= '${contrasena}' AND username='${usuario}'`,
    (error,results) => {
        if (Object.keys(results).length==0){
            console.log('usuario invalido');
            res.status(401).redirect('/login');
        }
        else{
            console.log('usuario valido');
            next();
        }
        
    });
}

const isSesionInactive=(req,res,next)=>{
    
    const sessionKey = req.sessionID;
    try{
        connection.query(`SELECT logged FROM users WHERE token = '${sessionKey}' AND logged=1`,
    (error,results) => {
        
        console.log('sesion activa? largo: '+Object.keys(results).length );

        if (Object.keys(results).length>0){
            console.log('Sesion activa');

            res.status(401).redirect('/chat');
        }
        else{
            console.log('Sesion inactiva. OK');
            next();
        }
        
    });
    }
    catch(error){
        next();
    }
    
}


const unlogUser = (token,callback) => {
    return new Promise((resolve, reject) => {
        console.log('Deslogueando a ' + token + '...');
        connection.query(`UPDATE users SET token='no token', logged=0 WHERE token='${token}' AND logged=1`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.affectedRows > 0) {
                    resolve('Deslogueado satisfactoriamente');
                } else {
                    resolve(callback);
                }
            }
        );
    });
}

const saveTokenToDb=(req,res,next)=>{
    const sessionKey = req.sessionID;
    const { usuario, contrasena } = req.body;
/*
    connection.query(`UPDATE users SET token = ? WHERE username= ? AND logged=0`,[sessionKey, username]
*/    
    

    connection.query(`UPDATE users SET token = '${sessionKey}', logged=1 WHERE username= '${usuario}' AND logged=0 AND token != '${sessionKey}' `,
    (error,results) => {
        if (Object.keys(results).length>0){
            console.log(`Token '${sessionKey}' saved.`);
            next();  
        }
        else{
            res.status(401).send('Deslogueate para iniciar otra sesion!');
        }
    });
}

module.exports = {
    isSesionInactive,
    saveTokenToDb,
    validarUsuario,
    unlogUser
};