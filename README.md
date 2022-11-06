# ProyectoJAP
Proyecto de e-commerce de Jovenes a Programar (JaP) de Iván Arriola @ivan1arriola

## Gestion de perfiles
Los perfiles de usuarios se almacenan en el almacenamiento local con la key "profiles", como un array de perfiles.
Un perfil tiene los siguientes atributos
~~~
profile = { name, name2, lastName, lastName2, email, telephone, picture }
~~~

- **Nombre**
- Segundo nombre 
- **Apellido**
- Segundo apellido
- **E-mail** - *Obligatorio y sive de ID*
- Telefono
- Foto de perfil

En la pagina de **login** se puede ingresar con un email ya registrado o con uno sin registrar.
En caso de ingresar con un email no registrado con anterioridad, se crea un nuevo perfil con ese email y se agrega al
array de perfiles en el almacenamiento local.

Si se inicia sesion con Google y el perfil asociado no existe, se crea un nuevo perfil con los campos nombre, apellido, email y foto de perfil completados con los datos proporcionados por Google.

El atributo email del perfil es el que se usa para acceder a un perfil en especifico, sirviendo como ID.
No pueden haber dos perfiles con el mismo email asociado.

En la pagina de **my-profile** se puede actualizar los datos del perfil del usuario actual. Para actualizar, los
datos obligatorios deben de tener valor.

## Iniciar Sesion

El estado de sesion iniciada se gestiona en el almacenamiento local, a traves de la key "user".
En esta key se almacena el email del usuario que este con la sesión activa.

En caso de no haber usuario con la sesion activa, se redirigira automaticamente a la pagina de login.

Tambien se puede loguear utilizando una cuenta de Google

## Gestion de Carrito
Carrito

##
