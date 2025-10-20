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
        const [result]: any = await pool.execute(
            `INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES (?, ?, ?)`,
            [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie]
        );
        return result.insertId;
    }

    static async getAll(): Promise<IPrestation[]> {
        const [rows]: any = await pool.execute(`
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
        return rows.map((row: any) => ({
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
        const [rows]: any = await pool.execute(`
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

        if (rows.length === 0) return null;

        const row = rows[0];
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
        const [result]: any = await pool.execute(
            `UPDATE Prestation SET nomPrestation = ?, prix_TTC = ?, idCategorie = ? WHERE idPrestation = ?`,
            [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie, idPrestation]
        );
        return result.affectedRows;
    }

    static async delete(idPrestation: number): Promise<number> {
        const [result]: any = await pool.execute(`DELETE FROM Prestation WHERE idPrestation = ?`, [idPrestation]);
        return result.affectedRows;
    }
}
