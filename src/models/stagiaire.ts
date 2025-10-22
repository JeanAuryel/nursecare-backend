import pool from '../config/dbconfig';

export interface IStagiaire {
    idStagiaire?: number;
    nomStagiaire: string;
    prenomStagiaire: string;
    idEcole: number;
    idTuteur?: number; // ID de l'employé tuteur
    mailStagiaire?: string;
    numStagiaire?: string;
    dateDebutStage?: string;
    dateFinStage?: string;
    // Relations
    ecole?: any;
    tuteur?: any;
    notes?: any[]; // Notes et appréciations des RDV
}

export interface IStagiaireDetailed extends IStagiaire {
    ecole: {
        idEcole: number;
        nomEcole: string;
        contactReferent: string;
    };
    tuteur?: {
        idEmploye: number;
        nomEmploye: string;
        prenomEmploye: string;
    };
    notes: Array<{
        idRdv: number;
        noteStagiaire: number;
        commentaireStagiaire: string;
        dateRdv: string;
        nomPrestation: string;
    }>;
}

export class Stagiaire {
    static async create(stagiaire: Partial<IStagiaire>): Promise<number> {
        const result = await pool.query(
            `INSERT INTO Stagiaire (nomStagiaire, prenomStagiaire, idEcole, idTuteur, mailStagiaire, numStagiaire, dateDebutStage, dateFinStage)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                stagiaire.nomStagiaire,
                stagiaire.prenomStagiaire,
                stagiaire.idEcole,
                stagiaire.idTuteur || null,
                stagiaire.mailStagiaire || null,
                stagiaire.numStagiaire || null,
                stagiaire.dateDebutStage || null,
                stagiaire.dateFinStage || null
            ]
        );
        return result.rows[0].idstagiaire;
    }

    static async getAll(): Promise<IStagiaire[]> {
        const result = await pool.query(`SELECT * FROM Stagiaire ORDER BY nomStagiaire, prenomStagiaire`);
        return result.rows;
    }

    static async getOne(idStagiaire: number): Promise<IStagiaire | null> {
        const result = await pool.query(`SELECT * FROM Stagiaire WHERE idStagiaire = $1`, [idStagiaire]);
        return result.rows.length ? result.rows[0] : null;
    }

    static async getOneDetailed(idStagiaire: number): Promise<IStagiaireDetailed | null> {
        // Récupérer le stagiaire
        const stagiairesResult = await pool.query(
            `SELECT S.*, E.nomEcole, E.contactReferent
             FROM Stagiaire S
             LEFT JOIN Ecole E ON S.idEcole = E.idEcole
             WHERE S.idStagiaire = ?`,
            [idStagiaire]
        );

        if (stagiairesResult.rows.length === 0) return null;

        const stagiaire = stagiairesResult.rows[0];

        // Récupérer le tuteur si existe
        if (stagiaire.idTuteur) {
            const tuteursResult = await pool.query(
                `SELECT idEmploye, nomEmploye, prenomEmploye FROM Employe WHERE idEmploye = $1`,
                [stagiaire.idTuteur]
            );
            stagiaire.tuteur = tuteursResult.rows[0] || null;
        }

        // Récupérer les notes et appréciations
        const notesResult = await pool.query(
            `SELECT R.idRdv, R.noteStagiaire, R.commentaireStagiaire, R.timestamp_RDV_reel as dateRdv, P.nomPrestation
             FROM RDV R
             LEFT JOIN Prestation P ON R.idPrestation = P.idPrestation
             WHERE R.idStagiaire = ? AND R.timestamp_RDV_reel IS NOT NULL
             ORDER BY R.timestamp_RDV_reel DESC`,
            [idStagiaire]
        );

        stagiaire.notes = notesResult.rows;

        return stagiaire;
    }

    static async update(idStagiaire: number, stagiaire: Partial<IStagiaire>): Promise<number> {
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
            `UPDATE Stagiaire SET ${fields.join(', ')} WHERE idStagiaire = $1`,
            values
        );
        return result.rowCount || 0;
    }

    static async delete(idStagiaire: number): Promise<number> {
        const result = await pool.query(`DELETE FROM Stagiaire WHERE idStagiaire = $1`, [idStagiaire]);
        return result.rowCount || 0;
    }
}
