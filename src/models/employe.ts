import pool from "../config/dbconfig";
import bcrypt from "bcrypt";

export enum RoleEmploye {
  INFIRMIER = "INFIRMIER",
  DIRECTEUR = "DIRECTEUR",
  SECRETAIRE = "SECRETAIRE"
}

export interface IEmploye {
  idEmploye?: number;
  nomEmploye: string;
  prenomEmploye: string;
  mailEmploye: string;
  mdpEmploye: string;
  roleEmploye: RoleEmploye; 
}

export class Employe {
  
  /**
   * Vérifie si un mot de passe est déjà haché
   */
  private static isPasswordHashed(mdpEmploye: string): boolean {
    return mdpEmploye.startsWith('$2b$') || mdpEmploye.startsWith('$2a$') || mdpEmploye.startsWith('$2y$');
  }

  /**
   * Hache un mot de passe s'il n'est pas déjà haché
   */
  private static async hashPasswordIfNeeded(mdpEmploye: string): Promise<string> {
    if (this.isPasswordHashed(mdpEmploye)) {
      console.log('🔍 Mot de passe déjà haché, pas de modification nécessaire');
      return mdpEmploye;
    }
    
    console.log('🔑 Hachage du mot de passe en cours...');
    const hashedPassword = await bcrypt.hash(mdpEmploye, 10);
    console.log('✅ Mot de passe haché avec succès');
    return hashedPassword;
  }

  static async create(employe: Omit<IEmploye, 'mdpEmploye'> & { mdpEmploye: string }): Promise<string> {
    // Hasher le mot de passe automatiquement
    const hashedPassword = await bcrypt.hash(employe.mdpEmploye, 10);

    await pool.query(
      'INSERT INTO Employe (mailEmploye, mdpEmploye, prenomEmploye, nomEmploye, roleEmploye) VALUES ($1, $2, $3, $4, $5)',
      [employe.mailEmploye, hashedPassword, employe.prenomEmploye, employe.nomEmploye, employe.roleEmploye]
    );

    return employe.mailEmploye;
  }

  static async findByEmail(email: string): Promise<IEmploye | null> {
  const result = await pool.query(
    'SELECT * FROM Employe WHERE mailEmploye = $1',
    [email]
  );

  if (!result.rows.length) return null;

  const employe = result.rows[0] as IEmploye;
  employe.roleEmploye = employe.roleEmploye as RoleEmploye;
  return employe;
}

  static async update(email: string, employe: Partial<IEmploye>): Promise<boolean> {
    let query = 'UPDATE Employe SET ';
    const params: any[] = [];
    let paramIndex = 1;

    if (employe.prenomEmploye) {
      query += `prenomEmploye = $${paramIndex++}, `;
      params.push(employe.prenomEmploye);
    }

    if (employe.nomEmploye) {
      query += `nomEmploye = $${paramIndex++}, `;
      params.push(employe.nomEmploye);
    }

    if (employe.mdpEmploye) {
      query += `mdpEmploye = $${paramIndex++}, `;
      // Hasher le nouveau mot de passe automatiquement
      const hashedPassword = await this.hashPasswordIfNeeded(employe.mdpEmploye);
      params.push(hashedPassword);
    }

    // Enlever la virgule et l'espace à la fin
    query = query.slice(0, -2);

    query += ` WHERE mailEmploye = $${paramIndex}`;
    params.push(email);

    const result = await pool.query(query, params);

    return result.rowCount !== null && result.rowCount > 0;
  }

  static async getAll(): Promise<IEmploye[]> {
    const result = await pool.query('SELECT * FROM Employe');
    return result.rows;
  }

  static async verifyPassword(email: string, password: string): Promise<boolean> {
    const employe = await this.findByEmail(email);

    if (!employe) {
      console.log(`❌ Utilisateur non trouvé: ${email}`);
      return false;
    }

    // Si le mot de passe en base n'est pas haché, le hasher maintenant
    if (!this.isPasswordHashed(employe.mdpEmploye)) {
      console.log(`🔄 Migration du mot de passe pour: ${email}`);

      // Vérifier d'abord si le mot de passe en clair correspond
      if (employe.mdpEmploye === password) {
        // Hasher et mettre à jour
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          'UPDATE Employe SET mdpEmploye = $1 WHERE mailEmploye = $2',
          [hashedPassword, email]
        );
        console.log(`✅ Mot de passe migré pour: ${email}`);
        return true;
      } else {
        console.log(`❌ Mot de passe incorrect pour: ${email}`);
        return false;
      }
    }

    // Vérification normale avec bcrypt
    const isValid = await bcrypt.compare(password, employe.mdpEmploye);
    console.log(`🔐 Vérification pour ${email}: ${isValid ? '✅ OK' : '❌ KO'}`);
    return isValid;
  }

}