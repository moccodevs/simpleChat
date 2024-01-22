const { connection } = require ('../config.db');

const getAmigos = (usuario)=>{
    return new Promise((resolve, reject) => {
        connection.query(`SELECT usuario2 FROM amigos WHERE usuario1='${usuario}'`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.length > 0) {
                    
                    resolve(results);
                } else {
                    resolve('Usuario sin amigos :(');
                }
            }
        );
    });
}

const saveMsgToDb = (msg) => {
    const {emisor,destination,message,fecha}=msg;
    console.log('mensaje a guardar:'+msg);
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO chats(emisor,destino,mensaje,fecha) VALUES('${emisor}','${destination}','${message}','${fecha}')`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.length > 0) {
                    
                    resolve(results);
                }
            }
        );
    });
}
const getMessages = (username) => {
    
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM chats WHERE emisor='${username}' or destino='${username}'`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.length > 0) {
                    for (const rowDataPacket of results) {
                        // Formatear la fecha antes de imprimir
                        //rowDataPacket.fecha = formatearFecha(rowDataPacket.fecha);
                        console.log(results);
                      }
                    resolve(results);
                }
            }
        );
    });
}

function formatearFecha(fecha) {
    const opcionesDeFormato = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Intl.DateTimeFormat('es-ES', opcionesDeFormato).format(fecha);
  }

module.exports = {
        getAmigos,
        saveMsgToDb,
        getMessages
    };