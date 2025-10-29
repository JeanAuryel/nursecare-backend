// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../config/dbconfig";
import { IEmploye, Employe } from "../models/employe";

export async function login(req: Request, res: Response) {
  try {
    const { mailEmploye, mdpEmploye } = req.body;

    if (!mailEmploye || !mdpEmploye) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const result = await pool.query(
      'SELECT * FROM "Employe" WHERE "mailEmploye" = $1',
      [mailEmploye]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const employe = result.rows[0] as IEmploye;

    // Utiliser la méthode verifyPassword qui gère les mots de passe en clair et les hache automatiquement
    const passwordMatch = await Employe.verifyPassword(mailEmploye, mdpEmploye);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    // Création des tokens directement ici
    const accessToken = jwt.sign(
      {
        idEmploye: employe.idEmploye,
        mailEmploye: employe.mailEmploye,
        roleEmploye: employe.roleEmploye
      },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' } as SignOptions
    );

    const refreshToken = jwt.sign(
      {
        idEmploye: employe.idEmploye,
        mailEmploye: employe.mailEmploye,
        roleEmploye: employe.roleEmploye
      },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' } as SignOptions
    );

    res.status(200).json({
      message: "Connexion réussie",
      accessToken,
      refreshToken,
      employe: {
        id: employe.idEmploye,
        nom: employe.nomEmploye,
        prenom: employe.prenomEmploye,
        role: employe.roleEmploye
      }
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
