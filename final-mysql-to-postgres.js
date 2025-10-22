const fs = require('fs');

console.log('🔄 Conversion finale MySQL → PostgreSQL\n');

// Lire le fichier MySQL
console.log('📖 Lecture du dump MySQL...');
let sql = fs.readFileSync('demo-mysql_nursecare.sql', 'utf8');
console.log('✅ Fichier lu\n');

// 1. Supprimer les commentaires et directives MySQL
console.log('🧹 Nettoyage...');
sql = sql.replace(/\/\*!.*?\*\/;?/gs, '');
sql = sql.replace(/--[^\n]*\n/g, '');
sql = sql.replace(/SET SQL_MODE.*?;/g, '');
sql = sql.replace(/START TRANSACTION;/g, '');
sql = sql.replace(/COMMIT;/g, '');
sql = sql.replace(/SET time_zone.*?;/g, '');
sql = sql.replace(/SET NAMES.*?;/g, '');
sql = sql.replace(/SET character_set_client.*?;/g, '');
console.log('✅ Nettoyé\n');

// 2. Remplacer les backticks AVANT tout traitement
console.log('✏️  Remplacement des backticks...');
sql = sql.replace(/`/g, '"');
console.log('✅ Backticks remplacés\n');

// 3. Gérer les ENUM - extraire et remplacer
console.log('🔧 Traitement des ENUMs...');
const enumPatterns = [];
sql = sql.replace(/enum\(([^)]+)\)/gi, (match, values) => {
  // Garder la liste des valeurs pour créer un type custom plus tard
  const enumValues = values.split(',').map(v => v.trim().replace(/'/g, ''));
  enumPatterns.push(enumValues);
  // Pour l'instant, on remplace par VARCHAR
  return 'VARCHAR(50)';
});
console.log(`✅ ${enumPatterns.length} ENUMs convertis en VARCHAR\n`);

// 4. Remplacer les types de données
console.log('🔧 Conversion des types...');
sql = sql.replace(/\bint\(\d+\)/gi, 'INTEGER');
sql = sql.replace(/\btinyint\s*\(\s*1\s*\)/gi, 'BOOLEAN');
sql = sql.replace(/\btinyint\s*\(\s*\d+\s*\)/gi, 'SMALLINT');
sql = sql.replace(/\bdatetime\b/gi, 'TIMESTAMP');
sql = sql.replace(/current_timestamp\s*\(\s*\)/gi, 'CURRENT_TIMESTAMP');
console.log('✅ Types convertis\n');

// 5. Supprimer ON UPDATE CURRENT_TIMESTAMP (non supporté par PostgreSQL)
console.log('🗑️  Suppression de ON UPDATE...');
sql = sql.replace(/\s+ON UPDATE CURRENT_TIMESTAMP/gi, '');
console.log('✅ ON UPDATE supprimé\n');

// 6. Gérer AUTO_INCREMENT
console.log('🔑 Traitement AUTO_INCREMENT...');
// Trouver les colonnes avec AUTO_INCREMENT et les convertir en SERIAL
sql = sql.replace(/\"(\w+)\"\s+INTEGER\s+NOT NULL\s+AUTO_INCREMENT/gi, '"$1" SERIAL PRIMARY KEY');
sql = sql.replace(/\"(\w+)\"\s+INTEGER\s+AUTO_INCREMENT/gi, '"$1" SERIAL PRIMARY KEY');
// Supprimer les AUTO_INCREMENT restants
sql = sql.replace(/\s*AUTO_INCREMENT\s*/gi, ' ');
console.log('✅ AUTO_INCREMENT traité\n');

// 7. Supprimer les clauses MySQL spécifiques
console.log('🗑️  Suppression des clauses MySQL...');
sql = sql.replace(/\s*ENGINE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*DEFAULT\s+CHARSET\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*COLLATE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
console.log('✅ Clauses supprimées\n');

// 8. Nettoyer les KEY et INDEX
console.log('🔨 Nettoyage des INDEX...');
sql = sql.replace(/,\s*PRIMARY\s+KEY\s+\([^)]+\)/gi, ''); // On les a déjà avec SERIAL
sql = sql.replace(/,\s*KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
sql = sql.replace(/,\s*UNIQUE\s+KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
sql = sql.replace(/,\s*CONSTRAINT\s+"[^"]+"\s+FOREIGN KEY[^;]+/gi, '');
sql = sql.replace(/,\s*,/g, ',');
sql = sql.replace(/,\s*\)/g, ')');
console.log('✅ INDEX nettoyés\n');

// 9. Corriger les DEFAULT avec booléens
console.log('✅ Correction des DEFAULT booléens...');
sql = sql.replace(/DEFAULT\s+1/gi, 'DEFAULT TRUE');
sql = sql.replace(/DEFAULT\s+0/gi, 'DEFAULT FALSE');
console.log('✅ DEFAULT corrigés\n');

// 10. NE PAS convertir les valeurs dans les INSERT
// PostgreSQL accepte 0/1 pour les booléens, donc on garde tel quel

// 11. Échapper les apostrophes
console.log('📝 Échappement des apostrophes...');
sql = sql.replace(/\\'/g, "''");
console.log('✅ Apostrophes échappées\n');

// 12. Nettoyer les lignes vides
sql = sql.replace(/\n\n\n+/g, '\n\n');

// 13. Créer l'en-tête
const pgHeader = `-- PostgreSQL dump converted from MySQL
-- Database: nursecare_db
-- Conversion date: ${new Date().toISOString()}

BEGIN;

-- Désactiver temporairement les contraintes
SET session_replication_role = 'replica';

`;

// 14. Créer le pied de page
const pgFooter = `

-- Réactiver les contraintes
SET session_replication_role = 'origin';

COMMIT;
`;

sql = pgHeader + sql + pgFooter;

// Sauvegarder
console.log('💾 Sauvegarde...');
fs.writeFileSync('postgres_final.sql', sql, 'utf8');
console.log('✅ Fichier sauvegardé: postgres_final.sql\n');

console.log('═'.repeat(60));
console.log('🎉 Conversion terminée!');
console.log('═'.repeat(60));
console.log('\n📋 Fichier prêt pour l\'import PostgreSQL\n');
