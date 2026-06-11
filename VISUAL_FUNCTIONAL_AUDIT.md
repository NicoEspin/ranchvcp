# Auditoria visual y funcional

## Objetivo

Este documento releva el estado actual del proyecto para preparar un refactor completo de branding y UI sin romper el comportamiento existente.

La idea no es rediseñar a ciegas. Primero hay que entender que partes son puramente visuales, que partes sostienen la conversion y que piezas funcionales NO conviene tocar mientras se redefine la identidad.

## Resumen ejecutivo

El proyecto actual funciona como una landing gastronomica con carta digital y dos recorridos principales:

1. Reservar por WhatsApp.
2. Armar un pedido y enviarlo por WhatsApp.

La app publica visible hoy se concentra en dos rutas:

1. `/`
2. `/carta`

La base funcional esta bastante encapsulada y eso juega a favor del refactor visual. Se puede rehacer casi toda la capa estetica, el ritmo de secciones, la jerarquia tipografica, la paleta, los componentes de superficie y el branding general SIN tocar la logica critica de pedidos y reservas.

Tambien hay deuda clara de template/demo: placeholders en `public/`, imagenes de Unsplash en `lib/mock-data.ts`, un link muerto en el footer, una inconsistencia con el numero de WhatsApp y configuraciones que hoy esconden errores de TypeScript.

## Alcance del sitio actual

### Rutas publicas

1. `app/page.tsx`
   Home principal con secciones de hero, menu, reservas, ubicacion, galeria, FAQ y CTA final.
2. `app/carta/page.tsx`
   Carta visual simplificada pensada para lectura directa o uso via QR.

### Shell global

`app/layout.tsx`:

1. Carga `Geist`, `Geist Mono` y `Playfair Display`.
2. Define metadata global publica.
3. Envuelve toda la app con `OrderProvider`.
4. Activa `@vercel/analytics` solo en produccion.

## Arquitectura visible del producto

La home actual esta compuesta por estas piezas:

1. `components/restaurant/SiteHeader.tsx`
2. `components/restaurant/HeroSection.tsx`
3. `components/restaurant/MenuSection.tsx`
4. `components/restaurant/ReservationSection.tsx`
5. `components/restaurant/LocationHoursSection.tsx`
6. `components/restaurant/GallerySection.tsx`
7. `components/restaurant/FAQSection.tsx`
8. `components/restaurant/FinalCTASection.tsx`
9. `components/restaurant/SiteFooter.tsx`
10. `components/restaurant/FloatingWhatsAppButton.tsx`

La experiencia funcional de pedidos se apoya sobre:

1. `components/restaurant/OrderProvider.tsx`
2. `components/restaurant/OrderSummary.tsx`
3. `components/restaurant/MenuCatalog.tsx`
4. `components/restaurant/MenuItemCard.tsx`
5. `lib/whatsapp.ts`

La fuente de datos visible hoy sale mayormente de mocks en:

1. `lib/mock-data.ts`

Conclusion: el proyecto ya esta separado en una capa de secciones publicas y una capa funcional chica pero importante. Eso permite rediseñar fuerte sin romper todo, SIEMPRE que no se toque la logica critica sin criterio.

## Inventario funcional por pagina

### `/`

Funciones visibles en la home:

1. Header fijo con navegacion por anchors.
2. CTA de reserva.
3. CTA de ver menu.
4. Bloque de menu con categorias y platos.
5. Formulario de reservas.
6. Bloque de ubicacion y horarios.
7. Galeria de imagenes.
8. FAQ.
9. CTA final.
10. Footer con contacto y redes.
11. Boton flotante de WhatsApp.

Funciones reales de negocio:

1. Agregar platos al pedido desde el menu.
2. Abrir un resumen de pedido responsive.
3. Editar cantidades.
4. Quitar items.
5. Quitar ingredientes.
6. Completar datos de cliente.
7. Elegir `pickup` o `delivery`.
8. Exigir direccion solo si el modo es `delivery`.
9. Enviar pedido a WhatsApp con mensaje estructurado.
10. Crear reserva y abrir WhatsApp con mensaje prearmado.
11. Navegar a Google Maps.

### `/carta`

Funciones visibles:

1. Carta enfocada en lectura rapida.
2. Navegacion por categorias.
3. Listado de platos, precios y disponibilidad.

