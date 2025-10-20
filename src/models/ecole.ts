import pool from '../config/dbconfig';

export interface IEcole {
  idEcole?: number;
  nomEcole: string;
  adresseEcole: string;
  villeEcole: string;
  codePostalEcole: string;
  numEcole: string;
  contactReferent: string;
}

export interface IEcoleForm {
  nomEcole: string;
  adresseEcole: string;
  villeEcole: string;
  codePostalEcole: string;
  numEcole: string;
  contactReferent: string;
}

export class Ecole {
  static async create(ecoleData: IEcoleForm): Promise<IEcole> {
    const [result]: any = await pool.execute(
      `INSERT INTO Ecole (nomEcole, adresseEcole, villeEcole, codePostalEcole, numEcole, contactReferent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ecoleData.nomEcole,
        ecoleData.adresseEcole,
        ecoleData.villeEcole,
        ecoleData.codePostalEcole,
        ecoleData.numEcole,
        ecoleData.contactReferent
      ]
    );
    const id = result.insertId;
    const [rows]: any = await pool.execute(
      `SELECT * FROM Ecole WHERE idEcole = ?`,
      [id]
    );
    return rows[0];
  }

  static async getAll(): Promise<IEcole[]> {
    const [rows]: any = await pool.execute(`SELECT * FROM Ecole ORDER BY nomEcole`);
    return rows;
  }

  static async getAllWithStagiaires(): Promise<any[]> {
    const [ecoles]: any = await pool.execute(`SELECT * FROM Ecole ORDER BY nomEcole`);

    // Pour chaque école, récupérer ses stagiaires
    for (const ecole of ecoles) {
      const [stagiaires]: any = await pool.execute(
        `SELECT * FROM Stagiaire WHERE idEcole = ? ORDER BY nomStagiaire, prenomStagiaire`,
        [ecole.idEcole]
      );
      ecole.stagiaires = stagiaires;
    }

    return ecoles;
  }

  static async getOne(idEcole: number): Promise<IEcole | null> {
    const [rows]: any = await pool.execute(
      `SELECT * FROM Ecole WHERE idEcole = ?`,
      [idEcole]
    );
    return rows.length ? rows[0] : null;
  }

  static async update(idEcole: number, ecoleData: Partial<IEcoleForm>): Promise<IEcole | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (ecoleData.nomEcole !== undefined) {
      fields.push('nomEcole = ?');
      values.push(ecoleData.nomEcole);
    }
    if (ecoleData.adresseEcole !== undefined) {
      fields.push('adresseEcole = ?');
      values.push(ecoleData.adresseEcole);
    }
    if (ecoleData.villeEcole !== undefined) {
      fields.push('villeEcole = ?');
      values.push(ecoleData.villeEcole);
    }
    if (ecoleData.codePostalEcole !== undefined) {
      fields.push('codePostalEcole = ?');
      values.push(ecoleData.codePostalEcole);
    }
    if (ecoleData.numEcole !== undefined) {
      fields.push('numEcole = ?');
      values.push(ecoleData.numEcole);
    }
    if (ecoleData.contactReferent !== undefined) {
      fields.push('contactReferent = ?');
      values.push(ecoleData.contactReferent);
    }

    if (fields.length === 0) {
      return this.getOne(idEcole);
    }

    values.push(idEcole);

    await pool.execute(
      `UPDATE Ecole SET ${fields.join(', ')} WHERE idEcole = ?`,
      values
    );

    return this.getOne(idEcole);
  }

  static async delete(idEcole: number): Promise<number> {
    const [result]: any = await pool.execute(
      `DELETE FROM Ecole WHERE idEcole = ?`,
      [idEcole]
    );
    return result.affectedRows;
  }
}
