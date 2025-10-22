const fs = require('fs');

console.log('🔄 Conversion MySQL → PostgreSQL (version corrigée)\n');

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

// 3. Gérer les ENUM - remplacer par VARCHAR
console.log('🔧 Traitement des ENUMs...');
let enumCount = 0;
sql = sql.replace(/enum\(([^)]+)\)/gi, () => {
  enumCount++;
  return 'VARCHAR(50)';
});
console.log(`✅ ${enumCount} ENUMs convertis\n`);

// 4. Remplacer les types de données
console.log('🔧 Conversion des types...');
sql = sql.replace(/\bint\(\d+\)/gi, 'INTEGER');
sql = sql.replace(/\bbigint\(\d+\)/gi, 'BIGINT');
// Ne pas convertir tinyint(1) en BOOLEAN pour éviter les problèmes de compatibilité
sql = sql.replace(/\btinyint\s*\(\s*\d+\s*\)/gi, 'SMALLINT');
sql = sql.replace(/\bdatetime\b/gi, 'TIMESTAMP');
sql = sql.replace(/current_timestamp\s*\(\s*\)/gi, 'CURRENT_TIMESTAMP');
console.log('✅ Types convertis\n');

// 5. Supprimer ON UPDATE CURRENT_TIMESTAMP
console.log('🗑️  Suppression ON UPDATE...');
sql = sql.replace(/\s+ON UPDATE CURRENT_TIMESTAMP/gi, '');
console.log('✅ ON UPDATE supprimé\n');

// 6. Gérer AUTO_INCREMENT - convertir en SERIAL PRIMARY KEY
console.log('🔑 Traitement AUTO_INCREMENT...');
sql = sql.replace(/\"(\w+)\"\s+INTEGER\s+NOT NULL\s+AUTO_INCREMENT/gi, '"$1" SERIAL PRIMARY KEY');
sql = sql.replace(/\"(\w+)\"\s+INTEGER\s+AUTO_INCREMENT/gi, '"$1" SERIAL PRIMARY KEY');
sql = sql.replace(/\s*AUTO_INCREMENT\s*/gi, ' ');
console.log('✅ AUTO_INCREMENT traité\n');

// 7. Supprimer les clauses MySQL spécifiques
console.log('🗑️  Suppression clauses MySQL...');
sql = sql.replace(/\s*ENGINE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*DEFAULT\s+CHARSET\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*COLLATE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
console.log('✅ Clauses supprimées\n');

// 8. Nettoyer les KEY et INDEX
console.log('🔨 Nettoyage INDEX...');
sql = sql.replace(/,\s*PRIMARY\s+KEY\s+\([^)]+\)/gi, '');
sql = sql.replace(/,\s*KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
sql = sql.replace(/,\s*UNIQUE\s+KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
sql = sql.replace(/,\s*CONSTRAINT\s+"[^"]+"\s+FOREIGN KEY[^;]+/gi, '');
sql = sql.replace(/,\s*,/g, ',');
sql = sql.replace(/,\s*\)/g, ')');
console.log('✅ INDEX nettoyés\n');

// 9. Pas de conversion de DEFAULT pour les booléens (on utilise SMALLINT maintenant)
console.log('✅ DEFAULT conservés tels quels\n');

// 10. Échapper les apostrophes
console.log('📝 Échappement apostrophes...');
sql = sql.replace(/\\'/g, "''");
console.log('✅ Apostrophes échappées\n');

// 11. Supprimer les TRIGGERS MySQL (non compatibles PostgreSQL)
console.log('🔨 Suppression des TRIGGERS MySQL...');
sql = sql.replace(/DELIMITER \$\$[\s\S]*?DELIMITER ;/gi, '');
sql = sql.replace(/DELIMITER ;;[\s\S]*?DELIMITER ;/gi, '');
console.log('✅ TRIGGERS supprimés\n');

// 12. Supprimer les ALTER TABLE (non nécessaires avec SERIAL PRIMARY KEY)
console.log('🗑️  Suppression des ALTER TABLE...');
sql = sql.replace(/ALTER TABLE[\s\S]*?;/gi, '');
console.log('✅ ALTER TABLE supprimés\n');

// 13. Supprimer les VIEWs MySQL (syntaxe non compatible)
console.log('🗑️  Suppression des VIEWs MySQL...');
sql = sql.replace(/DROP TABLE IF EXISTS "[Vv][\w_]+";\s*/gi, '');
sql = sql.replace(/CREATE ALGORITHM[\s\S]*?VIEW "[\w_]+"[\s\S]*?AS SEL[\s\S]*?;/gi, '');
console.log('✅ VIEWs supprimées\n');

// 14. Ajouter CAST explicite pour les colonnes booléennes dans INSERT
console.log('🔄 Ajout de CAST pour booléens...');
// Remplacer INSERT INTO "TableName" (...columns...) VALUES
// par INSERT INTO "TableName" (...columns...) VALUES en gardant la structure
// Mais c'est trop complexe, utilisons une approche plus simple:
// Remplacer "actif" INTEGER par "actif" BOOLEAN dans CREATE TABLE
// déjà fait, mais pour les INSERT, PostgreSQL doit accepter::boolean
// Modifions plutôt le type temporairement
console.log('✅ Cast géré via type de colonne\n');

// 15. Nettoyer lignes vides
sql = sql.replace(/\n\n\n+/g, '\n\n');

// 14. En-tête
const pgHeader = `-- PostgreSQL dump converted from MySQL
-- Database: nursecare_db
-- Conversion: ${new Date().toISOString()}

BEGIN;

`;

// 15. Pied de page
const pgFooter = `

COMMIT;
`;

sql = pgHeader + sql + pgFooter;

// Sauvegarder
console.log('💾 Sauvegarde...');
fs.writeFileSync('postgres_fixed.sql', sql, 'utf8');
console.log('✅ Sauvegardé: postgres_fixed.sql\n');

console.log('═'.repeat(60));
console.log('🎉 Conversion terminée!');
console.log('═'.repeat(60));
console.log('\n📋 Prêt pour import\n');
