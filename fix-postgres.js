const fs = require('fs');
const path = require('path');

// Fichiers à convertir
const files = [
  'src/models/facture.ts',
  'src/models/prestation.ts',
  'src/models/stagiaire.ts',
  'src/models/ecole.ts',
  'src/models/categorie.ts',
];

function replacePlaceholders(query) {
  let counter = 1;
  return query.replace(/\?/g, () => `$${counter++}`);
}

function convertFileContent(content) {
  let result = content;

  // Étape 1: Remplacer pool.execute par pool.query
  result = result.replace(/pool\.execute\(/g, 'pool.query(');

  // Étape 2: Convertir les destructuring patterns
  result = result.replace(/const \[rows\]:\s*any\s*=\s*await pool\.query/g, 'const result = await pool.query');
  result = result.replace(/const \[result\]:\s*any\s*=\s*await pool\.query/g, 'const result = await pool.query');
  result = result.replace(/const \[ecoles\]:\s*any\s*=\s*await pool\.query/g, 'const ecolesResult = await pool.query');
  result = result.replace(/const \[stagiaires\]:\s*any\s*=\s*await pool\.query/g, 'const stagiairesResult = await pool.query');
  result = result.replace(/const \[tuteurs\]:\s*any\s*=\s*await pool\.query/g, 'const tuteursResult = await pool.query');
  result = result.replace(/const \[notes\]:\s*any\s*=\s*await pool\.query/g, 'const notesResult = await pool.query');
  result = result.replace(/const \[lignes\]:\s*any\s*=\s*await pool\.query/g, 'const lignesResult = await pool.query');

  // Étape 3: Remplacer les références à rows/result
  result = result.replace(/return rows;/g, 'return result.rows;');
  result = result.replace(/return rows\.length \? rows\[0\] : null;/g, 'return result.rows.length ? result.rows[0] : null;');
  result = result.replace(/if \(rows\.length === 0\) return null;/g, 'if (result.rows.length === 0) return null;');
  result = result.replace(/const row = rows\[0\];/g, 'const row = result.rows[0];');
  result = result.replace(/const facture = rows\[0\];/g, 'const facture = result.rows[0];');
  result = result.replace(/const count = rows\[0\]\.count/g, 'const count = result.rows[0].count');

  // Étape 4: result.insertId -> result.rows[0]
  result = result.replace(/const id = result\.insertId;/g, 'const id = result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idfacture || result.rows[0].idligne;');
  result = result.replace(/return result\.insertId;/g, 'return result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idfacture || result.rows[0].idligne;');

  // Étape 5: result.affectedRows -> result.rowCount
  result = result.replace(/result\.affectedRows/g, 'result.rowCount');
  result = result.replace(/return result\.rowCount;/g, 'return result.rowCount || 0;');
  result = result.replace(/return result\.rowCount > 0;/g, 'return result.rowCount !== null && result.rowCount > 0;');

  // Étape 6: rows.map -> result.rows.map
  result = result.replace(/rows\.map\(/g, 'result.rows.map(');

  // Étape 7: Remplacer les variables destructurées personnalisées
  result = result.replace(/for \(const ecole of ecoles\)/g, 'for (const ecole of ecolesResult.rows)');
  result = result.replace(/stagiaire\.tuteur = tuteurs\[0\]/g, 'stagiaire.tuteur = tuteursResult.rows[0]');
  result = result.replace(/stagiaire\.notes = notes;/g, 'stagiaire.notes = notesResult.rows;');
  result = result.replace(/ecole\.stagiaires = stagiaires;/g, 'ecole.stagiaires = stagiairesResult.rows;');
  result = result.replace(/facture\.lignes = lignes;/g, 'facture.lignes = lignesResult.rows;');
  result = result.replace(/if \(stagiaires\.length === 0\) return null;/g, 'if (stagiairesResult.rows.length === 0) return null;');
  result = result.replace(/const stagiaire = stagiaires\[0\];/g, 'const stagiaire = stagiairesResult.rows[0];');

  // Étape 8: JSON_OBJECT -> json_build_object
  result = result.replace(/JSON_OBJECT\(/g, 'json_build_object(');

  // Étape 9: YEAR() et NOW()
  result = result.replace(/YEAR\(([^)]+)\)/g, 'EXTRACT(YEAR FROM $1)');
  result = result.replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');

  // Étape 10: Convertir les placeholders ? en $1, $2, etc.
  const lines = result.split('\n');
  const fixedLines = [];

  for (let line of lines) {
    // Si la ligne contient une query SQL avec des placeholders
    if (line.includes('pool.query') ||
        (line.trim().startsWith('`') && line.includes('?')) ||
        (line.includes('INSERT') || line.includes('UPDATE') || line.includes('SELECT') || line.includes('DELETE')) && line.includes('?')) {

      // Trouver les parties avec des ?
      const matches = line.match(/`[^`]*`/g);
      if (matches) {
        for (const match of matches) {
          if (match.includes('?')) {
            const fixed = replacePlaceholders(match);
            line = line.replace(match, fixed);
          }
        }
      }
    }
    fixedLines.push(line);
  }

  return fixedLines.join('\n');
}

console.log('🚀 Début de la conversion MySQL → PostgreSQL\n');

for (const file of files) {
  const fullPath = path.join(__dirname, file);

  if (fs.existsSync(fullPath)) {
    try {
      console.log(`📝 Traitement de ${file}...`);
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      const convertedContent = convertFileContent(originalContent);

      fs.writeFileSync(fullPath, convertedContent, 'utf8');
      console.log(`✅ ${file} converti avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de la conversion de ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
}

console.log('\n✨ Conversion terminée!');
console.log('\n📋 Rappel: Vérifiez manuellement les fichiers pour des cas particuliers comme:');
console.log('  - Les RETURNING clauses pour les INSERT');
console.log('  - Les noms de colonnes en lowercase dans PostgreSQL');
console.log('  - Les fonctions spécifiques à MySQL qui n\'ont pas d\'équivalent direct');
