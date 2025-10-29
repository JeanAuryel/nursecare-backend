import pool from '../config/dbconfig';

export interface IStagiaire {
    idStagiaire?: number;
    nomStagiaire: string;
    prenomStagiaire: string;
    idEcole: number;
    mailStagiaire?: string;
    telephoneStagiaire?: string;
    dateDebutStage?: Date;
    dateFinStage?: Date;
    actif?: boolean;
    // Relations
    ecole?: any;
    notes?: any[]; // Notes et appréciations des RDV
}

export interface IStagiaireDetailed extends IStagiaire {
    ecole: {
        idEcole: number;
        nomEcole: string;
    };
    notes: Array<{
        idBonObservation: number;
        idRDV: number;
        noteStagiaire: number;
        commentaireStagiaire: string;
        dateHeureObservation: Date;
        nomPrestation: string;
        evaluateur: {
            nomEmploye: string;
            prenomEmploye: string;
        };
    }>;
}

export class Stagiaire {
    /**
     * Créer un nouveau stagiaire
     */
    static async create(stagiaire: Omit<IStagiaire, 'idStagiaire'>): Promise<number> {
        const result = await pool.query(
            `INSERT INTO "Stagiaire" (
                "nomStagiaire", "prenomStagiaire", "idEcole",
                "mailStagiaire", "telephoneStagiaire",
                "dateDebutStage", "dateFinStage"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "idStagiaire"`,
            [
                stagiaire.nomStagiaire,
                stagiaire.prenomStagiaire,
                stagiaire.idEcole,
                stagiaire.mailStagiaire || null,
                stagiaire.telephoneStagiaire || null,
                stagiaire.dateDebutStage || null,
                stagiaire.dateFinStage || null
            ]
        );
        return result.rows[0].idStagiaire;
    }

    /**
     * Récupérer tous les stagiaires actifs
     */
    static async getAll(): Promise<IStagiaire[]> {
        const result = await pool.query(`
            SELECT * FROM "Stagiaire"
            WHERE "actif" = TRUE
            ORDER BY "nomStagiaire", "prenomStagiaire"
        `);
        return result.rows;
    }

