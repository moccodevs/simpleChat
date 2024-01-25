const dotenv=require('dotenv');
const mysql=require('mysql');
let connection;

connection = mysql.createConnection(
    /*{port:process.env.PORT,
    host:process.env.DBHOST,
    user:process.env.DBUSER,
    database:process.env.DBNAME,
    password:process.env.DBPASS}*/
    process.env.connectionUri
);

connection.connect((error)=>{
    if (error){
        console.log("Error al conectar con la base de datos.");
        console.log(error);
    }
    else{
        console.log("--Base de datos conectada.");
    }
})

module.exports={connection};