Comportamiento importante:

1. `OrderProvider` oculta la UI de pedido en esta ruta.
2. No hay header, footer ni boton flotante.
3. Es una experiencia mas limpia y util para QR o consulta inmediata.

## Flujos criticos que NO hay que romper

Estas piezas son sensibles. Si se rediseñan sin entender la logica, se arma un quilombo al pedo.

### Pedido

Archivos clave:

1. `components/restaurant/OrderProvider.tsx`
2. `components/restaurant/OrderSummary.tsx`
3. `components/restaurant/MenuCatalog.tsx`
4. `components/restaurant/MenuItemCard.tsx`
5. `lib/whatsapp.ts`

Responsabilidades:

1. Gestion del estado local del pedido.
2. Apertura del panel de pedido segun viewport.
3. Validacion del formulario de checkout.
4. Construccion del mensaje final para WhatsApp.

### Reserva

Archivos clave:

1. `components/restaurant/ReservationSection.tsx`
2. `lib/whatsapp.ts`

Responsabilidades:

1. Recoleccion de nombre, fecha, hora y cantidad de personas.
2. Validacion basica del formulario.
3. Apertura del mensaje de reserva en WhatsApp.

### Navegacion por secciones

IDs y anchors sensibles:

1. `#menu`
2. `#reservas`
3. `#ubicacion`
4. `#faq`

Si cambia el layout y se pierden estos anchors, rompes navegacion, CTA internos y expectativa de uso.

## Sistema visual actual

### Paleta y tokens

La base visual esta declarada en `app/globals.css`.

Tokens principales detectados:

1. `--background: #120D0A`
2. `--background-alt: #1B130F`
3. `--foreground: #FFF8EF`
4. `--primary: #C99A5B`
5. `--accent: #B85C38`
6. `--olive: #6F7D4E`
7. `--whatsapp: #25D366`

Esto define una estetica:

1. Oscura.
2. Calida.
3. Premium.
4. Editorial/gastronomica.

### Tipografia

Definida en `app/layout.tsx` y expuesta hacia CSS:

1. `Geist` para UI y cuerpo.
2. `Playfair Display` para titulares de marca.
3. `Geist Mono` para casos puntuales.

El contraste serif + sans es parte fuerte de la identidad actual.

### Lenguaje de superficie

Patrones visuales detectados:

1. Cards con bordes transluidos.
2. Mucho uso de `glass-card`.
3. Overlays oscuros sobre imagen.
4. Bordes redondeados grandes.
5. Glow calido en CTAs o bloques destacados.

Utilities custom visibles en `app/globals.css`:

1. `.image-overlay`
2. `.warm-glow`
3. `.glass-card`
4. `.hide-scrollbar`

### Sistema de componentes

Hay base `shadcn` + `Radix` en:

1. `components/ui/*`
2. `components.json`

Se detecta:

1. Estilo `new-york`.
2. `rsc: true`.
3. Uso de variables CSS.
4. `lucide-react` para iconografia.

O sea, la base tecnica del sistema UI esta bien para rediseñar arriba. No hace falta tirar todo por la ventana.

## Branding actual detectado

### Marca textual

La marca visible hoy es `Casa Bruma`.

Fuente principal:

1. `lib/mock-data.ts`
2. `app/layout.tsx`

Tagline detectado:

`Cocina de estacion · Atencion cercana · Mesa lista cuando llegas`

### Tono y territorio verbal

El copy actual insiste mucho en:

1. Claridad.
2. Menos friccion.
3. Menos mensajes sueltos.
4. Informacion ordenada.
5. Conversacion por WhatsApp sin vueltas.

El branding verbal actual esta mas cerca de una promesa de orden comercial que de una narrativa de marca fuerte o aspiracional.

### Activos visuales reales

En `public/` se detectan assets de placeholder o template:

1. `placeholder-logo.svg`
2. `placeholder-logo.png`
3. `placeholder.jpg`
4. `placeholder-user.jpg`
5. `placeholder.svg`
6. `icon.svg`
7. `icon-light-32x32.png`
8. `icon-dark-32x32.png`
9. `apple-icon.png`

Problema: la marca textual existe, pero los assets todavia no la representan de verdad.

### Imagenes de producto/ambiente

