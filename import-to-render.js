const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Lire l'URL depuis les arguments ou demander à l'utilisateur
const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Usage: node import-to-render.js "DATABASE_URL"');
  console.error('');
  console.error('Exemple:');
  console.error('node import-to-render.js "postgresql://user:pass@host:5432/db"');
  console.error('');
  console.error('📋 Copiez l\'External Database URL depuis Render Dashboard');
  process.exit(1);
}

async function importDatabase() {
  console.log('🚀 Démarrage de l\'import...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Tester la connexion
    console.log('📡 Test de connexion à PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connexion réussie!\n');

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'render-import-clean.sql');
    console.log('📄 Lecture de render-import-clean.sql...');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(`✅ ${sql.split('\n').length} lignes lues\n`);

    // Exécuter le SQL
    console.log('⚙️  Exécution du script SQL...');
    console.log('⏳ Cela peut prendre 30-60 secondes...\n');

    await pool.query(sql);

    console.log('✅ Import terminé avec succès!\n');

    // Vérifier les comptes de test
    console.log('🔍 Vérification des comptes de test...');
    const result = await pool.query(
      `SELECT "mailEmploye", "roleEmploye" FROM "Employe" WHERE "mailEmploye" LIKE '%test.%@nursecare.fr' ORDER BY "roleEmploye"`
    );

    console.log('✅ Comptes de test trouvés:');
    result.rows.forEach(row => {
      console.log(`   - ${row.mailEmploye} (${row.roleEmploye})`);
    });

    console.log('\n🎉 Base de données prête! Vous pouvez maintenant vous connecter.');

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'import:');
    console.error(error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 La connexion a été refusée. Vérifiez:');
      console.error('   - Que l\'URL de connexion est correcte');
      console.error('   - Que la base de données est bien démarrée sur Render');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

importDatabase();
