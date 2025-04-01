# WAI Es Un Asistente Virtual de Productividad Ofimática

Este proyecto es una aplicación web de inteligencia artificial diseñada para potenciar la productividad en entornos de oficina. Actúa como un asistente virtual inteligente, capaz de comprender y ejecutar tareas complejas mediante la interacción con archivos, servicios web y APIs integradas. La aplicación utiliza modelos de IA para interpretar el contexto, generar respuestas y automatizar procesos, brindando soporte en la redacción, organización y gestión de información.

---

## Integraciones

### Office 365 Tools
- Word
- Excel
- PowerPoint
- Outlook
- OneDrive
- Power BI
### Google Workspace Tools
- Gmail
- Google Calendar
- Google Drive
- Google Docs
- Google Sheets
- Google Meet
- Google Forms
- Google Sites


### Integración con modelos de lenguaje avanzados para el procesamiento y generación de contenido. 

- **API Deepseek**   
- **API Perplexity**   
- **API GPTs** 
- **API Gemini** 


---

## Funciones de la IA

### Comprensión del Contexto

- **Interpretación de Instrucciones:**  
  La aplicación entiende solicitudes en lenguaje natural, como "Resume este documento PDF" o "Crea una hoja de cálculo con estos datos".
  
- **Acceso a Datos Relevantes:**  
  Capacidad para acceder a información en archivos locales (con permisos), en la nube (Google Drive, OneDrive, etc.), páginas web o aplicaciones específicas.
  
- **Mantenimiento del Estado:**  
  Conserva el contexto de la conversación o tarea actual, facilitando la ejecución de acciones secuenciales y relacionadas.

### Interacción con el Entorno (Protocol / Model Interaction)

- **Navegación Web:**  
  Capacidad para abrir páginas, interactuar con formularios y extraer información estructurada o no estructurada.

- **Manipulación de Archivos:**  
  - **Creación:** Genera documentos (texto, hojas de cálculo, presentaciones) basados en plantillas o instrucciones.  
  - **Lectura:** Abre y extrae contenido de formatos como PDF, DOCX, XLSX, CSV, TXT, entre otros.  
  - **Modificación:** Edita archivos existentes añadiendo texto, actualizando datos o formateando documentos.  
  - **Organización:** Renombra, mueve, copia o elimina archivos, siempre respetando los permisos y la seguridad.

- **Integración con Aplicaciones:**  
  Potencial interacción con APIs de software de oficina (como Microsoft Graph API o Google Workspace APIs) para enviar correos, agendar reuniones y más.

### Procesamiento y Generación (Model)

- **Utilización de Modelos de IA:**  
  Emplea modelos de lenguaje para:
  - Resumir textos.
  - Generar borradores (correos, informes).
  - Traducir contenido.
  - Extraer información clave.
  - Analizar datos en hojas de cálculo.
  - Tomar decisiones sobre acciones a seguir.

- **Planificación de Tareas:**  
  Descompone solicitudes complejas en pasos ejecutables, facilitando la automatización y ejecución de tareas.

- **Seguridad y Permisos:**  
  Acceso y modificación de archivos y servicios web de forma segura, respetando las restricciones y permisos del usuario.

---

## Enfoques de Implementación

###  Opción 1: Enfoque Cliente con "Graceful Degradation"

- **Descripción:**  
  Diseñado para Single Page Applications (SPAs), esta opción utiliza la mejor API disponible y recurre a una opción universal si la preferida falla.

- **Flujo en el Cliente:**  
  1. Recibe el contenido de la IA en la SPA.
  2. Verifica el soporte para la File System Access API (`window.showSaveFilePicker`).
  3. Si está soportado, muestra un botón "Guardar Informe" que permite al usuario seleccionar la ubicación y nombre del archivo.  
  4. Convierte el contenido en un Blob y lo escribe en el archivo seleccionado.  
  5. Si no está soportado, ofrece un botón "Descargar Informe" que:
     - Convierte el contenido en un Blob.
     - Crea una URL de objeto.
     - Simula un clic en un enlace temporal para iniciar la descarga.
     - Libera la URL del objeto.


