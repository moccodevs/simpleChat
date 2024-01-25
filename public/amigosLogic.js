    document.addEventListener('DOMContentLoaded', async () => {
        fetch('/config')
        .then(response => {
            if (!response.ok) {
            throw new Error('Error al obtener la configuración');
        }
            return response.json();
        })
        .then(config=>{
            const socket = io(`${config.serverUrl}:${config.serverPort}`);
            obtenerUsuariosConectados(socket)
            .then((usuarios)=>{
                llenarMenuDesplegable(usuarios);

                /*Fuerza a mostrar el chat inicial */
                $('#selectUsuarios').trigger('change')
                
            }).catch((error)=>{
                console.log('error al obtener usuarios');
            });
            return
        })
        .catch((error)=>{
            console.log(error);
        })

        
        
    });
    async function obtenerUsuariosConectados(socket) {
        return new Promise(resolve => {
            socket.emit('verAmigos', (usuarios) => {
                resolve(usuarios);
            });
        });
    }

    function llenarMenuDesplegable(usuarios) {
        const selectUsuarios = document.getElementById('selectUsuarios');

        usuarios.forEach(usuario => {
            const opcionUsuario = document.createElement('option');
            opcionUsuario.value = usuario.amigo;
            opcionUsuario.textContent = usuario.amigo;
            selectUsuarios.appendChild(opcionUsuario);
        });
    }

    function establecerChat() {
        const usuarioId = document.getElementById('selectUsuarios').value;

        if (usuarioId) {
            console.log(`Chat con el usuario ${usuarioId}`);
            // Puedes llamar a funciones adicionales para manejar el chat en el frontend
        } else {
            console.log("Selecciona un amigo para iniciar el chat.");
        }
    }