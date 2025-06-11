
# Link Shortener

Este es un proyecto de un acortador de URLs construido utilizando **Express.js**, **SQLite3** y **shortid**. Permite a los usuarios acortar URLs largas y redirigirlas a sus versiones originales mediante una URL corta.

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

   La base de datos SQLite se crea automáticamente al ejecutar el proyecto, pero asegúrate de tener la carpeta `public` y la base de datos `linkshortener.db` en tu proyecto.

4. **Inicia el servidor**:

   Ejecuta el siguiente comando para iniciar el servidor:

   ```bash
   node app.js
   ```

   Esto iniciará el servidor en el puerto 8898.

5. **Configura Nginx** (si es necesario):

   Para configurar **Nginx** como servidor web, crea un archivo de configuración para tu dominio en `/etc/nginx/sites-available/` y luego crea un enlace simbólico en `/etc/nginx/sites-enabled/`.

   Archivo de configuración de Nginx (`/etc/nginx/sites/009-vcesar.conf`):

   ```nginx
   server {
       server_name vcesar.katzellc.com;

       root /var/www/vcesar;
       index index.html index.htm;

       location / {
           try_files $uri $uri/ =404;
       }

       # Error pages
       error_page 404 /404.html;
       location = /404.html {
           root /usr/share/nginx/html;
       }

       error_page 500 502 503 504 /50x.html;
       location = /50x.html {
           root /usr/share/nginx/html;
       }

       listen 443 ssl; # managed by Certbot
       ssl_certificate /etc/letsencrypt/live/vcesar.katzellc.com/fullchain.pem; # managed by Certbot
       ssl_certificate_key /etc/letsencrypt/live/vcesar.katzellc.com/privkey.pem; # managed by Certbot
       include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
   }

   server {
       if ($host = vcesar.katzellc.com) {
           return 301 https://$host$request_uri;
       } # managed by Certbot

       listen 80;
       server_name vcesar.katzellc.com;
       return 404; # managed by Certbot
   }
   ```

   Luego, habilita la configuración con:

   ```bash
   sudo ln -s /etc/nginx/sites-available/009-vcesar.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

   Asegúrate de tener configurados los certificados SSL a través de **Certbot** para HTTPS.

## Uso

Una vez que el servidor esté en funcionamiento, puedes realizar las siguientes acciones:

### Acortar una URL

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

Esto te redirigirá a la URL original que proporcionaste.

## Estructura del Proyecto

- `app.js`: Archivo principal que configura y ejecuta el servidor Express.
- `linkshortener.db`: Base de datos SQLite que almacena los enlaces cortos y sus URLs originales.
- `public/`: Carpeta destinada a los archivos estáticos (HTML, CSS, JS) que se pueden servir a los usuarios.

## Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js que facilita la creación del servidor.
- **SQLite3**: Base de datos ligera utilizada para almacenar los enlaces cortos y originales.
- **shortid**: Paquete utilizado para generar identificadores cortos y únicos para las URLs.
- **Nginx**: Servidor web utilizado para servir los archivos estáticos y manejar la redirección HTTPS.
- **Certbot**: Herramienta utilizada para gestionar certificados SSL de Let's Encrypt.

