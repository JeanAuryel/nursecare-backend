// src/models/rdv.ts
import pool from "../config/dbconfig";

export enum StatutRDV {
  PREVU = "PREVU",
  REALISE = "REALISE",
  ANNULE = "ANNULE"
}

export interface IRDV {
  idRDV?: number;
  idEmploye: number;
  idPatient: number;
  idStagiaire?: number | null;
  dateHeurePrevu: Date;
  dateHeureReel?: Date | null;
  dureeEstimee?: number | null;
  dureeReelle?: number | null;
  statutRDV?: StatutRDV;
  commentaireRDV?: string | null;
  dateHeureFacture?: Date | null;
  dateHeureIntegrePGI?: Date | null;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface IRDVComplet extends IRDV {
  nomEmploye?: string;
  prenomEmploye?: string;
  roleEmploye?: string;
  nomPatient?: string;
  prenomPatient?: string;
  adressePatient?: string;
  telephonePatient?: string;
  nomStagiaire?: string;
  prenomStagiaire?: string;
}

export interface IPrestationRDV {
  idPrestation: number;
  quantite: number;
  prixUnitaire: number;
}

export class RDV {

  /**
   * Créer un nouveau RDV
   */
  static async create(rdv: Omit<IRDV, 'idRDV'>): Promise<number> {
    const result = await pool.query(
      `INSERT INTO "RDV"
       ("idEmploye", "idPatient", "idStagiaire", "dateHeurePrevu",
        "dureeEstimee", "statutRDV", "commentaireRDV")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING "idRDV"`,
      [
        rdv.idEmploye,
        rdv.idPatient,
        rdv.idStagiaire || null,
        rdv.dateHeurePrevu,
        rdv.dureeEstimee || null,
        rdv.statutRDV || 'PREVU',
        rdv.commentaireRDV || null
      ]
    );

    return result.rows[0].idRDV;
  }

