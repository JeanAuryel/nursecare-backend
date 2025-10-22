const mysql = require('mysql2/promise');
const { Client } = require('pg');
const fs = require('fs');

console.log('🚀 Migration MySQL → PostgreSQL\n');

// Configuration MySQL AlwaysData
const mysqlConfig = {
  host: 'mysql-demo-mysql.alwaysdata.net',
  port: 3306,
  user: '395216',
  password: 'deathrow',
  database: 'demo-mysql_nursecare'
};

// Configuration PostgreSQL Render
const pgConnectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

async function migrate() {
  let mysqlConnection;
  let pgClient;

  try {
    // Connexion MySQL
    console.log('🔌 Connexion à MySQL AlwaysData...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connecté à MySQL\n');

    // Connexion PostgreSQL
    console.log('🔌 Connexion à PostgreSQL Render...');
    pgClient = new Client({
      connectionString: pgConnectionString,
      ssl: { rejectUnauthorized: false }
    });
    await pgClient.connect();
    console.log('✅ Connecté à PostgreSQL\n');

    // Récupérer toutes les tables MySQL
    console.log('📋 Récupération des tables...');
    const [tables] = await mysqlConnection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'demo-mysql_nursecare'"
    );

    console.log(`📊 ${tables.length} tables trouvées:\n`);
    tables.forEach(t => console.log(`   - ${t.TABLE_NAME || t.table_name}`));
    console.log('');

    // Pour chaque table
    for (const tableRow of tables) {
      const tableName = tableRow.TABLE_NAME || tableRow.table_name;

      console.log(`\n📦 Migration de la table: ${tableName}`);
      console.log('─'.repeat(50));

      // 1. Récupérer la structure de la table
      const [createTableResult] = await mysqlConnection.query(`SHOW CREATE TABLE \`${tableName}\``);
      let createTableSQL = createTableResult[0]['Create Table'];

      // 2. Convertir le CREATE TABLE en syntaxe PostgreSQL
      createTableSQL = convertCreateTableToPostgres(createTableSQL, tableName);

      // 3. Créer la table dans PostgreSQL
      try {
        console.log(`   📝 Création de la table...`);
        await pgClient.query(createTableSQL);
        console.log(`   ✅ Table créée`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Table existe déjà, on continue...`);
        } else {
          console.error(`   ❌ Erreur création:`, error.message);
          continue;
        }
      }

      // 4. Récupérer les données
      console.log(`   📥 Récupération des données...`);
      const [rows] = await mysqlConnection.query(`SELECT * FROM \`${tableName}\``);

      if (rows.length === 0) {
        console.log(`   ℹ️  Table vide, on passe à la suivante`);
        continue;
      }

      console.log(`   📊 ${rows.length} lignes trouvées`);

      // 5. Insérer les données dans PostgreSQL
      console.log(`   📤 Insertion des données...`);
      let inserted = 0;
      let errors = 0;

      for (const row of rows) {
        try {
          const columns = Object.keys(row);
          const values = Object.values(row);

          // Conversion des valeurs pour PostgreSQL
          const pgValues = values.map(val => {
            if (val === null) return null;
            if (typeof val === 'boolean') return val;
            if (val instanceof Date) return val;
            if (typeof val === 'number') return val;
            return val;
          });

          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const columnNames = columns.map(c => `"${c}"`).join(', ');

          const insertSQL = `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`;

          await pgClient.query(insertSQL, pgValues);
          inserted++;

          // Afficher la progression tous les 10 enregistrements
          if (inserted % 10 === 0) {
            process.stdout.write(`\r   📊 Progression: ${inserted}/${rows.length}`);
          }
        } catch (error) {
          errors++;
          if (errors <= 3) {
            console.log(`\n   ⚠️  Erreur ligne: ${error.message}`);
          }
        }
      }

      console.log(`\n   ✅ ${inserted} lignes insérées${errors > 0 ? ` (${errors} erreurs)` : ''}`);
    }

    console.log('\n\n' + '='.repeat(50));
    console.log('🎉 Migration terminée avec succès!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message);
    console.error(error);
  } finally {
    // Fermeture des connexions
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('\n🔌 Connexion MySQL fermée');
    }
    if (pgClient) {
      await pgClient.end();
      console.log('🔌 Connexion PostgreSQL fermée');
    }
  }
}

// Fonction pour convertir CREATE TABLE MySQL en PostgreSQL
function convertCreateTableToPostgres(mysqlSQL, tableName) {
  let sql = mysqlSQL;

  // Remplacer les backticks par des double quotes
  sql = sql.replace(/`/g, '"');

  // Types de données
  sql = sql.replace(/\bint\(\d+\)/gi, 'INTEGER');
  sql = sql.replace(/\btinyint\(1\)/gi, 'BOOLEAN');
  sql = sql.replace(/\btinyint\(\d+\)/gi, 'SMALLINT');
  sql = sql.replace(/\bvarchar\((\d+)\)/gi, 'VARCHAR($1)');
  sql = sql.replace(/\btext\b/gi, 'TEXT');
  sql = sql.replace(/\btimestamp\b/gi, 'TIMESTAMP');
  sql = sql.replace(/\bdatetime\b/gi, 'TIMESTAMP');
  sql = sql.replace(/\bdate\b/gi, 'DATE');
  sql = sql.replace(/\bdecimal\((\d+),(\d+)\)/gi, 'DECIMAL($1,$2)');

  // AUTO_INCREMENT → SERIAL
  sql = sql.replace(/\bAUTO_INCREMENT\b/gi, '');

  // Supprimer les clauses MySQL spécifiques
  sql = sql.replace(/ENGINE=\w+/gi, '');
  sql = sql.replace(/DEFAULT CHARSET=\w+/gi, '');
  sql = sql.replace(/COLLATE=\w+/gi, '');
  sql = sql.replace(/AUTO_INCREMENT=\d+/gi, '');

  // current_timestamp()
  sql = sql.replace(/current_timestamp\(\)/gi, 'CURRENT_TIMESTAMP');

  // Supprimer les KEY et INDEX qui causent des problèmes
  sql = sql.replace(/,\s*KEY\s+"[^"]+"\s+\([^)]+\)/gi, '');
  sql = sql.replace(/,\s*UNIQUE KEY\s+"[^"]+"\s+\([^)]+\)/gi, '');

  // Nettoyer les virgules en trop
  sql = sql.replace(/,\s*\)/g, ')');

  return sql;
}

// Lancer la migration
migrate();
