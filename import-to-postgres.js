const fs = require('fs');
const { Client } = require('pg');

console.log('📥 Import des données dans PostgreSQL Render...\n');

// URL de connexion PostgreSQL
const connectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

// Lire le fichier SQL
const sql = fs.readFileSync('postgres_dump.sql', 'utf8');

// Créer le client PostgreSQL
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importData() {
  try {
    console.log('🔌 Connexion à PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté!\n');

    console.log('📤 Import des données...');
    console.log('(Cela peut prendre 1-2 minutes)\n');

    // Exécuter le SQL
    await client.query(sql);

    console.log('✅ Import réussi!');
    console.log('📊 Toutes les tables et données ont été importées.\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error.message);
    console.error('\nDétails:', error);
  } finally {
    await client.end();
    console.log('🔌 Connexion fermée.');
  }
}

importData();
