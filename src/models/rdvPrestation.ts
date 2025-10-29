import pool from '../config/dbconfig';

export interface IRDVPrestation {
    idRDV: number;
    idPrestation: number;
    quantite: number;
    prixUnitaire: number;
}

export interface IRDVPrestationDetailed extends IRDVPrestation {
    prestation?: {
        idPrestation: number;
        nomPrestation: string;
        nomCategorie: string;
        dureeEstimee?: number;
    };
    montantTotal?: number; // quantite * prixUnitaire
}

export class RDVPrestation {
    /**
     * Ajouter une prestation à un RDV
     */
    static async add(rdvPrestation: IRDVPrestation): Promise<boolean> {
        const result = await pool.query(
            `INSERT INTO "RDV_Prestation" ("idRDV", "idPrestation", "quantite", "prixUnitaire")
             VALUES ($1, $2, $3, $4)`,
            [
                rdvPrestation.idRDV,
                rdvPrestation.idPrestation,
                rdvPrestation.quantite,
                rdvPrestation.prixUnitaire
            ]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Ajouter plusieurs prestations à un RDV en une seule transaction
     */
    static async addMultiple(idRDV: number, prestations: Omit<IRDVPrestation, 'idRDV'>[]): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const prestation of prestations) {
                await client.query(
                    `INSERT INTO "RDV_Prestation" ("idRDV", "idPrestation", "quantite", "prixUnitaire")
                     VALUES ($1, $2, $3, $4)`,
                    [idRDV, prestation.idPrestation, prestation.quantite, prestation.prixUnitaire]
                );
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Récupérer toutes les prestations d'un RDV
     */
    static async getByRDV(idRDV: number): Promise<IRDVPrestationDetailed[]> {
        const result = await pool.query(
            `SELECT
                rp."idRDV",
                rp."idPrestation",
                rp."quantite",
                rp."prixUnitaire",
                (rp."quantite" * rp."prixUnitaire") AS "montantTotal",
                pr."nomPrestation",
                pr."dureeEstimee",
                c."nomCategorie"
             FROM "RDV_Prestation" rp
             INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             WHERE rp."idRDV" = $1
             ORDER BY c."nomCategorie", pr."nomPrestation"`,
            [idRDV]
        );

        return result.rows.map(row => ({
            idRDV: row.idRDV,
            idPrestation: row.idPrestation,
            quantite: row.quantite,
            prixUnitaire: parseFloat(row.prixUnitaire),
            montantTotal: parseFloat(row.montantTotal),
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: row.nomCategorie,
                dureeEstimee: row.dureeEstimee
            }
        }));
    }

    /**
     * Récupérer une prestation spécifique d'un RDV
     */
    static async getOne(idRDV: number, idPrestation: number): Promise<IRDVPrestation | null> {
        const result = await pool.query(
            `SELECT * FROM "RDV_Prestation"
             WHERE "idRDV" = $1 AND "idPrestation" = $2`,
            [idRDV, idPrestation]
        );

        if (!result.rows.length) return null;

        const row = result.rows[0];
        return {
            idRDV: row.idRDV,
            idPrestation: row.idPrestation,
            quantite: row.quantite,
            prixUnitaire: parseFloat(row.prixUnitaire)
        };
    }

    /**
     * Mettre à jour une prestation d'un RDV (quantité ou prix)
     */
    static async update(
        idRDV: number,
        idPrestation: number,
        updates: { quantite?: number; prixUnitaire?: number }
    ): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updates.quantite !== undefined) {
            fields.push(`"quantite" = $${paramIndex++}`);
            values.push(updates.quantite);
        }

        if (updates.prixUnitaire !== undefined) {
            fields.push(`"prixUnitaire" = $${paramIndex++}`);
            values.push(updates.prixUnitaire);
        }

        if (fields.length === 0) return false;

        values.push(idRDV, idPrestation);

