# Velvet Studio · Prototipo funcional

Web de demostración para organización de eventos. Conserva la estructura de HTML, CSS y JavaScript del repositorio original y sus imágenes. No necesita instalación de dependencias para funcionar.

## Abrir con doble clic en Windows

1. Instala Node.js LTS una sola vez desde https://nodejs.org/en/download.
2. Si recibiste un ZIP, usa **Extraer todo** antes de abrir la carpeta.
3. Haz doble clic en **ABRIR-VELVET.bat**. El navegador se abre al estar lista la web.
4. Deja la ventana abierta o minimizada. Ciérrala para detener el servidor.

Consulta `LEEME-PRIMERO.txt` para las instrucciones sencillas. No necesitas Git ni instalar paquetes para usar una copia extraída del ZIP.

## Ejecutar desde terminal

Con Node.js instalado, desde esta carpeta:

```powershell
node serve.cjs
```

El navegador se abre con la dirección elegida. Se intenta **http://127.0.0.1:4173** y, si está ocupado, se elige otro puerto automáticamente. Copia la dirección que muestra la consola si necesitas abrirla manualmente. Detén el servidor con `Ctrl+C`. Si tienes npm, también puedes usar `npm start` y `npm run check`.

Usa el servidor local para que todas las páginas compartan el mismo almacenamiento. Evita abrirlas directamente con `file://`.

## Recorrido de presentación

1. En Inicio encontrarás una portada y un panel de seis acciones. Abre los planes, catálogo, galería o reservas desde sus tarjetas; cada opción aparece en una ventana modal.
2. Abre **Cotizar y reservar**. Cambia temática, colores, decoración, invitados y servicios.
3. Usa **VELVET10** para aplicar el descuento inicial del 10%. Los valores son ilustrativos en COP.
4. Selecciona fecha y lugar. Para una ubicación propia, escribe su dirección.
5. Pulsa **Este es mi plan** para elegirlo y pasar directamente a la personalización. Guarda una cotización o solicita una reserva con datos de prueba.
6. Desde la confirmación, pulsa **Simular pago ahora** o **Reservar y simular pago**. También puedes entrar a **Mi cuenta** con el mismo correo para retomar la reserva.
7. Elige **Nequi**, **Daviplata** o **tarjeta**. Simula un pago rechazado o aprobado, un anticipo del 30% o el saldo. Descarga el comprobante de texto.
8. Envía un mensaje desde Contacto y respóndelo en **Administración → Mensajes**. La respuesta aparece en la cuenta del cliente.
9. Cambia paquetes, promociones o fotografías desde el panel y vuelve al sitio para ver los cambios.
10. En **Administración → Configuración**, restablece los datos para una nueva presentación.

### Cuenta de ejemplo

**laura@demo.local** permite explorar una boda con reserva y anticipo. El acceso es una simulación por correo, sin contraseña. También puedes registrar otra cuenta local.

El portal administrativo está en `admin.html`. Entra con **angie@demo.local** para administrar el equipo y crear usuarios en **Usuarios y roles**. El acceso y los permisos son simulaciones locales por correo, sin contraseñas ni autenticación de producción.

## Funciones incluidas

- Portada con video local, botones, eventos destacados, promoción y testimonios ficticios identificados.
- Modo claro y oscuro persistente, navegación móvil y respeto a la preferencia de movimiento reducido.
- Categorías: cumpleaños de niño, niña y adultos; grados de niño y niña; graduaciones de bachillerato y universidad; bodas; quinceañeras; revelaciones de niño y niña; baby showers; bautizos; primeras comuniones; aniversarios; pedidas de mano; cenas románticas; empresariales y celebraciones especiales.
- Detalle de cada categoría con fotografía, inspiración y acceso al personalizador.
- Galería filtrable con fotografías, video y vista ampliada.
- Paquetes Esencial (básico), Especial, Signature (premium) y A tu manera (personalizado).
- Presupuesto dinámico: base para 30 invitados, $35.000 por invitado adicional, servicios y promoción configurable.
- Calendario por lugar, bloqueo de reservas duplicadas, fecha y ubicación.
- Cotizaciones, reservas, cancelaciones y consulta de saldos.
- Checkout con Nequi, Daviplata y formulario de tarjeta de crédito/débito; códigos de prueba, cuotas, resultados aprobado/rechazado y comprobantes descargables.
- Diseñador y vista previa de invitación digital, sorpresas, fotografía, catering y música.
- Cuenta de cliente con registro e historial de cotizaciones, reservas, pagos y respuestas.
- Usuarios del equipo con roles Administración, Coordinación, Finanzas y Contenido; perfiles activables/desactivables y herramientas por rol.
- Planes infantiles separados para niño y niña, ocho temáticas visuales y siete adicionales que actualizan el presupuesto.
- Presentación animada a pantalla completa en cada entrada y recarga, sonido ambiental opcional y opiniones en carrusel manual.
- Administración de clientes, eventos, reservas, calendario, estados, precios, promociones, pagos y galería.
- Fotos locales JPG, PNG o WebP de hasta 1 MB; edición de título y categoría.
- Reporte CSV descargable, búsqueda y filtros.
- WhatsApp y redes simulados dentro del sitio, contacto, preguntas frecuentes y cobertura ilustrativa.

