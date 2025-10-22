const fs = require('fs');
const { Client } = require('pg');

console.log('📥 Import PostgreSQL (version corrigée)\n');

const connectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

console.log('📖 Lecture...');
const sql = fs.readFileSync('postgres_fixed.sql', 'utf8');
console.log('✅ Lu\n');

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function importData() {
  try {
    console.log('🔌 Connexion...');
    await client.connect();
    console.log('✅ Connecté\n');

    console.log('📤 Import en cours...');
    console.log('⏳ Patience...\n');

    await client.query(sql);

    console.log('═'.repeat(60));
    console.log('🎉 Import réussi!');
    console.log('═'.repeat(60));

    // Vérification
    console.log('\n📊 Vérification des données:\n');
    const tables = ['Employe', 'Patient', 'Soin', 'Analyse', 'Facture', 'Ecole', 'Categorie'];

    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`   ✅ ${table.padEnd(15)} : ${result.rows[0].count} enregistrements`);
      } catch (err) {
        console.log(`   ❌ ${table.padEnd(15)} : ${err.message.substring(0, 40)}`);
      }
    }

    console.log('\n🎉 Migration terminée avec succès!\n');
    console.log('📋 Prochaine étape: Tester l\'application\n');

  } catch (error) {
    console.error('\n❌ ERREUR:\n');
    console.error('Message:', error.message);
    if (error.position) {
      console.error('Position:', error.position);
      // Afficher le contexte autour de la position
      const pos = parseInt(error.position);
      const context = sql.substring(Math.max(0, pos - 100), Math.min(sql.length, pos + 100));
      console.error('\nContexte:');
      console.error('...' + context + '...');
    }
    console.error('');
  } finally {
    await client.end();
    console.log('🔌 Connexion fermée\n');
  }
}

importData();
