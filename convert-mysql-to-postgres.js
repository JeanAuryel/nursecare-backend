const fs = require('fs');

console.log('🔄 Conversion MySQL → PostgreSQL...');

// Lire le fichier MySQL
let sql = fs.readFileSync('demo-mysql_nursecare.sql', 'utf8');

// 1. Supprimer les commentaires MySQL spécifiques
sql = sql.replace(/\/\*!.*?\*\/;?/gs, '');
sql = sql.replace(/-- phpMyAdmin.*?\n/g, '');
sql = sql.replace(/-- Host:.*?\n/g, '');
sql = sql.replace(/-- Generation Time:.*?\n/g, '');
sql = sql.replace(/-- Server version:.*?\n/g, '');
sql = sql.replace(/-- PHP Version:.*?\n/g, '');

// 2. Supprimer les commandes MySQL spécifiques
sql = sql.replace(/SET SQL_MODE.*?;/g, '');
sql = sql.replace(/START TRANSACTION;/g, '');
sql = sql.replace(/SET time_zone.*?;/g, '');
sql = sql.replace(/SET NAMES.*?;/g, '');

// 3. Remplacer les types de données MySQL par PostgreSQL
sql = sql.replace(/\bint\((\d+)\)/gi, 'INTEGER');
sql = sql.replace(/\btinyint\(1\)/gi, 'BOOLEAN');
sql = sql.replace(/\btinyint\((\d+)\)/gi, 'SMALLINT');
sql = sql.replace(/\bvarchar\((\d+)\)/gi, 'VARCHAR($1)');
sql = sql.replace(/\btext\b/gi, 'TEXT');
sql = sql.replace(/\btimestamp\b/gi, 'TIMESTAMP');
sql = sql.replace(/\bdatetime\b/gi, 'TIMESTAMP');
sql = sql.replace(/\bdate\b/gi, 'DATE');
sql = sql.replace(/\bdecimal\((\d+),(\d+)\)/gi, 'DECIMAL($1,$2)');

// 4. Remplacer AUTO_INCREMENT par SERIAL
sql = sql.replace(/\bAUTO_INCREMENT\b/gi, '');
sql = sql.replace(/`(\w+)` INTEGER NOT NULL,/g, '"$1" SERIAL PRIMARY KEY,');

// 5. Remplacer les backticks par des double quotes
sql = sql.replace(/`/g, '"');

// 6. Remplacer ENGINE=InnoDB par rien
sql = sql.replace(/ENGINE=\w+/gi, '');
sql = sql.replace(/DEFAULT CHARSET=\w+/gi, '');
sql = sql.replace(/COLLATE=\w+/gi, '');

// 7. Remplacer current_timestamp() par CURRENT_TIMESTAMP
sql = sql.replace(/current_timestamp\(\)/gi, 'CURRENT_TIMESTAMP');

// 8. Convertir DEFAULT NULL en valeur par défaut PostgreSQL
sql = sql.replace(/DEFAULT NULL/gi, 'DEFAULT NULL');

// 9. Échapper les apostrophes dans les données
sql = sql.replace(/\\'/g, "''");

// 10. Supprimer les lignes vides multiples
sql = sql.replace(/\n\n\n+/g, '\n\n');

// 10. Ajouter des commandes PostgreSQL au début
const pgHeader = `-- PostgreSQL dump converted from MySQL
-- Database: nursecare_db

BEGIN;

`;

// 11. Ajouter COMMIT à la fin
const pgFooter = `

COMMIT;
`;

sql = pgHeader + sql + pgFooter;

// Sauvegarder le fichier converti
fs.writeFileSync('postgres_dump.sql', sql, 'utf8');

console.log('✅ Conversion terminée!');
console.log('📄 Fichier créé: postgres_dump.sql');
console.log('');
console.log('⚠️  ATTENTION: Vérifiez le fichier manuellement avant import!');
console.log('   Certaines conversions peuvent nécessiter des ajustements.');
