const https = require('https');

const BACKEND_URL = 'https://nursecare-backend.onrender.com';

// Comptes de test à vérifier
const testAccounts = [
  { email: 'test.directeur@nursecare.fr', password: 'Test1', role: 'DIRECTEUR' },
  { email: 'test.secretaire@nursecare.fr', password: 'Test2', role: 'SECRETAIRE' },
  { email: 'test.infirmier@nursecare.fr', password: 'Test3', role: 'INFIRMIER' }
];

function testLogin(email, password, expectedRole) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      mailEmploye: email,
      mdpEmploye: password
    });

    const options = {
      hostname: 'nursecare-backend.onrender.com',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: result, email, expectedRole });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, email, expectedRole, error: 'Parse error' });
        }
      });
    });

    req.on('error', (error) => {
      reject({ email, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Test de connexion à l\'API NurseCare\n');
  console.log(`📡 Backend: ${BACKEND_URL}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const account of testAccounts) {
    try {
      console.log(`🔐 Test de connexion: ${account.email}`);
      const result = await testLogin(account.email, account.password, account.role);

      if (result.status === 200) {
        if (result.data.accessToken && result.data.refreshToken) {
          console.log(`   ✅ Succès - Tokens reçus`);
          console.log(`   👤 Utilisateur: ${result.data.employe.nom} ${result.data.employe.prenom}`);
          console.log(`   🎭 Rôle: ${result.data.employe.role}`);

          if (result.data.employe.role === account.role) {
            console.log(`   ✅ Rôle correct: ${account.role}`);
            successCount++;
          } else {
            console.log(`   ❌ Rôle incorrect: attendu ${account.role}, reçu ${result.data.employe.role}`);
            failCount++;
          }
        } else {
          console.log(`   ⚠️  Succès mais tokens manquants`);
          console.log(`   Réponse:`, JSON.stringify(result.data, null, 2));
          failCount++;
        }
      } else {
        console.log(`   ❌ Échec - Status ${result.status}`);
        console.log(`   Message:`, result.data.message || result.data);
        failCount++;
      }
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.error}`);
      failCount++;
    }
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Résultats: ${successCount} succès, ${failCount} échecs`);

  if (successCount === testAccounts.length) {
    console.log('🎉 Tous les tests sont passés avec succès!');
    process.exit(0);
  } else {
    console.log('⚠️  Certains tests ont échoué');
    process.exit(1);
  }
}

runTests();