Las imagenes visibles vienen de mocks en `lib/mock-data.ts` y usan recursos estilo Unsplash.

Eso sirve para demo. Para branding serio NO sirve ni en pedo.

## UX y conversion actual

### Embudo implicito

El journey actual es bastante claro:

1. Entender propuesta.
2. Ver carta.
3. Reservar o pedir.
4. Cerrar por WhatsApp.

### CTAs principales detectados

1. `Reservar por WhatsApp`
2. `Ver menu`
3. `Como llegar`
4. `Enviar pedido por WhatsApp`
5. `Ver pedido`

### Lo que hoy funciona bien

1. Los recorridos principales son simples.
2. La home lleva rapido a una accion.
3. `/carta` esta bien enfocada para QR.
4. El pedido tiene validacion razonable.
5. La propuesta comercial se entiende rapido.

### Lo que hoy falta

1. No hay social proof real.
2. No hay promociones expuestas aunque existen datos mock para eso.
3. No hay mapa real embebido.
4. No hay feedback visual mas rico en algunas interacciones.
5. No hay un recorrido intermedio claro para consultar platos.
6. Existe `generateInquiryMessage()` en `lib/whatsapp.ts` pero no se usa en UI.

## Responsive y comportamiento cross-device

Se detectan decisiones utiles que conviene preservar:

1. `SiteHeader.tsx` separa desktop y mobile menu.
2. `OrderSummary.tsx` usa `Drawer` en mobile y `Sheet` en desktop.
3. `CategoryStrip.tsx` usa scroll horizontal.
4. `OrderProvider.tsx` muestra CTA fijo `Ver pedido` en mobile cuando hay items.
5. La grilla del contenido cambia segun breakpoint en varias secciones.

Moraleja: podés cambiar visualmente TODO eso, pero el comportamiento responsive ya resuelve problemas reales. No lo destruyas porque se ve lindo en Figma. Eso es mediocridad de tutorial, no arquitectura.

## Inconsistencias y deuda detectada

### Funcional

1. `lib/whatsapp.ts` usa `WHATSAPP_NUMBER = '+543541560518'`.
2. `lib/mock-data.ts` define `restaurantSettings.whatsapp = '5491123456789'`.

Hay dos fuentes de verdad para el telefono y encima no coinciden.

### Tecnica

1. `next.config.mjs` tiene `typescript.ignoreBuildErrors: true`.
2. `components/restaurant/index.ts` exporta `FeaturedDishes`, pero ese archivo no existe.
3. `components/restaurant/LocationHoursSection.tsx` importa `openingHours` y no lo usa.
4. Existen hooks duplicados:
   `components/ui/use-mobile.tsx`
   `hooks/use-mobile.ts`

### Visual

1. Mapa placeholder en `LocationHoursSection.tsx`.
2. Imagenes genericas en hero, galeria y menu via `lib/mock-data.ts`.
3. Iconografia de template en `public/`.
4. Footer con `href="#"` en el link a Synttek desde `SiteFooter.tsx`.

### Producto

1. El sitio opera sobre mocks, no sobre una fuente administrable real.
2. No hay CMS ni backend de contenido.
3. No hay tracking profundo de conversion mas alla de abrir WhatsApp.

## Oportunidades para el refactor visual

### Rediseño seguro sin romper comportamiento

1. Rehacer hero completo.
2. Cambiar paleta y tokens semanticos.
3. Replantear header y footer.
4. Rediseñar cards y superficies.
5. Cambiar la grilla de secciones y el ritmo vertical.
6. Reestilizar CTA flotante.
7. Rehacer la carta visual manteniendo contratos funcionales.
8. Replantear la galeria y el bloque de ubicacion.

### Rediseño con valor de producto extra

1. Activar consultas por plato usando `generateInquiryMessage()`.
2. Mostrar promociones reales.
3. Agregar filtros o badges utiles en la carta.
4. Sumar mapa real o visual custom del local.
5. Incluir medios de pago, politicas, delivery y senias.
6. Sumar reseñas, testimonios o señales de confianza.
7. Diferenciar mejor los journeys de `reservar`, `pedir` y `consultar`.

## Riesgos del refactor visual

### Riesgos altos