    /**
     * Récupérer un stagiaire par ID
     */
    static async getOne(idStagiaire: number): Promise<IStagiaire | null> {
        const result = await pool.query(
            `SELECT * FROM "Stagiaire" WHERE "idStagiaire" = $1`,
            [idStagiaire]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    /**
     * Récupérer un stagiaire avec toutes ses informations détaillées
     */
    static async getOneDetailed(idStagiaire: number): Promise<IStagiaireDetailed | null> {
        // Récupérer le stagiaire avec son école
        const stagiairesResult = await pool.query(
            `SELECT
                s.*,
                e."nomEcole"
             FROM "Stagiaire" s
             LEFT JOIN "Ecole" e ON s."idEcole" = e."idEcole"
             WHERE s."idStagiaire" = $1`,
            [idStagiaire]
        );

        if (stagiairesResult.rows.length === 0) return null;

        const stagiaire = stagiairesResult.rows[0];

        // Structurer l'objet école
        stagiaire.ecole = {
            idEcole: stagiaire.idEcole,
            nomEcole: stagiaire.nomEcole
        };

        // Récupérer les bons d'observation (notes et appréciations)
        const notesResult = await pool.query(
            `SELECT
                bo."idBonObservation",
                bo."idRDV",
                bo."noteStagiaire",
                bo."commentaireStagiaire",
                bo."dateHeureObservation",
                p."nomPrestation",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "BonObservation" bo
             INNER JOIN "Prestation" p ON bo."idPrestation" = p."idPrestation"
             INNER JOIN "Employe" e ON bo."idEmployeEvaluateur" = e."idEmploye"
             WHERE bo."idStagiaire" = $1
             ORDER BY bo."dateHeureObservation" DESC`,
            [idStagiaire]
        );

        stagiaire.notes = notesResult.rows.map(note => ({
            idBonObservation: note.idBonObservation,
            idRDV: note.idRDV,
            noteStagiaire: note.noteStagiaire,
            commentaireStagiaire: note.commentaireStagiaire,
            dateHeureObservation: note.dateHeureObservation,
            nomPrestation: note.nomPrestation,
            evaluateur: {
                nomEmploye: note.nomEmploye,
                prenomEmploye: note.prenomEmploye
            }
        }));

        return stagiaire;
    }

    /**
     * Récupérer les stagiaires d'une école
     */
    static async getByEcole(idEcole: number): Promise<IStagiaire[]> {
        const result = await pool.query(
            `SELECT * FROM "Stagiaire"
             WHERE "idEcole" = $1 AND "actif" = TRUE
             ORDER BY "nomStagiaire", "prenomStagiaire"`,
            [idEcole]
        );
        return result.rows;
    }

    /**
     * Récupérer les stagiaires actuellement en stage
     */
    static async getActifs(): Promise<IStagiaire[]> {
        const result = await pool.query(
            `SELECT s.*, e."nomEcole"
             FROM "Stagiaire" s
             LEFT JOIN "Ecole" e ON s."idEcole" = e."idEcole"
             WHERE s."actif" = TRUE
               AND s."dateDebutStage" <= CURRENT_DATE
               AND (s."dateFinStage" IS NULL OR s."dateFinStage" >= CURRENT_DATE)
             ORDER BY s."nomStagiaire", s."prenomStagiaire"`
        );
        return result.rows;
    }

    /**
     * Mettre à jour un stagiaire
     */
    static async update(idStagiaire: number, stagiaire: Partial<IStagiaire>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (stagiaire.nomStagiaire !== undefined) {
            fields.push(`"nomStagiaire" = $${paramIndex++}`);
            values.push(stagiaire.nomStagiaire);
        }
        if (stagiaire.prenomStagiaire !== undefined) {
            fields.push(`"prenomStagiaire" = $${paramIndex++}`);
            values.push(stagiaire.prenomStagiaire);
        }
        if (stagiaire.idEcole !== undefined) {
            fields.push(`"idEcole" = $${paramIndex++}`);
            values.push(stagiaire.idEcole);
        }
        if (stagiaire.mailStagiaire !== undefined) {
            fields.push(`"mailStagiaire" = $${paramIndex++}`);
            values.push(stagiaire.mailStagiaire);
        }
        if (stagiaire.telephoneStagiaire !== undefined) {
            fields.push(`"telephoneStagiaire" = $${paramIndex++}`);
            values.push(stagiaire.telephoneStagiaire);
        }
        if (stagiaire.dateDebutStage !== undefined) {
            fields.push(`"dateDebutStage" = $${paramIndex++}`);
            values.push(stagiaire.dateDebutStage);
        }
        if (stagiaire.dateFinStage !== undefined) {
            fields.push(`"dateFinStage" = $${paramIndex++}`);
            values.push(stagiaire.dateFinStage);
        }

        if (fields.length === 0) return false;

        values.push(idStagiaire);

        const result = await pool.query(
            `UPDATE "Stagiaire" SET ${fields.join(', ')} WHERE "idStagiaire" = $${paramIndex}`,
            values
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer un stagiaire (soft delete)
     */
    static async delete(idStagiaire: number): Promise<boolean> {
        const result = await pool.query(
            `UPDATE "Stagiaire" SET "actif" = FALSE WHERE "idStagiaire" = $1`,
            [idStagiaire]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Récupérer les statistiques d'un stagiaire
     */
    static async getStats(idStagiaire: number): Promise<any> {
        const result = await pool.query(
            `SELECT
                COUNT(bo."idBonObservation") AS "nombreEvaluations",
                AVG(bo."noteStagiaire") AS "moyenneNotes",
                MIN(bo."noteStagiaire") AS "noteMin",
                MAX(bo."noteStagiaire") AS "noteMax"
             FROM "BonObservation" bo
             WHERE bo."idStagiaire" = $1`,
            [idStagiaire]
        );

        return result.rows[0];
    }

    /**
     * Rechercher des stagiaires par nom ou prénom
     */
    static async search(searchTerm: string): Promise<IStagiaire[]> {
        const result = await pool.query(
            `SELECT s.*, e."nomEcole"
             FROM "Stagiaire" s
             LEFT JOIN "Ecole" e ON s."idEcole" = e."idEcole"
             WHERE s."actif" = TRUE
             AND (
                LOWER(s."nomStagiaire") LIKE LOWER($1)
                OR LOWER(s."prenomStagiaire") LIKE LOWER($1)
             )
             ORDER BY s."nomStagiaire", s."prenomStagiaire"`,
            [`%${searchTerm}%`]
        );
        return result.rows;
    }
}
