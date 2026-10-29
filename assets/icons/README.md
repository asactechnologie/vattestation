# Icônes de l'application (sources SVG)

Sources vectorielles éditables des icônes PWA. Le globe et le logotype ASAC sont des tracés vectoriels issus de `public/assets/logo_asac.png`.

| Fichier | Fichiers générés |
|---|---|
| `icon.svg` | `public/asac_icon_192.png`, `public/asac_icon_512.png`, `app/icon.png` |
| `icon-maskable.svg` | `public/asac_icon_maskable_192.png`, `public/asac_icon_maskable_512.png` (Android) |
| `icon-apple.svg` | `app/apple-icon.png` (iOS, 180 px) |
| `favicon.svg` | `app/favicon.ico` (16/32/48 px) |

Calques nommés dans chaque SVG : `background`, `glow-layer`, `ring`, `logo` (`globe`, `wordmark`, `tricolor`), `sheen-layer`, `edge-layer`.

- **Couleurs** : dégradé `bg` et halo `glow` dans `<defs>`.
- **icon-maskable.svg** : garder le logo dans le cercle central de 80 % (zone de sécurité Android).
- **favicon.svg** : version simplifiée (rayures fusionnées) pour rester lisible en 16 px.

Après modification, régénérer les PNG et le favicon :

```bash
pnpm add -D playwright && node scripts/generate-icons.mjs
```

Le script utilise Google Chrome installé localement. Pensez ensuite à incrémenter `CACHE_NAME` dans `public/sw.js`.