1. Romper la navegacion por anchors.
2. Romper el sticky de categorias en la carta.
3. Romper el flujo de pedido al tocar `OrderProvider` o `OrderSummary` sin tests.
4. Perder accesibilidad si se reemplazan primitives de Radix por markup casero.

### Riesgos medios

1. Priorizar una estetica linda por encima de la claridad comercial.
2. Esconder precios, disponibilidad o CTA dentro del nuevo lenguaje visual.
3. Empeorar mobile por diseñar primero para desktop.
4. Diluir la accion principal a WhatsApp.

### Riesgos tecnicos

1. `typescript.ignoreBuildErrors` puede esconder roturas reales.
2. La deuda template puede confundir durante el refactor.
3. Hay piezas no consolidadas que conviene limpiar antes del cambio grande.

## Qué es visual-only y qué es behavior-critical

### Visual-only

Se puede rediseñar con libertad relativa:

1. Paleta.
2. Tipografia.
3. Layout de secciones.
4. Cards.
5. Espaciados.
6. Iconografia.
7. Tratamiento fotografico.
8. Header y footer a nivel estetico.
9. Estilo de formularios.

### Behavior-critical

Conviene tratarlo como zona protegida hasta tener el rediseño controlado:

1. `lib/whatsapp.ts`
2. `components/restaurant/OrderProvider.tsx`
3. `components/restaurant/OrderSummary.tsx`
4. `components/restaurant/MenuCatalog.tsx`
5. `components/restaurant/MenuItemCard.tsx`
6. `components/restaurant/ReservationSection.tsx`
7. IDs de anchors y contratos de navegacion.
8. Comportamiento diferencial de `/carta`.

## Archivos clave para el rediseño

### Branding y datos

1. `lib/mock-data.ts`
2. `public/icon.svg`
3. `public/placeholder-logo.svg`
4. `public/icon-light-32x32.png`
5. `public/icon-dark-32x32.png`

### Sistema visual

1. `app/globals.css`
2. `tailwind.config.ts`
3. `components.json`
4. `components/ui/button.tsx`
5. `components/ui/input.tsx`
6. `components/ui/select.tsx`
7. `components/ui/drawer.tsx`
8. `components/ui/sheet.tsx`

### Home y carta

1. `app/page.tsx`
2. `app/carta/page.tsx`
3. `components/restaurant/SiteHeader.tsx`
4. `components/restaurant/HeroSection.tsx`
5. `components/restaurant/MenuSection.tsx`
6. `components/restaurant/LocationHoursSection.tsx`
7. `components/restaurant/GallerySection.tsx`
8. `components/restaurant/FAQSection.tsx`
9. `components/restaurant/FinalCTASection.tsx`
10. `components/restaurant/SiteFooter.tsx`

### Flujos funcionales

1. `components/restaurant/OrderProvider.tsx`
2. `components/restaurant/OrderSummary.tsx`
3. `components/restaurant/ReservationSection.tsx`
4. `lib/whatsapp.ts`

## Recomendaciones priorizadas

1. Definir una fuente de verdad de marca antes de tocar UI: nombre final, tono, telefono, direccion, horarios, redes, logos, favicon y assets fotograficos reales.
2. Separar en la documentacion del rediseño lo `visual-only` de lo `behavior-critical` para que nadie rompa conversion por jugar al diseñador sin entender el sistema.
3. Reemplazar assets de placeholder e imagenes mock antes del nuevo branding visual.
4. Mantener como prioridad de negocio los journeys de `reservar` y `pedir`.
5. Corregir inconsistencias base antes del refactor grande: numero de WhatsApp, export roto, hooks duplicados y `ignoreBuildErrors`.
6. Definir si el rediseño solo cambia skin o si tambien suma producto: consultas por plato, promos, trust signals, mapa real y mejoras de FAQ.

## Propuesta de siguiente documento

Con esta auditoria, el siguiente paso logico es escribir una `guia de branding y rediseño` con:

1. Nuevo posicionamiento.
2. Personalidad de marca.
3. Paleta y tipografia nuevas.
4. Direccion fotografica.
5. Sistema de componentes visual.
6. Reglas para home.
7. Reglas para `/carta`.
8. Guardrails funcionales para no romper el negocio.

Ese documento ya no seria de diagnostico. Seria la especificacion concreta del nuevo lenguaje visual.