## Almacenamiento y alcance

Los datos se guardan en `localStorage`, clave `velvet-demo-v1`, dentro de este navegador y origen. No se sincronizan entre dispositivos o navegadores. Recarga las páginas para ver cambios hechos en otra pestaña.

No hay base de datos, llamadas a APIs, pasarela de pagos, IA remota, mapas embebidos, CDN ni envío de correos o mensajes reales. No se piden números bancarios ni contraseñas. Usa únicamente información ficticia. Los comprobantes no tienen valor fiscal.

Los saldos muestran total menos pagos simulados. Cancelar una reserva libera la fecha y conserva su historial de pagos; no genera una devolución real. El panel permite modificar el total acordado de un evento, sin recalcular automáticamente sus invitados; nunca admite un total menor a lo ya pagado.

Las cotizaciones guardadas conservan sus precios aunque el administrador cambie los paquetes. El paquete personalizado tiene una base orientativa y admite las mismas opciones de personalización. La disponibilidad es una simulación por fecha y lugar, sin horarios parciales.

## Archivos principales

| Archivo | Responsabilidad |
| --- | --- |
| `index.html`, `eventos.css`, `eventos.js` | Sitio público y personalizador |
| `demo.js` | Datos, almacenamiento, calendario, pagos, comprobantes, WhatsApp simulado y animaciones |
| `ia.js`, `ia.css` | Velvet IA local: conversación, contexto, recomendaciones y acciones sobre el formulario |
| `cuenta.html`, `clientes.js` | Registro, acceso y cuenta del cliente |
| `admin.html`, `admin.js` | Acceso, resumen y lógica compartida del panel |
| `perfiles.js`, `usuarios.html` | Roles, acceso del equipo, creación y edición de perfiles |
| `catalogo.js`, `infantiles.js` | Temáticas infantiles y catálogo de adicionales |
| `experiencia.js` | Bienvenida, sonido sintetizado local y opiniones |
| `eventos.html`, `clientes.html`, `mensajes.html` | Gestión de eventos, clientes y conversaciones |
| `paquetes.html`, `pagos.html`, `fotografias.html` | Paquetes, promociones, pagos y galería |
| `reportes.html`, `configuracion.html` | Exportación y restablecimiento |
| `assets/eventos.mp4` | Video local de 12 segundos creado con imágenes originales |
| `serve.cjs` | Servidor estático local; no recibe ni guarda datos de la aplicación |
| `tools/verify.cjs` | Verificación de flujos con Playwright y Chrome |
| `tools/create-video.py` | Receta opcional para regenerar el video con imageio-ffmpeg |

`backend/`, los estilos antiguos que no están enlazados y las guías previas se conservan como referencia del proyecto original; **la demo no ejecuta el backend**. `ia.js` y `ia.css` ahora implementan el nuevo asistente local. No necesitas instalar Python ni configurar claves de Gemini.

## Verificación

La aplicación no tiene dependencias de ejecución. La prueba opcional `tools/verify.cjs` requiere Playwright y Chrome instalados, además del servidor local iniciado. Ejecuta `node tools/verify.cjs`, `node tools/verify-admin.cjs`, `node tools/verify-payments.cjs`, `node tools/verify-appearance.cjs` y `node tools/verify-portals.cjs`. Si Playwright está en una ruta externa, indica esa ruta en la variable `PLAYWRIGHT_MODULE`. Las capturas se escriben en `qa/` (no versionada).

