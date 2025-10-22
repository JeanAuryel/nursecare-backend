const fs = require('fs');
const path = require('path');

// Corrections manuelles spécifiques

// 1. Catégorie.ts
const categoriePath = path.join(__dirname, 'src/models/categorie.ts');
let categorieContent = fs.readFileSync(categoriePath, 'utf8');
categorieContent = categorieContent.replace(
  '`INSERT INTO Categorie (nomCategorie) VALUES ($1)`',
  '`INSERT INTO Categorie (nomCategorie) VALUES ($1) RETURNING idCategorie`'
);
categorieContent = categorieContent.replace(
  'return result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idfacture || result.rows[0].idligne;',
  'return result.rows[0].idcategorie;'
);
fs.writeFileSync(categoriePath, categorieContent, 'utf8');
console.log('✅ categorie.ts corrigé');

// 2. Prestation.ts
const prestationPath = path.join(__dirname, 'src/models/prestation.ts');
let prestationContent = fs.readFileSync(prestationPath, 'utf8');
prestationContent = prestationContent.replace(
  '`INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES ($1, $2, $3)`',
  '`INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES ($1, $2, $3) RETURNING idPrestation`'
);
prestationContent = prestationContent.replace(
  'return result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idfacture || result.rows[0].idligne;',
  'return result.rows[0].idprestation;'
);
fs.writeFileSync(prestationPath, prestationContent, 'utf8');
console.log('✅ prestation.ts corrigé');

// 3. Ecole.ts - plusieurs corrections
const ecolePath = path.join(__dirname, 'src/models/ecole.ts');
let ecoleContent = fs.readFileSync(ecolePath, 'utf8');

// Remplacer les ? restants par des placeholders numérotés
ecoleContent = ecoleContent.replace(
  `VALUES (?, ?, ?, ?, ?, ?)`,
  `VALUES ($1, $2, $3, $4, $5, $6) RETURNING idEcole`
);

// Corriger la méthode create
ecoleContent = ecoleContent.replace(
  /const id = result\.rows\[0\]\.idecole \|\|[^;]+;[\s\S]*?const result = await pool\.query\(\s*`SELECT \* FROM Ecole WHERE idEcole = \$1`,\s*\[id\]\s*\);[\s\S]*?return rows\[0\];/,
  `const id = result.rows[0].idecole;
    const selectResult = await pool.query(
      \`SELECT * FROM Ecole WHERE idEcole = $1\`,
      [id]
    );
    return selectResult.rows[0];`
);

fs.writeFileSync(ecolePath, ecoleContent, 'utf8');
console.log('✅ ecole.ts corrigé');

// 4. Stagiaire.ts
const stagiairePath = path.join(__dirname, 'src/models/stagiaire.ts');
let stagiaireContent = fs.readFileSync(stagiairePath, 'utf8');

// Ajouter RETURNING
stagiaireContent = stagiaireContent.replace(
  /INSERT INTO Stagiaire \([^)]+\)[\s\S]*?VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\)`/,
  (match) => match.replace(')', ') RETURNING idStagiaire')
);

// Corriger le return
stagiaireContent = stagiaireContent.replace(
  'return result.rows[0].idecole || result.rows[0].idcategorie || result.rows[0].idprestation || result.rows[0].idstagiaire || result.rows[0].idfacture || result.rows[0].idligne;',
  'return result.rows[0].idstagiaire;'
);

// Corriger les ? dans la méthode update (si présents)
let counter = 1;
stagiaireContent = stagiaireContent.replace(/(fields\.push\('nomStagiaire = )(\?')/g, () => `fields.push('nomStagiaire = $${counter++}')`);
// Reset counter pour chaque méthode...  en fait c'est dynamique donc c'est OK

fs.writeFileSync(stagiairePath, stagiaireContent, 'utf8');
console.log('✅ stagiaire.ts corrigé');

// 5. Facture.ts - plusieurs INSERT
const facturePath = path.join(__dirname, 'src/models/facture.ts');
let factureContent = fs.readFileSync(facturePath, 'utf8');

// Ajouter RETURNING pour les INSERT
factureContent = factureContent.replace(
  /INSERT INTO Facture \([^)]+\)[\s\S]*?VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12\)`/,
  (match) => match.replace(/\)`$/, ') RETURNING idFacture`')
);

factureContent = factureContent.replace(
  /INSERT INTO LigneFacture \([^)]+\)[\s\S]*?VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10\)`/,
  (match) => match.replace(/\)`$/, ') RETURNING idLigne`')
);

// Corriger les return insertId
factureContent = factureContent.replace(
  /return result\.rows\[0\]\.idecole \|\| result\.rows\[0\]\.idcategorie \|\| result\.rows\[0\]\.idprestation \|\| result\.rows\[0\]\.idstagiaire \|\| result\.rows\[0\]\.idfacture \|\| result\.rows\[0\]\.idligne;/g,
  (match, offset) => {
    // Déterminer si on est dans create ou ajouterLigne
    const before = factureContent.substring(Math.max(0, offset - 200), offset);
    if (before.includes('ajouterLigne')) {
      return 'return result.rows[0].idligne;';
    } else {
      return 'return result.rows[0].idfacture;';
    }
  }
);

fs.writeFileSync(facturePath, factureContent, 'utf8');
console.log('✅ facture.ts corrigé');

console.log('\n✨ Tous les fichiers ont été corrigés!');