  /**
   * Ajouter des prestations à un RDV
   */
  static async addPrestations(idRDV: number, prestations: IPrestationRDV[]): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const prestation of prestations) {
        await client.query(
          `INSERT INTO "RDV_Prestation"
           ("idRDV", "idPrestation", "quantite", "prixUnitaire")
           VALUES ($1, $2, $3, $4)`,
          [idRDV, prestation.idPrestation, prestation.quantite, prestation.prixUnitaire]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Trouver un RDV par ID
   */
  static async findById(id: number): Promise<IRDV | null> {
    const result = await pool.query(
      'SELECT * FROM "RDV" WHERE "idRDV" = $1',
      [id]
    );

    if (!result.rows.length) return null;
    return result.rows[0] as IRDV;
  }

  /**
   * Trouver un RDV avec toutes les informations (jointures)
   */
  static async findByIdComplet(id: number): Promise<IRDVComplet | null> {
    const result = await pool.query(
      `SELECT
        r.*,
        e."nomEmploye",
        e."prenomEmploye",
        e."roleEmploye",
        p."nomPatient",
        p."prenomPatient",
        p."adressePatient",
        p."telephonePatient",
        s."nomStagiaire",
        s."prenomStagiaire"
       FROM "RDV" r
       INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
       INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
       LEFT JOIN "Stagiaire" s ON r."idStagiaire" = s."idStagiaire"
       WHERE r."idRDV" = $1`,
      [id]
    );

    if (!result.rows.length) return null;
    return result.rows[0] as IRDVComplet;
  }

  /**
   * Récupérer les RDV d'un infirmier pour une date donnée
   */
  static async getByEmployeAndDate(idEmploye: number, date: Date): Promise<IRDVComplet[]> {
    const result = await pool.query(
      `SELECT
        r.*,
        p."nomPatient",
        p."prenomPatient",
        p."adressePatient",
        p."telephonePatient",
        s."nomStagiaire",
        s."prenomStagiaire"
       FROM "RDV" r
       INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
       LEFT JOIN "Stagiaire" s ON r."idStagiaire" = s."idStagiaire"
       WHERE r."idEmploye" = $1
         AND DATE(r."dateHeurePrevu") = DATE($2)
         AND r."statutRDV" = 'PREVU'
       ORDER BY r."dateHeurePrevu" ASC`,
      [idEmploye, date]
    );

    return result.rows as IRDVComplet[];
  }

  /**
   * Récupérer les adresses des patients pour un infirmier et une date (pour calcul d'itinéraire)
   */
  static async getAddressesForRoute(idEmploye: number, date: Date): Promise<{ idRDV: number; adressePatient: string; dateHeurePrevu: Date }[]> {
    const result = await pool.query(
      `SELECT
        r."idRDV",
        p."adressePatient",
        r."dateHeurePrevu"
       FROM "RDV" r
       INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
       WHERE r."idEmploye" = $1
         AND DATE(r."dateHeurePrevu") = DATE($2)
         AND r."statutRDV" = 'PREVU'
       ORDER BY r."dateHeurePrevu" ASC`,
      [idEmploye, date]
    );

    return result.rows;
  }

  /**
   * Récupérer les prestations d'un RDV
   */
  static async getPrestations(idRDV: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT
        rp."idPrestation",
        pr."nomPrestation",
        c."nomCategorie",
        rp."quantite",
        rp."prixUnitaire",
        (rp."quantite" * rp."prixUnitaire") AS "montantTotal"
       FROM "RDV_Prestation" rp
       INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
       INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
       WHERE rp."idRDV" = $1`,
      [idRDV]
    );

    return result.rows;
  }

  /**
   * Calculer le montant total d'un RDV
   */
  static async calculateTotal(idRDV: number): Promise<number> {
    const result = await pool.query(
      `SELECT SUM(rp."quantite" * rp."prixUnitaire") AS "montantTotal"
       FROM "RDV_Prestation" rp
       WHERE rp."idRDV" = $1`,
      [idRDV]
    );

    return parseFloat(result.rows[0].montantTotal || 0);
  }

  /**
   * Mettre à jour un RDV
   */
  static async update(id: number, rdv: Partial<IRDV>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (rdv.dateHeurePrevu !== undefined) {
      fields.push(`"dateHeurePrevu" = $${paramIndex++}`);
      values.push(rdv.dateHeurePrevu);
    }

    if (rdv.dateHeureReel !== undefined) {
      fields.push(`"dateHeureReel" = $${paramIndex++}`);
      values.push(rdv.dateHeureReel);
    }

    if (rdv.dureeEstimee !== undefined) {
      fields.push(`"dureeEstimee" = $${paramIndex++}`);
      values.push(rdv.dureeEstimee);
    }

    if (rdv.dureeReelle !== undefined) {
      fields.push(`"dureeReelle" = $${paramIndex++}`);
      values.push(rdv.dureeReelle);
    }

    if (rdv.statutRDV !== undefined) {
      fields.push(`"statutRDV" = $${paramIndex++}`);
      values.push(rdv.statutRDV);
    }

    if (rdv.commentaireRDV !== undefined) {
      fields.push(`"commentaireRDV" = $${paramIndex++}`);
      values.push(rdv.commentaireRDV);
    }

    if (rdv.dateHeureFacture !== undefined) {
      fields.push(`"dateHeureFacture" = $${paramIndex++}`);
      values.push(rdv.dateHeureFacture);
    }

    if (rdv.dateHeureIntegrePGI !== undefined) {
      fields.push(`"dateHeureIntegrePGI" = $${paramIndex++}`);
      values.push(rdv.dateHeureIntegrePGI);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const result = await pool.query(
      `UPDATE "RDV" SET ${fields.join(', ')} WHERE "idRDV" = $${paramIndex}`,
      values
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Marquer un RDV comme réalisé
   */
  static async markAsRealise(id: number, dateHeureReel: Date, dureeReelle: number): Promise<boolean> {
    const result = await pool.query(
      `UPDATE "RDV"
       SET "statutRDV" = 'REALISE',
           "dateHeureReel" = $1,
           "dureeReelle" = $2
       WHERE "idRDV" = $3`,
      [dateHeureReel, dureeReelle, id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Marquer un RDV comme facturé
   */
  static async markAsFacture(id: number): Promise<boolean> {
    const result = await pool.query(
      `UPDATE "RDV"
       SET "dateHeureFacture" = CURRENT_TIMESTAMP
       WHERE "idRDV" = $1`,
      [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Marquer un RDV comme intégré dans le PGI
   */
  static async markAsIntegrePGI(id: number): Promise<boolean> {
    const result = await pool.query(
      `UPDATE "RDV"
       SET "dateHeureIntegrePGI" = CURRENT_TIMESTAMP
       WHERE "idRDV" = $1`,
      [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Annuler un RDV
   */
  static async cancel(id: number, motif: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE "RDV"
       SET "statutRDV" = 'ANNULE',
           "commentaireRDV" = $1
       WHERE "idRDV" = $2`,
      [motif, id]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Récupérer les RDV en attente d'intégration PGI
   */
  static async getPendingPGI(): Promise<IRDVComplet[]> {
    const result = await pool.query(
      `SELECT
        r.*,
        e."nomEmploye",
        e."prenomEmploye",
        p."nomPatient",
        p."prenomPatient"
       FROM "RDV" r
       INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
       INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
       WHERE r."statutRDV" = 'REALISE'
         AND r."dateHeureFacture" IS NOT NULL
         AND r."dateHeureIntegrePGI" IS NULL
       ORDER BY r."dateHeureFacture" ASC`
    );

    return result.rows as IRDVComplet[];
  }

  /**
   * Récupérer les RDV réalisés non facturés
   */
  static async getUnbilled(): Promise<IRDVComplet[]> {
    const result = await pool.query(
      `SELECT
        r.*,
        e."nomEmploye",
        e."prenomEmploye",
        p."nomPatient",
        p."prenomPatient"
       FROM "RDV" r
       INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
       INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
       WHERE r."statutRDV" = 'REALISE'
         AND r."dateHeureFacture" IS NULL
       ORDER BY r."dateHeureReel" DESC`
    );

    return result.rows as IRDVComplet[];
  }

  /**
   * Compter les RDV par statut
   */
  static async countByStatus(): Promise<{ statutRDV: string; count: number }[]> {
    const result = await pool.query(
      `SELECT "statutRDV", COUNT(*) as count
       FROM "RDV"
       GROUP BY "statutRDV"`
    );

    return result.rows;
  }

  /**
   * Récupérer les statistiques d'un infirmier pour une période
   */
  static async getStatsEmploye(idEmploye: number, dateDebut: Date, dateFin: Date): Promise<any> {
    const result = await pool.query(
      `SELECT
        COUNT(DISTINCT r."idRDV") AS "nbInterventions",
        SUM(r."dureeReelle") AS "dureeTotal",
        SUM(rp."quantite" * rp."prixUnitaire") AS "caGenere"
       FROM "RDV" r
       LEFT JOIN "RDV_Prestation" rp ON r."idRDV" = rp."idRDV"
       WHERE r."idEmploye" = $1
         AND r."statutRDV" = 'REALISE'
         AND r."dateHeureReel" BETWEEN $2 AND $3`,
      [idEmploye, dateDebut, dateFin]
    );

    return result.rows[0];
  }
}
