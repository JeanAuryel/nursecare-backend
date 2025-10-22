const fs = require('fs');

console.log('🔄 Conversion intelligente MySQL → PostgreSQL\n');

// Lire le fichier MySQL
console.log('📖 Lecture du dump MySQL...');
let sql = fs.readFileSync('demo-mysql_nursecare.sql', 'utf8');
console.log('✅ Fichier lu\n');

// 1. Supprimer les commentaires et directives MySQL
console.log('🧹 Nettoyage des commentaires et directives MySQL...');
sql = sql.replace(/\/\*!.*?\*\/;?/gs, '');
sql = sql.replace(/--[^\n]*\n/g, '');
sql = sql.replace(/SET SQL_MODE.*?;/g, '');
sql = sql.replace(/START TRANSACTION;/g, '');
sql = sql.replace(/COMMIT;/g, '');
sql = sql.replace(/SET time_zone.*?;/g, '');
sql = sql.replace(/SET NAMES.*?;/g, '');
sql = sql.replace(/SET character_set_client.*?;/g, '');
console.log('✅ Nettoyage terminé\n');

// 2. Remplacer les types de données
console.log('🔧 Conversion des types de données...');
// Remplacer int(X) par INTEGER
sql = sql.replace(/\bint\(\d+\)/gi, 'INTEGER');
// Remplacer tinyint(1) par BOOLEAN
sql = sql.replace(/\btinyint\s*\(\s*1\s*\)/gi, 'BOOLEAN');
// Remplacer tinyint(X) par SMALLINT
sql = sql.replace(/\btinyint\s*\(\s*\d+\s*\)/gi, 'SMALLINT');
// Remplacer datetime par TIMESTAMP
sql = sql.replace(/\bdatetime\b/gi, 'TIMESTAMP');
// Remplacer current_timestamp() par CURRENT_TIMESTAMP
sql = sql.replace(/current_timestamp\s*\(\s*\)/gi, 'CURRENT_TIMESTAMP');
console.log('✅ Types convertis\n');

// 3. Gérer AUTO_INCREMENT et PRIMARY KEY
console.log('🔑 Traitement des clés primaires et AUTO_INCREMENT...');
// Trouver les colonnes avec AUTO_INCREMENT et les marquer comme SERIAL
sql = sql.replace(/`(\w+)`\s+INTEGER\s+NOT NULL\s+AUTO_INCREMENT/gi, '"$1" SERIAL');
sql = sql.replace(/`(\w+)`\s+INTEGER\s+AUTO_INCREMENT/gi, '"$1" SERIAL');
// Supprimer les AUTO_INCREMENT restants
sql = sql.replace(/\s*AUTO_INCREMENT\s*/gi, ' ');
console.log('✅ Clés traitées\n');

// 4. Remplacer backticks par double quotes
console.log('✏️  Remplacement des backticks...');
sql = sql.replace(/`/g, '"');
console.log('✅ Backticks remplacés\n');

// 5. Supprimer les clauses MySQL spécifiques
console.log('🗑️  Suppression des clauses MySQL spécifiques...');
sql = sql.replace(/\s*ENGINE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*DEFAULT\s+CHARSET\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*COLLATE\s*=\s*\w+/gi, '');
sql = sql.replace(/\s*AUTO_INCREMENT\s*=\s*\d+/gi, '');
console.log('✅ Clauses supprimées\n');

// 6. Nettoyer les KEY et INDEX
console.log('🔨 Nettoyage des INDEX et KEY...');
// Supprimer les KEY qui ne sont pas PRIMARY
sql = sql.replace(/,\s*KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
sql = sql.replace(/,\s*UNIQUE\s+KEY\s+"[^"]+"\s*\([^)]+\)/gi, '');
// Nettoyer les virgules doubles ou finales avant parenthèse fermante
sql = sql.replace(/,\s*,/g, ',');
sql = sql.replace(/,\s*\)/g, ')');
console.log('✅ INDEX nettoyés\n');

// 7. Gérer les valeurs booléennes dans les INSERT
console.log('🔄 Conversion des valeurs booléennes...');
// Dans les INSERT, remplacer les valeurs numériques pour les colonnes booléennes
// Cette étape est approximative - PostgreSQL accepte 0/1 mais préfère TRUE/FALSE
sql = sql.replace(/\((0|1),/g, (match, p1) => `(${p1 === '1' ? 'TRUE' : 'FALSE'},`);
sql = sql.replace(/,(0|1),/g, (match, p1) => `,${p1 === '1' ? 'TRUE' : 'FALSE'},`);
sql = sql.replace(/,(0|1)\)/g, (match, p1) => `,${p1 === '1' ? 'TRUE' : 'FALSE'})`);
console.log('✅ Booléens convertis\n');

// 8. Échapper les apostrophes dans les chaînes
console.log('📝 Échappement des apostrophes...');
// PostgreSQL utilise '' pour échapper les apostrophes dans les chaînes
// Chercher les chaînes entre apostrophes et doubler les apostrophes internes
sql = sql.replace(/\\'/g, "''");
console.log('✅ Apostrophes échappées\n');

// 9. Gérer les séquences pour les colonnes SERIAL
console.log('📊 Préparation des séquences...');
// PostgreSQL crée automatiquement des séquences pour SERIAL
// On doit les réinitialiser après l'import des données
const sequenceResets = [];
const tableMatches = sql.matchAll(/CREATE TABLE "(\w+)"/gi);
for (const match of tableMatches) {
  const tableName = match[1];
  sequenceResets.push(`SELECT setval('"${tableName}_id_seq"', (SELECT MAX(id) FROM "${tableName}") + 1, false);`);
}
console.log(`✅ ${sequenceResets.length} séquences à réinitialiser\n`);

// 10. Nettoyer les lignes vides multiples
sql = sql.replace(/\n\n\n+/g, '\n\n');

// 11. Ajouter l'en-tête PostgreSQL
const pgHeader = `-- PostgreSQL dump converted from MySQL
-- Database: nursecare_db
-- Conversion date: ${new Date().toISOString()}

BEGIN;

-- Désactiver temporairement les contraintes de clés étrangères
SET session_replication_role = 'replica';

`;

// 12. Ajouter le pied de page avec réactivation des contraintes et réinitialisation des séquences
const pgFooter = `

-- Réactiver les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- Réinitialiser les séquences pour les colonnes SERIAL
${sequenceResets.join('\n')}

COMMIT;

-- Migration terminée
`;

sql = pgHeader + sql + pgFooter;

// Sauvegarder le fichier
console.log('💾 Sauvegarde du fichier PostgreSQL...');
fs.writeFileSync('postgres_dump_v2.sql', sql, 'utf8');
console.log('✅ Fichier sauvegardé: postgres_dump_v2.sql\n');

console.log('═'.repeat(60));
console.log('🎉 Conversion terminée avec succès!');
console.log('═'.repeat(60));
console.log('\n📋 Étapes suivantes:');
console.log('   1. Vérifiez le fichier postgres_dump_v2.sql');
console.log('   2. Importez-le dans PostgreSQL Render');
console.log('   3. Vérifiez que toutes les données sont présentes\n');
console.log('⚠️  NOTE: Certaines conversions peuvent nécessiter des ajustements manuels.');
console.log('   En cas d\'erreur, consultez les logs PostgreSQL.\n');
