import pool from '../config/dbconfig';

export interface IEcole {
  idEcole?: number;
  nomEcole: string;
  adresseEcole?: string;
  telephoneEcole?: string;
  mailEcole?: string;
}

export class Ecole {
  /**
   * Créer une nouvelle école
   */
  static async create(ecoleData: Omit<IEcole, 'idEcole'>): Promise<IEcole> {
    const result = await pool.query(
      `INSERT INTO "Ecole" ("nomEcole", "adresseEcole", "telephoneEcole", "mailEcole")
       VALUES ($1, $2, $3, $4)
       RETURNING "idEcole"`,
      [
        ecoleData.nomEcole,
        ecoleData.adresseEcole || null,
        ecoleData.telephoneEcole || null,
        ecoleData.mailEcole || null
      ]
    );

    const id = result.rows[0].idEcole;
    const selectResult = await pool.query(
      `SELECT * FROM "Ecole" WHERE "idEcole" = $1`,
      [id]
    );
    return selectResult.rows[0];
  }

  /**
   * Récupérer toutes les écoles
   */
  static async getAll(): Promise<IEcole[]> {
    const result = await pool.query(`
      SELECT * FROM "Ecole"
      ORDER BY "nomEcole"
    `);
    return result.rows;
  }

  /**
   * Récupérer toutes les écoles avec leurs stagiaires
   */
  static async getAllWithStagiaires(): Promise<any[]> {
    const ecolesResult = await pool.query(`
      SELECT * FROM "Ecole"
      ORDER BY "nomEcole"
    `);

    // Pour chaque école, récupérer ses stagiaires actifs
    for (const ecole of ecolesResult.rows) {
      const stagiairesResult = await pool.query(
        `SELECT * FROM "Stagiaire"
         WHERE "idEcole" = $1 AND "actif" = TRUE
         ORDER BY "nomStagiaire", "prenomStagiaire"`,
        [ecole.idEcole]
      );
      ecole.stagiaires = stagiairesResult.rows;
    }

    return ecolesResult.rows;
  }

