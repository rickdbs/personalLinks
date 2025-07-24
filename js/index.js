

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

            fetch('http://localhost:3333/locale',{
              method: 'POST',
              headers:{
                "Content-Type": "application/json"
              },
              body:JSON.stringify({
                latitude: "Latitude veio do Front",
                longitude: "Longitude veio do Front"
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
            console.error("Usuário negou a permissão de localização.");
            registrarIP()
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Informações de localização indisponíveis.");
            break;
          case error.TIMEOUT:
            console.error("Tempo esgotado ao tentar obter a localização.");
            break;
          case error.UNKNOWN_ERROR:
          default:
            console.error("Ocorreu um erro desconhecido ao obter a localização.");
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

    // Mostra no HTML (opcional)
    // document.getElementById("resultado").innerHTML = `
    //   IP: ${data.query} <br>
    //   Local: ${data.city}, ${data.regionName}, ${data.country}
    // `;

    // Envia os dados para o servidor
    // await fetch("http://localhost:3000/registrar-ip", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     ip: data.query,
    //     cidade: data.city,
    //     estado: data.regionName,
    //     pais: data.country,
    //     latitude: data.lat,
    //     longitude: data.lon,
    //     isp: data.isp
    //   })
    // });

  } catch (e) {
    // document.getElementById("resultado").textContent = "Erro ao obter IP";
    console.error(e);
  }
}

