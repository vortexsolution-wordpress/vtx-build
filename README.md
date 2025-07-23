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


# Development

## Configuration
Utiliser npm link pour lier le package localement, ce qui permet de tester les modifications sans avoir à publier le package à chaque fois.

```bash
npm link
```
puis dans votre projet :

```bash
npm link vtx-build
```

## Mise à jour du package
Modifiez le fichier `package.json` pour mettre à jour la version du package.