### Opción 2: Enfoques de servidor por next (API) 

- **Descripción:**  
  Utiliza la arquitectura de Next.js para separar la lógica del frontend y backend, moviendo la generación de archivos al servidor.

- **Flujo en el Servidor y Cliente:**  
  1. **Ruta de API:**  
     - Crea un endpoint (por ejemplo, `/api/generar-informe`) que recibe la solicitud del frontend.
     - Llama a la API de IA para obtener el contenido o datos del informe.
     - Genera el archivo en el formato deseado (PDF, CSV, DOCX, etc.) usando librerías de Node.js.
     - Configura las cabeceras HTTP (`Content-Type` y `Content-Disposition`) para forzar la descarga en el navegador.
     - Envía el archivo en la respuesta.
  2. **Frontend:**  
     - Realiza una simple llamada (usando `fetch` o `axios`) a la ruta de API.
     - El navegador, gracias a las cabeceras, inicia la descarga automáticamente.


## Utilidades Adicionales del Asistente

### Asistencia Activa y Gestión

- **Recordatorios y Alarmas:**  
  Establece recordatorios basados en lenguaje natural (ej. "Recuérdame llamar al médico mañana a las 10 AM").

- **Gestión de Calendario:**  
  Programa eventos, envía invitaciones y verifica la disponibilidad mediante integraciones con servicios como Google Calendar.

- **Búsqueda y Filtrado de Información:**  
  Busca y filtra información específica en la web o bases de datos conectadas.

- **Automatización de Tareas:**  
  Ejecuta secuencias de acciones basadas en comandos o eventos (por ejemplo, "Si recibo un correo de [contacto], guarda el archivo adjunto en [carpeta]").

- **Organización de Información:**  
  Clasifica y etiqueta información relevante extraída de correos, documentos y páginas web.

- **Seguimiento de Proyectos:**  
  Mantén un registro del progreso de tareas, enviando actualizaciones y recordatorios a los involucrados.

- **Control de Dispositivos (Potencial):**  
  Integración futura con plataformas de hogar inteligente para el control de dispositivos mediante comandos.

- **Traducción en Tiempo Real:**  
  Traduce conversaciones o textos de forma instantánea.

- **Respuestas Específicas:**  
  Proporciona respuestas concisas y basadas en información accesible.

- **Generación de Resúmenes Ejecutivos:**  
  Sintetiza información de múltiples fuentes para crear resúmenes concisos.

### Interacción y Aprendizaje

- **Aprendizaje Adaptativo:**  
  Ajusta la presentación de información y tareas según el progreso y preferencias del usuario.

- **Identificación de Patrones y Tendencias:**  
  Analiza datos para detectar patrones relevantes.

- **Recomendaciones Personalizadas:**  
  Sugiere contenido, recursos o acciones basadas en el historial e intereses del usuario.

- **Explicaciones y Ejemplos Detallados:**  
  Ofrece explicaciones y ejemplos prácticos para facilitar la comprensión.

- **Generación de Preguntas:**  
  Formula preguntas que fomentan el pensamiento crítico y la reflexión.

### Integración Específica

- **Envío de Correos Electrónicos:**  
  Redacta y envía correos mediante la integración con Resend.

- **Interacción con Bases de Datos:**  
  Consulta y modifica datos en Supabase, respetando los permisos adecuados.

- **Contenido Web Dinámico:**  
  Utiliza Next.js para mostrar información procesada o generada por la IA de manera interactiva.

- **Procesamiento de Pagos (Potencial):**  
  Posible integración futura con Stripe para gestionar pagos.

---

## Conclusión

Este asistente virtual de productividad ofimática combina la potencia de la inteligencia artificial con integraciones robustas para ofrecer una solución completa y segura en entornos de oficina. Con capacidades que van desde la generación y manipulación de contenido hasta la automatización de tareas y gestión de información, esta aplicación está diseñada para optimizar y simplificar la jornada laboral.

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