Para regenerar el video, instala `imageio-ffmpeg` en `.runtime/` y ejecuta `python tools/create-video.py`. El MP4 generado ya está incluido; este paso no es necesario para presentar la web.

## Probar los medios de pago

- **Tarjeta:** pulsa **Completar con datos de prueba**. Puedes editar titular, número ficticio, vencimiento, CVV, tipo de tarjeta y cuotas de crédito. Se aceptan únicamente los números ficticios `4242 4242 4242 4242` y `5555 5555 5555 4444`, con vencimiento futuro y CVV de tres dígitos.
- **Nequi / Daviplata:** pulsa **Usar celular de prueba**, genera el código y escribe `123456`. El código es local y no se envía ningún SMS.
- Marca la casilla de demostración y confirma. Puedes elegir un resultado rechazado para probar el reintento.
- Cancelar, cerrar la ventana o pulsar Escape durante el procesamiento cancela la simulación sin registrar pagos.
- Solo se guardan el importe, la fecha, la referencia y el nombre del método. No se guardan los campos de tarjeta, celular o código. Los movimientos previos y datos existentes se conservan.

## Diseño y Velvet IA local

El tema claro usa contraste entre crema, ciruela, dorado y verde, con tarjetas delimitadas y formularios destacados. Los botones tienen cambios de color, brillo, elevación y respuesta al pulsar. Hay entradas al desplazarse y una barra de progreso. La preferencia de movimiento reducido del sistema desactiva las animaciones decorativas. El portal administrativo tiene un acceso visible en la cabecera, también en móvil.

Velvet IA es un asistente de reglas local, sin Gemini ni conexiones externas. Conserva hasta 30 mensajes por pestaña durante la sesión, reconoce tipos de celebración, invitados, presupuesto y planes, lee los precios/promociones actuales y consulta la disponibilidad real de los datos de esta demo. Puede llevar una propuesta al personalizador; el usuario debe revisar y guardar la cotización o reserva. No crea reservas ni pagos desde el chat. Permite reiniciar la conversación, usar preguntas sugeridas y navegar a cuenta, galería o contacto.

Prueba: escribe **Una boda para 60 invitados con 5 millones de presupuesto** y pulsa **Llevar mi idea al personalizador**. Para disponibilidad, indica fecha y lugar: **2027-06-20 en Jardín Velvet**.

## Portales y perfiles

Los accesos **Clientes** y **Administración** están junto al modo claro/oscuro; en móvil el acceso administrativo se abre desde **Equipo**. El registro público crea siempre un perfil Cliente. Un cliente no puede entrar al panel del equipo.

| Perfil de ejemplo | Rol | Herramientas |
| --- | --- | --- |
| angie@demo.local | Administración | Todas, incluidos usuarios y configuración |
| sofia@demo.local | Coordinación | Eventos, clientes, mensajes e informes |
| daniel@demo.local | Finanzas | Pagos, saldos e informes |
| camila@demo.local | Contenido | Paquetes, promociones y fotografías |
| laura@demo.local | Cliente | Su cuenta, cotizaciones, reservas y pagos |

No se necesitan contraseñas. Desde **Usuarios y roles**, Administración puede crear perfiles y cambiar rol o estado. No se permite desactivar o degradar el propio administrador ni dejar al sistema sin un administrador activo. Se conservan los datos locales anteriores mediante una migración. La restricción de secciones es parte del prototipo de interfaz, no una barrera de seguridad de servidor. Restablecer la demo también cierra la sesión del equipo.

## Infantil, bienvenida y ambiente

El catálogo tiene Batman, Cars, Marvel y dinosaurios en la selección de niño, y Barbie, princesas, Frozen y unicornios en la selección de niña. Es posible adaptar las opciones libremente. Al elegir una temática, se prepara la categoría, la paleta, el montaje y el plan Especial. Los adicionales (piñata, mesa dulce, personaje, taller, inflable, recuerdos y brillo) se suman al presupuesto y quedan guardados en la reserva.

La presentación ocupa toda la pantalla al entrar a Inicio y en cada recarga. Se puede saltar con el botón o Escape y se cierra sola después de 4,2 segundos (1,8 con movimiento reducido). El ambiente musical se sintetiza con Web Audio en el propio navegador; se activa solo al pulsar **Activar ambiente** o **Entrar con ambiente**, se puede silenciar y se pausa al ocultar la pestaña. Las opiniones se recorren con flechas, puntos, teclado o desplazamiento horizontal. Se respeta la preferencia de movimiento reducido.

