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
        function getMessages(destino) {
            
            console.log('Valor de destino:', destino);
            
            return new Promise(resolve => {
                socket.emit('getMessages', destino, (messages) => {
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
           
            myUsername = message;
            var div = document.getElementById("div");
            var divNuevo = document.createElement("bienvenido");
            divNuevo.id = "divNuevo";
            divNuevo.textContent = "Bienvenido: " + myUsername + "!";
            div.appendChild(divNuevo);
            let messages;
            const destino=document.getElementById('selectUsuarios').value;
            
            getMessages(destino)
                .then((destino)=>{
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
            $('#selectUsuarios').trigger('change');
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
                    
                    const destination = $('#selectUsuarios').val();
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
            

            $('#selectUsuarios').on('change',cargarMensajes);

            function cargarMensajes(){
                const destino = document.getElementById('selectUsuarios').value;
                console.log(destino)
                const contenedor = document.getElementById('messages-container');
                    contenedor.innerHTML = '';
                getMessages(destino)
                .then((messages)=>{
                    
                    setChat(messages,myUsername);
            
                    console.log(myUsername);
                })
                .catch((error)=>{
                    console.log(error);
                })
            }
        });
        
        
    })    
    .catch((error)=>{
        console.log(error);
    })
/******************************************************************AMIGOS*********************************************************** */
