const { Pool } = require('pg');

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Usage: node clean-database.js "DATABASE_URL"');
  process.exit(1);
}

async function cleanDatabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🧹 Nettoyage complet de la base de données...\n');

    // Supprimer toutes les tables et vues
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO nursecare_db_user;
      GRANT ALL ON SCHEMA public TO public;
    `);

    console.log('✅ Base de données nettoyée avec succès!');
    console.log('📋 Toutes les tables, vues, types et triggers ont été supprimés.\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanDatabase();