        const result = await pool.query(
            `UPDATE "RDV_Prestation"
             SET ${fields.join(', ')}
             WHERE "idRDV" = $${paramIndex} AND "idPrestation" = $${paramIndex + 1}`,
            values
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer une prestation d'un RDV
     */
    static async delete(idRDV: number, idPrestation: number): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM "RDV_Prestation"
             WHERE "idRDV" = $1 AND "idPrestation" = $2`,
            [idRDV, idPrestation]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer toutes les prestations d'un RDV
     */
    static async deleteAllByRDV(idRDV: number): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM "RDV_Prestation" WHERE "idRDV" = $1`,
            [idRDV]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Calculer le montant total d'un RDV
     */
    static async calculateTotal(idRDV: number): Promise<number> {
        const result = await pool.query(
            `SELECT SUM("quantite" * "prixUnitaire") AS "montantTotal"
             FROM "RDV_Prestation"
             WHERE "idRDV" = $1`,
            [idRDV]
        );

        return parseFloat(result.rows[0].montantTotal || 0);
    }

    /**
     * Calculer la durée totale estimée d'un RDV
     */
    static async calculateDureeEstimee(idRDV: number): Promise<number> {
        const result = await pool.query(
            `SELECT SUM(rp."quantite" * pr."dureeEstimee") AS "dureeEstimee"
             FROM "RDV_Prestation" rp
             INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
             WHERE rp."idRDV" = $1 AND pr."dureeEstimee" IS NOT NULL`,
            [idRDV]
        );

        return parseInt(result.rows[0].dureeEstimee || 0);
    }

    /**
     * Vérifier si une prestation existe dans un RDV
     */
    static async exists(idRDV: number, idPrestation: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM "RDV_Prestation"
             WHERE "idRDV" = $1 AND "idPrestation" = $2`,
            [idRDV, idPrestation]
        );

        return result.rows.length > 0;
    }

    /**
     * Compter le nombre de prestations d'un RDV
     */
    static async countByRDV(idRDV: number): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM "RDV_Prestation" WHERE "idRDV" = $1`,
            [idRDV]
        );

        return parseInt(result.rows[0].count);
    }

