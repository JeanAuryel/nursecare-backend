const { Pool } = require('pg');

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Usage: node verify-import.js "DATABASE_URL"');
  process.exit(1);
}

async function verifyImport() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔍 Vérification de l\'import...\n');

    // Compter les tables
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`✅ Tables créées (${tables.rows.length}):`);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Compter les vues
    const views = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'VIEW'
      ORDER BY table_name
    `);

    console.log(`✅ Vues créées (${views.rows.length}):`);
    views.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Vérifier les comptes de test
    const employes = await pool.query(
      `SELECT mailemploye, roleemploye FROM employe WHERE mailemploye LIKE '%test%@nursecare.fr' ORDER BY roleemploye`
    );

    console.log(`✅ Comptes de test trouvés (${employes.rows.length}):`);
    employes.rows.forEach(row => {
      console.log(`   - ${row.mailemploye} (${row.roleemploye})`);
    });
    console.log('');

    // Compter les données de test
    const categories = await pool.query('SELECT COUNT(*) FROM categorie');
    const ecoles = await pool.query('SELECT COUNT(*) FROM ecole');
    const patients = await pool.query('SELECT COUNT(*) FROM patient');
    const prestations = await pool.query('SELECT COUNT(*) FROM prestation');
    const stagiaires = await pool.query('SELECT COUNT(*) FROM stagiaire');

    console.log('✅ Données de test insérées:');
    console.log(`   - ${categories.rows[0].count} catégories`);
    console.log(`   - ${ecoles.rows[0].count} écoles`);
    console.log(`   - ${employes.rows.length} employés`);
    console.log(`   - ${patients.rows[0].count} patients`);
    console.log(`   - ${prestations.rows[0].count} prestations`);
    console.log(`   - ${stagiaires.rows[0].count} stagiaires`);

    console.log('\n🎉 Import vérifié avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyImport();
