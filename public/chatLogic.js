const socket = io('http://192.168.1.47:3000');

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
                const fecha = currentObject.fecha;
              
                // Hacer algo con los valores, por ejemplo, imprimirlos
                console.log(`Emisor: ${emisor}, Destino: ${destination}, Mensaje: ${message}, Fecha: ${fecha}`);
                if (emisor!==myUsername){
                    socket.emit('receiveMessage',({message,emisor}));
                }
                else{
                    $('#messages-container').append('<div class="message-outcome-container"><div class="message-send">Tú: ' + message + '</div></div>');
                    $('#message-input').val('');
                    scrollDown();

                }

              }
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

            

            
            
                

            socket.on('receiveMessage',({message,emisor})=>{
            $('#messages-container').append(`<div class="message-income-container"><div class="message-income">${emisor}: ` + message + '</div></div>');
            scrollDown();
            })

            
            
        })
        

        $(document).ready(function() {
            // Función para enviar mensajes
            function sendMessage() {
                


                var message = $('#message-input').val();
                if (message.trim() !== '') {
                    $('#messages-container').append('<div class="message-outcome-container"><div class="message-send">Tú: ' + message + '</div></div>');
                    $('#message-input').val('');
                    scrollDown();
                    const destination = $('#destination-input').val();
                    const fechaActual = new Date();
                    const fechaNowFormateada = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
                    const data = {
                        emisor:sessionID,
                        destination:destination,
                        message:message,
                        fecha: fechaNowFormateada
                    }
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
