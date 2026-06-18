# Keel — operación disciplinada para agentes de Claude

> Un marco portable de gobernanza para correr agentes de Claude (Claude Code,
> Agent SDK) sin romper cosas ni quemar tokens. Tres skills + un comando, listos
> para instalar y configurar por proyecto.
>
> **Keel es la metodología de gobernanza de agentes de [Esteban Aguilar](#autor).**
> Nace de operar agentes en producción todos los días, no de la teoría.

Keel es la quilla del barco: la pieza que no se ve pero mantiene todo estable y en
rumbo. Eso hace este plugin con un agente: lo deja moverse rápido en lo seguro y lo
frena en seco antes de lo irreversible.

## El problema que resuelve

Un agente con autonomía es útil hasta que toca producción, sobrescribe algo
publicado, ejecuta un `push`/deploy que no correspondía, o gasta el presupuesto de
tokens corriendo el modelo más caro en una tarea mecánica. La mayoría de los
equipos no tiene un criterio **explícito** de cuándo el agente puede actuar solo y
cuándo tiene que parar y preguntar. Keel es ese criterio, ya escrito.

## Qué incluye

Tres skills (se activan solas cuando la situación lo amerita) y un comando:

| Skill | Para qué |
|-------|----------|
| **`authorization-protocol`** | Decide si el agente puede ejecutar o tiene que pedir aprobación. Modelo de 3 niveles (mandato amplio / mecanismo / aprobación explícita con scope), test de 4 pasos, zonas calientes y regla de propagación mecánica. |
| **`model-delegation`** | Elegir el modelo más barato que preserve calidad y riesgo. Tiers por tipo de tarea, profundidad máxima de subagentes, prohibición de auto-escalar, y escalera de herramientas más-barata-primero. |
| **`context-discipline`** | Mantener la sesión anclada en archivos y no en el chat. Cuándo cortar una sesión larga, qué registrar y cómo dejar un punto de retomado para una sesión nueva. |
| **`/keel:policy-init`** | Genera el `AGENT_POLICY.md` de tu proyecto entrevistándote sobre tus zonas calientes y fuentes de verdad. |

## La separación clave: mecanismo vs. tus datos

Las skills son **genéricas**: describen el *patrón* (qué es una zona caliente, qué
significa propagación mecánica, cómo se elige un modelo). Lo específico de tu
proyecto —qué rutas son calientes, dónde vive tu fuente de verdad, qué cuenta como
release— vive en un único archivo que vos controlás: **`AGENT_POLICY.md`** en la
raíz de tu proyecto.

Resultado: el producto se distribuye limpio, sin nada de tu empresa adentro, y cada
comprador lo configura para lo suyo. La plantilla está en
`plugins/keel/templates/AGENT_POLICY.template.md`.

## Instalación

Keel se distribuye como un marketplace de un solo plugin.

```
# En Claude Code:
/plugin marketplace add https://github.com/quitohooded/keel
/plugin install keel@keel
```

Después, en tu proyecto:

```
/keel:policy-init
```

para generar el `AGENT_POLICY.md`. Ver `DISTRIBUTION.md` para las rutas de
publicación (repo git, ruta local, o paquete).

## Cómo usarlo, en una línea

> Read-only y propuestas son libres. Lo caliente, hacia afuera, irreversible o
> estructural es aprobación explícita. Ante la duda, se pregunta. Modelo más
> barato que rinda; delegación corta; herramienta más liviana primero.

## Autor

Creado por **Esteban Aguilar** — [estebanaguilar.com.ar](https://estebanaguilar.com.ar)
· [github.com/quitohooded](https://github.com/quitohooded). Keel destila el
criterio que uso para operar agentes en trabajo real: cuándo un agente puede
actuar solo y cuándo tiene que parar, qué modelo asignar a cada tarea, y cómo
mantener una sesión anclada en archivos. Si te sirve, contame en qué lo aplicaste.

## Licencia

**Source-available con atribución (sin reventa).** Podés ver, usar y adaptar Keel
para tu propio trabajo —incluido trabajo comercial tuyo o de tus clientes— siempre
que conserves la atribución a *Keel by Esteban Aguilar*. No podés vender ni
redistribuir Keel (o un derivado) como producto propio sin permiso. Ver `LICENSE`.
© 2026 Esteban Aguilar.
