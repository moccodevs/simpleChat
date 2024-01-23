fetch('/config')
.then(response => {
    if (!response.ok) {
    throw new Error('Error al obtener la configuración');
}
    return response.json();
})
.then(config=>{
  console.log(config);
  const socket = io(`${config.serverUrl}:${config.serverPort}`);


        let sessionID;
        var chatContainer = document.getElementById('messages-container');
        const scrollDown = ()=>{
            chatContainer.scrollTop = chatContainer.scrollHeight;
        };        
        const getMessages=()=>{

            return new Promise(resolve => {
                socket.emit('getMessages', (messages) => {
                    resolve(messages);
                    
                });
            });
        }
        const setChat = (messages,myUsername)=>{
            for (let i = 0; i < messages.length; i++) {
                const currentObject = messages[i];
                // Acceder a las propiedades del objeto actual
                const emisor = currentObject.emisor;
                const destination = currentObject.destino;
                const message = currentObject.mensaje;
                let fecha = currentObject.fecha;
                fecha=new Date(`${fecha}`);
                console.log(`Emisor: ${emisor}, Destino: ${destination}, Mensaje: ${message}, Fecha: ${fecha}`);
                if (emisor!=myUsername){
                    socket.emit('receiveMessage',{message:`${message}`,emisor:`${emisor}`});

                    colocarMensajeRecibido(emisor,message,fecha);
                }
                else{
                    colocarMensajeEnviado(message,fecha);
                    scrollDown();

                }

              }
        }

        const formatFecha=(fecha)=>{
            return fecha;
        }

        socket.on('getIdentity',(message)=>{
            //$('#messages-container').append('<div class="message">Mi token: ' + message + '</div>');
            $('#message-input').val('');
            myUsername = message;
            let messages;
            getMessages(messages)
                .then((messages)=>{
                    setChat(messages,myUsername);
                    console.log(myUsername);
                })
                .catch((error)=>{
                    console.log(error);
                })

            
            socket.on('receiveMessage',({message,emisor,fecha})=>{
                //fecha = formatFecha(fecha);
                colocarMensajeRecibido(emisor,message,fecha);
            })

            
            
        })
        
        
        const colocarMensajeEnviado = (mensaje,fecha)=>{
            const fechaContainer = '<div class="fecha-message">'+ getHoraYminutos(fecha) +'</div>';
            $('#messages-container').append('<div class="message-outcome-container"><div class="message-send">Tú: ' + mensaje +fechaContainer+ '</div></div>');
            $('#message-input').val('');
            scrollDown();
        }
        const colocarMensajeRecibido = (emisor,mensaje,fecha)=>{

            const fechaContainer = '<div class="fecha-message">'+ getHoraYminutos(fecha) +'</div>';
            $('#messages-container').append(`<div class="message-income-container"><div class="message-income">${emisor}: ` + mensaje + fechaContainer + '</div></div>');
            scrollDown();
        }

        const getHoraYminutos=(fecha)=>{
            const fechaObject=new Date(`${fecha}`);
            var minutosConDosDigitos = fechaObject.getMinutes() < 10 ? '0' + fechaObject.getMinutes() : fechaObject.getMinutes();
            return (fechaObject.getHours())+':'+minutosConDosDigitos;
        }

        $(document).ready(function() {
            // Función para enviar mensajes
            function sendMessage() {
                


                var message = $('#message-input').val();
                if (message.trim() !== '') {
                    
                    const destination = $('#destination-input').val();
                    const fechaActual = new Date();
                    
                    //const fechaNowFormateada = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
                    const data = {
                        emisor:sessionID,
                        destination:destination,
                        message:message,
                        fecha: fechaActual
                    }
                    colocarMensajeEnviado(message,data.fecha);
                    socket.emit('toServer', data);

                    // Puedes enviar el mensaje al backend aquí si es necesario
                }
            }

            // Evento al hacer clic en el botón de enviar
            $('#send-button').on('click', function() {
                sendMessage();
            });

            // Evento al presionar la tecla Enter en el campo de entrada
            $('#message-input').on('keypress', function(e) {
                if (e.which === 13) {
                    sendMessage();
                    
                }
            });
            
        });
    }).catch((error)=>{
        console.log(error);
    })
