# Keel Skills — operación disciplinada para agentes de Claude

> *Read this in [English](README.md).*

> Un marco portable de gobernanza para correr agentes de Claude (Claude Code,
> Agent SDK) sin romper cosas ni quemar tokens. Cinco skills, seis comandos y dos
> hooks: instalás, corrés `/keel-skills:onboard`, listo.
>
> **Keel Skills es la metodología de gobernanza de agentes de [Esteban Aguilar](#autor).**
> Nace de operar agentes en producción todos los días, no de la teoría.

Keel Skills toma su nombre de la quilla del barco (*keel*): la pieza que no se ve pero mantiene todo estable y en
rumbo. Eso hace este plugin con un agente: lo deja moverse rápido en lo seguro y lo
frena en seco antes de lo irreversible.

![Keel Skills frenando a un agente al que le dijeron "limpiá y pusheá": pasa el test de 4 pasos, frena en la zona caliente y propone un plan acotado](assets/keel-demo.gif)

*Al agente le dijeron "limpiá y pusheá". Sin una regla, lo hace —borra, force-push,
listo—. Con Keel toca una zona caliente, frena y propone un plan acotado, marcando
el borrado peligroso. ([recorrido completo](examples/green-light-brake.md))*

> **En palabras simples.** Los asistentes de IA que escriben código ya pueden actuar
> solos — y a veces hacen algo que no se puede deshacer, como borrar trabajo para
> siempre o publicar un cambio en el sistema en vivo antes de que alguien lo revise.
> Keel Skills es un conjunto de reglas de la casa: deja que el asistente haga lo
> chico y seguro por su cuenta, pero lo obliga a **frenar y preguntarte primero**
> antes de cualquier cosa riesgosa o permanente. Vos mantenés el control sin tener
> que vigilar cada paso.

## El problema que resuelve

Un agente con autonomía es útil hasta que toca producción, sobrescribe algo
publicado, ejecuta un `push`/deploy que no correspondía, o gasta el presupuesto de
tokens corriendo el modelo más caro en una tarea mecánica. La mayoría de los
equipos no tiene un criterio **explícito** de cuándo el agente puede actuar solo y
cuándo tiene que parar y preguntar. Keel Skills es ese criterio, ya escrito.

Casi siempre te das cuenta de que lo necesitabas el día *después* del push que no
correspondía. La idea de Keel Skills es tenerlo puesto antes de ese día.

## Qué incluye

Las skills se activan solas cuando la situación lo amerita. Los comandos los
corrés vos. Los hooks corren automáticamente, y uno de ellos puede frenar una
llamada a herramienta en seco:

| Componente | Para qué |
|-----------|----------|
| **`authorization-protocol`** | Decide si el agente puede actuar o tiene que parar y preguntar. Ordena lo que parece permiso en tres cosas — un objetivo, un método y una luz verde (solo la luz verde habilita) — con un chequeo de cuatro pasos, zonas de riesgo ("calientes"), una regla para seguir adelante con una luz verde que ya tenés, y la regla para corridas desatendidas. |
| **`model-delegation`** | Elegir el modelo más barato que preserve calidad y riesgo. Tiers por tipo de tarea, profundidad máxima de subagentes, prohibición de auto-escalar, y escalera de herramientas más-barata-primero. |
| **`context-discipline`** | Mantener la sesión anclada en archivos y no en el chat. Las dos puntas de una sesión, cuándo cortar una larga, qué registrar y cómo dejar un punto de retomado. |
| **`workspace-hygiene`** *(0.6)* | Que los documentos y el estado no envejezcan hasta volverse mentira, y que el drift se detecte igual. Estado vs. historia y cuándo cortar, por qué un bootstrap no lleva estado, chequeos que existen porque algo ya se rompió, y qué nunca puede hacer una barrida desatendida. |
| **`repeatable-work`** *(0.6)* | Convertir en script lo que ya hiciste tres veces, en vez de en costumbre. Qué tiene que ser una herramienta que corre un agente, bancos de prueba con un caso que *tiene* que fallar, y el ciclo capturar → cosechar → adoptar. |
| **`/keel-skills:onboard`** *(0.6)* | **Empezá acá.** El programa de iniciación: mira qué hay realmente en tu carpeta —repo o no, un proyecto o varios, docs de agente ya existentes, o nada—, te dice qué encontró *y qué no pudo determinar*, y construye solo el nivel que elijas. |
| **`policy-init`** · **`session-start`** · **`session-close`** · **`hygiene`** · **`harvest`** | Generar la política · abrir sesión sobre estado y chequeos · reconciliar estado y dejar handoff · barrida semanal de solo lectura · revisar qué se repitió y redactar qué vale construir. |
| **hook `SessionStart`** | Si tu proyecto tiene un `AGENT_POLICY.md`, lo inyecta automáticamente al contexto al abrir cada sesión. Así la política deja de depender de que el agente "se acuerde" de leerla. Si no hay política, avisa en dos líneas. |
| **hook `PreToolUse`** *(0.4)* | La baranda dura. Inspecciona cada llamada a herramienta *antes* de que corra y frena las calientes (`git push`, deploy, `rm -rf`, escrituras a tus rutas calientes, llamadas MCP hacia afuera) pidiendo aprobación explícita — aunque el agente no se haya frenado solo. Registra cada decisión en `.keel/audit.jsonl`. |

Más plantillas ejecutables: un [script de chequeos](plugins/keel-skills/templates/checks/README.md)
sin dependencias con su banco de pruebas, el par estado/historia, la cola de
mejoras y un prompt de barrida semanal desatendida.

## El modelo de permisos, de un vistazo

El corazón de Keel Skills: un chequeo de cuatro pasos que decide, antes de cada
acción que escribe o cambia algo, si el agente puede actuar solo o tiene que parar y
pedir un sí claro — una **luz verde**.

![Modelo de permisos de Keel Skills: el chequeo de cuatro pasos](assets/authorization-flow.es.svg)

El modelo está especificado de forma neutral al runtime en **[SPEC.md](SPEC.md)**,
para que pueda citarse y reimplementarse fuera de Claude Code.

## La separación clave: mecanismo vs. tus datos

Las skills son **genéricas**: describen el *patrón* (qué es una zona de riesgo, qué
significa seguir adelante con una luz verde que ya tenés, cómo se elige un modelo). Lo específico de tu
proyecto —qué rutas son calientes, dónde vive tu fuente de verdad, qué cuenta como
release— vive en un único archivo que vos controlás: **`AGENT_POLICY.md`** en la
raíz de tu proyecto.

Resultado: el producto se distribuye limpio, sin nada de tu empresa adentro, y cada
usuario lo configura para lo suyo. La plantilla está en
`plugins/keel-skills/templates/AGENT_POLICY.template.md`, y hay packs listos para
stacks comunes en [`policies/`](policies/).

## Instalación

Keel Skills se distribuye como un marketplace de un solo plugin.

```text
# En Claude Code:
/plugin marketplace add https://github.com/quitohooded/keel-skills
/plugin install keel-skills@keel-skills
```

Después, en el proyecto que quieras gobernar:

```text
/keel-skills:onboard
```

**No asume nada**: primero mira qué hay realmente ahí, te dice qué encontró *y qué
no pudo determinar*, y recién entonces ofrece tres tamaños —solo el freno (~5 min),
más el ciclo de sesión (~15), más el ciclo de mantenimiento (~30)— y construye
únicamente el que elijas. El nivel 1 es una respuesta final legítima; podés subir
después corriéndolo de nuevo. Termina haciendo que el freno se dispare con un
comando real, porque "quedó configurado" es una afirmación, no una prueba.

Si solo querés el archivo de política, `/keel-skills:policy-init` hace ese paso.
Ver `DISTRIBUTION.md` para las rutas de publicación (repo git, ruta local, o paquete).

## Una vez configurado

Si tomaste el ciclo de sesión, el ritmo es:

```text
/keel-skills:session-start     # cargar estado y correr los chequeos, antes del trabajo
/keel-skills:session-close      # devolver el estado a los archivos, una línea de historia
/keel-skills:hygiene            # semanal, solo lectura: reporta pero nunca actúa
/keel-skills:harvest            # cuando sobra capacidad: qué se repitió, qué construir
```

Por qué está armado así —documentos que no envejecen, chequeos que se ganan su
lugar, corridas desatendidas, la regla de tres— está en
[el ciclo operativo](https://docs.estebanaguilar.me/concepts/operating-loop).

## Cómo usarlo, en una línea

> Read-only y propuestas son libres. Lo riesgoso, hacia afuera, difícil de
> deshacer o que reconstruye un sistema necesita una luz verde. Ante la duda, se
> pregunta. Modelo más barato que rinda; delegación corta; herramienta más liviana primero.

## Autor

Creado por **Esteban Aguilar** — [estebanaguilar.me](https://estebanaguilar.me)
· [github.com/quitohooded](https://github.com/quitohooded). Keel Skills destila el
criterio que uso para operar agentes en trabajo real: cuándo un agente puede
actuar solo y cuándo tiene que parar, qué modelo asignar a cada tarea, y cómo
mantener una sesión anclada en archivos. Si te sirve, contame en qué lo aplicaste.

## Licencia

**MIT.** Podés usarlo, forkearlo y construir encima, incluido trabajo comercial.
MIT solo te pide conservar el aviso de copyright; un crédito visible a *Keel Skills
by Esteban Aguilar* es la norma que te pedimos seguir (ver [NOTICE](NOTICE)).
© 2026 Esteban Aguilar.
