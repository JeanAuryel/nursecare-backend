import pool from '../config/dbconfig';

export interface IPrestation {
    idPrestation?: number;
    nomPrestation: string;
    prixTTC: number;
    dureeEstimee?: number; // Durée en minutes
    idCategorie: number;
    actif?: boolean;
    categorie?: {
        idCategorie: number;
        nomCategorie: string;
    };
}

export class Prestation {
    /**
     * Créer une nouvelle prestation
     */
    static async create(prestation: Omit<IPrestation, 'idPrestation'>): Promise<number> {
        const result = await pool.query(
            `INSERT INTO "Prestation" ("nomPrestation", "prixTTC", "dureeEstimee", "idCategorie")
             VALUES ($1, $2, $3, $4)
             RETURNING "idPrestation"`,
            [
                prestation.nomPrestation,
                prestation.prixTTC,
                prestation.dureeEstimee || null,
                prestation.idCategorie
            ]
        );
        return result.rows[0].idPrestation;
    }

    /**
     * Récupérer toutes les prestations actives
     */
    static async getAll(): Promise<IPrestation[]> {
        const result = await pool.query(`
            SELECT
                p."idPrestation",
                p."nomPrestation",
                p."prixTTC",
                p."dureeEstimee",
                p."idCategorie",
                p."actif",
                c."nomCategorie"
            FROM "Prestation" p
            LEFT JOIN "Categorie" c ON p."idCategorie" = c."idCategorie"
            WHERE p."actif" = TRUE
            ORDER BY c."nomCategorie", p."nomPrestation"
        `);

        // Restructurer les données pour inclure l'objet categorie
        return result.rows.map((row: any) => ({
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prixTTC: parseFloat(row.prixTTC),
            dureeEstimee: row.dureeEstimee,
            idCategorie: row.idCategorie,
            actif: row.actif,
            categorie: row.nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.nomCategorie
            } : undefined
        }));
    }

    /**
     * Récupérer une prestation par ID
     */
    static async getOne(idPrestation: number): Promise<IPrestation | null> {
        const result = await pool.query(`
            SELECT
                p."idPrestation",
                p."nomPrestation",
                p."prixTTC",
                p."dureeEstimee",
                p."idCategorie",
                p."actif",
                c."nomCategorie"
            FROM "Prestation" p
            LEFT JOIN "Categorie" c ON p."idCategorie" = c."idCategorie"
            WHERE p."idPrestation" = $1
        `, [idPrestation]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prixTTC: parseFloat(row.prixTTC),
            dureeEstimee: row.dureeEstimee,
            idCategorie: row.idCategorie,
            actif: row.actif,
            categorie: row.nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.nomCategorie
            } : undefined
        };
    }

    /**
     * Récupérer les prestations d'une catégorie
     */
    static async getByCategorie(idCategorie: number): Promise<IPrestation[]> {
        const result = await pool.query(
            `SELECT
                p."idPrestation",
                p."nomPrestation",
                p."prixTTC",
                p."dureeEstimee",
                p."idCategorie",
                p."actif",
                c."nomCategorie"
             FROM "Prestation" p
             LEFT JOIN "Categorie" c ON p."idCategorie" = c."idCategorie"
             WHERE p."idCategorie" = $1 AND p."actif" = TRUE
             ORDER BY p."nomPrestation"`,
            [idCategorie]
        );

        return result.rows.map((row: any) => ({
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prixTTC: parseFloat(row.prixTTC),
            dureeEstimee: row.dureeEstimee,
            idCategorie: row.idCategorie,
            actif: row.actif,
            categorie: {
                idCategorie: row.idCategorie,
                nomCategorie: row.nomCategorie
            }
        }));
    }

    /**
     * Rechercher des prestations par nom
     */
    static async search(searchTerm: string): Promise<IPrestation[]> {
        const result = await pool.query(
            `SELECT
                p."idPrestation",
                p."nomPrestation",
                p."prixTTC",
                p."dureeEstimee",
                p."idCategorie",
                p."actif",
                c."nomCategorie"
             FROM "Prestation" p
             LEFT JOIN "Categorie" c ON p."idCategorie" = c."idCategorie"
             WHERE p."actif" = TRUE
             AND LOWER(p."nomPrestation") LIKE LOWER($1)
             ORDER BY p."nomPrestation"`,
            [`%${searchTerm}%`]
        );

        return result.rows.map((row: any) => ({
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prixTTC: parseFloat(row.prixTTC),
            dureeEstimee: row.dureeEstimee,
            idCategorie: row.idCategorie,
            actif: row.actif,
            categorie: row.nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.nomCategorie
            } : undefined
        }));
    }

    /**
     * Mettre à jour une prestation
     */
    static async update(idPrestation: number, prestation: Partial<IPrestation>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (prestation.nomPrestation !== undefined) {
            fields.push(`"nomPrestation" = $${paramIndex++}`);
            values.push(prestation.nomPrestation);
        }
        if (prestation.prixTTC !== undefined) {
            fields.push(`"prixTTC" = $${paramIndex++}`);
            values.push(prestation.prixTTC);
        }
        if (prestation.dureeEstimee !== undefined) {
            fields.push(`"dureeEstimee" = $${paramIndex++}`);
            values.push(prestation.dureeEstimee);
        }
        if (prestation.idCategorie !== undefined) {
            fields.push(`"idCategorie" = $${paramIndex++}`);
            values.push(prestation.idCategorie);
        }

        if (fields.length === 0) return false;

        values.push(idPrestation);

        const result = await pool.query(
            `UPDATE "Prestation" SET ${fields.join(', ')} WHERE "idPrestation" = $${paramIndex}`,
            values
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer une prestation (soft delete)
     */
    static async delete(idPrestation: number): Promise<boolean> {
        const result = await pool.query(
            `UPDATE "Prestation" SET "actif" = FALSE WHERE "idPrestation" = $1`,
            [idPrestation]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Récupérer les prestations les plus utilisées
     */
    static async getMostUsed(limit: number = 10): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                p."idPrestation",
                p."nomPrestation",
                p."prixTTC",
                c."nomCategorie",
                COUNT(rp."idRDV") AS "nombreUtilisations",
                SUM(rp."quantite") AS "quantiteTotale",
                SUM(rp."quantite" * rp."prixUnitaire") AS "chiffreAffaires"
             FROM "Prestation" p
             LEFT JOIN "Categorie" c ON p."idCategorie" = c."idCategorie"
             LEFT JOIN "RDV_Prestation" rp ON p."idPrestation" = rp."idPrestation"
             WHERE p."actif" = TRUE
             GROUP BY p."idPrestation", p."nomPrestation", p."prixTTC", c."nomCategorie"
             ORDER BY "nombreUtilisations" DESC
             LIMIT $1`,
            [limit]
        );

        return result.rows;
    }

    /**
     * Calculer le prix moyen des prestations par catégorie
     */
    static async getAveragePriceByCategorie(): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                c."idCategorie",
                c."nomCategorie",
                COUNT(p."idPrestation") AS "nombrePrestations",
                AVG(p."prixTTC") AS "prixMoyen",
                MIN(p."prixTTC") AS "prixMin",
                MAX(p."prixTTC") AS "prixMax"
             FROM "Categorie" c
             LEFT JOIN "Prestation" p ON c."idCategorie" = p."idCategorie" AND p."actif" = TRUE
             GROUP BY c."idCategorie", c."nomCategorie"
             ORDER BY c."nomCategorie"`
        );

        return result.rows;
    }

    /**
     * Compter le nombre de prestations actives
     */
    static async count(): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM "Prestation" WHERE "actif" = TRUE`
        );
        return parseInt(result.rows[0].count);
    }
}
