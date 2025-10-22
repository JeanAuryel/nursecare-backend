const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/models/stagiaire.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the update method
const oldUpdate = `    static async update(idStagiaire: number, stagiaire: Partial<IStagiaire>): Promise<number> {
        const fields: string[] = [];
        const values: any[] = [];

        if (stagiaire.nomStagiaire !== undefined) {
            fields.push('nomStagiaire = $1'));
            values.push(stagiaire.nomStagiaire);
        }
        if (stagiaire.prenomStagiaire !== undefined) {
            fields.push('prenomStagiaire = ?');
            values.push(stagiaire.prenomStagiaire);
        }
        if (stagiaire.idEcole !== undefined) {
            fields.push('idEcole = ?');
            values.push(stagiaire.idEcole);
        }
        if (stagiaire.idTuteur !== undefined) {
            fields.push('idTuteur = ?');
            values.push(stagiaire.idTuteur);
        }
        if (stagiaire.mailStagiaire !== undefined) {
            fields.push('mailStagiaire = ?');
            values.push(stagiaire.mailStagiaire);
        }
        if (stagiaire.numStagiaire !== undefined) {
            fields.push('numStagiaire = ?');
            values.push(stagiaire.numStagiaire);
        }
        if (stagiaire.dateDebutStage !== undefined) {
            fields.push('dateDebutStage = ?');
            values.push(stagiaire.dateDebutStage);
        }
        if (stagiaire.dateFinStage !== undefined) {
            fields.push('dateFinStage = ?');
            values.push(stagiaire.dateFinStage);
        }

        if (fields.length === 0) return 0;

        values.push(idStagiaire);

        const result = await pool.query(
            \`UPDATE Stagiaire SET \${fields.join(', ')} WHERE idStagiaire = $1\`,
            values
        );
        return result.rowCount || 0;
    }`;

const newUpdate = `    static async update(idStagiaire: number, stagiaire: Partial<IStagiaire>): Promise<number> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (stagiaire.nomStagiaire !== undefined) {
            fields.push(\`nomStagiaire = $\${paramIndex++}\`);
            values.push(stagiaire.nomStagiaire);
        }
        if (stagiaire.prenomStagiaire !== undefined) {
            fields.push(\`prenomStagiaire = $\${paramIndex++}\`);
            values.push(stagiaire.prenomStagiaire);
        }
        if (stagiaire.idEcole !== undefined) {
            fields.push(\`idEcole = $\${paramIndex++}\`);
            values.push(stagiaire.idEcole);
        }
        if (stagiaire.idTuteur !== undefined) {
            fields.push(\`idTuteur = $\${paramIndex++}\`);
            values.push(stagiaire.idTuteur);
        }
        if (stagiaire.mailStagiaire !== undefined) {
            fields.push(\`mailStagiaire = $\${paramIndex++}\`);
            values.push(stagiaire.mailStagiaire);
        }
        if (stagiaire.numStagiaire !== undefined) {
            fields.push(\`numStagiaire = $\${paramIndex++}\`);
            values.push(stagiaire.numStagiaire);
        }
        if (stagiaire.dateDebutStage !== undefined) {
            fields.push(\`dateDebutStage = $\${paramIndex++}\`);
            values.push(stagiaire.dateDebutStage);
        }
        if (stagiaire.dateFinStage !== undefined) {
            fields.push(\`dateFinStage = $\${paramIndex++}\`);
            values.push(stagiaire.dateFinStage);
        }

        if (fields.length === 0) return 0;

        values.push(idStagiaire);

        const result = await pool.query(
            \`UPDATE Stagiaire SET \${fields.join(', ')} WHERE idStagiaire = $\${paramIndex}\`,
            values
        );
        return result.rowCount || 0;
    }`;

content = content.replace(oldUpdate, newUpdate);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ stagiaire.ts corrigé!');
