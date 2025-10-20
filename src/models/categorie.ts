import pool from '../config/dbconfig';

export interface ICategorie {
  idCategorie?: number; // id en option à la création
  nomCategorie: string;
}

export class Categorie {
  static async create(categorie: ICategorie): Promise<number> {
    const [result]: any = await pool.execute(
      `INSERT INTO Categorie (nomCategorie) VALUES (?)`,
      [categorie.nomCategorie]
    );
    return result.insertId;
  }

  static async findAll(): Promise<ICategorie[]> {
    const [rows]: any = await pool.execute(`SELECT * FROM Categorie`);
    return rows;
  }

  static async findById(idCategorie: number): Promise<ICategorie | null> {
    const [rows]: any = await pool.execute(
      `SELECT * FROM Categorie WHERE idCategorie = ?`,
      [idCategorie]
    );
    return rows.length ? rows[0] : null;
  }

  static async update(categorie: ICategorie): Promise<number> {
    const [result]: any = await pool.execute(
      `UPDATE Categorie SET nomCategorie = ? WHERE idCategorie = ?`,
      [categorie.nomCategorie, categorie.idCategorie]
    );
    return result.affectedRows;
  }

  static async delete(idCategorie: number): Promise<number> {
    const [result]: any = await pool.execute(
      `DELETE FROM Categorie WHERE idCategorie = ?`,
      [idCategorie]
    );
    return result.affectedRows;
  }
}
