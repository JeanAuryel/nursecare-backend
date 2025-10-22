const fs = require('fs');
const path = require('path');

/**
 * Script de conversion MySQL vers PostgreSQL
 * Convertit automatiquement tous les fichiers qui utilisent pool.execute vers pool.query
 */

const files = [
  'src/models/facture.ts',
  'src/models/prestation.ts',
  'src/models/stagiaire.ts',
  'src/models/ecole.ts',
  'src/models/categorie.ts',
  'src/controllers/statsController.ts',
  'src/controllers/secretariatController.ts'
];

function convertFile(filePath) {
  console.log(`\n🔄 Conversion de ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // 1. Remplacer pool.execute par pool.query
  const executeCount = (content.match(/pool\.execute/g) || []).length;
  content = content.replace(/pool\.execute/g, 'pool.query');
  changes += executeCount;

  // 2. Remplacer les destructuring [rows] par result
  content = content.replace(/const \[rows\]: any = await pool\.query/g, 'const result = await pool.query');
  content = content.replace(/const \[result\]: any = await pool\.query/g, 'const result = await pool.query');

  // 3. Remplacer rows par result.rows dans les returns simples
  content = content.replace(/return rows;$/gm, 'return result.rows;');
  content = content.replace(/return rows\.length \? rows\[0\] : null;/g, 'return result.rows.length ? result.rows[0] : null;');
  content = content.replace(/if \(rows\.length === 0\) return null;/g, 'if (result.rows.length === 0) return null;/');

  // 4. Remplacer result.insertId par result.rows[0].id (avec variations)
  content = content.replace(/return result\.insertId;/g, 'return result.rows[0].idpatient || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idfacture || result.rows[0].idligne;');

  // 5. Remplacer result.affectedRows par result.rowCount
  content = content.replace(/result\.affectedRows/g, 'result.rowCount');
  content = content.replace(/return result\.rowCount;/g, 'return result.rowCount || 0;');
  content = content.replace(/return result\.rowCount > 0;/g, 'return result.rowCount !== null && result.rowCount > 0;');

  // 6. Remplacer les placeholders ? par $1, $2, etc.
  content = convertPlaceholders(content);

  // 7. Remplacer JSON_OBJECT par json_build_object
  content = content.replace(/JSON_OBJECT\(/g, 'json_build_object(');

  // 8. Remplacer YEAR() et autres fonctions MySQL
  content = content.replace(/YEAR\(([^)]+)\)/g, 'EXTRACT(YEAR FROM $1)');
  content = content.replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');

  // 9. Remplacer les références à rows après les conversions
  content = content.replace(/const row = rows\[0\];/g, 'const row = result.rows[0];');
  content = content.replace(/rows\.map\(/g, 'result.rows.map(');
  content = content.replace(/facture\.lignes = lignes;/g, 'facture.lignes = result.rows;');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${filePath} converti (${changes} modifications)`);
}

function convertPlaceholders(content) {
  const lines = content.split('\n');
  const result = [];

  for (let line of lines) {
    // Compter les ? dans les queries SQL
    if (line.includes('pool.query') || line.includes('INSERT') || line.includes('UPDATE') || line.includes('SELECT') || line.includes('DELETE')) {
      let placeholderCount = 1;
      line = line.replace(/\?/g, () => `$${placeholderCount++}`);
    }
    result.push(line);
  }

  return result.join('\n');
}

console.log('🚀 Début de la conversion MySQL → PostgreSQL\n');

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    try {
      convertFile(fullPath);
    } catch (error) {
      console.error(`❌ Erreur lors de la conversion de ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
}

console.log('\n✨ Conversion terminée!');
