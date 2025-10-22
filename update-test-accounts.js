const { Client } = require('pg');
const bcrypt = require('bcrypt');

console.log('🔄 Mise à jour des comptes de test\n');

// Configuration PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgresql://nursecare_db_user:mkpJUkmq0xiNSsH7wSzPRNMVSkkgnVZH@dpg-d3rjtrhr0fns73dnerpg-a.frankfurt-postgres.render.com/nursecare_db';

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Nouveaux identifiants des comptes de test
const testAccounts = [
  {
    oldEmail: 'test_1.nursecare@nursecare.fr',
    newEmail: 'test.directeur@nursecare.fr',
    newPassword: 'Test1',
    role: 'DIRECTEUR'
  },
  {
    oldEmail: 'test_2.nursecare@nursecare.fr',
    newEmail: 'test.secretaire@nursecare.fr',
    newPassword: 'Test2',
    role: 'SECRETAIRE'
  },
  {
    oldEmail: 'test_3.nursecare@nursecare.fr',
    newEmail: 'test.infirmier@nursecare.fr',
    newPassword: 'Test3',
    role: 'INFIRMIER'
  }
];

async function updateTestAccounts() {
  try {
    console.log('🔌 Connexion à PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté!\n');

    for (const account of testAccounts) {
      console.log(`📝 Mise à jour du compte ${account.role}...`);

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(account.newPassword, 10);

      // Mettre à jour l'email et le mot de passe
      const result = await client.query(
        `UPDATE "Employe"
         SET "mailEmploye" = $1, "mdpEmploye" = $2
         WHERE "mailEmploye" = $3`,
        [account.newEmail, hashedPassword, account.oldEmail]
      );

      if (result.rowCount > 0) {
        console.log(`   ✅ ${account.oldEmail} → ${account.newEmail}`);
        console.log(`   🔑 Mot de passe: ${account.newPassword}`);
      } else {
        console.log(`   ⚠️  Compte ${account.oldEmail} non trouvé, recherche par rôle...`);

        // Essayer de trouver par rôle et mettre à jour
        const updateByRole = await client.query(
          `UPDATE "Employe"
           SET "mailEmploye" = $1, "mdpEmploye" = $2
           WHERE "idEmploye" = (
             SELECT "idEmploye" FROM "Employe"
             WHERE "roleEmploye" = $3
             AND "mailEmploye" LIKE '%test%'
             LIMIT 1
           )`,
          [account.newEmail, hashedPassword, account.role]
        );

        if (updateByRole.rowCount > 0) {
          console.log(`   ✅ Compte ${account.role} mis à jour → ${account.newEmail}`);
        } else {
          console.log(`   ❌ Impossible de trouver le compte ${account.role}`);
        }
      }
      console.log('');
    }

    // Afficher le récapitulatif
    console.log('═'.repeat(60));
    console.log('📋 RÉCAPITULATIF DES COMPTES DE TEST');
    console.log('═'.repeat(60));
    console.log('\n👤 DIRECTEUR:');
    console.log('   Email:    test.directeur@nursecare.fr');
    console.log('   Password: Test1\n');

    console.log('👤 SECRÉTAIRE:');
    console.log('   Email:    test.secretaire@nursecare.fr');
    console.log('   Password: Test2\n');

    console.log('👤 INFIRMIER:');
    console.log('   Email:    test.infirmier@nursecare.fr');
    console.log('   Password: Test3\n');

    console.log('═'.repeat(60));
    console.log('✅ Mise à jour terminée!\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error(error);
  } finally {
    await client.end();
    console.log('🔌 Connexion fermée.\n');
  }
}

updateTestAccounts();
