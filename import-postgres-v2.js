const fs = require('fs');
const { Client } = require('pg');

console.log('📥 Import des données dans PostgreSQL Render\n');

// Configuration PostgreSQL
const connectionString = 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

// Lire le fichier SQL converti
console.log('📖 Lecture du fichier SQL...');
const sql = fs.readFileSync('postgres_dump_v2.sql', 'utf8');
console.log('✅ Fichier lu\n');

// Créer le client PostgreSQL
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importData() {
  try {
    console.log('🔌 Connexion à PostgreSQL Render...');
    await client.connect();
    console.log('✅ Connecté!\n');

    console.log('📤 Import des données en cours...');
    console.log('⏳ Cela peut prendre 1-2 minutes, veuillez patienter...\n');

    // Exécuter le SQL complet
    await client.query(sql);

    console.log('═'.repeat(60));
    console.log('🎉 Import réussi!');
    console.log('═'.repeat(60));
    console.log('\n✅ Toutes les tables et données ont été importées.');
    console.log('✅ Les séquences ont été réinitialisées.');
    console.log('✅ Les contraintes ont été réactivées.\n');

    // Vérifier quelques tables
    console.log('📊 Vérification des données importées:\n');

    const tables = ['utilisateurs', 'patients', 'soins', 'analyses'];
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        const count = result.rows[0].count;
        console.log(`   ${table.padEnd(20)} : ${count} enregistrements`);
      } catch (error) {
        console.log(`   ${table.padEnd(20)} : ⚠️  Erreur de vérification`);
      }
    }

    console.log('\n✅ Migration terminée avec succès!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'import:');
    console.error('─'.repeat(60));
    console.error('Message:', error.message);
    console.error('─'.repeat(60));

    // Afficher plus de détails si disponibles
    if (error.position) {
      console.error('Position:', error.position);
    }
    if (error.detail) {
      console.error('Détail:', error.detail);
    }
    if (error.hint) {
      console.error('Suggestion:', error.hint);
    }

    console.error('\n💡 Conseils:');
    console.error('   1. Vérifiez le fichier postgres_dump_v2.sql');
    console.error('   2. Cherchez la ligne mentionnée dans l\'erreur');
    console.error('   3. Corrigez manuellement si nécessaire\n');

  } finally {
    await client.end();
    console.log('🔌 Connexion fermée.\n');
  }
}

importData();
