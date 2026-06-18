# Distribución de Keel

Keel está estructurado como un **marketplace de un solo plugin**, que es la forma
directamente instalable en Claude Code. Hay tres caminos de entrega.

## Estructura del repo

```
keel/
  .claude-plugin/
    marketplace.json          ← define el marketplace y lista el plugin "keel"
  plugins/
    keel/
      .claude-plugin/
        plugin.json           ← manifiesto del plugin
      skills/
        authorization-protocol/SKILL.md
        model-delegation/SKILL.md
        context-discipline/SKILL.md
      commands/
        policy-init.md        ← /keel:policy-init
      templates/
        AGENT_POLICY.template.md
      README.md
  README.md                   ← overview comercial (español)
  LICENSE                     ← licencia comercial (template)
  CHANGELOG.md
  DISTRIBUTION.md             ← este archivo
```

## Camino 1 — Repositorio git público (camino elegido)

El repo ya está inicializado localmente con el primer commit. Falta crear el
remoto público y subirlo:

```
# Con GitHub CLI (gh) ya autenticado, desde C:\roadtobiz\_experimentos\keel:
gh repo create keel --public --source . --remote origin --push

# O manual: creás el repo vacío en github.com y luego:
git remote add origin https://github.com/quitohooded/keel.git
git branch -M main
git push -u origin main
```

Después, cualquiera instala con:

```
/plugin marketplace add https://github.com/quitohooded/keel
/plugin install keel@keel
```

Para actualizar, publicás un commit nuevo y el usuario hace
`/plugin marketplace update keel`. La licencia (source-available con atribución,
sin reventa) vive en `LICENSE`.

## Camino 2 — Ruta local (para pruebas o entrega directa)

```
/plugin marketplace add C:/ruta/a/keel
/plugin install keel@keel
```

Útil para validar antes de publicar, o para entregar a un cliente que prefiere
instalación local.

## Camino 3 — Paquete (entrega offline)

Comprimí la carpeta `keel/` y entregala. El comprador la descomprime y usa el
Camino 2 apuntando a la ruta donde la dejó.

## Antes de publicar (checklist)

- [ ] Completar `author.homepage` en `plugin.json` y el contacto en `LICENSE`.
- [ ] Revisar la licencia con asesoría legal (el `LICENSE` es un template).
- [ ] Confirmar que NINGÚN dato propio quedó en las skills (deben ser genéricas;
      todo lo específico va en el `AGENT_POLICY.md` del comprador).
- [ ] Probar el ciclo completo: `marketplace add` → `install` → `/keel:policy-init`
      → disparar cada skill con una situación real.
- [ ] Bump de versión en `plugin.json`, `marketplace.json` y `CHANGELOG.md`.
```