Las imágenes de inspiración infantil fueron creadas con la herramienta integrada de generación de imágenes y se guardan en `assets/tematicas-infantiles.png` (atlas de ocho montajes). El prompt se conserva en `assets/tematicas-infantiles-prompt.txt`. La aplicación no llama a herramientas de generación de imágenes en ejecución.

## Navegación, galería y ubicación

El menú superior abre Eventos, Infantiles, Galería, Paquetes, Ubicación y Cotizar en modales. Debajo de la portada hay un panel compacto con seis tarjetas: planes, cotizar/reservar, mis reservas/pagos, infantiles, galería y ubicación. Los enlaces secundarios abren servicios, opiniones, contacto y preguntas frecuentes. En celular hay una barra fija para cotizar, abrir el catálogo o ir a las reservas; el asistente queda encima de esta barra. El formulario tiene enlaces a sus tres bloques y un acceso a fecha/datos desde el resumen.

Elegir un paquete lleva directamente al formulario, sin diálogo intermedio. En la vista ampliada de una foto se puede pulsar **Quiero una celebración así** para preparar la categoría correspondiente.

La galería inicial tiene **30 fotografías y un video**. Los montajes de quince años, cumpleaños, grados, baby shower, revelación, boda, empresa y conciertos están identificados por su contenido. Se incorporaron imágenes específicas para bautizo, primera comunión, pedida de mano y cumpleaños de 40, además de las ocho temáticas infantiles. La actualización corrige los ejemplos incluidos y conserva las fotos subidas por el usuario; no se agregan duplicados al recargar. `inspiracion.js` comparte esta biblioteca entre el sitio y el administrador.

Las cuatro imágenes nuevas se generaron con la herramienta integrada `image_gen` y se guardan en `assets/celebracion-bautizo.png`, `assets/celebracion-comunion.png`, `assets/celebracion-romance.png` y `assets/celebracion-adultos.png`. Los prompts exactos están en `assets/celebraciones-prompts.txt`. Son imágenes de inspiración de una demo, no fotografías de eventos realmente realizados.

**¿Dónde puedes encontrarnos?** usa un mapa SVG local inspirado en la presentación de un mapa de calles. Muestra el Parque de la 93 como referencia de demostración en Bogotá, sin afirmar que allí exista una sede del negocio. Permite elegir Aeropuerto El Dorado, Centro histórico, Portal Norte o Chía y acercar/alejar el esquema. Las líneas son ilustrativas, sin escala, tráfico ni instrucciones viales reales. El botón **Consultar ruta en Google Maps** abre, solamente al pulsarlo, una pestaña externa con origen y destino. Esa consulta externa requiere internet; la demo no integra API de mapas ni carga recursos remotos automáticamente. Lógica: `ubicacion.js`.

El video local se regeneró a **1280 × 720, 30 fps**, con encuadres fijos y disolvencias suaves. Se eliminó el zoom por cuadro que producía temblores. Termina con el mismo encuadre inicial para mantener la continuidad al repetir.

Verificación adicional: `node tools/verify-navigation.cjs` comprueba presentación al entrar/recargar y cierre automático, cuatro orígenes, zoom y enlaces, recursos de galería, selección desde foto y paquete, cinco anchos, barra móvil y reproducción del MP4. Los recursos visuales y los datos funcionan localmente.

## Inicio compacto y navegación por ventanas

`secciones.js` traslada las once secciones existentes a un contenedor oculto y muestra solamente la elegida dentro de un `<dialog>` accesible. Se reutilizan los mismos elementos, formularios y controladores; la cotización conserva los datos al ir a otra sección y volver. La portada conserva su video y presenta un panel de acciones en lugar de apilar todas las secciones.

El modal tiene título, cierre visible, navegación rápida entre **Planes**, **Cotizar** y **Mis reservas y pagos**, desplazamiento interno y bloqueo del fondo. Se puede cerrar con Escape o pulsando fuera de la ventana. El foco vuelve al acceso original al cerrar. En celular ocupa la pantalla para aprovechar el espacio. Los detalles de una foto, confirmaciones y pagos siguen abriéndose sobre la sección activa; al cerrarlos se vuelve al contexto anterior.

