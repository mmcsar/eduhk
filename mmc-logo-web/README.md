# MMC Logo — React + Tailwind

Version web moderne du sceau « Maintenance de Matériel au Congo », bâtie avec React 18, Vite et Tailwind CSS 3. Tous les cercles, les textes courbes et la typographie centrale sont générés via SVG et utilitaires Tailwind pour garder un rendu net et responsive.

## Stack & Features
- React 18 + Vite
- Tailwind CSS 3 (JIT, classes arbitraires, backdrop blur, animations custom)
- SVG `textPath` pour le lettrage circulaire + cercles animés (stroke-dash)
- Google Fonts (`Inter`, `Playfair Display`)
- Bouton « Relancer l’animation » (re-render contrôlé côté React)

## Lancer le projet
```bash
cd mmc-logo-web
npm install        # déjà exécuté mais à refaire après un clone
npm run dev        # démarre Vite sur http://localhost:5173
```

## Personnalisation
- Couleurs, typo, ombres & animations : `tailwind.config.js`
- Mise en page principale + contrôles : `src/App.jsx`
- Styles globaux + directives Tailwind : `src/index.css`

Les textes « MAINTENANCE DE MATERIEL » et « AU CONGO » peuvent être remplacés par n’importe quelle chaîne (les arcs s’ajustent automatiquement). Les cercles utilisent des classes Tailwind avec valeurs arbitraires (`stroke-[1.5px]`, `tracking-[0.75em]`, etc.) pour un contrôle précis sans CSS personnalisé.
