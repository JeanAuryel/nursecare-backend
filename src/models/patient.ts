import pool from '../config/dbconfig';

export interface IPatient {
    idPatient?: number;
    nomPatient: string;
    prenomPatient: string;
    adressePatient: string;
    codePostalPatient?: string;
    villePatient?: string;
    telephonePatient: string;
    mailPatient?: string;
    numSecuriteSociale?: string;
    actif?: boolean;
    dateCreation?: Date;
    dateModification?: Date;
}

export class Patient {
    /**
     * Créer un nouveau patient
     */
    static async create(patient: Omit<IPatient, 'idPatient'>): Promise<number> {
        const result = await pool.query(
            `INSERT INTO "Patient" (
                "nomPatient", "prenomPatient", "adressePatient",
                "codePostalPatient", "villePatient", "telephonePatient",
                "mailPatient", "numSecuriteSociale"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING "idPatient"`,
            [
                patient.nomPatient,
                patient.prenomPatient,
                patient.adressePatient,
                patient.codePostalPatient || null,
                patient.villePatient || null,
                patient.telephonePatient,
                patient.mailPatient || null,
                patient.numSecuriteSociale || null
            ]
        );
        return result.rows[0].idPatient;
    }

    /**
     * Récupérer tous les patients actifs
     */
    static async getAll(): Promise<IPatient[]> {
        const result = await pool.query(
            `SELECT * FROM "Patient"
             WHERE "actif" = TRUE
             ORDER BY "nomPatient", "prenomPatient"`
        );
        return result.rows;
    }

    /**
     * Récupérer un patient par ID
     */
    static async getOne(idPatient: number): Promise<IPatient | null> {
        const result = await pool.query(
            `SELECT * FROM "Patient" WHERE "idPatient" = $1`,
            [idPatient]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    /**
     * Trouver un patient par email
     */
    static async findByEmail(email: string): Promise<IPatient | null> {
        const result = await pool.query(
            `SELECT * FROM "Patient" WHERE "mailPatient" = $1 AND "actif" = TRUE`,
            [email]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    /**
     * Trouver un patient par téléphone
     */
    static async findByPhone(phone: string): Promise<IPatient | null> {
        const result = await pool.query(
            `SELECT * FROM "Patient" WHERE "telephonePatient" = $1 AND "actif" = TRUE`,
            [phone]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    /**
     * Mettre à jour un patient
     */
    static async update(idPatient: number, patient: Partial<IPatient>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (patient.nomPatient !== undefined) {
            fields.push(`"nomPatient" = $${paramIndex++}`);
            values.push(patient.nomPatient);
        }
        if (patient.prenomPatient !== undefined) {
            fields.push(`"prenomPatient" = $${paramIndex++}`);
            values.push(patient.prenomPatient);
        }
        if (patient.adressePatient !== undefined) {
            fields.push(`"adressePatient" = $${paramIndex++}`);
            values.push(patient.adressePatient);
        }
        if (patient.codePostalPatient !== undefined) {
            fields.push(`"codePostalPatient" = $${paramIndex++}`);
            values.push(patient.codePostalPatient);
        }
        if (patient.villePatient !== undefined) {
            fields.push(`"villePatient" = $${paramIndex++}`);
            values.push(patient.villePatient);
        }
        if (patient.telephonePatient !== undefined) {
            fields.push(`"telephonePatient" = $${paramIndex++}`);
            values.push(patient.telephonePatient);
        }
        if (patient.mailPatient !== undefined) {
            fields.push(`"mailPatient" = $${paramIndex++}`);
            values.push(patient.mailPatient);
        }
        if (patient.numSecuriteSociale !== undefined) {
            fields.push(`"numSecuriteSociale" = $${paramIndex++}`);
            values.push(patient.numSecuriteSociale);
        }

        if (fields.length === 0) return false;

        values.push(idPatient);

        const result = await pool.query(
            `UPDATE "Patient" SET ${fields.join(', ')} WHERE "idPatient" = $${paramIndex}`,
            values
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer un patient (soft delete)
     */
    static async delete(idPatient: number): Promise<boolean> {
        const result = await pool.query(
            `UPDATE "Patient" SET "actif" = FALSE WHERE "idPatient" = $1`,
            [idPatient]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Rechercher des patients par nom ou prénom
     */
    static async search(searchTerm: string): Promise<IPatient[]> {
        const result = await pool.query(
            `SELECT * FROM "Patient"
             WHERE "actif" = TRUE
             AND (
                LOWER("nomPatient") LIKE LOWER($1)
                OR LOWER("prenomPatient") LIKE LOWER($1)
             )
             ORDER BY "nomPatient", "prenomPatient"`,
            [`%${searchTerm}%`]
        );
        return result.rows;
    }

    /**
     * Compter le nombre de patients actifs
     */
    static async count(): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM "Patient" WHERE "actif" = TRUE`
        );
        return parseInt(result.rows[0].count);
    }

    /**
     * Vérifier si un email existe déjà
     */
    static async emailExists(email: string, excludeId?: number): Promise<boolean> {
        let query = `SELECT 1 FROM "Patient" WHERE "mailPatient" = $1 AND "actif" = TRUE`;
        const params: any[] = [email];

        if (excludeId) {
            query += ` AND "idPatient" != $2`;
            params.push(excludeId);
        }

        const result = await pool.query(query, params);
        return result.rows.length > 0;
    }

    /**
     * Vérifier si un téléphone existe déjà
     */
    static async phoneExists(phone: string, excludeId?: number): Promise<boolean> {
        let query = `SELECT 1 FROM "Patient" WHERE "telephonePatient" = $1 AND "actif" = TRUE`;
        const params: any[] = [phone];

        if (excludeId) {
            query += ` AND "idPatient" != $2`;
            params.push(excludeId);
        }

        const result = await pool.query(query, params);
        return result.rows.length > 0;
    }

    /**
     * Récupérer l'historique des RDV d'un patient
     */
    static async getHistoriqueRDV(idPatient: number): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                r."idRDV",
                r."dateHeurePrevu",
                r."dateHeureReel",
                r."statutRDV",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "RDV" r
             LEFT JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
             WHERE r."idPatient" = $1
             ORDER BY r."dateHeurePrevu" DESC`,
            [idPatient]
        );
        return result.rows;
    }

    /**
     * Récupérer les statistiques d'un patient
     */
    static async getStats(idPatient: number): Promise<any> {
        const result = await pool.query(
            `SELECT
                COUNT(DISTINCT r."idRDV") AS "nombreRDV",
                COUNT(DISTINCT CASE WHEN r."statutRDV" = 'REALISE' THEN r."idRDV" END) AS "nombreRDVRealises",
                SUM(rp."quantite" * rp."prixUnitaire") AS "montantTotal"
             FROM "RDV" r
             LEFT JOIN "RDV_Prestation" rp ON r."idRDV" = rp."idRDV"
             WHERE r."idPatient" = $1`,
            [idPatient]
        );

        return result.rows[0];
    }
}
