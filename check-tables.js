const { Client } = require('pg');

const connectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkTables() {
  try {
    await client.connect();
    console.log('✅ Connecté\n');

    // Lister toutes les tables
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`📊 Tables trouvées (${result.rows.length}):\n`);

    for (const row of result.rows) {
      const tableName = row.table_name;
      const countResult = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
      const count = countResult.rows[0].count;
      console.log(`   ${tableName.padEnd(30)} : ${count} enregistrements`);
    }

    console.log('\n✅ Vérification terminée\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();
