-- PostgreSQL dump converted from MySQL
-- Database: nursecare_db
-- Conversion: 2025-10-21T08:57:57.502Z

BEGIN;



CREATE TABLE "Categorie" (
  "idCategorie" INTEGER NOT NULL,
  "nomCategorie" varchar(100) NOT NULL,
  "descriptionCategorie" text DEFAULT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "Categorie" ("idCategorie", "nomCategorie", "descriptionCategorie", "actif", "dateCreation") VALUES
(1, 'Actes de soins', NULL, 1, '2025-10-18 23:39:22'),
(2, 'Actes d''analyse', NULL, 1, '2025-10-18 23:39:22'),
(3, 'Actes préventifs', NULL, 1, '2025-10-18 23:39:22');

CREATE TABLE "Ecole" (
  "idEcole" INTEGER NOT NULL,
  "nomEcole" varchar(100) NOT NULL,
  "adresseEcole" varchar(255) DEFAULT NULL,
  "villeEcole" varchar(100) DEFAULT NULL,
  "codePostalEcole" varchar(10) DEFAULT NULL,
  "telephoneEcole" varchar(20) DEFAULT NULL,
  "mailEcole" varchar(100) DEFAULT NULL,
  "contactReferent" varchar(100) DEFAULT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "Ecole" ("idEcole", "nomEcole", "adresseEcole", "villeEcole", "codePostalEcole", "telephoneEcole", "mailEcole", "contactReferent", "actif", "dateCreation") VALUES
(1, 'ESICAD', '56 chemin de la Roseraie', 'Toulouse', '31500', '05 61 23 45 78', 'contact@esicad-toulouse.fr', 'julie.martin@esicad-toulouse.fr', 1, '2025-10-18 23:04:17'),
(2, 'Mirail-Université', '9 place du Capitole', 'Toulouse', '31000', '05 62 98 11 34', 'info@mirail-universite.fr', 'thomas.lefevre@mirail-universite.fr', 1, '2025-10-18 23:04:17'),
(3, 'ESMT Sup', '28 rue du Faubourg-Bonnefoy', 'Toulouse', '31500', '05 61 47 82 19', 'accueil@esmt-tlse.fr', 'sarah.benali@esmt-tlse.fr', 1, '2025-10-18 23:04:17');

CREATE TABLE "Employe" (
  "idEmploye" INTEGER NOT NULL,
  "nomEmploye" varchar(50) NOT NULL,
  "prenomEmploye" varchar(50) NOT NULL,
  "mailEmploye" varchar(100) NOT NULL,
  "mdpEmploye" varchar(255) NOT NULL,
  "roleEmploye" VARCHAR(50) NOT NULL,
  "telephoneEmploye" varchar(20) DEFAULT NULL,
  "adresseEmploye" varchar(255) DEFAULT NULL,
  "villeEmploye" varchar(100) DEFAULT NULL,
  "codePostalEmploye" varchar(10) DEFAULT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "dateModification" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "Employe" ("idEmploye", "nomEmploye", "prenomEmploye", "mailEmploye", "mdpEmploye", "roleEmploye", "telephoneEmploye", "adresseEmploye", "villeEmploye", "codePostalEmploye", "actif", "dateCreation", "dateModification") VALUES
(1, 'Akinotcho', 'Jean-Auryel', 'jeanauryel.akinotcho@nursecare.fr', '$2b$10$ZU3djEQdGDDouYbrjSRcO.xzZ14XCjFP9fAIrYQNtEKQnginP5eHO', 'DIRECTEUR', '06 12 34 56 78', '12 rue du Languedoc', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 15:10:45'),
(2, 'Joachim', 'Elodie', 'elodie.joachim@nursecare.fr', '$2b$10$DbnZctV1fBU3dcqyUKIxLe.jddYaIBOKUXhPbM1KH4eKG2boiOuQ2', 'INFIRMIER', '06 98 87 76 65', '48 avenue des Minimes', 'TOULOUSE', '31200', 1, '2025-10-14 16:03:08', '2025-10-19 17:54:14'),
(3, 'Kibangou', 'Ruth', 'ruth.kibangou@nursecare.fr', '$2b$10$qsDypq8QqOAHdhMxqw1q0uNfBiM1tUO5uh1hCe4JLGj.j82DHg3Si', 'SECRETAIRE', '06 98 76 54 32', '7 impasse Saint-Aubin', 'TOULOUSE', '31500', 1, '2025-10-14 16:03:08', '2025-10-19 16:40:59'),
(4, 'nursecare', 'test_1', 'test_1.nursecare@nursecare.fr', '$2b$10$J92iwNVgMMf9N3SdwBNZuOu.1sln2JXeLKkf5vDOySdfAhVlBHc12', 'DIRECTEUR', '07 12 23 34 45', '7 impasse Saint-Aubin', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 15:42:04'),
(5, 'nursecare', 'test_2', 'test_2.nursecare@nursecare.fr', '$2b$10$lzsCIY4RWHHqNKiaUzGJ8eW5QHAprnTRCUkFWi5Vn4ljHeuk3Yzp2', 'SECRETAIRE', '07 12 34 56 78', '25 boulevard de Strasbourg', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 16:55:43'),
(6, 'nursecare', 'test_3', 'test_3.nursecare@nursecare.fr', '$2b$10$UTdRqNxMm36MFgAlCxFt4e6Cd9sCePxGC.mPQ65oLwSickcvYUdeu', 'INFIRMIER', '06 12 34 56 78', '3 allée des Chalets', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 17:00:49');

CREATE TABLE "Facture" (
  "idFacture" INTEGER NOT NULL,
  "numeroFacture" varchar(50) NOT NULL,
  "idPatient" INTEGER NOT NULL,
  "dateFacture" date NOT NULL,
  "dateEcheance" date NOT NULL,
  "montantHT" decimal(10,2) NOT NULL DEFAULT 0.00,
  "montantTVA" decimal(10,2) NOT NULL DEFAULT 0.00,
  "montantTTC" decimal(10,2) NOT NULL DEFAULT 0.00,
  "montantPaye" decimal(10,2) DEFAULT 0.00,
  "statutFacture" VARCHAR(50) NOT NULL DEFAULT 'BROUILLON',
  "modePaiement" VARCHAR(50) DEFAULT NULL,
  "datePaiement" date DEFAULT NULL,
  "notes" text DEFAULT NULL,
  "createdAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "Facture" ("idFacture", "numeroFacture", "idPatient", "dateFacture", "dateEcheance", "montantHT", "montantTVA", "montantTTC", "montantPaye", "statutFacture", "modePaiement", "datePaiement", "notes", "createdAt", "updatedAt") VALUES
(1, 'F2025-001', 1, '2025-01-02', '2025-02-01', 20.00, 1.10, 21.10, 21.10, 'PAYEE', '', '2025-01-02', 'Paiement immédiat', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(2, 'F2025-002', 2, '2025-01-03', '2025-02-02', 15.00, 0.83, 15.83, 15.83, 'PAYEE', 'ESPECES', '2025-01-03', 'Paiement comptant', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(3, 'F2025-003', 3, '2025-02-05', '2025-03-07', 25.00, 1.38, 26.38, 26.38, 'PAYEE', 'VIREMENT', '2025-02-05', NULL, '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(4, 'F2025-004', 4, '2025-02-15', '2025-03-17', 20.00, 1.10, 21.10, 21.10, 'PAYEE', '', '2025-02-15', 'Stagiaire 9 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(5, 'F2025-005', 5, '2025-02-25', '2025-03-27', 35.00, 1.93, 36.93, 36.93, 'PAYEE', 'CHEQUE', '2025-02-25', 'Stagiaire 9 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(6, 'F2025-006', 6, '2025-03-05', '2025-04-04', 15.00, 0.83, 15.83, 15.83, 'PAYEE', '', '2025-03-05', NULL, '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(7, 'F2025-007', 7, '2025-03-15', '2025-04-14', 20.00, 1.10, 21.10, 10.00, 'PARTIELLE', 'ESPECES', '2025-03-15', 'Paiement partiel - Reste dû: 11.10€ - Stagiaire 9', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(8, 'F2025-008', 8, '2025-03-25', '2025-04-24', 25.00, 1.38, 26.38, 0.00, 'IMPAYEE', NULL, NULL, 'Relance nécessaire - Stagiaire 10 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(9, 'F2025-009', 1, '2025-04-10', '2025-05-10', 15.00, 0.83, 15.83, 15.83, 'PAYEE', 'VIREMENT', '2025-04-12', 'Stagiaire 11 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(10, 'F2025-010', 2, '2025-04-20', '2025-05-20', 20.00, 1.10, 21.10, 21.10, 'PAYEE', '', '2025-04-20', 'Stagiaire 12 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(11, 'F2025-011', 3, '2025-05-10', '2025-06-09', 35.00, 1.93, 36.93, 36.93, 'PAYEE', 'ESPECES', '2025-05-10', 'Stagiaire 10 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(12, 'F2025-012', 4, '2025-05-25', '2025-06-24', 15.00, 0.83, 15.83, 0.00, 'ENVOYEE', NULL, NULL, 'Facture envoyée - En attente de paiement - Stagiaire 11', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(13, 'F2025-013', 5, '2025-06-05', '2025-07-05', 25.00, 1.38, 26.38, 26.38, 'PAYEE', 'CHEQUE', '2025-06-06', 'Stagiaire 12 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27'),
(14, 'F2025-014', 6, '2025-06-15', '2025-07-15', 20.00, 1.10, 21.10, 21.10, 'PAYEE', '', '2025-06-15', 'Stagiaire 10 présent', '2025-10-19 17:25:27', '2025-10-19 17:25:27');

CREATE TABLE "LigneFacture" (
  "idLigne" INTEGER NOT NULL,
  "idFacture" INTEGER NOT NULL,
  "idPrestation" INTEGER NOT NULL,
  "idRdv" INTEGER DEFAULT NULL,
  "description" text NOT NULL,
  "quantite" INTEGER NOT NULL DEFAULT 1,
  "prixUnitaire" decimal(10,2) NOT NULL,
  "montantHT" decimal(10,2) NOT NULL,
  "tauxTVA" decimal(5,2) NOT NULL DEFAULT 0.00,
  "montantTVA" decimal(10,2) NOT NULL DEFAULT 0.00,
  "montantTTC" decimal(10,2) NOT NULL
);

INSERT INTO "LigneFacture" ("idLigne", "idFacture", "idPrestation", "idRdv", "description", "quantite", "prixUnitaire", "montantHT", "tauxTVA", "montantTVA", "montantTTC") VALUES
(1, 1, 1, NULL, '', 1, 20.00, 20.00, 5.50, 1.10, 21.10),
(2, 2, 2, NULL, '', 1, 15.00, 15.00, 5.50, 0.83, 15.83),
(3, 3, 3, NULL, '', 1, 25.00, 25.00, 5.50, 1.38, 26.38),
(4, 4, 1, NULL, '', 1, 20.00, 20.00, 5.50, 1.10, 21.10),
(5, 5, 4, NULL, '', 1, 35.00, 35.00, 5.50, 1.93, 36.93),
(6, 6, 2, NULL, '', 1, 15.00, 15.00, 5.50, 0.83, 15.83),
(7, 7, 1, NULL, '', 1, 20.00, 20.00, 5.50, 1.10, 21.10),
(8, 8, 3, NULL, '', 1, 25.00, 25.00, 5.50, 1.38, 26.38),
(9, 9, 2, NULL, '', 1, 15.00, 15.00, 5.50, 0.83, 15.83),
(10, 10, 1, NULL, '', 1, 20.00, 20.00, 5.50, 1.10, 21.10),
(11, 11, 4, NULL, '', 1, 35.00, 35.00, 5.50, 1.93, 36.93),
(12, 12, 2, NULL, '', 1, 15.00, 15.00, 5.50, 0.83, 15.83),
(13, 13, 3, NULL, '', 1, 25.00, 25.00, 5.50, 1.38, 26.38),
(14, 14, 1, NULL, '', 1, 20.00, 20.00, 5.50, 1.10, 21.10);

CREATE TABLE "Patient" (
  "idPatient" INTEGER NOT NULL,
  "nomPatient" varchar(50) NOT NULL,
  "prenomPatient" varchar(50) NOT NULL,
  "adressePatient" varchar(255) NOT NULL,
  "villePatient" varchar(100) NOT NULL,
  "codePostalPatient" varchar(10) NOT NULL,
  "numPatient" varchar(20) NOT NULL,
  "mailPatient" varchar(100) DEFAULT NULL,
  "numeroSecuSociale" varchar(15) DEFAULT NULL,
  "dateNaissance" date DEFAULT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "dateModification" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "Patient" ("idPatient", "nomPatient", "prenomPatient", "adressePatient", "villePatient", "codePostalPatient", "numPatient", "mailPatient", "numeroSecuSociale", "dateNaissance", "actif", "dateCreation", "dateModification") VALUES
(1, 'Lambert', 'Élodie', '14 rue Raymond IV', 'Toulouse', '31000', '06 71 45 28 90', 'elodie.lambert@example.com', '297041523456789', '1997-04-15', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(2, 'Marchand', 'Paul', '22 avenue de Castres', 'Toulouse', '31500', '06 58 93 47 62', 'paul.marchand@example.com', '298112045678912', '1998-11-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(3, 'Benoit', 'Amandine', '8 rue Saint-Roch', 'Toulouse', '31400', '06 33 47 81 09', 'amandine.benoit@example.com', '300052078901234', '2000-05-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(4, 'Fontaine', 'Matthieu', '19 allée Jules Guesde', 'Toulouse', '31400', '06 74 62 15 33', 'matthieu.fontaine@example.com', '296072145678912', '1996-07-21', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(5, 'Renaud', 'Camille', '5 impasse du Général Compans', 'Toulouse', '31000', '06 28 55 44 12', 'camille.renaud@example.com', '301011245678934', '2001-01-12', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(6, 'Charpentier', 'Noah', '33 boulevard de la Marquette', 'Toulouse', '31000', '06 52 34 18 77', 'noah.charpentier@example.com', '299102345678901', '1999-10-23', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(7, 'Collet', 'Mélissa', '41 chemin du Prat-Long', 'Toulouse', '31500', '06 84 79 62 05', 'melissa.collet@example.com', '303062078912345', '2003-06-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(8, 'Deschamps', 'Romain', '2 place Wilson', 'Toulouse', '31000', '06 95 28 43 10', 'romain.deschamps@example.com', '295092012345678', '1995-09-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00');

CREATE TABLE "Prestation" (
  "IdPrestation" INTEGER NOT NULL,
  "nomPrestation" varchar(150) NOT NULL,
  "descriptionPrestation" text DEFAULT NULL,
  "prix_TTC" decimal(10,2) NOT NULL,
  "dureeMoyenneMinutes" INTEGER DEFAULT 30,
  "idCategorie" INTEGER NOT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "dateModification" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "Prestation" ("IdPrestation", "nomPrestation", "descriptionPrestation", "prix_TTC", "dureeMoyenneMinutes", "idCategorie", "actif", "dateCreation", "dateModification") VALUES
(1, 'Pose / retrait d’une attelle', 'Application ou retrait d’une attelle pour immobilisation temporaire d’un membre.', 15.00, 20, 1, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(2, 'Nettoyage d’une plaie', 'Désinfection et nettoyage d’une plaie superficielle ou profonde.', 12.00, 15, 1, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(3, 'Changement d’un pansement', 'Retrait et remplacement d’un pansement avec vérification de la cicatrisation.', 17.00, 25, 1, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(4, 'Remise en place d’une articulation', 'Manipulation douce pour réaligner une articulation déplacée.', 13.00, 20, 1, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(5, 'Toilette du patient', 'Assistance à la toilette complète ou partielle d’un patient dépendant.', 22.00, 30, 1, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(6, 'Prise de sang', 'Prélèvement sanguin à des fins d’analyse médicale.', 19.00, 15, 2, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(7, 'Prise d’échantillon buccal', 'Collecte d’un échantillon de salive ou muqueuse buccale pour analyse.', 24.00, 10, 2, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(8, 'Prise d’autres échantillons', 'Collecte d’échantillons biologiques (urine, selles, etc.) pour analyses.', 27.00, 15, 2, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(9, 'Évaluation Sevrage Alcoolisme', 'Entretien et test d’évaluation pour un suivi de sevrage alcoolique.', 19.00, 30, 3, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(10, 'Évaluation Sevrage Tabagisme', 'Évaluation initiale pour un programme d’arrêt du tabac.', 19.00, 25, 3, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(11, 'Évaluation Psychologique Dépression', 'Bilan psychologique visant à évaluer la sévérité d’une dépression.', 19.00, 40, 3, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(12, 'Évaluation Psychologique Troubles de l’alimentation', 'Évaluation psychologique pour troubles alimentaires (anorexie, boulimie, etc.).', 19.00, 40, 3, 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(13, 'Changement d’un pansement', NULL, 17.00, 30, 1, 1, '2025-10-19 14:00:26', '2025-10-19 14:00:26');

CREATE TABLE "RDV" (
  "idRDV" INTEGER NOT NULL,
  "idEmploye" INTEGER NOT NULL,
  "idPatient" INTEGER NOT NULL,
  "IdPrestation" INTEGER NOT NULL,
  "idStagiaire" INTEGER DEFAULT NULL,
  "timestamp_RDV_prevu" TIMESTAMP NOT NULL,
  "timestamp_RDV_reel" TIMESTAMP DEFAULT NULL,
  "timestamp_RDV_facture" TIMESTAMP DEFAULT NULL,
  "timestamp_RDV_integrePGI" TIMESTAMP DEFAULT NULL,
  "statut" VARCHAR(50) DEFAULT 'Planifie',
  "noteStagiaire" INTEGER DEFAULT NULL,
  "commentaireStagiaire" text DEFAULT NULL,
  "commentaireGeneral" text DEFAULT NULL,
  "montantFacture" decimal(10,2) DEFAULT NULL,
  "numeroFacture" varchar(50) DEFAULT NULL,
  "idEmployePlanificateur" INTEGER DEFAULT NULL,
  "idEmployeTraiteurPGI" INTEGER DEFAULT NULL,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "dateModification" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "RDV" ("idRDV", "idEmploye", "idPatient", "IdPrestation", "idStagiaire", "timestamp_RDV_prevu", "timestamp_RDV_reel", "timestamp_RDV_facture", "timestamp_RDV_integrePGI", "statut", "noteStagiaire", "commentaireStagiaire", "commentaireGeneral", "montantFacture", "numeroFacture", "idEmployePlanificateur", "idEmployeTraiteurPGI", "dateCreation", "dateModification") VALUES
(1, 2, 1, 1, NULL, '2025-01-02 09:00:00', '2025-01-02 09:05:00', '2025-01-02 09:30:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, 5, 5, '2025-10-19 07:20:52', '2025-10-19 16:50:33'),
(2, 2, 2, 2, NULL, '2025-01-03 10:30:00', '2025-01-03 10:35:00', '2025-01-03 11:00:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, 3, 3, '2025-10-19 07:20:52', '2025-10-19 16:50:33'),
(3, 6, 3, 3, NULL, '2025-02-05 14:00:00', '2025-02-05 14:10:00', '2025-02-05 14:45:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(4, 2, 4, 1, 9, '2025-02-15 08:30:00', '2025-02-15 08:40:00', '2025-02-15 09:15:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(5, 6, 5, 4, 9, '2025-02-25 11:00:00', '2025-02-25 11:05:00', '2025-02-25 11:30:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(6, 2, 6, 2, NULL, '2025-03-05 15:30:00', '2025-03-05 15:35:00', '2025-03-05 16:00:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(7, 6, 7, 1, 9, '2025-03-15 09:30:00', '2025-03-15 09:40:00', '2025-03-15 10:15:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(8, 2, 8, 3, 10, '2025-03-25 13:00:00', '2025-03-25 13:10:00', '2025-03-25 13:45:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(9, 6, 1, 2, 11, '2025-04-10 10:00:00', '2025-04-10 10:10:00', '2025-04-10 10:45:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(10, 2, 2, 1, 12, '2025-04-20 16:00:00', '2025-04-20 16:05:00', '2025-04-20 16:30:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(11, 2, 3, 4, 10, '2025-05-10 08:30:00', '2025-05-10 08:35:00', '2025-05-10 09:00:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(12, 6, 4, 2, 11, '2025-05-25 09:30:00', '2025-05-25 09:40:00', '2025-05-25 10:15:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(13, 2, 5, 3, 12, '2025-06-05 11:00:00', '2025-06-05 11:10:00', '2025-06-05 11:45:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(14, 6, 6, 1, 10, '2025-06-15 14:00:00', '2025-06-15 14:10:00', '2025-06-15 14:45:00', NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(15, 2, 1, 2, NULL, '2025-10-19 08:30:00', '2025-10-19 08:35:00', NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(16, 6, 2, 1, NULL, '2025-10-19 09:30:00', '2025-10-19 09:40:00', NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(17, 2, 3, 3, NULL, '2025-10-19 11:00:00', '2025-10-19 11:10:00', NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(18, 6, 4, 2, NULL, '2025-10-19 14:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(19, 2, 5, 4, NULL, '2025-10-19 16:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(20, 2, 6, 1, NULL, '2025-10-20 09:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(21, 6, 7, 3, NULL, '2025-10-20 10:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(22, 2, 8, 2, NULL, '2025-10-20 13:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(23, 6, 1, 1, NULL, '2025-10-20 15:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(24, 2, 2, 4, NULL, '2025-10-20 16:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(25, 2, 3, 1, NULL, '2025-11-03 09:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(26, 6, 4, 2, NULL, '2025-11-05 10:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(27, 2, 5, 3, 7, '2026-03-15 11:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(28, 6, 6, 4, 7, '2026-04-20 14:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(29, 2, 7, 1, 8, '2026-05-15 10:00:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55'),
(30, 6, 8, 2, 8, '2026-06-20 13:30:00', NULL, NULL, NULL, 'Planifie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19 07:20:52', '2025-10-19 07:23:55');

CREATE TABLE "Stagiaire" (
  "idStagiaire" INTEGER NOT NULL,
  "nomStagiaire" varchar(50) NOT NULL,
  "prenomStagiaire" varchar(50) NOT NULL,
  "telephoneStagiaire" varchar(20) DEFAULT NULL,
  "mailStagiaire" varchar(100) DEFAULT NULL,
  "dateDebutStage" date NOT NULL,
  "dateFinStage" date NOT NULL,
  "idEcole" INTEGER NOT NULL,
  "idEmployeTuteur" INTEGER DEFAULT NULL,
  "actif" SMALLINT DEFAULT 1,
  "dateCreation" timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

INSERT INTO "Stagiaire" ("idStagiaire", "nomStagiaire", "prenomStagiaire", "telephoneStagiaire", "mailStagiaire", "dateDebutStage", "dateFinStage", "idEcole", "idEmployeTuteur", "actif", "dateCreation") VALUES
(7, 'Dupont', 'Clara', '06 42 15 89 33', 'clara.dupont@esicad-toulouse.fr', '2026-03-03', '2026-06-27', 1, 6, 1, '2025-10-18 23:19:44'),
(8, 'Bernard', 'Lucas', '06 57 21 73 45', 'lucas.bernard@esicad-toulouse.fr', '2026-04-07', '2026-07-25', 1, 2, 1, '2025-10-18 23:19:44'),
(9, 'Leroy', 'Emma', '06 21 34 67 88', 'emma.leroy@mirail-universite.fr', '2025-02-10', '2025-05-30', 2, 2, 1, '2025-10-18 23:19:44'),
(10, 'Girard', 'Hugo', '06 78 22 91 04', 'hugo.girard@mirail-universite.fr', '2025-03-17', '2025-06-20', 2, 6, 1, '2025-10-18 23:19:44'),
(11, 'Morel', 'Sofia', '06 39 84 12 57', 'sofia.morel@esmt-tlse.fr', '2025-04-01', '2025-07-18', 3, 6, 1, '2025-10-18 23:19:44'),
(12, 'Roux', 'Nathan', '06 90 23 45 81', 'nathan.roux@esmt-tlse.fr', '2025-03-24', '2025-07-11', 3, 2, 1, '2025-10-18 23:19:44');

CREATE TABLE "VueFacturesCompletes" (
"idFacture" INTEGER
,"numeroFacture" varchar(50)
,"idPatient" INTEGER
,"dateFacture" date
,"dateEcheance" date
,"montantHT" decimal(10,2)
,"montantTVA" decimal(10,2)
,"montantTTC" decimal(10,2)
,"montantPaye" decimal(10,2)
,"statutFacture" VARCHAR(50)
,"modePaiement" VARCHAR(50)
,"datePaiement" date
,"notes" text
,"createdAt" timestamp
,"updatedAt" timestamp
,"nomPatient" varchar(50)
,"prenomPatient" varchar(50)
,"adressePatient" varchar(255)
,"numPatient" varchar(20)
,"mailPatient" varchar(100)
,"nombreLignes" BIGINT
,"statutLibelle" varchar(16)
,"joursRetard" INTEGER
);

CREATE TABLE "VueLignesFacturesCompletes" (
"idLigne" INTEGER
,"idFacture" INTEGER
,"idPrestation" INTEGER
,"idRdv" INTEGER
,"description" text
,"quantite" INTEGER
,"prixUnitaire" decimal(10,2)
,"montantHT" decimal(10,2)
,"tauxTVA" decimal(5,2)
,"montantTVA" decimal(10,2)
,"montantTTC" decimal(10,2)
,"numeroFacture" varchar(50)
,"dateFacture" date
,"statutFacture" VARCHAR(50)
,"nomPrestation" varchar(150)
,"prixPrestation" decimal(10,2)
);

CREATE TABLE "v_activite_par_categorie" (
"nomCategorie" varchar(100)
,"nombre_prestations" BIGINT
,"montant_total" decimal(32,2)
,"montant_moyen" decimal(14,6)
,"annee" INTEGER
,"mois" INTEGER
);

CREATE TABLE "v_charge_travail_infirmiers" (
"idEmploye" INTEGER
,"infirmier" varchar(101)
,"nombre_rdv_total" BIGINT
,"nombre_rdv_planifies" decimal(22,0)
,"nombre_rdv_termines" decimal(22,0)
,"chiffre_affaire_genere" decimal(32,2)
,"nombre_patients_differents" BIGINT
);

CREATE TABLE "v_factures_en_attente" (
"idRDV" INTEGER
,"numeroFacture" varchar(50)
,"date_facture" TIMESTAMP
,"jours_attente" INTEGER
,"montantFacture" decimal(10,2)
,"infirmier" varchar(101)
,"patient" varchar(101)
,"statut" VARCHAR(50)
);

CREATE TABLE "v_notes_par_ecole" (
"idEcole" INTEGER
,"nomEcole" varchar(100)
,"nombre_stagiaires" BIGINT
,"nombre_observations_total" BIGINT
,"note_moyenne_ecole" decimal(14,4)
,"note_min" INTEGER
,"note_max" INTEGER
);

CREATE TABLE "v_notes_stagiaires" (
"idStagiaire" INTEGER
,"stagiaire" varchar(101)
,"nomEcole" varchar(100)
,"nombre_observations" BIGINT
,"note_moyenne" decimal(14,4)
,"note_min" INTEGER
,"note_max" INTEGER
);

CREATE TABLE "v_planning_infirmiers" (
"idRDV" INTEGER
,"timestamp_RDV_prevu" TIMESTAMP
,"timestamp_RDV_reel" TIMESTAMP
,"statut" VARCHAR(50)
,"infirmier" varchar(101)
,"idEmploye" INTEGER
,"patient" varchar(101)
,"adresse_complete" varchar(368)
,"nomPrestation" varchar(150)
,"nomCategorie" varchar(100)
,"montantFacture" decimal(10,2)
,"stagiaire" varchar(101)
);



COMMIT;
