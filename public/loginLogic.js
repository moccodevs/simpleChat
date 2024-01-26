fetch('/config')
.then(response => {
    if (!response.ok) {
    throw new Error('Error al obtener la configuración');
}
    return response.json();
})
.then(config=>{
  console.log(config);
  loguear(config);
})
.catch(error => console.error('Error al obtener la configuración', error))

const loguear=(config)=>{
document.getElementById('send-button').addEventListener('click', function() {
const datosMensaje = {
    'usuario': $('#usuario').val(),
    'contrasena': $('#contrasena').val()
};
const solicitudConfig = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosMensaje)
};



fetch(config.serverUrl+'/validate',solicitudConfig)
  .then(response => {
  if (!response.ok) { 
      throw new Error(`Error de red: ${response.status}`);
    }
      return response.json();
  })
  
  .catch(error => {
    console.error('Error en la solicitud:', error);
  });
});
}