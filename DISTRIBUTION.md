# Distribución de Keel Skills

Keel Skills está estructurado como un **marketplace de un solo plugin**, que es la forma
directamente instalable en Claude Code. Hay tres caminos de entrega.

## Estructura del repo

```
keel-skills/
  .claude-plugin/
    marketplace.json          ← define el marketplace y lista el plugin "keel-skills"
  plugins/
    keel-skills/
      .claude-plugin/
        plugin.json           ← manifiesto del plugin
      skills/
        authorization-protocol/SKILL.md
        model-delegation/SKILL.md
        context-discipline/SKILL.md
      commands/
        policy-init.md        ← /keel-skills:policy-init
      hooks/
        hooks.json            ← SessionStart: inyecta el AGENT_POLICY.md al contexto
        inject-policy.cjs     ← script del hook (Node, cross-platform)
      templates/
        AGENT_POLICY.template.md
      README.md
  README.md                   ← overview (inglés, primario)
  README.es.md                ← overview (español, voz de marca)
  SPEC.md                     ← spec abierto, neutral al runtime (modelo objetivo/método/luz verde + formato AGENT_POLICY.md)
  policies/                   ← packs de AGENT_POLICY.md por stack (web-app-deploy, nextjs-vercel, supabase)
  examples/                   ← green-light-brake.md (antes/después) + demo-script.md (guion grabable)
  CONTRIBUTING.md             ← packs, implementaciones compatibles, mejoras al spec
  STRATEGY.md                 ← estrategia de crecimiento (fuente de verdad interna)
  LICENSE                     ← MIT
  NOTICE                      ← atribución (norma) sobre MIT
  CHANGELOG.md
  DISTRIBUTION.md             ← este archivo
```

## Camino 1 — Repositorio git público (camino elegido)

**Ya publicado** en `https://github.com/quitohooded/keel-skills` (rama `main`).
Para publicar una versión nueva, basta con commitear y pushear:

```
# desde C:\roadtobiz\_experimentos\keel-skills:
git add -A
git commit -m "Keel Skills vX.Y.Z — <resumen>"
git push
```

Cualquiera instala con:

```
/plugin marketplace add https://github.com/quitohooded/keel-skills
/plugin install keel-skills@keel-skills
```

Para actualizar, publicás un commit nuevo y el usuario hace
`/plugin marketplace update keel-skills`. La licencia (**MIT**) vive en `LICENSE`;
la atribución pedida (norma, no obligación legal más allá del aviso MIT) está en
`NOTICE`.

## Camino 2 — Ruta local (para pruebas o entrega directa)

```
/plugin marketplace add C:/ruta/a/keel-skills
/plugin install keel-skills@keel-skills
```

Útil para validar antes de publicar, o para entregar a un cliente que prefiere
instalación local.

## Camino 3 — Paquete (entrega offline)

Comprimí la carpeta `keel-skills/` y entregala. El comprador la descomprime y usa el
Camino 2 apuntando a la ruta donde la dejó.

## Antes de publicar (checklist)

- [x] Completar `author.homepage` en `plugin.json` y el contacto en docs.
- [x] Licencia **MIT** + `NOTICE` con la atribución pedida. (Decisión 2026-06-19:
      se relicenció desde source-available/no-reventa a MIT para habilitar adopción
      y reimplementación libres — ver `STRATEGY.md`.)
- [x] Bump de versión sincronizado en `plugin.json`, `marketplace.json` y `CHANGELOG.md` (0.3.0).
- [ ] Confirmar que NINGÚN dato propio quedó en las skills (deben ser genéricas;
      todo lo específico va en el `AGENT_POLICY.md` del comprador).
- [ ] Probar el ciclo completo: `marketplace add` → `install` → `/keel-skills:policy-init`
      → disparar cada skill con una situación real, y verificar que el hook
      `SessionStart` inyecta el `AGENT_POLICY.md` al abrir sesión.
- [ ] Grabar el demo de 60s (`examples/demo-script.md`) y embeberlo en el README.
