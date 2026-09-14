Nuevo: Llamada API para actualizar campos AVD.

Nuevo: Exportar e importar Flujos y/o Dispositivos Virtuales Avanzados de otros usuarios de Homey. Importar a través de Plantillas en Configuración de la App, Reparación de AVD o al crear AVDs.

También nuevo: ¡Dispositivo Virtual Completamente Personalizable (AVD)!
Consulta el tema para ver ejemplos.

Crea un dispositivo y configúralo tú mismo:
* Estado de Texto que puedes seleccionar como Indicador de Estado en el Azulejo del Dispositivo en la App Móvil, configurable a través de flujos.
* Iconos personalizables que se pueden cargar como icono de capacidad.
* Haz que el Azulejo del Dispositivo funcione como un Botón Pulsador (permaneciendo claro/oscuro después de ser clicado) pero ajusta Oscuro/Claro en el Azulejo como estado desde un flujo.
* Se pueden añadir 10 Números, Textos, Sí/No, Botones y Cámaras a add_devices.
* Ocultar el botón del azulejo del dispositivo desde el propio dispositivo.

Y 

Una tarjeta de flujo para recuperar el Usuario y el Cliente desde los Insights de hace x minutos (puede ser cero por ahora). Ejemplo: Recuperar el valor de LivingRoom para la Temperatura de hace 30 minutos.

O

Configurar capacidades de dispositivos por zona, por ejemplo, abrir o cerrar todas las cortinas en una zona determinada, incluyendo (o no) las subzonas, de una cierta marca o tipo de dispositivo. También escucha capacidades para las cuales no hay activadores del desarrollador de la aplicación y te da fichas con el Usuario y el Cliente (App) que activaron/cambiaron el valor de la capacidad. Y una condición capaz de establecer una capacidad y esperar una "error" específico.

Ahora también una nueva tarjeta de acción, que recupera el valor de una capacidad de un dispositivo de hace [número de] minutos (incluyendo el Usuario y Cliente que cambió el valor).

Y una tarjeta App ha comenzado (Cuando) y una tarjeta App está funcionando (Y).

Ejemplo: Establecer curtain.windowcoverings_set A 0 en Casa incluyendo subzonas (Sí). Esto cerrará todas las cortinas en la Casa y subzonas. Establecerlo en 1 abrirá todas las cortinas.

Ejemplo: Escuchar (ver) desde Vacuumcleaner1 para bin_full El flujo se activará cuando un dispositivo llamado Vacuumcleaner1 haya cambiado la capacidad bin_full. Verifica el valor como verdadero y envía una notificación a tu teléfono para saber cuándo el contenedor del aspirador está lleno.

Ejemplo: Establecer SamsungFrameTV.onof a True y esperar el error: Encendido ya... El flujo continuará después de que el TV se haya encendido. Así que no más flujos con retrasos esperando que el TV o la cafetera se enciendan.

Ejemplo: Recuperar el valor de LivingRoom para la Temperatura de hace 30 minutos.