  /**
   * Récupérer une école par ID
   */
  static async getOne(idEcole: number): Promise<IEcole | null> {
    const result = await pool.query(
      `SELECT * FROM "Ecole" WHERE "idEcole" = $1`,
      [idEcole]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  /**
   * Récupérer une école avec ses stagiaires
   */
  static async getOneWithStagiaires(idEcole: number): Promise<any | null> {
    const ecoleResult = await pool.query(
      `SELECT * FROM "Ecole" WHERE "idEcole" = $1`,
      [idEcole]
    );

    if (ecoleResult.rows.length === 0) return null;

    const ecole = ecoleResult.rows[0];

    // Récupérer les stagiaires de cette école
    const stagiairesResult = await pool.query(
      `SELECT * FROM "Stagiaire"
       WHERE "idEcole" = $1 AND "actif" = TRUE
       ORDER BY "nomStagiaire", "prenomStagiaire"`,
      [idEcole]
    );

    ecole.stagiaires = stagiairesResult.rows;

    return ecole;
  }

  /**
   * Récupérer une école par nom
   */
  static async findByName(nomEcole: string): Promise<IEcole | null> {
    const result = await pool.query(
      `SELECT * FROM "Ecole" WHERE "nomEcole" = $1`,
      [nomEcole]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  /**
   * Mettre à jour une école
   */
  static async update(idEcole: number, ecoleData: Partial<IEcole>): Promise<IEcole | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (ecoleData.nomEcole !== undefined) {
      fields.push(`"nomEcole" = $${paramIndex++}`);
      values.push(ecoleData.nomEcole);
    }
    if (ecoleData.adresseEcole !== undefined) {
      fields.push(`"adresseEcole" = $${paramIndex++}`);
      values.push(ecoleData.adresseEcole);
    }
    if (ecoleData.telephoneEcole !== undefined) {
      fields.push(`"telephoneEcole" = $${paramIndex++}`);
      values.push(ecoleData.telephoneEcole);
    }
    if (ecoleData.mailEcole !== undefined) {
      fields.push(`"mailEcole" = $${paramIndex++}`);
      values.push(ecoleData.mailEcole);
    }

    if (fields.length === 0) {
      return this.getOne(idEcole);
    }

    values.push(idEcole);

    await pool.query(
      `UPDATE "Ecole" SET ${fields.join(', ')} WHERE "idEcole" = $${paramIndex}`,
      values
    );

    return this.getOne(idEcole);
  }

  /**
   * Supprimer une école
   */
  static async delete(idEcole: number): Promise<boolean> {
    // Vérifier s'il y a des stagiaires liés
    const stagiairesResult = await pool.query(
      `SELECT COUNT(*) as count FROM "Stagiaire" WHERE "idEcole" = $1 AND "actif" = TRUE`,
      [idEcole]
    );

    if (parseInt(stagiairesResult.rows[0].count) > 0) {
      throw new Error('Impossible de supprimer une école ayant des stagiaires actifs');
    }

    const result = await pool.query(
      `DELETE FROM "Ecole" WHERE "idEcole" = $1`,
      [idEcole]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Rechercher des écoles par nom
   */
  static async search(searchTerm: string): Promise<IEcole[]> {
    const result = await pool.query(
      `SELECT * FROM "Ecole"
       WHERE LOWER("nomEcole") LIKE LOWER($1)
       ORDER BY "nomEcole"`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  /**
   * Compter le nombre d'écoles
   */
  static async count(): Promise<number> {
    const result = await pool.query(`SELECT COUNT(*) as count FROM "Ecole"`);
    return parseInt(result.rows[0].count);
  }

  /**
   * Récupérer les statistiques d'une école
   */
  static async getStats(idEcole: number): Promise<any> {
    const result = await pool.query(
      `SELECT
        e."idEcole",
        e."nomEcole",
        COUNT(DISTINCT s."idStagiaire") AS "nombreStagiaires",
        COUNT(DISTINCT CASE WHEN s."actif" = TRUE THEN s."idStagiaire" END) AS "nombreStagiairesActifs",
        COUNT(bo."idBonObservation") AS "nombreEvaluations",
        AVG(bo."noteStagiaire") AS "moyenneNotes"
       FROM "Ecole" e
       LEFT JOIN "Stagiaire" s ON e."idEcole" = s."idEcole"
       LEFT JOIN "BonObservation" bo ON s."idStagiaire" = bo."idStagiaire"
       WHERE e."idEcole" = $1
       GROUP BY e."idEcole", e."nomEcole"`,
      [idEcole]
    );

    return result.rows[0];
  }

  /**
   * Récupérer les moyennes des notes par école
   */
  static async getMoyennesNotes(): Promise<any[]> {
    const result = await pool.query(
      `SELECT
        e."idEcole",
        e."nomEcole",
        COUNT(DISTINCT s."idStagiaire") AS "nombreStagiaires",
        COUNT(bo."idBonObservation") AS "nombreObservations",
        AVG(bo."noteStagiaire") AS "moyenneNotes",
        MIN(bo."noteStagiaire") AS "noteMin",
        MAX(bo."noteStagiaire") AS "noteMax"
       FROM "Ecole" e
       LEFT JOIN "Stagiaire" s ON e."idEcole" = s."idEcole"
       LEFT JOIN "BonObservation" bo ON s."idStagiaire" = bo."idStagiaire"
       GROUP BY e."idEcole", e."nomEcole"
       ORDER BY "moyenneNotes" DESC NULLS LAST`
    );

    return result.rows;
  }

  /**
   * Vérifier si un nom d'école existe déjà
   */
  static async nameExists(nomEcole: string, excludeId?: number): Promise<boolean> {
    let query = `SELECT 1 FROM "Ecole" WHERE "nomEcole" = $1`;
    const params: any[] = [nomEcole];

    if (excludeId) {
      query += ` AND "idEcole" != $2`;
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }
}
