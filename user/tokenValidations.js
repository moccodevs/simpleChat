const { connection } = require ('../config.db');

const tokenExiste = (req,res,next)=>{
    const sessionKey = req.sessionID;
    connection.query(`SELECT token FROM users WHERE token= '${sessionKey}'`,
    (error,results) => {
        if (Object.keys(results).length>0){
            
            console.log('token no existe'+results);
            res.status(400).redirect('/login')
        }
        else{
            console.log('token existe');
            next();
        }
    });
}
const validarTokenSocket = (token,next) =>{
   
    console.log('validando token');
    connection.query(`SELECT username FROM users WHERE token= '${token}'`,
    (error,results) => {
        if (error){
            console.log('error al validar token');
            return false;
        }
        else{
            if (Object.keys(results).length>0){
                console.log(`Credenciales OK para chat `);
                next();
            }
            else{
                console.log('token invalido para chat');
                return false;
            }
        }

    });

}

const getNombreByToken = (sessionKey) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT username FROM users WHERE token= '${sessionKey}'`, (error, results) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);
                reject('Error interno del servidor');
            }
            if (results.length > 0) {
                const user = results[0].username;
                console.log('Token existe');
                resolve(user);
            }
        });
    });
};

const getTokenByUsername = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT token FROM users WHERE username= '${user}'`, (error, results) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);
                reject('Error interno del servidor');
            }
            if (results.length > 0) {
                const token = results[0].token;
                console.log('Usuario existe');
                resolve(token);
            }
        });
    });
};

/*
const getNombreByToken = (token) =>{
    connection.query(`SELECT username FROM users WHERE token= '${token}'`,
    (error,results) => {
        if (error){
            console.log(error);
            return;
        }
        else{
            if (Object.keys(results).length>0){
                console.log(results);
                const user = results[0].username;
                return user;
            }
            else{
                return 'Anonimo';
            }
        }
    });
}
*/
const validarToken=(req,res,next)=>{
    let sessionKey='';
    try{
        sessionKey = req.sessionID;
    }
    catch(err){
        console.log('error validacion token:')
        console.log(err);
        res.status(401).redirect('/login');
    }
    
    console.log('validando token');
    connection.query(`SELECT username FROM users WHERE token= '${sessionKey}'`,
    (error,results) => {
        if (error){
            res.status(401).redirect('/login');
            return;
        }
        else{
            if (Object.keys(results).length>0){
                console.log(`Credenciales OK `);
                next();
            }
            else{
                res.status(401).redirect('/login');
            }
        }

    });
}

module.exports= {
    tokenExiste,
    validarToken,
    validarTokenSocket,
    getNombreByToken,
    getTokenByUsername
};