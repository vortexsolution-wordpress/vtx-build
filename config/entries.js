import path from 'path';
import { glob } from 'glob';
import {exit} from "@wordpress/scripts/utils/process.js";

const entries = {};

// Utilitaires pour générer les noms d'entrée propres
const generateEntryName = (prefix, filePath) => {
  const parsed = path.parse(filePath);
  return `${parsed.name}`;
};

// Helper : ajouter des fichiers à entry
const addFilesToEntry = (pattern, prefix) => {
  const files = glob.sync(pattern, { ignore: '**/_*.*' });

  files.forEach((file) => {
    const name = generateEntryName(prefix, file);
    const fullPath = path.resolve(process.cwd(), file);
    if(!entries[name]) {
      entries[name] = [];
    }
    entries[name].push(fullPath);
  });
};

// Ajout des scripts globaux
addFilesToEntry('assets/scripts/*.js', 'js');
// Ajout des scripts des blocs
addFilesToEntry('blocks/!(_*)/assets/*.js', 'js');

// Ajout des styles globaux
addFilesToEntry('assets/styles/*.scss', 'css');
// Ajout des styles des blocs
addFilesToEntry('blocks/!(_*)/assets/*.scss', 'css');


// Sécurité : vérifier qu'on a bien des entrées
if (Object.keys(entries).length === 0) {
  console.warn('[vtx-build] ⚠️ Aucun fichier trouvé pour compiler.');
}

export default entries;
