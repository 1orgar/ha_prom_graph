# Dashboard cards — development

```bash
npm install
npm run watch   # dev build
npm test        # unit tests (vitest)
npm run build   # production build -> ../custom_components/prometheus_dashboard/www/
```

The bundle `custom_components/prometheus_dashboard/www/prometheus-dashboard-cards.js` is committed (HACS
installs the integration folder as is) and served by the integration. Rebuild before committing — CI checks it.

**Version:** the cards use `version` of `custom_components/prometheus_dashboard/manifest.json` (injected as
`__VERSION__` and added to the resource URL as `?v=`, so browsers load the new cards after an update).
Releases are made by the integration workflow.

**Screenshots** (`../images/*.png`) are generated from `demo/` with the built-in demo data:

```bash
npm run build
npm i --no-save playwright-core
npm run screenshots   # uses the installed Google Chrome (CHROME_PATH=... to override)
```

Card previews in *Add card* use the same demo data (`src/demo/demo-data.ts`), so they look good
on any Prometheus server; real queries run once the card is added.

User documentation: [CARDS.md](../CARDS.md).
