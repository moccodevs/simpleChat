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
    validarTokenSocket
};