import path from 'path';
import { glob } from 'glob';

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
    entries[name] = fullPath;
  });
};

// Ajout des scripts globaux
addFilesToEntry('assets/scripts/*.js', 'scripts');
// Ajout des scripts des blocs
addFilesToEntry('blocks/!(_*)/assets/*.js', 'scripts');

// Ajout des styles globaux
addFilesToEntry('assets/styles/*.scss', 'styles');
// Ajout des styles des blocs
addFilesToEntry('blocks/!(_*)/assets/*.scss', 'styles');


// Sécurité : vérifier qu'on a bien des entrées
if (Object.keys(entries).length === 0) {
  console.warn('[vtx-build] ⚠️ Aucun fichier trouvé pour compiler.');
}

export default entries;
