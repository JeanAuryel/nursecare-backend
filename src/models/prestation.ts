import pool from '../config/dbconfig';

export interface IPrestation {
    idPrestation?: number;
    nomPrestation: string;
    prix_TTC: number;
    idCategorie: number;
    categorie?: {
        idCategorie: number;
        nomCategorie: string;
    };
}

export class Prestation {
    static async create(prestation: IPrestation): Promise<number> {
        const result = await pool.query(
            `INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES ($1, $2, $3) RETURNING idPrestation`,
            [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie]
        );
        return result.rows[0].idprestation;
    }

    static async getAll(): Promise<IPrestation[]> {
        const result = await pool.query(`
            SELECT
                p.idPrestation,
                p.nomPrestation,
                p.prix_TTC,
                p.idCategorie,
                c.nomCategorie as categorie_nomCategorie
            FROM Prestation p
            LEFT JOIN Categorie c ON p.idCategorie = c.idCategorie
            ORDER BY p.nomPrestation
        `);

        // Restructurer les données pour inclure l'objet categorie
        return result.rows.map((row: any) => ({
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prix_TTC: row.prix_TTC,
            idCategorie: row.idCategorie,
            categorie: row.categorie_nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.categorie_nomCategorie
            } : undefined
        }));
    }

    static async getOne(idPrestation: number): Promise<IPrestation | null> {
        const result = await pool.query(`
            SELECT
                p.idPrestation,
                p.nomPrestation,
                p.prix_TTC,
                p.idCategorie,
                c.nomCategorie as categorie_nomCategorie
            FROM Prestation p
            LEFT JOIN Categorie c ON p.idCategorie = c.idCategorie
            WHERE p.idPrestation = ?
        `, [idPrestation]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prix_TTC: row.prix_TTC,
            idCategorie: row.idCategorie,
            categorie: row.categorie_nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.categorie_nomCategorie
            } : undefined
        };
    }

    static async update(idPrestation: number, prestation: IPrestation): Promise<number> {
        const result = await pool.query(
            `UPDATE Prestation SET nomPrestation = $1, prix_TTC = $2, idCategorie = $3 WHERE idPrestation = $4`,
            [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie, idPrestation]
        );
        return result.rowCount || 0;
    }

    static async delete(idPrestation: number): Promise<number> {
        const result = await pool.query(`DELETE FROM Prestation WHERE idPrestation = $1`, [idPrestation]);
        return result.rowCount || 0;
    }
}
