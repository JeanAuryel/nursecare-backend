import pool from "../config/dbconfig";

export enum StatutFacture {
  BROUILLON = "BROUILLON",
  ENVOYEE = "ENVOYEE",
  PAYEE = "PAYEE",
  PARTIELLE = "PARTIELLE",
  IMPAYEE = "IMPAYEE",
  ANNULEE = "ANNULEE"
}

export enum ModePaiement {
  ESPECES = "ESPECES",
  CARTE = "CARTE",
  CHEQUE = "CHEQUE",
  VIREMENT = "VIREMENT",
  MUTUELLE = "MUTUELLE"
}

export interface IFacture {
  idFacture?: number;
  numeroFacture: string;
  idPatient: number;
  dateFacture: Date;
  dateEcheance: Date;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  montantPaye?: number;
  statutFacture: StatutFacture;
  modePaiement?: ModePaiement;
  datePaiement?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILigneFacture {
  idLigne?: number;
  idFacture: number;
  idPrestation: number;
  idRdv?: number;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  prestation?: {
    nomPrestation: string;
  };
}

export interface IFactureDetailed extends IFacture {
  patient?: {
    idPatient: number;
    nomPatient: string;
    prenomPatient: string;
    adressePatient: string;
    numPatient: string;
    mailPatient?: string;
  };
  lignes?: ILigneFacture[];
}

export class Facture {
  /**
   * Générer un numéro de facture unique
   */
  static async genererNumeroFacture(): Promise<string> {
    const annee = new Date().getFullYear();
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM Facture WHERE YEAR(dateFacture) = ?",
      [annee]
    );
    const count = rows[0].count + 1;
    return `FAC-${annee}-${String(count).padStart(5, '0')}`;
  }

  /**
   * Créer une nouvelle facture
   */
  static async create(facture: Omit<IFacture, 'idFacture' | 'numeroFacture'>): Promise<number> {
    const numeroFacture = await this.genererNumeroFacture();

    const [result]: any = await pool.execute(
      `INSERT INTO Facture (
        numeroFacture, idPatient, dateFacture, dateEcheance,
        montantHT, montantTVA, montantTTC, montantPaye,
        statutFacture, modePaiement, datePaiement, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numeroFacture,
        facture.idPatient,
        facture.dateFacture,
        facture.dateEcheance,
        facture.montantHT,
        facture.montantTVA,
        facture.montantTTC,
        facture.montantPaye || 0,
        facture.statutFacture,
        facture.modePaiement || null,
        facture.datePaiement || null,
        facture.notes || null
      ]
    );

    return result.insertId;
  }

  /**
   * Ajouter une ligne de facture
   */
  static async ajouterLigne(ligne: Omit<ILigneFacture, 'idLigne'>): Promise<number> {
    const [result]: any = await pool.execute(
      `INSERT INTO LigneFacture (
        idFacture, idPrestation, idRdv, description,
        quantite, prixUnitaire, montantHT,
        tauxTVA, montantTVA, montantTTC
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ligne.idFacture,
        ligne.idPrestation,
        ligne.idRdv || null,
        ligne.description,
        ligne.quantite,
        ligne.prixUnitaire,
        ligne.montantHT,
        ligne.tauxTVA,
        ligne.montantTVA,
        ligne.montantTTC
      ]
    );

    return result.insertId;
  }

  /**
   * Récupérer toutes les factures
   */
  static async getAll(): Promise<IFactureDetailed[]> {
    const [rows]: any = await pool.execute(`
      SELECT
        f.*,
        JSON_OBJECT(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      ORDER BY f.dateFacture DESC
    `);

    // Parse patient JSON and convert numeric fields
    return rows.map((row: any) => ({
      ...row,
      patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
      montantHT: parseFloat(row.montantHT) || 0,
      montantTVA: parseFloat(row.montantTVA) || 0,
      montantTTC: parseFloat(row.montantTTC) || 0,
      montantPaye: parseFloat(row.montantPaye) || 0
    }));
  }

  /**
   * Récupérer une facture par ID avec ses lignes
   */
  static async getById(idFacture: number): Promise<IFactureDetailed | null> {
    const [rows]: any = await pool.execute(`
      SELECT
        f.*,
        JSON_OBJECT(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.idFacture = ?
    `, [idFacture]);

    if (rows.length === 0) return null;

    const facture = rows[0];

    // Parse patient JSON
    facture.patient = typeof facture.patient === 'string' ? JSON.parse(facture.patient) : facture.patient;

    // Récupérer les lignes
    const [lignes]: any = await pool.execute(`
      SELECT
        lf.*,
        pr.nomPrestation,
        pr.codePrestation
      FROM LigneFacture lf
      LEFT JOIN Prestation pr ON lf.idPrestation = pr.idPrestation
      WHERE lf.idFacture = ?
    `, [idFacture]);

    facture.lignes = lignes;

    return facture;
  }

  /**
   * Mettre à jour le statut d'une facture
   */
  static async updateStatut(
    idFacture: number,
    statutFacture: StatutFacture,
    montantPaye?: number,
    modePaiement?: ModePaiement,
    datePaiement?: Date
  ): Promise<boolean> {
    const [result]: any = await pool.execute(
      `UPDATE Facture
       SET statutFacture = ?,
           montantPaye = COALESCE(?, montantPaye),
           modePaiement = COALESCE(?, modePaiement),
           datePaiement = COALESCE(?, datePaiement),
           updatedAt = NOW()
       WHERE idFacture = ?`,
      [statutFacture, montantPaye, modePaiement, datePaiement, idFacture]
    );

    return result.affectedRows > 0;
  }

  /**
   * Récupérer les factures par statut
   */
  static async getByStatut(statutFacture: StatutFacture): Promise<IFactureDetailed[]> {
    const [rows]: any = await pool.execute(`
      SELECT
        f.*,
        JSON_OBJECT(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.statutFacture = ?
      ORDER BY f.dateFacture DESC
    `, [statutFacture]);

    // Parse patient JSON and convert numeric fields
    return rows.map((row: any) => ({
      ...row,
      patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
      montantHT: parseFloat(row.montantHT) || 0,
      montantTVA: parseFloat(row.montantTVA) || 0,
      montantTTC: parseFloat(row.montantTTC) || 0,
      montantPaye: parseFloat(row.montantPaye) || 0
    }));
  }

  /**
   * Récupérer les factures d'un patient
   */
  static async getByPatient(idPatient: number): Promise<IFactureDetailed[]> {
    const [rows]: any = await pool.execute(`
      SELECT
        f.*,
        JSON_OBJECT(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.idPatient = ?
      ORDER BY f.dateFacture DESC
    `, [idPatient]);

    // Parse patient JSON and convert numeric fields
    return rows.map((row: any) => ({
      ...row,
      patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
      montantHT: parseFloat(row.montantHT) || 0,
      montantTVA: parseFloat(row.montantTVA) || 0,
      montantTTC: parseFloat(row.montantTTC) || 0,
      montantPaye: parseFloat(row.montantPaye) || 0
    }));
  }

  /**
   * Supprimer une facture
   */
  static async delete(idFacture: number): Promise<boolean> {
    // Supprimer d'abord les lignes
    await pool.execute("DELETE FROM LigneFacture WHERE idFacture = ?", [idFacture]);

    // Puis la facture
    const [result]: any = await pool.execute(
      "DELETE FROM Facture WHERE idFacture = ?",
      [idFacture]
    );

    return result.affectedRows > 0;
  }
}
