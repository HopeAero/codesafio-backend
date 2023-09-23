# 💻🐱‍🐉 CodeSafio UCAB 2024-15

![GitHub last commit](https://img.shields.io/github/last-commit/AlejandroJRosas/codesafio-backend)

<img src='codesafio.jpg'>

****
**Repositorio del Backend para el Proyecto de CodeSafio UCAB 2024-15**
****

# 📃 Requerimientos

### Para utilizar el backend necesita lo siguiente:

- Tener PostgreSQL instalado

- Clonar el repositorio y ejecutar el siguiente comando:

```pwsh
npm i
```

- Crear un archivo .env con el formato del .env.example

```rb
AUTH_SECRET=#EL SECRETO DE AUTENTICADO
AUTH_EXPIRE=#TIEMPO DE EXPIRACIÓN DEL TOKEN
AUTH_ROUNDS=#CANTIDAD DE ROUNDS PARA EL ENCRIPTADO [DEFAULT (10)]
PORT=#PUERTO PARA EL BACKEND [DEFAULT (3000)]
DBPORT=#PUERTO DE LA BASE DE DATOS DE POSTGRESQL [OBTENIDO EN LA INSTALACIÓN DE PG]
DBNAME=#NOMBRE DE LA BD
DBUSER=#NOMBRE DE USUARIO EN LA BD
DBHOST=#HOST DE LA BD
DBPASSWORD=#CONTRASEÑA DEL USUARIO EN LA BD
```

- Para ejecutar como Desarrollador

```pwsh
npm run dev
```

- Para buildear y ejecutar la build

```pwsh
npm start
```

# 🤙 Uso


Luego de tener el backend corriendo puedes hacer uso de *Postman* 👩‍🚀🚀 o servir los datos por medio de un frontend o aplicación al *puerto* que hayas colocado en el **.env**

<img src='cuchau.jpg'>

# ⭕ To-do
|| Descripción | Status |
| --- | --- | --- |
| ***Feature*** | Iniciando el Repositorio | 🔄 |
