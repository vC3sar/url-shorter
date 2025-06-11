document.getElementById("shortenForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const originalUrl = document.getElementById("originalUrl").value;
  const resultDiv = document.getElementById("result");
  const shortUrlSpan = document.getElementById("shortUrl");
  const copyButton = document.getElementById("copyButton");

  const response = await fetch("https://link.katzellc.com/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (response.ok) {
/*    const data = await response.json();
    shortUrlSpan.textContent = `https://link.katzellc.com/${data.shortUrl}`;
    resultDiv.style.display = "block";
*/
 const data = await response.json();

    // Crear el enlace completo con el dominio
    const fullShortUrl = `https://link.katzellc.com/${data.shortUrl}`;

    // Convertir shortUrlSpan en un <a> clickeable
    shortUrlSpan.innerHTML = `<a href="${fullShortUrl}" target="_blank">${fullShortUrl}</a>`;

    // Hacer visible el div con el enlace
    resultDiv.style.display = "block";

    // Configurar el botón de copiar
    copyButton.onclick = function() {
      // Copiar el enlace al portapapeles
      navigator.clipboard.writeText(fullShortUrl)
        .then(() => {
          alert('Enlace copiado al portapapeles');
        })
        .catch(err => {
          alert('Error al copiar el enlace: ', err);
        });
    };
  } else {
    alert("Error al acortar la URL");
  }
});

