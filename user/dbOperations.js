const { connection } = require ('../config.db');

const getAmigos = (usuario)=>{
    return new Promise((resolve, reject) => {
        connection.query(`SELECT usuario1,usuario2 FROM amigos WHERE usuario1='${usuario}' OR usuario2='${usuario}'`,
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
    
    fechaFormateada=formatearFecha(fecha);

    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO chats(emisor,destino,mensaje,fecha) VALUES('${emisor}','${destination}','${message}','${NOW()}')`,
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
const getMessages = (emisor,destinatario) => {
    console.log('emisor: '+emisor);
    console.log('destinatario: '+ destinatario);
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM chats WHERE (emisor='${emisor}' AND destino='${destinatario}') OR (emisor='${destinatario}' AND destino='${emisor}')`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (results.length > 0) {
                    for (const rowDataPacket of results) {
                        
                        let timeZoneArg=new Date(`${rowDataPacket.fecha}`);
                        //timeZoneArg.setHours(timeZoneArg.getHours()-3);
                        
                        rowDataPacket.fecha = timeZoneArg;
                      }
                    resolve(results);
                }
            }
        );
    });
}

function formatearFecha(fecha) {
    return new Date('2024-01-26T01:42:10.019Z').toISOString().slice(0, 19).replace('T', ' ');
  }

module.exports = {
        getAmigos,
        saveMsgToDb,
        getMessages
    };