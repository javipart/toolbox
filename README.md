
# Toolbox Test

Proyecto desarrollado con JavaScript
- React para el front
- Node para el API

## Despliegue en Local

- Clonar el Proyecto
- Se puede desplegar ingresando a cada carpeta `/api` y `/web` y en cada una usar el comando `npm start`.
- También se puede hacer ingresando el comando `docker-compose up --build -d` para desplegar los 2 servicios de forma sencilla.
- Ingresar, desde el navegador, a `http://localhost:3000/`.
- Se va a visualizar en la página inicial una tabla con el conenido de los archivos procesados por la API
- Se puede buscar por nombre, la búsqueda solo se va a realizar si el archivo existe, en caso de que no muestra un error.

## Funcionamiento de la API

La api, en su primer interacción con la api externa, solicita la lista de archivos, luego los descarga, guardando cada uno en una carpeta temporal, los procesa para extraer la data, luego esa data se guarda en caché

- En las solicitudes futuras, va a verificar la caché, la cual expira en 1 hora
- Existe un cron, que se ejecuta cada hora, para descargar los archivos, validar si hay cambios, a través de un hash, si los hay, se reemplaza por el nuevo contenido, si no, el archivo sigue igual.
- Existe un endpoint para listar todos los archivos, el cual usa el front para validar en la búsqueda por queryParams, si existe o no, para evitar el consumo innecesario de la API


