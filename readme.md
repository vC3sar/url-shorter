# Link Shortener v1

### Acortador de enlaces fácil de usar
**Solo descarga y ejecuta**

![Descripción de la imagen](https://i.ibb.co/0yxSWFK0/Captura-de-pantalla-2025-06-10-220150.png)

Demo: [link.katzellc.com](https://link.katzellc.com/)

Este proyecto es un acortador de URLs construido con **Express.js**, **SQLite3** y **shortid**. Permite a los usuarios acortar enlaces largos y redirigirlos a sus versiones originales mediante URLs cortas.

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/)
- [Nginx](https://www.nginx.com/)

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

1. **Clona el repositorio o descarga los archivos del proyecto**:

   ```bash
   git clone https://github.com/vC3sar/url-shorter.git
   cd link-shortener
   ```

2. **Instala las dependencias**:

   Ejecuta el siguiente comando en la terminal para instalar las dependencias del proyecto:

   ```bash
   npm install
   ```

3. **Configura la base de datos**:

   La base de datos SQLite se creará automáticamente al ejecutar el proyecto. Asegúrate de que las carpetas `public` y el archivo `linkshortener.db` estén presentes en el proyecto.

4. **Inicia el servidor**:

   Ejecuta el siguiente comando para iniciar el servidor:

   ```bash
   node app.js
   ```

   Esto iniciará el servidor en el puerto 8898.

5. **Configura Nginx** (si es necesario):

   Si deseas usar **Nginx** como servidor web, crea un archivo de configuración para tu dominio en `/etc/nginx/sites-available/` y luego crea un enlace simbólico en `/etc/nginx/sites-enabled/`.

   Archivo de configuración de Nginx (`/etc/nginx/sites-available/008-shortlink.conf`):

   ```nginx
   server {
       server_name link.tudominio.com;

       location / {
           proxy_pass http://localhost:8898;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       listen 443 ssl; # managed by Certbot
       ssl_certificate /etc/letsencrypt/live/link.tudominio.com/fullchain.pem; # managed by Certbot
       ssl_certificate_key /etc/letsencrypt/live/link.tudominio.com/privkey.pem; # managed by Certbot
       include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
   }

   server {
       if ($host = link.tudominio.com) {
           return 301 https://$host$request_uri;
       } # managed by Certbot

       listen 80;
       server_name link.tudominio.com;
       return 404; # managed by Certbot
   }
   ```

   Luego, habilita la configuración con:

   ```bash
   sudo ln -s /etc/nginx/sites-available/008-shortlink.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

   Asegúrate de haber configurado los certificados SSL mediante **Certbot** para habilitar HTTPS.

## Uso

Una vez que el servidor esté funcionando, puedes realizar las siguientes acciones:
### Ve al sitio web en linea
**Web**: `https://tu.dominio.com`
Si no usas nginx la conexión sera por http

### Acortar una URL con API (metodo 2)

Envía una solicitud **POST** a la siguiente ruta para acortar una URL:

**Endpoint**: `http://localhost:8898/shorten`

**Cuerpo de la solicitud (JSON)**:

```json
{
  "originalUrl": "https://www.ejemplo.com"
}
```

**Respuesta**:

```json
{
  "originalUrl": "https://www.ejemplo.com",
  "shortUrl": "abcd1234"
}
```

### Redirigir a la URL original

Para acceder a la URL original, simplemente visita la URL corta generada. Por ejemplo:

**URL corta**: `http://localhost:8898/abcd1234`

Esto te redirigirá automáticamente a la URL original que proporcionaste.

## Estructura del Proyecto

- `app.js`: Archivo principal que configura y ejecuta el servidor Express.
- `linkshortener.db`: Base de datos SQLite que almacena los enlaces cortos y sus URLs originales.
- `public/`: Carpeta destinada a los archivos estáticos (HTML, CSS, JS) que se sirven a los usuarios.

## Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js que facilita la creación del servidor.
- **SQLite3**: Base de datos ligera utilizada para almacenar los enlaces cortos y originales.
- **shortid**: Paquete utilizado para generar identificadores cortos y únicos para las URLs.
- **Nginx**: Servidor web utilizado para servir los archivos estáticos y manejar la redirección HTTPS.
- **Certbot**: Herramienta utilizada para gestionar certificados SSL de Let's Encrypt.

