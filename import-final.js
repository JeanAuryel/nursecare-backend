const fs = require('fs');
const { Client } = require('pg');

console.log('📥 Import final PostgreSQL\n');

const connectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

console.log('📖 Lecture...');
const sql = fs.readFileSync('postgres_final.sql', 'utf8');
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

    console.log('📤 Import...');
    await client.query(sql);

    console.log('\n✅ Import réussi!\n');

    // Vérification
    console.log('📊 Vérification:\n');
    const tables = ['Employe', 'Patient', 'Soin', 'Analyse', 'Facture'];
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`   ${table.padEnd(15)} : ${result.rows[0].count} enregistrements`);
      } catch (err) {
        console.log(`   ${table.padEnd(15)} : Erreur - ${err.message}`);
      }
    }

    console.log('\n🎉 Migration terminée!\n');

  } catch (error) {
    console.error('\n❌ Erreur:');
    console.error('Message:', error.message);
    if (error.position) console.error('Position:', error.position);
    console.error('');
  } finally {
    await client.end();
    console.log('🔌 Fermé\n');
  }
}

importData();