**Mis reservas y pagos** incluye registro, entrada a la cuenta, reservas, saldos y comprobantes sin salir de Inicio. `clientes.js` expone `ClientPortal.render()` y sirve tanto para este modal como para la página independiente `cuenta.html`. Todos comparten el mismo estado local; no se usan iframes ni servicios remotos.

Los enlaces `#paquetes`, `#cliente`, `#personaliza`, `#fechaEvento` y el resto de secciones siguen funcionando al abrirlos directamente, después de la presentación de bienvenida. Atrás/Adelante del navegador recupera la ventana correspondiente. Las acciones del asistente abren también estas ventanas.

Prueba específica: `node tools/verify-modals.cjs`, que comprueba las once secciones, selección de plan, datos conservados, reserva/pago, acceso y registro del cliente, navegación desde fotos/temáticas, Escape, historial, enlaces directos y cinco tamaños de pantalla. Las pruebas anteriores se adaptaron a abrir la sección antes de interactuar con ella.

## Presentaciones con varios proyectos y puertos ocupados

El lanzador (`ABRIR-VELVET.bat`, `node tools/start-demo.cjs`, `node serve.cjs` o `npm start`) intenta iniciar en 127.0.0.1:4173. Si el puerto está ocupado o no está permitido, intenta los nueve siguientes; si todos fallan, solicita al sistema operativo un puerto libre. Abre el navegador con el puerto realmente obtenido, sin que el usuario tenga que editar código o detener otros proyectos.

Si encuentra esta misma copia de Velvet ya funcionando entre esos puertos, abre su dirección. Identifica la carpeta mediante una huella local en la cabecera `X-Velvet-Instance`; otra carpeta de Velvet o una aplicación distinta no se reutiliza. Una aplicación que no responde no bloquea indefinidamente el arranque. El puerto se reserva al iniciar el servidor, evitando el intervalo entre comprobar y utilizar un puerto. Nunca se cierran procesos ajenos. Una política del equipo que impida iniciar cualquier servidor local todavía puede impedir la ejecución.

Para preparar el PC de exposición: instalar Node.js, disponer de Chrome/Edge u otro navegador actual, extraer completamente el ZIP y probar el lanzador antes de la presentación. No se necesitan Git, npm install ni conexión a internet para los flujos de la demo; el enlace opcional a Google Maps sí necesita internet. Mantener la ventana del servidor abierta mientras se presenta y usar la dirección que muestra, que puede diferir entre PCs.

Los datos de localStorage pertenecen al navegador y al origen (dirección y puerto). Si se cambia de puerto, las cuentas y reservas guardadas en otro puerto no se trasladan; se muestran los ejemplos iniciales. Para conservar los datos de una sesión, mantener abierto el mismo servidor y volver a su misma dirección.

Para pruebas o una preferencia explícita se puede establecer `VELVET_PORT` (1024–65535); `VELVET_NO_BROWSER=1` evita abrir el navegador. La prueba `node tools/verify-launcher.cjs` usa puertos aislados y comprueba inicio normal, reutilización, copia ajena, conflictos múltiples, servidor sin respuesta y puerto elegido por el sistema. No detiene la demo abierta en 4173.

## Si Windows no abre el navegador

El lanzador imprime siempre la URL del puerto activo. `tools/open-browser.cjs` solicita la apertura en Windows con `cmd.exe /d /c start` y, si ese comando falla, intenta `Start-Process` con PowerShell. Un fallo al abrir el navegador no detiene el servidor. Si se ha configurado `VELVET_NO_BROWSER=1`, se indica explícitamente que la apertura automática está desactivada.

Cada inicio actualiza `ABRIR-ENLACE.html` en la misma carpeta. Si el navegador no apareció, se puede hacer doble clic en ese archivo: redirige al puerto realmente seleccionado e incluye un enlace visible como alternativa. El servidor debe permanecer abierto. El archivo se genera en el PC de destino y está excluido de Git y del ZIP, para no distribuir una dirección de otro equipo. Si la carpeta no permite escribirlo, la URL sigue disponible en la consola.

No se puede confirmar que una ventana se haya mostrado solo porque Windows acepte la solicitud. Si no aparece, abre el HTML de enlace o pega la dirección impresa en Chrome/Edge. `node tools/verify-browser.cjs` comprueba los comandos, el segundo intento, el fallo controlado y la validación de URLs locales, sin abrir navegadores durante las pruebas automáticas.
