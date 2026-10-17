# Velvet Studio · Prototipo funcional

Web de demostración para organización de eventos. Conserva la estructura de HTML, CSS y JavaScript del repositorio original y sus imágenes. No necesita instalación de dependencias para funcionar.

## Ejecutar

Con Node.js instalado, desde esta carpeta:

```powershell
node serve.cjs
```

Abre **http://127.0.0.1:4173**. Detén el servidor con `Ctrl+C`. Si tienes npm, también puedes usar `npm start` y `npm run check`.

Usa el servidor local para que todas las páginas compartan el mismo almacenamiento. Evita abrirlas directamente con `file://`.

## Recorrido de presentación

1. Recorre Inicio, las 19 categorías, la galería y los cuatro paquetes.
2. Abre **Diseña tu evento**. Cambia temática, colores, decoración, invitados y servicios.
3. Usa **VELVET10** para aplicar el descuento inicial del 10%. Los valores son ilustrativos en COP.
4. Selecciona fecha y lugar. Para una ubicación propia, escribe su dirección.
5. Guarda una cotización o solicita una reserva con un nombre, correo y teléfono de prueba.
6. Entra a **Mi cuenta** con el mismo correo. Confirma la reserva si guardaste una cotización.
7. Simula un pago rechazado o aprobado, un anticipo del 30% y el pago del saldo. Descarga el comprobante de texto.
8. Envía un mensaje desde Contacto y respóndelo en **Administración → Mensajes**. La respuesta aparece en la cuenta del cliente.
9. Cambia paquetes, promociones o fotografías desde el panel y vuelve al sitio para ver los cambios.
10. En **Administración → Configuración**, restablece los datos para una nueva presentación.

### Cuenta de ejemplo

**laura@demo.local** permite explorar una boda con reserva y anticipo. El acceso es una simulación por correo, sin contraseña. También puedes registrar otra cuenta local.

El panel administrativo está abierto intencionalmente para la demo en `admin.html`. No ofrece seguridad ni autenticación de producción.

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
- Checkout con tarjeta ficticia de débito o crédito, resultados aprobado/rechazado y comprobantes descargables.
- Diseñador y vista previa de invitación digital, sorpresas, fotografía, catering y música.
- Cuenta de cliente con historial de cotizaciones, reservas, pagos y respuestas.
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
| `demo.js` | Datos, almacenamiento, calendario, pagos, comprobantes y chat local |
| `cuenta.html`, `clientes.js` | Registro, acceso y cuenta del cliente |
| `admin.html`, `admin.js` | Resumen y lógica compartida del panel |
| `eventos.html`, `clientes.html`, `mensajes.html` | Gestión de eventos, clientes y conversaciones |
| `paquetes.html`, `pagos.html`, `fotografias.html` | Paquetes, promociones, pagos y galería |
| `reportes.html`, `configuracion.html` | Exportación y restablecimiento |
| `assets/eventos.mp4` | Video local de 12 segundos creado con imágenes originales |
| `serve.cjs` | Servidor estático local; no recibe ni guarda datos de la aplicación |
| `tools/verify.cjs` | Verificación de flujos con Playwright y Chrome |
| `tools/create-video.py` | Receta opcional para regenerar el video con imageio-ffmpeg |

`backend/`, `ia.js`, los estilos antiguos y las guías previas se conservan como referencia del proyecto original; **la demo no los carga ni los ejecuta**. No necesitas instalar Python ni configurar claves de Gemini.

## Verificación

La aplicación no tiene dependencias de ejecución. La prueba opcional `tools/verify.cjs` requiere Playwright y Chrome instalados, además del servidor local iniciado. Ejecuta `node tools/verify.cjs` y `node tools/verify-admin.cjs`. Si Playwright está en una ruta externa, indica esa ruta en la variable `PLAYWRIGHT_MODULE`. Las capturas se escriben en `qa/` (no versionada).

Para regenerar el video, instala `imageio-ffmpeg` en `.runtime/` y ejecuta `python tools/create-video.py`. El MP4 generado ya está incluido; este paso no es necesario para presentar la web.
