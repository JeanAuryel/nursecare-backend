const { Pool } = require('pg');

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Usage: node test-db-columns.js "DATABASE_URL"');
  process.exit(1);
}

async function testColumns() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Test des colonnes retournées par PostgreSQL\n');

    // Tester avec le compte test
    const result = await pool.query(
      "SELECT * FROM employe WHERE mailemploye = $1",
      ['test.directeur@nursecare.fr']
    );

    if (result.rows.length > 0) {
      console.log('✅ Utilisateur trouvé!');
      console.log('\n📋 Colonnes retournées par PostgreSQL:');
      const keys = Object.keys(result.rows[0]);
      keys.forEach(key => {
        console.log(`   - ${key}: ${result.rows[0][key]}`);
      });

      console.log('\n🔍 Test avec la casse mixte (Employe, mailEmploye):');
      try {
        const result2 = await pool.query(
          "SELECT * FROM Employe WHERE mailEmploye = $1",
          ['test.directeur@nursecare.fr']
        );
        console.log('✅ Requête avec casse mixte fonctionne aussi!');
        console.log('📋 Colonnes:', Object.keys(result2.rows[0]).join(', '));
      } catch (error) {
        console.log('❌ Erreur avec casse mixte:', error.message);
      }
    } else {
      console.log('❌ Aucun utilisateur trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

testColumns();
