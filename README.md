<a id="inicio-readme"></a>

<div align="center">

# ✨ Velvet Eventos

### Tu idea. Tu celebración. Una experiencia para imaginarla.

**Prototipo funcional para organizar eventos, personalizar planes y simular reservas y pagos.**

🎨 Claro y oscuro · 📱 Adaptable · 🪟 Navegación en modales · 💾 Datos locales

[🚀 Ejecutar](#ejecutar) · [🎉 Explorar funciones](#funciones) · [👥 Cuentas de prueba](#cuentas) · [🛠️ Resolver problemas](#ayuda)

<img src="imagen1.png" alt="Montaje de quince años con flores, luces y decoración Velvet" width="850" />

</div>

> 🧪 **Es una demostración:** las cuentas, cotizaciones, reservas, conversaciones y pagos son simulados. No se procesa dinero ni se envían mensajes reales. Utiliza datos ficticios.

## 🧭 Explora este README

Pulsa los enlaces para navegar y las secciones **▶** para desplegar los detalles.

| Quiero…                                     | Ir a…                                           |
| ------------------------------------------- | ----------------------------------------------- |
| Entender para qué sirve                     | [🎯 Objetivo](#objetivo)                        |
| Abrir la web en mi computador               | [🚀 Instalación y ejecución](#ejecutar)         |
| Preparar una exposición con otros proyectos | [🎤 Modo presentación y puertos](#presentacion) |
| Saber qué incluye                           | [🎉 Funcionalidades](#funciones)                |
| Entrar como cliente o administrador         | [👥 Cuentas y roles](#cuentas)                  |
| Recorrer una demostración completa          | [🧪 Ruta de prueba](#recorrido)                 |
| Entender las carpetas y los datos           | [📁 Contenido del proyecto](#contenido)         |
| Solucionar un inconveniente                 | [🛠️ Preguntas y soluciones](#ayuda)             |

<a id="objetivo"></a>

## 🎯 ¿Cuál es el objetivo?

**Velvet Eventos**, presentado en la interfaz como **Velvet Studio**, permite mostrar cómo sería una plataforma de organización de celebraciones: descubrir ideas, elegir un paquete, personalizarlo, consultar una fecha, reservar y simular el pago.

Está pensado para **exposiciones académicas, demostraciones de producto y pruebas de experiencia de usuario**. La portada reúne las acciones principales; el contenido se abre en ventanas modales para evitar una página llena de secciones verticales.

| Para quien organiza su evento     | Para el equipo del estudio         |
| --------------------------------- | ---------------------------------- |
| Explorar estilos y fotografías    | Gestionar clientes y celebraciones |
| Personalizar una propuesta        | Administrar planes y promociones   |
| Cotizar, reservar y simular pagos | Revisar pagos y saldos simulados   |
| Consultar su historial            | Crear usuarios y asignar roles     |

<a id="ejecutar"></a>

## 🚀 ¿Cómo ejecutar el proyecto?

### 🧰 Lo que necesitas

- Un computador con un navegador como **Chrome o Edge**.
- **Node.js LTS** instalado: [descargar desde su sitio oficial](https://nodejs.org/en/download).
- La carpeta **completa y extraída** del proyecto.

**No necesitas instalar paquetes con `npm install`, configurar una base de datos, usar Python ni conseguir claves de APIs para ejecutar la demo.** Git solo hace falta si eliges descargar mediante clonación.

### 🪟 Opción recomendada: doble clic en Windows

1. **Descarga el proyecto.** En este repositorio, pulsa **Code → Download ZIP**. Si es privado, entra primero con una cuenta que tenga acceso.
2. **Extrae el ZIP.** Haz clic derecho sobre él y selecciona **Extraer todo**. Espera a que termine; no abras los archivos desde la ventana del comprimido.
3. **Abre la carpeta extraída.** Debes encontrar juntos `index.html`, `serve.cjs`, la carpeta `tools` y **`ABRIR-VELVET.bat`**.
4. **Ejecuta `ABRIR-VELVET.bat` con doble clic.** Si Windows oculta las extensiones, puede aparecer como `ABRIR-VELVET`.
5. **Conserva abierta la ventana del servidor.** Puedes minimizarla mientras presentas la web.
6. **Usa la dirección que muestra esa ventana.** El lanzador intenta abrirla en el navegador automáticamente.

> 🌐 **¿No apareció el navegador?** Con el servidor todavía abierto, haz doble clic en **`ABRIR-ENLACE.html`**, que se genera en esa misma carpeta. También puedes copiar la dirección que aparece en la consola y pegarla en Chrome o Edge.

**Para detenerla:** cierra la ventana del servidor o pulsa `Ctrl+C`. Cerrar únicamente la pestaña del navegador no apaga el servidor.

<details>
<summary><strong>▶ 💻 Prefiero abrirla desde una terminal</strong></summary>

Abre una terminal **dentro de la carpeta que contiene `serve.cjs`** y ejecuta:

```bash
node serve.cjs
```

También puedes utilizar:

```bash
npm start
```

Ambos usan el mismo lanzador con selección automática de puerto. Copia la URL impresa si el navegador no se abre. Este método también sirve para iniciar el proyecto en macOS o Linux con Node.js instalado; el archivo BAT está pensado para Windows.

Para comprobar que Node.js está disponible:

```bash
node --version
```

</details>

<details>
<summary><strong>▶ 🌿 Quiero descargarlo usando Git</strong></summary>

Necesitas Git instalado y acceso a este repositorio privado. Ejecuta estos comandos en orden:

```bash
git clone https://github.com/santiagosanchez1099-arch/velvet-eventos.git
cd velvet-eventos
git switch main
node serve.cjs
```

Si GitHub solicita autenticación, utiliza tu acceso configurado para GitHub. **No necesitas poner credenciales en los archivos del proyecto.**

</details>

<a id="presentacion"></a>

## 🎤 Preparar la exposición

### 🔌 ¿Y si otro proyecto está usando el puerto?

La dirección habitual es `http://127.0.0.1:4173`, pero **el número puede cambiar**:

1. El lanzador intenta usar `4173`.
2. Si está ocupado o no está permitido, prueba los puertos siguientes.
3. Si esos también están ocupados, solicita uno disponible al sistema operativo.
4. Muestra y solicita abrir **el enlace con el puerto realmente elegido**.

✅ No tienes que editar código ni cerrar los otros proyectos. Si encuentra esta misma copia ya funcionando, reutiliza su dirección; otra carpeta de Velvet se considera una copia distinta.

> 🔗 **El enlace depende del puerto.** No memorices siempre `4173`: utiliza el que aparece en la ventana o abre `ABRIR-ENLACE.html` después de iniciar el servidor.

**Antes de presentar:**

- [ ] Instalar Node.js en el computador que se utilizará.
- [ ] Extraer completamente el ZIP.
- [ ] Abrir el lanzador y comprobar que carga la web.
- [ ] Probar una reserva y un pago ficticio.
- [ ] Mantener abierta la ventana del servidor durante la demostración.

Los flujos simulados y los recursos visuales funcionan sin internet una vez preparado el equipo. El botón opcional de **Google Maps** sí abre un servicio externo y necesita conexión. Las restricciones de ejecución del computador pueden impedir iniciar un servidor, por lo que conviene probar en el equipo definitivo.

<a id="funciones"></a>

## 🎉 ¿Qué incluye?

| Área               | Lo que puedes probar                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| 🏠 Inicio          | Presentación animada a pantalla completa, video local estable y panel de seis acciones      |
| 🪟 Navegación      | Secciones en modales, cierre con Escape, accesos rápidos e historial Atrás/Adelante         |
| 🎨 Apariencia      | Tema claro/oscuro, animaciones, botones interactivos y diseño adaptable                     |
| 💎 Planes          | Esencial, Especial, Signature y A tu manera, con precios ilustrativos en COP                |
| 🧸 Infantil        | Planes de niño y niña, ocho temáticas visuales y catálogo de adicionales                    |
| 🖼️ Inspiración     | 30 fotografías y un video iniciales, filtros, ampliación y acceso a cotizar desde una foto  |
| ✨ Personalización | Celebración, temática, colores, decoración, invitados, presupuesto y servicios              |
| 📅 Reservas        | Calendario por lugar, disponibilidad simulada y validación de conflictos de fecha           |
| 💳 Pagos           | Nequi, Daviplata, tarjeta de crédito/débito, anticipo, saldo y comprobantes descargables    |
| 👤 Cliente         | Registro, acceso por correo e historial de cotizaciones, reservas, pagos y conversaciones   |
| 🔐 Administración  | Clientes, eventos, usuarios y roles, planes, promociones, pagos, fotografías e informes CSV |
| 💌 Extras          | Invitaciones digitales, sorpresas, fotografía, catering, música y adicionales infantiles    |
| 💬 Velvet IA       | Asistente de reglas local que orienta y lleva propuestas al personalizador                  |
| 📍 Ubicación       | Mapa ilustrativo de Bogotá, cuatro orígenes y enlace opcional a indicaciones en Google Maps |
| 🎵 Ambiente        | Sonido opcional sintetizado en el navegador y opiniones en carrusel                         |

<details>
<summary><strong>▶ 🎈 Ver todas las celebraciones y temáticas infantiles</strong></summary>

**Celebraciones:** cumpleaños de niño, niña y adultos; grados de niño y niña; graduaciones de bachillerato y universidad; bodas; quinceañeras; revelaciones de sexo de niño y niña; baby showers; bautizos; primeras comuniones; aniversarios; pedidas de mano; cenas románticas; eventos empresariales y celebraciones especiales.

**Temáticas infantiles:** Batman, Cars, Marvel, dinosaurios, Barbie, princesas, Frozen y unicornios. Las propuestas pueden adaptarse a otros gustos desde el personalizador.

**Adicionales infantiles:** piñata, mesa dulce, show de personaje, taller creativo, inflable, recuerdos y estación de brillo. Se suman al presupuesto y quedan incluidos en la reserva simulada.

</details>

<a id="cuentas"></a>

## 👥 Cuentas y roles de prueba

**No necesitas contraseñas.** El acceso por correo es parte de la simulación.

| Correo              | Rol               | ¿Dónde entrar y qué hacer?                                          |
| ------------------- | ----------------- | ------------------------------------------------------------------- |
| `laura@demo.local`  | 👤 Cliente        | **Mis reservas y pagos**: explorar una boda con reserva y anticipo  |
| `angie@demo.local`  | 🛡️ Administración | **Administración / Equipo**: acceso completo y creación de usuarios |
| `sofia@demo.local`  | 📋 Coordinación   | Eventos, clientes, mensajes e informes                              |
| `daniel@demo.local` | 💰 Finanzas       | Pagos, saldos e informes                                            |
| `camila@demo.local` | 🎨 Contenido      | Paquetes, promociones y fotografías                                 |

También puedes crear una cuenta desde el registro público. Para crear perfiles del equipo, entra como Administración y abre **Usuarios y roles**. Los permisos son una demostración de interfaz, no autenticación de producción.

<a id="recorrido"></a>

## 🧪 Una demostración de principio a fin

1. **💎 Elegir un plan:** abre la tarjeta del inicio y pulsa **Este es mi plan**.
2. **✨ Personalizar:** cambia celebración, temática, colores, invitados y adicionales. El total se actualiza mientras eliges.
3. **🏷️ Aplicar la promoción:** el código inicial `VELVET10` aplica el 10 % mientras esté activo; puede cambiarse desde Administración.
4. **📅 Elegir fecha y lugar:** completa tus datos ficticios y una fecha disponible. Si eliges tu propia ubicación, escribe su dirección.
5. **📝 Guardar o reservar:** guarda una cotización o solicita la reserva. Si una fecha ya está reservada en ese lugar, el sistema indica el conflicto.
6. **💳 Simular el pago:** desde la confirmación abre el pago y selecciona un método de prueba.
7. **🧾 Consultar el resultado:** entra a **Mis reservas y pagos** con el correo utilizado y revisa el saldo o el comprobante.
8. **🔐 Mostrar la gestión:** entra con `angie@demo.local` para ver el evento, administrar perfiles o modificar la oferta.

<details>
<summary><strong>▶ 💳 Datos para probar tarjeta, Nequi y Daviplata</strong></summary>

**Tarjeta de prueba**

- Pulsa **Completar con datos de prueba** para llenar el formulario.
- Se admiten los números ficticios `4242 4242 4242 4242` y `5555 5555 5555 4444`.
- Usa un vencimiento futuro y un CVV de tres dígitos.
- Puedes seleccionar crédito/débito, cuotas de crédito y un resultado aprobado o rechazado.

**Nequi o Daviplata de prueba**

- Pulsa **Usar celular de prueba**.
- Solicita el código y escribe **`123456`**.
- No se envía ningún SMS.

Marca la casilla de demostración y confirma. Puedes simular un anticipo del 30 %, el total o el saldo disponible. Los campos de tarjeta, celular y código no se guardan en el historial de pagos. **No introduzcas información bancaria real.**

</details>

<details>
<summary><strong>▶ 💬 Qué preguntarle a Velvet IA</strong></summary>

Prueba con estas frases:

- «¿Qué paquetes y precios tienen?»
- «Una boda para 60 invitados con 5 millones de presupuesto»
- «¿Cómo puedo pagar con Nequi?»
- «Quiero un cumpleaños de niña para 40 personas»

El asistente lee los planes y datos actuales de la demo. Puede preparar el personalizador, pero debes revisar y guardar la cotización o reserva. Funciona mediante reglas locales; no se conecta a Gemini ni a otro modelo remoto.

</details>

<a id="contenido"></a>

## 📁 Contenido del proyecto

**Tecnologías:** HTML, CSS y JavaScript para la interfaz; Node.js con módulos integrados para servir los archivos. El servidor estático no almacena los datos de la aplicación.

<details>
<summary><strong>▶ 🗂️ Abrir el mapa de archivos</strong></summary>

| Archivo o carpeta              | Función                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `index.html`                   | Entrada principal de la web                                                         |
| `eventos.css`, `eventos.js`    | Diseño, eventos, paquetes y formulario de cotización                                |
| `secciones.js`                 | Panel de acciones y navegación mediante modales                                     |
| `demo.js`                      | Datos simulados, almacenamiento, calendario, pagos y comprobantes                   |
| `perfiles.js`, `usuarios.html` | Roles y administración de perfiles                                                  |
| `catalogo.js`, `infantiles.js` | Temáticas y adicionales infantiles                                                  |
| `inspiracion.js`               | Biblioteca de fotografías y categorías corregidas                                   |
| `experiencia.js`               | Bienvenida, sonido ambiental y opiniones                                            |
| `ia.js`, `ia.css`              | Asistente local Velvet IA                                                           |
| `ubicacion.js`                 | Mapa ilustrativo y enlaces de ruta                                                  |
| `cuenta.html`, `clientes.js`   | Cuenta del cliente, como página o dentro de un modal                                |
| `admin.html`, `admin.js`       | Acceso y herramientas del equipo                                                    |
| Otras páginas HTML del panel   | Eventos, clientes, mensajes, paquetes, pagos, fotografías, informes y configuración |
| `assets/`                      | Video, imágenes de inspiración y prompts de los recursos generados                  |
| `serve.cjs`                    | Servidor estático local                                                             |
| `ABRIR-VELVET.bat`             | Lanzador de Windows                                                                 |
| `tools/start-demo.cjs`         | Selección de puerto e inicio de la demo                                             |
| `tools/open-browser.cjs`       | Solicitud de apertura al navegador del sistema                                      |
| `tools/verify*.cjs`            | Verificaciones opcionales del proyecto                                              |
| `LEEME-PRIMERO.txt`            | Instrucciones breves para la copia descargada                                       |
| `docs/GUIA-TECNICA.md`         | Documentación técnica complementaria                                                |
| `backend/`                     | Referencia del proyecto original; no es necesario ejecutarlo                        |

`ABRIR-ENLACE.html` se crea automáticamente al iniciar y no se incluye en Git: su dirección depende del computador y del puerto elegido.

</details>

### 💾 ¿Dónde se guardan los datos?

En **`localStorage` del navegador**, bajo la clave `velvet-demo-v1`. Los datos pertenecen al navegador y a la dirección completa utilizada, **incluido el puerto**.

- Recargar conserva los datos mientras no se borre el almacenamiento.
- Otro computador, navegador o puerto tendrá datos independientes.
- No hay sincronización entre equipos ni base de datos remota.
- El registro no envía correos y los pagos no transfieren dinero.
- El mapa local es un esquema; el Parque de la 93 es una referencia de demostración, no una sede comercial confirmada.

Para volver a los ejemplos iniciales: **Administración → Configuración → Restablecer demo**. Esta opción elimina los cambios guardados en ese origen y cierra las sesiones simuladas.

<details>
<summary><strong>▶ 🔍 Verificaciones para quienes desarrollan</strong></summary>

Comprobación de sintaxis de los cuatro scripts principales definidos en `package.json`:

```bash
npm run check
```

Pruebas del lanzador y de sus comandos de apertura, sin instalar paquetes adicionales:

```bash
node tools/verify-launcher.cjs
node tools/verify-browser.cjs
```

Las pruebas de interfaz son opcionales y necesitan **Playwright y Chrome**, además de un servidor de la demo en `http://127.0.0.1:4173`:

```bash
node tools/verify.cjs
node tools/verify-admin.cjs
node tools/verify-payments.cjs
node tools/verify-portals.cjs
node tools/verify-appearance.cjs
node tools/verify-navigation.cjs
node tools/verify-modals.cjs
```

Si Playwright está en una ruta externa, configura `PLAYWRIGHT_MODULE`. Las capturas se guardan en `qa/`, una carpeta excluida de Git. Estas herramientas **no son necesarias para abrir o presentar la web**.

</details>

<a id="ayuda"></a>

## 🛠️ Preguntas y soluciones

<details>
<summary><strong>▶ La página queda en blanco</strong></summary>

Extrae **toda** la carpeta del ZIP, no únicamente `index.html`. Ejecuta `ABRIR-VELVET.bat` o `node serve.cjs` desde la carpeta del proyecto y utiliza la dirección impresa. No abras la web desde dentro del comprimido. Si continúa el problema, comprueba que estén presentes las carpetas `assets` y `tools` y los archivos JavaScript.

</details>

<details>
<summary><strong>▶ Se abre la consola, pero no el navegador</strong></summary>

No cierres la consola. Abre **`ABRIR-ENLACE.html`** o copia la dirección completa que aparece en ella y pégala en Chrome o Edge. Ese archivo se genera al iniciar; no debes buscarlo antes de ejecutar el lanzador.

Si la consola indica `VELVET_NO_BROWSER=1`, la apertura automática está desactivada mediante esa variable del entorno.

</details>

<details>
<summary><strong>▶ Aparece «node no se reconoce»</strong></summary>

Instala [Node.js LTS](https://nodejs.org/en/download). Cierra la consola anterior y vuelve a abrir el lanzador. Puedes comprobar la instalación con `node --version` en una terminal nueva.

</details>

<details>
<summary><strong>▶ Dice «no se puede acceder a este sitio»</strong></summary>

Comprueba que la ventana del servidor siga abierta. Utiliza la URL que muestra **ese inicio**, ya que el puerto puede cambiar. Si cerraste el servidor, vuelve a ejecutar el lanzador y abre el enlace actualizado.

</details>

<details>
<summary><strong>▶ El BAT no aparece o el equipo no permite ejecutarlo</strong></summary>

Comprueba que extrajiste la carpeta completa del repositorio. Si Node.js está instalado, puedes abrir una terminal en esa carpeta y ejecutar `node serve.cjs`. Si el computador impide ejecutar servidores locales, consulta a la persona responsable del equipo; no es necesario desactivar sus protecciones para usar el proyecto.

</details>

<details>
<summary><strong>▶ Mis reservas desaparecieron al cambiar de enlace</strong></summary>

Revisa que estés usando el mismo navegador y puerto. `http://127.0.0.1:4173` y `http://127.0.0.1:4174` tienen almacenamientos independientes. Inicia sesión con el mismo correo en el origen donde creaste la reserva.

</details>

<details>
<summary><strong>▶ ¿Necesito internet, base de datos o una cuenta de pagos?</strong></summary>

La demo no necesita base de datos, cuenta bancaria, credenciales de APIs ni internet durante sus flujos locales. La descarga inicial de Node.js y del proyecto sí requiere conexión, al igual que el enlace opcional a Google Maps. Las imágenes y el video incluidos se sirven desde la carpeta del proyecto.

</details>

---

📖 [Consultar la guía técnica](docs/GUIA-TECNICA.md) · 📝 [Leer las instrucciones rápidas](LEEME-PRIMERO.txt) · ⬆️ [Volver al inicio](#inicio-readme)

**✨ Velvet Eventos · Una demo para explorar, personalizar y celebrar.**
