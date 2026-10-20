# Servicio de Expedición de Tarjetas de Crédito

Servicio NestJS que **expide tarjetas de crédito** y gestiona la **logística de
envío** de esas tarjetas a los titulares. El proyecto está organizado en
arquitectura hexagonal (capas `dominio`, `aplicacion`, `infraestructura`) y dos
contextos: tarjetas y envíos.

> **Ejercicio de revisión de código.** Esta es una versión del servicio
> preparada para una actividad de aula. Tu tarea es **auditar el código y
> detectar los problemas de arquitectura y las malas prácticas** que contiene.
> No te fíes de los comentarios ni de la estructura de carpetas: revisa el
> código real.

## Qué debes hacer

Revisa el repositorio capa por capa y responde:

1. ¿La **regla de dependencias** de la arquitectura hexagonal se respeta? El
   dominio debería ser el núcleo y no depender de nada externo.
2. ¿Los **modelos de dominio** protegen sus invariantes, o son anémicos?
3. ¿Hay **fugas de seguridad** (datos sensibles expuestos o registrados)?
4. ¿Las **capas** tienen responsabilidades claras, o hay lógica fuera de lugar?
5. ¿Qué pasa con las **pruebas** y la **verificación automatizada**?
6. ¿Hay **bugs de comportamiento** observables al ejecutar el servicio?

Para cada hallazgo, indica: archivo y línea, por qué es un problema, qué
principio viola y cómo lo corregirías.

## Estructura

```
src/
├── compartido/   # núcleo transversal (identificador, errores, adaptadores)
├── tarjetas/     # expedición de tarjetas (dominio / aplicacion / infraestructura)
└── envios/       # logística de envío (dominio / aplicacion / infraestructura)
```

## Puesta en marcha

```bash
npm install
npm run build
npm run start:prod   # arranca el servicio
```

Explora los endpoints de tarjetas (`/tarjetas`, ...) y de envíos
(`/envios`, ...). Observa con atención las respuestas.

## Pista

Un buen punto de partida es comparar lo que dicen los comentarios y los nombres
de los archivos con lo que el código realmente hace.