    /**
     * Récupérer tous les RDV qui utilisent une prestation
     */
    static async getRDVsByPrestation(idPrestation: number): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                r."idRDV",
                r."dateHeurePrevu",
                r."statutRDV",
                e."nomEmploye",
                e."prenomEmploye",
                p."nomPatient",
                p."prenomPatient",
                rp."quantite",
                rp."prixUnitaire"
             FROM "RDV_Prestation" rp
             INNER JOIN "RDV" r ON rp."idRDV" = r."idRDV"
             INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
             INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
             WHERE rp."idPrestation" = $1
             ORDER BY r."dateHeurePrevu" DESC`,
            [idPrestation]
        );

        return result.rows;
    }

    /**
     * Récupérer les statistiques d'utilisation d'une prestation
     */
    static async getStatsByPrestation(idPrestation: number): Promise<any> {
        const result = await pool.query(
            `SELECT
                COUNT(DISTINCT rp."idRDV") AS "nombreRDV",
                SUM(rp."quantite") AS "quantiteTotale",
                AVG(rp."prixUnitaire") AS "prixMoyen",
                MIN(rp."prixUnitaire") AS "prixMin",
                MAX(rp."prixUnitaire") AS "prixMax",
                SUM(rp."quantite" * rp."prixUnitaire") AS "chiffreAffaires"
             FROM "RDV_Prestation" rp
             INNER JOIN "RDV" r ON rp."idRDV" = r."idRDV"
             WHERE rp."idPrestation" = $1 AND r."statutRDV" = 'REALISE'`,
            [idPrestation]
        );

        return result.rows[0];
    }

    /**
     * Récupérer les prestations les plus utilisées (top N)
     */
    static async getMostUsed(limit: number = 10): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                pr."idPrestation",
                pr."nomPrestation",
                c."nomCategorie",
                COUNT(DISTINCT rp."idRDV") AS "nombreRDV",
                SUM(rp."quantite") AS "quantiteTotale",
                SUM(rp."quantite" * rp."prixUnitaire") AS "chiffreAffaires"
             FROM "RDV_Prestation" rp
             INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             INNER JOIN "RDV" r ON rp."idRDV" = r."idRDV"
             WHERE r."statutRDV" = 'REALISE'
             GROUP BY pr."idPrestation", pr."nomPrestation", c."nomCategorie"
             ORDER BY "quantiteTotale" DESC
             LIMIT $1`,
            [limit]
        );

        return result.rows;
    }

    /**
     * Récupérer le chiffre d'affaires par catégorie de prestation
     */
    static async getCAByCategorie(dateDebut?: Date, dateFin?: Date): Promise<any[]> {
        let query = `
            SELECT
                c."idCategorie",
                c."nomCategorie",
                COUNT(DISTINCT rp."idRDV") AS "nombreRDV",
                SUM(rp."quantite") AS "nombrePrestations",
                SUM(rp."quantite" * rp."prixUnitaire") AS "chiffreAffaires"
             FROM "RDV_Prestation" rp
             INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             INNER JOIN "RDV" r ON rp."idRDV" = r."idRDV"
             WHERE r."statutRDV" = 'REALISE'
        `;

        const params: any[] = [];
        let paramIndex = 1;

        if (dateDebut) {
            query += ` AND r."dateHeureReel" >= $${paramIndex++}`;
            params.push(dateDebut);
        }

        if (dateFin) {
            query += ` AND r."dateHeureReel" <= $${paramIndex++}`;
            params.push(dateFin);
        }

        query += `
             GROUP BY c."idCategorie", c."nomCategorie"
             ORDER BY "chiffreAffaires" DESC
        `;

        const result = await pool.query(query, params);
        return result.rows;
    }

    /**
     * Remplacer toutes les prestations d'un RDV (transaction)
     */
    static async replaceAll(idRDV: number, prestations: Omit<IRDVPrestation, 'idRDV'>[]): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Supprimer toutes les prestations existantes
            await client.query(
                `DELETE FROM "RDV_Prestation" WHERE "idRDV" = $1`,
                [idRDV]
            );

            // Ajouter les nouvelles prestations
            for (const prestation of prestations) {
                await client.query(
                    `INSERT INTO "RDV_Prestation" ("idRDV", "idPrestation", "quantite", "prixUnitaire")
                     VALUES ($1, $2, $3, $4)`,
                    [idRDV, prestation.idPrestation, prestation.quantite, prestation.prixUnitaire]
                );
            }

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Récupérer toutes les lignes de prestation (admin)
     */
    static async getAll(limit?: number, offset?: number): Promise<IRDVPrestationDetailed[]> {
        let query = `
            SELECT
                rp."idRDV",
                rp."idPrestation",
                rp."quantite",
                rp."prixUnitaire",
                (rp."quantite" * rp."prixUnitaire") AS "montantTotal",
                pr."nomPrestation",
                c."nomCategorie",
                r."dateHeurePrevu",
                r."statutRDV"
             FROM "RDV_Prestation" rp
             INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             INNER JOIN "RDV" r ON rp."idRDV" = r."idRDV"
             ORDER BY r."dateHeurePrevu" DESC
        `;

        const params: any[] = [];
        if (limit) {
            query += ` LIMIT $1`;
            params.push(limit);
            if (offset) {
                query += ` OFFSET $2`;
                params.push(offset);
            }
        }

        const result = await pool.query(query, params);

        return result.rows.map(row => ({
            idRDV: row.idRDV,
            idPrestation: row.idPrestation,
            quantite: row.quantite,
            prixUnitaire: parseFloat(row.prixUnitaire),
            montantTotal: parseFloat(row.montantTotal),
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: row.nomCategorie
            }
        }));
    }
}
