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
    const result = await pool.query(
      `INSERT INTO Ecole (nomEcole, adresseEcole, villeEcole, codePostalEcole, numEcole, contactReferent)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING idEcole`,
      [
        ecoleData.nomEcole,
        ecoleData.adresseEcole,
        ecoleData.villeEcole,
        ecoleData.codePostalEcole,
        ecoleData.numEcole,
        ecoleData.contactReferent
      ]
    );
    const id = result.rows[0].idecole;
    const selectResult = await pool.query(
      `SELECT * FROM Ecole WHERE idEcole = $1`,
      [id]
    );
    return selectResult.rows[0];
  }

  static async getAll(): Promise<IEcole[]> {
    const result = await pool.query(`SELECT * FROM Ecole ORDER BY nomEcole`);
    return result.rows;
  }

  static async getAllWithStagiaires(): Promise<any[]> {
    const ecolesResult = await pool.query(`SELECT * FROM Ecole ORDER BY nomEcole`);

    // Pour chaque école, récupérer ses stagiaires
    for (const ecole of ecolesResult.rows) {
      const stagiairesResult = await pool.query(
        `SELECT * FROM Stagiaire WHERE idEcole = $1 ORDER BY nomStagiaire, prenomStagiaire`,
        [ecole.idEcole]
      );
      ecole.stagiaires = stagiairesResult.rows;
    }

    return ecoles;
  }

  static async getOne(idEcole: number): Promise<IEcole | null> {
    const result = await pool.query(
      `SELECT * FROM Ecole WHERE idEcole = $1`,
      [idEcole]
    );
    return result.rows.length ? result.rows[0] : null;
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

    await pool.query(
      `UPDATE Ecole SET ${fields.join(', ')} WHERE idEcole = $1`,
      values
    );

    return this.getOne(idEcole);
  }

  static async delete(idEcole: number): Promise<number> {
    const result = await pool.query(
      `DELETE FROM Ecole WHERE idEcole = $1`,
      [idEcole]
    );
    return result.rowCount || 0;
  }
}
