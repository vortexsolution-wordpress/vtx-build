# vtx-build

Outil CLI pour compiler des projets WordPress avec `@wordpress/scripts` + configs customisées Webpack & ESLint.

## 🚀 Installation

```bash
npm install --save-dev vortexsolution-wordpress/vtx-build
```

## 📋 Utilisation

### Scripts disponibles

Vous pouvez utiliser les commandes suivantes dans votre projet :

```bash
# Compiler les assets en mode production
vtx-build build

# Compiler les assets en mode développement et surveiller les changements
vtx-build start
```


### Exemple de configuration

Voici un exemple de configuration dans le `package.json` de votre thème WordPress :

```json
{
  "name": "mon-theme-wordpress",
  "version": "1.0.0",
  "scripts": {
    "build": "cross-env NODE_ENV=production vtx-build build",
    "start": "cross-env NODE_ENV=development vtx-build start"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "vtx-build": "^1.0.0"
  }
}
