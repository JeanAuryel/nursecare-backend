import pool from '../config/dbconfig';

export interface ICategorie {
  idCategorie?: number;
  nomCategorie: string;
  descriptionCategorie?: string;
}

export class Categorie {
  static async create(categorie: ICategorie): Promise<number> {
    const result = await pool.query(
      `INSERT INTO "Categorie" ("nomCategorie", "descriptionCategorie") VALUES ($1, $2) RETURNING "idCategorie"`,
      [categorie.nomCategorie, categorie.descriptionCategorie || null]
    );
    return result.rows[0].idCategorie;
  }

  static async findAll(): Promise<ICategorie[]> {
    const result = await pool.query(`SELECT * FROM "Categorie"`);
    return result.rows;
  }

  static async findById(idCategorie: number): Promise<ICategorie | null> {
    const result = await pool.query(
      `SELECT * FROM "Categorie" WHERE "idCategorie" = $1`,
      [idCategorie]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  static async update(categorie: ICategorie): Promise<number> {
    const result = await pool.query(
      `UPDATE "Categorie" SET "nomCategorie" = $1, "descriptionCategorie" = $2 WHERE "idCategorie" = $3`,
      [categorie.nomCategorie, categorie.descriptionCategorie || null, categorie.idCategorie]
    );
    return result.rowCount || 0;
  }

  static async delete(idCategorie: number): Promise<number> {
    const result = await pool.query(
      `DELETE FROM "Categorie" WHERE "idCategorie" = $1`,
      [idCategorie]
    );
    return result.rowCount || 0;
  }
}
