-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-demo-mysql.alwaysdata.net
-- Generation Time: Oct 21, 2025 at 10:24 AM
-- Server version: 10.11.14-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo-mysql_nursecare`
--

-- --------------------------------------------------------

--
-- Table structure for table `Categorie`
--

CREATE TABLE `Categorie` (
  `idCategorie` int(11) NOT NULL,
  `nomCategorie` varchar(100) NOT NULL,
  `descriptionCategorie` text DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Categorie`
--

INSERT INTO `Categorie` (`idCategorie`, `nomCategorie`, `descriptionCategorie`, `actif`, `dateCreation`) VALUES
(1, 'Actes de soins', NULL, 1, '2025-10-18 23:39:22'),
(2, 'Actes d\'analyse', NULL, 1, '2025-10-18 23:39:22'),
(3, 'Actes préventifs', NULL, 1, '2025-10-18 23:39:22');

-- --------------------------------------------------------

--
-- Table structure for table `Ecole`
--

CREATE TABLE `Ecole` (
  `idEcole` int(11) NOT NULL,
  `nomEcole` varchar(100) NOT NULL,
  `adresseEcole` varchar(255) DEFAULT NULL,
  `villeEcole` varchar(100) DEFAULT NULL,
  `codePostalEcole` varchar(10) DEFAULT NULL,
  `telephoneEcole` varchar(20) DEFAULT NULL,
  `mailEcole` varchar(100) DEFAULT NULL,
  `contactReferent` varchar(100) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `Ecole`
--

INSERT INTO `Ecole` (`idEcole`, `nomEcole`, `adresseEcole`, `villeEcole`, `codePostalEcole`, `telephoneEcole`, `mailEcole`, `contactReferent`, `actif`, `dateCreation`) VALUES
(1, 'ESICAD', '56 chemin de la Roseraie', 'Toulouse', '31500', '05 61 23 45 78', 'contact@esicad-toulouse.fr', 'julie.martin@esicad-toulouse.fr', 1, '2025-10-18 23:04:17'),
(2, 'Mirail-Université', '9 place du Capitole', 'Toulouse', '31000', '05 62 98 11 34', 'info@mirail-universite.fr', 'thomas.lefevre@mirail-universite.fr', 1, '2025-10-18 23:04:17'),
(3, 'ESMT Sup', '28 rue du Faubourg-Bonnefoy', 'Toulouse', '31500', '05 61 47 82 19', 'accueil@esmt-tlse.fr', 'sarah.benali@esmt-tlse.fr', 1, '2025-10-18 23:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `Employe`
--

CREATE TABLE `Employe` (
  `idEmploye` int(11) NOT NULL,
  `nomEmploye` varchar(50) NOT NULL,
  `prenomEmploye` varchar(50) NOT NULL,
  `mailEmploye` varchar(100) NOT NULL,
  `mdpEmploye` varchar(255) NOT NULL,
  `roleEmploye` enum('INFIRMIER','SECRETAIRE','DIRECTEUR') NOT NULL,
  `telephoneEmploye` varchar(20) DEFAULT NULL,
  `adresseEmploye` varchar(255) DEFAULT NULL,
  `villeEmploye` varchar(100) DEFAULT NULL,
  `codePostalEmploye` varchar(10) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp(),
  `dateModification` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `Employe`
--

INSERT INTO `Employe` (`idEmploye`, `nomEmploye`, `prenomEmploye`, `mailEmploye`, `mdpEmploye`, `roleEmploye`, `telephoneEmploye`, `adresseEmploye`, `villeEmploye`, `codePostalEmploye`, `actif`, `dateCreation`, `dateModification`) VALUES
(1, 'Akinotcho', 'Jean-Auryel', 'jeanauryel.akinotcho@nursecare.fr', '$2b$10$ZU3djEQdGDDouYbrjSRcO.xzZ14XCjFP9fAIrYQNtEKQnginP5eHO', 'DIRECTEUR', '06 12 34 56 78', '12 rue du Languedoc', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 15:10:45'),
(2, 'Joachim', 'Elodie', 'elodie.joachim@nursecare.fr', '$2b$10$DbnZctV1fBU3dcqyUKIxLe.jddYaIBOKUXhPbM1KH4eKG2boiOuQ2', 'INFIRMIER', '06 98 87 76 65', '48 avenue des Minimes', 'TOULOUSE', '31200', 1, '2025-10-14 16:03:08', '2025-10-19 17:54:14'),
(3, 'Kibangou', 'Ruth', 'ruth.kibangou@nursecare.fr', '$2b$10$qsDypq8QqOAHdhMxqw1q0uNfBiM1tUO5uh1hCe4JLGj.j82DHg3Si', 'SECRETAIRE', '06 98 76 54 32', '7 impasse Saint-Aubin', 'TOULOUSE', '31500', 1, '2025-10-14 16:03:08', '2025-10-19 16:40:59'),
(4, 'nursecare', 'test_1', 'test_1.nursecare@nursecare.fr', '$2b$10$J92iwNVgMMf9N3SdwBNZuOu.1sln2JXeLKkf5vDOySdfAhVlBHc12', 'DIRECTEUR', '07 12 23 34 45', '7 impasse Saint-Aubin', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 15:42:04'),
(5, 'nursecare', 'test_2', 'test_2.nursecare@nursecare.fr', '$2b$10$lzsCIY4RWHHqNKiaUzGJ8eW5QHAprnTRCUkFWi5Vn4ljHeuk3Yzp2', 'SECRETAIRE', '07 12 34 56 78', '25 boulevard de Strasbourg', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 16:55:43'),
(6, 'nursecare', 'test_3', 'test_3.nursecare@nursecare.fr', '$2b$10$UTdRqNxMm36MFgAlCxFt4e6Cd9sCePxGC.mPQ65oLwSickcvYUdeu', 'INFIRMIER', '06 12 34 56 78', '3 allée des Chalets', 'TOULOUSE', '31000', 1, '2025-10-14 16:03:08', '2025-10-18 17:00:49');

-- --------------------------------------------------------

--
-- Table structure for table `Facture`
--

CREATE TABLE `Facture` (
  `idFacture` int(11) NOT NULL,
  `numeroFacture` varchar(50) NOT NULL,
  `idPatient` int(11) NOT NULL,
  `dateFacture` date NOT NULL,
  `dateEcheance` date NOT NULL,
  `montantHT` decimal(10,2) NOT NULL DEFAULT 0.00,
  `montantTVA` decimal(10,2) NOT NULL DEFAULT 0.00,
  `montantTTC` decimal(10,2) NOT NULL DEFAULT 0.00,
  `montantPaye` decimal(10,2) DEFAULT 0.00,
  `statutFacture` enum('BROUILLON','ENVOYEE','PAYEE','PARTIELLE','IMPAYEE','ANNULEE') NOT NULL DEFAULT 'BROUILLON',
  `modePaiement` enum('ESPECES','CARTE','CHEQUE','VIREMENT','MUTUELLE') DEFAULT NULL,
  `datePaiement` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Facture`
--

INSERT INTO `Facture` (`idFacture`, `numeroFacture`, `idPatient`, `dateFacture`, `dateEcheance`, `montantHT`, `montantTVA`, `montantTTC`, `montantPaye`, `statutFacture`, `modePaiement`, `datePaiement`, `notes`, `createdAt`, `updatedAt`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `LigneFacture`
--

CREATE TABLE `LigneFacture` (
  `idLigne` int(11) NOT NULL,
  `idFacture` int(11) NOT NULL,
  `idPrestation` int(11) NOT NULL,
  `idRdv` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1,
  `prixUnitaire` decimal(10,2) NOT NULL,
  `montantHT` decimal(10,2) NOT NULL,
  `tauxTVA` decimal(5,2) NOT NULL DEFAULT 0.00,
  `montantTVA` decimal(10,2) NOT NULL DEFAULT 0.00,
  `montantTTC` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `LigneFacture`
--

INSERT INTO `LigneFacture` (`idLigne`, `idFacture`, `idPrestation`, `idRdv`, `description`, `quantite`, `prixUnitaire`, `montantHT`, `tauxTVA`, `montantTVA`, `montantTTC`) VALUES
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

--
-- Triggers `LigneFacture`
--
DELIMITER $$
CREATE TRIGGER `trg_update_facture_montants_after_delete` AFTER DELETE ON `LigneFacture` FOR EACH ROW BEGIN
  UPDATE Facture
  SET
    montantHT = (SELECT COALESCE(SUM(montantHT), 0) FROM LigneFacture WHERE idFacture = OLD.idFacture),
    montantTVA = (SELECT COALESCE(SUM(montantTVA), 0) FROM LigneFacture WHERE idFacture = OLD.idFacture),
    montantTTC = (SELECT COALESCE(SUM(montantTTC), 0) FROM LigneFacture WHERE idFacture = OLD.idFacture),
    updatedAt = CURRENT_TIMESTAMP
  WHERE idFacture = OLD.idFacture;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_facture_montants_after_insert` AFTER INSERT ON `LigneFacture` FOR EACH ROW BEGIN
  UPDATE Facture
  SET
    montantHT = (SELECT COALESCE(SUM(montantHT), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    montantTVA = (SELECT COALESCE(SUM(montantTVA), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    montantTTC = (SELECT COALESCE(SUM(montantTTC), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    updatedAt = CURRENT_TIMESTAMP
  WHERE idFacture = NEW.idFacture;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_facture_montants_after_update` AFTER UPDATE ON `LigneFacture` FOR EACH ROW BEGIN
  UPDATE Facture
  SET
    montantHT = (SELECT COALESCE(SUM(montantHT), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    montantTVA = (SELECT COALESCE(SUM(montantTVA), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    montantTTC = (SELECT COALESCE(SUM(montantTTC), 0) FROM LigneFacture WHERE idFacture = NEW.idFacture),
    updatedAt = CURRENT_TIMESTAMP
  WHERE idFacture = NEW.idFacture;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Patient`
--

CREATE TABLE `Patient` (
  `idPatient` int(11) NOT NULL,
  `nomPatient` varchar(50) NOT NULL,
  `prenomPatient` varchar(50) NOT NULL,
  `adressePatient` varchar(255) NOT NULL,
  `villePatient` varchar(100) NOT NULL,
  `codePostalPatient` varchar(10) NOT NULL,
  `numPatient` varchar(20) NOT NULL,
  `mailPatient` varchar(100) DEFAULT NULL,
  `numeroSecuSociale` varchar(15) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp(),
  `dateModification` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `Patient`
--

INSERT INTO `Patient` (`idPatient`, `nomPatient`, `prenomPatient`, `adressePatient`, `villePatient`, `codePostalPatient`, `numPatient`, `mailPatient`, `numeroSecuSociale`, `dateNaissance`, `actif`, `dateCreation`, `dateModification`) VALUES
(1, 'Lambert', 'Élodie', '14 rue Raymond IV', 'Toulouse', '31000', '06 71 45 28 90', 'elodie.lambert@example.com', '297041523456789', '1997-04-15', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(2, 'Marchand', 'Paul', '22 avenue de Castres', 'Toulouse', '31500', '06 58 93 47 62', 'paul.marchand@example.com', '298112045678912', '1998-11-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(3, 'Benoit', 'Amandine', '8 rue Saint-Roch', 'Toulouse', '31400', '06 33 47 81 09', 'amandine.benoit@example.com', '300052078901234', '2000-05-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(4, 'Fontaine', 'Matthieu', '19 allée Jules Guesde', 'Toulouse', '31400', '06 74 62 15 33', 'matthieu.fontaine@example.com', '296072145678912', '1996-07-21', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(5, 'Renaud', 'Camille', '5 impasse du Général Compans', 'Toulouse', '31000', '06 28 55 44 12', 'camille.renaud@example.com', '301011245678934', '2001-01-12', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(6, 'Charpentier', 'Noah', '33 boulevard de la Marquette', 'Toulouse', '31000', '06 52 34 18 77', 'noah.charpentier@example.com', '299102345678901', '1999-10-23', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(7, 'Collet', 'Mélissa', '41 chemin du Prat-Long', 'Toulouse', '31500', '06 84 79 62 05', 'melissa.collet@example.com', '303062078912345', '2003-06-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00'),
(8, 'Deschamps', 'Romain', '2 place Wilson', 'Toulouse', '31000', '06 95 28 43 10', 'romain.deschamps@example.com', '295092012345678', '1995-09-20', 1, '2025-10-13 22:00:00', '2025-10-13 22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `Prestation`
--

CREATE TABLE `Prestation` (
  `IdPrestation` int(11) NOT NULL,
  `nomPrestation` varchar(150) NOT NULL,
  `descriptionPrestation` text DEFAULT NULL,
  `prix_TTC` decimal(10,2) NOT NULL,
  `dureeMoyenneMinutes` int(11) DEFAULT 30,
  `idCategorie` int(11) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp(),
  `dateModification` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `Prestation`
--

INSERT INTO `Prestation` (`IdPrestation`, `nomPrestation`, `descriptionPrestation`, `prix_TTC`, `dureeMoyenneMinutes`, `idCategorie`, `actif`, `dateCreation`, `dateModification`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `RDV`
--

CREATE TABLE `RDV` (
  `idRDV` int(11) NOT NULL,
  `idEmploye` int(11) NOT NULL,
  `idPatient` int(11) NOT NULL,
  `IdPrestation` int(11) NOT NULL,
  `idStagiaire` int(11) DEFAULT NULL,
  `timestamp_RDV_prevu` datetime NOT NULL,
  `timestamp_RDV_reel` datetime DEFAULT NULL,
  `timestamp_RDV_facture` datetime DEFAULT NULL,
  `timestamp_RDV_integrePGI` datetime DEFAULT NULL,
  `statut` enum('Planifie','En_Cours','Termine','Annule','Facture','Integre_PGI') DEFAULT 'Planifie',
  `noteStagiaire` int(11) DEFAULT NULL,
  `commentaireStagiaire` text DEFAULT NULL,
  `commentaireGeneral` text DEFAULT NULL,
  `montantFacture` decimal(10,2) DEFAULT NULL,
  `numeroFacture` varchar(50) DEFAULT NULL,
  `idEmployePlanificateur` int(11) DEFAULT NULL,
  `idEmployeTraiteurPGI` int(11) DEFAULT NULL,
  `dateCreation` timestamp NULL DEFAULT current_timestamp(),
  `dateModification` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `RDV`
--

INSERT INTO `RDV` (`idRDV`, `idEmploye`, `idPatient`, `IdPrestation`, `idStagiaire`, `timestamp_RDV_prevu`, `timestamp_RDV_reel`, `timestamp_RDV_facture`, `timestamp_RDV_integrePGI`, `statut`, `noteStagiaire`, `commentaireStagiaire`, `commentaireGeneral`, `montantFacture`, `numeroFacture`, `idEmployePlanificateur`, `idEmployeTraiteurPGI`, `dateCreation`, `dateModification`) VALUES
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

--
-- Triggers `RDV`
--
DELIMITER $$
CREATE TRIGGER `trg_before_insert_rdv_check_infirmier` BEFORE INSERT ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_role_employe VARCHAR(50);
    
    SELECT roleEmploye INTO v_role_employe
    FROM Employe
    WHERE idEmploye = NEW.idEmploye;
    
    IF v_role_employe != 'INFIRMIER' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erreur : Seul un employé avec le rôle INFIRMIER peut être affecté à un RDV';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_rdv_check_planificateur` BEFORE INSERT ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_role_planif VARCHAR(50);
    
    IF NEW.idEmployePlanificateur IS NOT NULL THEN
        SELECT roleEmploye INTO v_role_planif
        FROM Employe
        WHERE idEmploye = NEW.idEmployePlanificateur;
        
        IF v_role_planif != 'SECRETAIRE' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Le planificateur doit avoir le rôle SECRETAIRE';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_rdv_note_stagiaire` BEFORE INSERT ON `RDV` FOR EACH ROW BEGIN
    IF NEW.noteStagiaire IS NOT NULL AND NEW.idStagiaire IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erreur : Impossible de noter un stagiaire si aucun stagiaire n''est affecté au RDV';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_rdv_periode_stage` BEFORE INSERT ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_date_debut DATE;
    DECLARE v_date_fin DATE;
    
    IF NEW.idStagiaire IS NOT NULL THEN
        SELECT dateDebutStage, dateFinStage INTO v_date_debut, v_date_fin
        FROM Stagiaire
        WHERE idStagiaire = NEW.idStagiaire;
        
        IF DATE(NEW.timestamp_RDV_prevu) < v_date_debut OR DATE(NEW.timestamp_RDV_prevu) > v_date_fin THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Le RDV est en dehors de la période de stage du stagiaire';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_check_infirmier` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_role_employe VARCHAR(50);
    
    IF NEW.idEmploye != OLD.idEmploye THEN
        SELECT roleEmploye INTO v_role_employe
        FROM Employe
        WHERE idEmploye = NEW.idEmploye;
        
        IF v_role_employe != 'INFIRMIER' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Seul un employé avec le rôle INFIRMIER peut être affecté à un RDV';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_check_traiteur` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_role_traiteur VARCHAR(50);
    
    IF NEW.idEmployeTraiteurPGI IS NOT NULL AND 
       (OLD.idEmployeTraiteurPGI IS NULL OR NEW.idEmployeTraiteurPGI != OLD.idEmployeTraiteurPGI) THEN
        SELECT roleEmploye INTO v_role_traiteur
        FROM Employe
        WHERE idEmploye = NEW.idEmployeTraiteurPGI;
        
        IF v_role_traiteur != 'SECRETAIRE' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Le traiteur PGI doit avoir le rôle SECRETAIRE';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_facture` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    -- Si on passe en statut 'Facture' et qu'il n'y a pas encore de numéro
    IF NEW.statut = 'Facture' AND OLD.statut != 'Facture' THEN
        IF NEW.numeroFacture IS NULL OR NEW.numeroFacture = '' THEN
            SET NEW.numeroFacture = CONCAT(
                'FAC-',
                YEAR(NEW.timestamp_RDV_facture),
                '-',
                LPAD(MONTH(NEW.timestamp_RDV_facture), 2, '0'),
                '-',
                LPAD(NEW.idRDV, 6, '0')
            );
        END IF;
        
        -- Définir le timestamp de facturation si pas déjà défini
        IF NEW.timestamp_RDV_facture IS NULL THEN
            SET NEW.timestamp_RDV_facture = NOW();
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_integration_pgi` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    -- Si on passe en statut 'Integre_PGI'
    IF NEW.statut = 'Integre_PGI' AND OLD.statut != 'Integre_PGI' THEN
        IF NEW.timestamp_RDV_integrePGI IS NULL THEN
            SET NEW.timestamp_RDV_integrePGI = NOW();
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_montant` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    DECLARE v_prix_prestation DECIMAL(10,2);
    
    -- Si on passe en statut 'Facture' et qu'il n'y a pas de montant
    IF NEW.statut = 'Facture' AND NEW.montantFacture IS NULL THEN
        SELECT prix_TTC INTO v_prix_prestation
        FROM Prestation
        WHERE IdPrestation = NEW.IdPrestation;
        
        SET NEW.montantFacture = v_prix_prestation;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_note_stagiaire` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    IF NEW.noteStagiaire IS NOT NULL AND NEW.idStagiaire IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erreur : Impossible de noter un stagiaire si aucun stagiaire n''est affecté au RDV';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_rdv_statut_coherence` BEFORE UPDATE ON `RDV` FOR EACH ROW BEGIN
    -- On ne peut pas facturer un RDV qui n'est pas terminé
    IF NEW.statut = 'Facture' AND OLD.statut NOT IN ('Termine', 'Facture') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erreur : Un RDV doit être terminé avant d''être facturé';
    END IF;
    
    -- On ne peut pas intégrer au PGI un RDV qui n'est pas facturé
    IF NEW.statut = 'Integre_PGI' AND OLD.statut NOT IN ('Facture', 'Integre_PGI') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Erreur : Un RDV doit être facturé avant d''être intégré au PGI';
    END IF;
    
    -- Si on termine le RDV, on doit avoir un timestamp réel
    IF NEW.statut = 'Termine' AND NEW.timestamp_RDV_reel IS NULL THEN
        SET NEW.timestamp_RDV_reel = NOW();
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Stagiaire`
--

CREATE TABLE `Stagiaire` (
  `idStagiaire` int(11) NOT NULL,
  `nomStagiaire` varchar(50) NOT NULL,
  `prenomStagiaire` varchar(50) NOT NULL,
  `telephoneStagiaire` varchar(20) DEFAULT NULL,
  `mailStagiaire` varchar(100) DEFAULT NULL,
  `dateDebutStage` date NOT NULL,
  `dateFinStage` date NOT NULL,
  `idEcole` int(11) NOT NULL,
  `idEmployeTuteur` int(11) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `dateCreation` timestamp NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `Stagiaire`
--

INSERT INTO `Stagiaire` (`idStagiaire`, `nomStagiaire`, `prenomStagiaire`, `telephoneStagiaire`, `mailStagiaire`, `dateDebutStage`, `dateFinStage`, `idEcole`, `idEmployeTuteur`, `actif`, `dateCreation`) VALUES
(7, 'Dupont', 'Clara', '06 42 15 89 33', 'clara.dupont@esicad-toulouse.fr', '2026-03-03', '2026-06-27', 1, 6, 1, '2025-10-18 23:19:44'),
(8, 'Bernard', 'Lucas', '06 57 21 73 45', 'lucas.bernard@esicad-toulouse.fr', '2026-04-07', '2026-07-25', 1, 2, 1, '2025-10-18 23:19:44'),
(9, 'Leroy', 'Emma', '06 21 34 67 88', 'emma.leroy@mirail-universite.fr', '2025-02-10', '2025-05-30', 2, 2, 1, '2025-10-18 23:19:44'),
(10, 'Girard', 'Hugo', '06 78 22 91 04', 'hugo.girard@mirail-universite.fr', '2025-03-17', '2025-06-20', 2, 6, 1, '2025-10-18 23:19:44'),
(11, 'Morel', 'Sofia', '06 39 84 12 57', 'sofia.morel@esmt-tlse.fr', '2025-04-01', '2025-07-18', 3, 6, 1, '2025-10-18 23:19:44'),
(12, 'Roux', 'Nathan', '06 90 23 45 81', 'nathan.roux@esmt-tlse.fr', '2025-03-24', '2025-07-11', 3, 2, 1, '2025-10-18 23:19:44');

--
-- Triggers `Stagiaire`
--
DELIMITER $$
CREATE TRIGGER `trg_before_insert_stagiaire_check_tuteur` BEFORE INSERT ON `Stagiaire` FOR EACH ROW BEGIN
    DECLARE v_role_tuteur VARCHAR(50);
    
    IF NEW.idEmployeTuteur IS NOT NULL THEN
        SELECT roleEmploye INTO v_role_tuteur
        FROM Employe
        WHERE idEmploye = NEW.idEmployeTuteur;
        
        IF v_role_tuteur != 'INFIRMIER' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Le tuteur d''un stagiaire doit être un INFIRMIER';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_update_stagiaire_check_tuteur` BEFORE UPDATE ON `Stagiaire` FOR EACH ROW BEGIN
    DECLARE v_role_tuteur VARCHAR(50);
    
    IF NEW.idEmployeTuteur IS NOT NULL AND 
       (OLD.idEmployeTuteur IS NULL OR NEW.idEmployeTuteur != OLD.idEmployeTuteur) THEN
        SELECT roleEmploye INTO v_role_tuteur
        FROM Employe
        WHERE idEmploye = NEW.idEmployeTuteur;
        
        IF v_role_tuteur != 'INFIRMIER' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erreur : Le tuteur d''un stagiaire doit être un INFIRMIER';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `VueFacturesCompletes`
-- (See below for the actual view)
--
CREATE TABLE `VueFacturesCompletes` (
`idFacture` int(11)
,`numeroFacture` varchar(50)
,`idPatient` int(11)
,`dateFacture` date
,`dateEcheance` date
,`montantHT` decimal(10,2)
,`montantTVA` decimal(10,2)
,`montantTTC` decimal(10,2)
,`montantPaye` decimal(10,2)
,`statutFacture` enum('BROUILLON','ENVOYEE','PAYEE','PARTIELLE','IMPAYEE','ANNULEE')
,`modePaiement` enum('ESPECES','CARTE','CHEQUE','VIREMENT','MUTUELLE')
,`datePaiement` date
,`notes` text
,`createdAt` timestamp
,`updatedAt` timestamp
,`nomPatient` varchar(50)
,`prenomPatient` varchar(50)
,`adressePatient` varchar(255)
,`numPatient` varchar(20)
,`mailPatient` varchar(100)
,`nombreLignes` bigint(21)
,`statutLibelle` varchar(16)
,`joursRetard` int(8)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `VueLignesFacturesCompletes`
-- (See below for the actual view)
--
CREATE TABLE `VueLignesFacturesCompletes` (
`idLigne` int(11)
,`idFacture` int(11)
,`idPrestation` int(11)
,`idRdv` int(11)
,`description` text
,`quantite` int(11)
,`prixUnitaire` decimal(10,2)
,`montantHT` decimal(10,2)
,`tauxTVA` decimal(5,2)
,`montantTVA` decimal(10,2)
,`montantTTC` decimal(10,2)
,`numeroFacture` varchar(50)
,`dateFacture` date
,`statutFacture` enum('BROUILLON','ENVOYEE','PAYEE','PARTIELLE','IMPAYEE','ANNULEE')
,`nomPrestation` varchar(150)
,`prixPrestation` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_activite_par_categorie`
-- (See below for the actual view)
--
CREATE TABLE `v_activite_par_categorie` (
`nomCategorie` varchar(100)
,`nombre_prestations` bigint(21)
,`montant_total` decimal(32,2)
,`montant_moyen` decimal(14,6)
,`annee` int(5)
,`mois` int(3)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_charge_travail_infirmiers`
-- (See below for the actual view)
--
CREATE TABLE `v_charge_travail_infirmiers` (
`idEmploye` int(11)
,`infirmier` varchar(101)
,`nombre_rdv_total` bigint(21)
,`nombre_rdv_planifies` decimal(22,0)
,`nombre_rdv_termines` decimal(22,0)
,`chiffre_affaire_genere` decimal(32,2)
,`nombre_patients_differents` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_factures_en_attente`
-- (See below for the actual view)
--
CREATE TABLE `v_factures_en_attente` (
`idRDV` int(11)
,`numeroFacture` varchar(50)
,`date_facture` datetime
,`jours_attente` int(8)
,`montantFacture` decimal(10,2)
,`infirmier` varchar(101)
,`patient` varchar(101)
,`statut` enum('Planifie','En_Cours','Termine','Annule','Facture','Integre_PGI')
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_notes_par_ecole`
-- (See below for the actual view)
--
CREATE TABLE `v_notes_par_ecole` (
`idEcole` int(11)
,`nomEcole` varchar(100)
,`nombre_stagiaires` bigint(21)
,`nombre_observations_total` bigint(21)
,`note_moyenne_ecole` decimal(14,4)
,`note_min` int(11)
,`note_max` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_notes_stagiaires`
-- (See below for the actual view)
--
CREATE TABLE `v_notes_stagiaires` (
`idStagiaire` int(11)
,`stagiaire` varchar(101)
,`nomEcole` varchar(100)
,`nombre_observations` bigint(21)
,`note_moyenne` decimal(14,4)
,`note_min` int(11)
,`note_max` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_planning_infirmiers`
-- (See below for the actual view)
--
CREATE TABLE `v_planning_infirmiers` (
`idRDV` int(11)
,`timestamp_RDV_prevu` datetime
,`timestamp_RDV_reel` datetime
,`statut` enum('Planifie','En_Cours','Termine','Annule','Facture','Integre_PGI')
,`infirmier` varchar(101)
,`idEmploye` int(11)
,`patient` varchar(101)
,`adresse_complete` varchar(368)
,`nomPrestation` varchar(150)
,`nomCategorie` varchar(100)
,`montantFacture` decimal(10,2)
,`stagiaire` varchar(101)
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Categorie`
--
ALTER TABLE `Categorie`
  ADD PRIMARY KEY (`idCategorie`),
  ADD UNIQUE KEY `nomCategorie` (`nomCategorie`);

--
-- Indexes for table `Ecole`
--
ALTER TABLE `Ecole`
  ADD PRIMARY KEY (`idEcole`);

--
-- Indexes for table `Employe`
--
ALTER TABLE `Employe`
  ADD PRIMARY KEY (`idEmploye`),
  ADD UNIQUE KEY `mailEmploye` (`mailEmploye`),
  ADD KEY `idx_employe_role` (`roleEmploye`,`actif`),
  ADD KEY `idx_employe_mail` (`mailEmploye`);

--
-- Indexes for table `Facture`
--
ALTER TABLE `Facture`
  ADD PRIMARY KEY (`idFacture`),
  ADD UNIQUE KEY `numeroFacture` (`numeroFacture`),
  ADD KEY `idx_facture_patient` (`idPatient`),
  ADD KEY `idx_facture_statut` (`statutFacture`),
  ADD KEY `idx_facture_date` (`dateFacture`),
  ADD KEY `idx_facture_numero` (`numeroFacture`);

--
-- Indexes for table `LigneFacture`
--
ALTER TABLE `LigneFacture`
  ADD PRIMARY KEY (`idLigne`),
  ADD KEY `idx_ligne_facture` (`idFacture`),
  ADD KEY `idx_ligne_prestation` (`idPrestation`),
  ADD KEY `idx_ligne_rdv` (`idRdv`);

--
-- Indexes for table `Patient`
--
ALTER TABLE `Patient`
  ADD PRIMARY KEY (`idPatient`),
  ADD UNIQUE KEY `numeroSecuSociale` (`numeroSecuSociale`),
  ADD KEY `idx_patient_actif` (`actif`),
  ADD KEY `idx_patient_nom` (`nomPatient`,`prenomPatient`);

--
-- Indexes for table `Prestation`
--
ALTER TABLE `Prestation`
  ADD PRIMARY KEY (`IdPrestation`),
  ADD KEY `idx_prestation_categorie` (`idCategorie`);

--
-- Indexes for table `RDV`
--
ALTER TABLE `RDV`
  ADD PRIMARY KEY (`idRDV`),
  ADD UNIQUE KEY `numeroFacture` (`numeroFacture`),
  ADD KEY `IdPrestation` (`IdPrestation`),
  ADD KEY `idEmployePlanificateur` (`idEmployePlanificateur`),
  ADD KEY `idEmployeTraiteurPGI` (`idEmployeTraiteurPGI`),
  ADD KEY `idx_rdv_employe` (`idEmploye`),
  ADD KEY `idx_rdv_patient` (`idPatient`),
  ADD KEY `idx_rdv_date` (`timestamp_RDV_prevu`),
  ADD KEY `idx_rdv_statut` (`statut`),
  ADD KEY `idx_rdv_stagiaire` (`idStagiaire`);

--
-- Indexes for table `Stagiaire`
--
ALTER TABLE `Stagiaire`
  ADD PRIMARY KEY (`idStagiaire`),
  ADD KEY `idEmployeTuteur` (`idEmployeTuteur`),
  ADD KEY `idx_stagiaire_ecole` (`idEcole`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Categorie`
--
ALTER TABLE `Categorie`
  MODIFY `idCategorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Ecole`
--
ALTER TABLE `Ecole`
  MODIFY `idEcole` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Employe`
--
ALTER TABLE `Employe`
  MODIFY `idEmploye` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Facture`
--
ALTER TABLE `Facture`
  MODIFY `idFacture` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `LigneFacture`
--
ALTER TABLE `LigneFacture`
  MODIFY `idLigne` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Patient`
--
ALTER TABLE `Patient`
  MODIFY `idPatient` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Prestation`
--
ALTER TABLE `Prestation`
  MODIFY `IdPrestation` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RDV`
--
ALTER TABLE `RDV`
  MODIFY `idRDV` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Stagiaire`
--
ALTER TABLE `Stagiaire`
  MODIFY `idStagiaire` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Structure for view `VueFacturesCompletes`
--
DROP TABLE IF EXISTS `VueFacturesCompletes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `VueFacturesCompletes`  AS SELECT `f`.`idFacture` AS `idFacture`, `f`.`numeroFacture` AS `numeroFacture`, `f`.`idPatient` AS `idPatient`, `f`.`dateFacture` AS `dateFacture`, `f`.`dateEcheance` AS `dateEcheance`, `f`.`montantHT` AS `montantHT`, `f`.`montantTVA` AS `montantTVA`, `f`.`montantTTC` AS `montantTTC`, `f`.`montantPaye` AS `montantPaye`, `f`.`statutFacture` AS `statutFacture`, `f`.`modePaiement` AS `modePaiement`, `f`.`datePaiement` AS `datePaiement`, `f`.`notes` AS `notes`, `f`.`createdAt` AS `createdAt`, `f`.`updatedAt` AS `updatedAt`, `p`.`nomPatient` AS `nomPatient`, `p`.`prenomPatient` AS `prenomPatient`, `p`.`adressePatient` AS `adressePatient`, `p`.`numPatient` AS `numPatient`, `p`.`mailPatient` AS `mailPatient`, count(`lf`.`idLigne`) AS `nombreLignes`, CASE `statutLibelle` ELSE `f`.`statutFacture` AS `end` END FROM ((`Facture` `f` left join `Patient` `p` on(`f`.`idPatient` = `p`.`idPatient`)) left join `LigneFacture` `lf` on(`f`.`idFacture` = `lf`.`idFacture`)) GROUP BY `f`.`idFacture` ;

-- --------------------------------------------------------

--
-- Structure for view `VueLignesFacturesCompletes`
--
DROP TABLE IF EXISTS `VueLignesFacturesCompletes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `VueLignesFacturesCompletes`  AS SELECT `lf`.`idLigne` AS `idLigne`, `lf`.`idFacture` AS `idFacture`, `lf`.`idPrestation` AS `idPrestation`, `lf`.`idRdv` AS `idRdv`, `lf`.`description` AS `description`, `lf`.`quantite` AS `quantite`, `lf`.`prixUnitaire` AS `prixUnitaire`, `lf`.`montantHT` AS `montantHT`, `lf`.`tauxTVA` AS `tauxTVA`, `lf`.`montantTVA` AS `montantTVA`, `lf`.`montantTTC` AS `montantTTC`, `f`.`numeroFacture` AS `numeroFacture`, `f`.`dateFacture` AS `dateFacture`, `f`.`statutFacture` AS `statutFacture`, `pr`.`nomPrestation` AS `nomPrestation`, `pr`.`prix_TTC` AS `prixPrestation` FROM (((`LigneFacture` `lf` join `Facture` `f` on(`lf`.`idFacture` = `f`.`idFacture`)) left join `Prestation` `pr` on(`lf`.`idPrestation` = `pr`.`IdPrestation`)) left join `RDV` `r` on(`lf`.`idRdv` = `r`.`idRDV`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_activite_par_categorie`
--
DROP TABLE IF EXISTS `v_activite_par_categorie`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_activite_par_categorie`  AS SELECT `c`.`nomCategorie` AS `nomCategorie`, count(`r`.`idRDV`) AS `nombre_prestations`, sum(`r`.`montantFacture`) AS `montant_total`, avg(`r`.`montantFacture`) AS `montant_moyen`, year(`r`.`timestamp_RDV_prevu`) AS `annee`, month(`r`.`timestamp_RDV_prevu`) AS `mois` FROM ((`RDV` `r` join `Prestation` `pr` on(`r`.`IdPrestation` = `pr`.`IdPrestation`)) join `Categorie` `c` on(`pr`.`idCategorie` = `c`.`idCategorie`)) WHERE `r`.`statut` in ('Termine','Facture','Integre_PGI') GROUP BY `c`.`nomCategorie`, year(`r`.`timestamp_RDV_prevu`), month(`r`.`timestamp_RDV_prevu`) ;

-- --------------------------------------------------------

--
-- Structure for view `v_charge_travail_infirmiers`
--
DROP TABLE IF EXISTS `v_charge_travail_infirmiers`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_charge_travail_infirmiers`  AS SELECT `e`.`idEmploye` AS `idEmploye`, concat(`e`.`prenomEmploye`,' ',`e`.`nomEmploye`) AS `infirmier`, count(`r`.`idRDV`) AS `nombre_rdv_total`, sum(case when `r`.`statut` = 'Planifie' then 1 else 0 end) AS `nombre_rdv_planifies`, sum(case when `r`.`statut` = 'Termine' then 1 else 0 end) AS `nombre_rdv_termines`, sum(`r`.`montantFacture`) AS `chiffre_affaire_genere`, count(distinct `r`.`idPatient`) AS `nombre_patients_differents` FROM (`Employe` `e` left join `RDV` `r` on(`e`.`idEmploye` = `r`.`idEmploye`)) WHERE `e`.`roleEmploye` = 'INFIRMIER' AND `e`.`actif` = 1 GROUP BY `e`.`idEmploye`, `e`.`prenomEmploye`, `e`.`nomEmploye` ;

-- --------------------------------------------------------

--
-- Structure for view `v_factures_en_attente`
--
DROP TABLE IF EXISTS `v_factures_en_attente`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_factures_en_attente`  AS SELECT `r`.`idRDV` AS `idRDV`, `r`.`numeroFacture` AS `numeroFacture`, `r`.`timestamp_RDV_facture` AS `date_facture`, to_days(curdate()) - to_days(`r`.`timestamp_RDV_facture`) AS `jours_attente`, `r`.`montantFacture` AS `montantFacture`, concat(`e`.`prenomEmploye`,' ',`e`.`nomEmploye`) AS `infirmier`, concat(`p`.`prenomPatient`,' ',`p`.`nomPatient`) AS `patient`, `r`.`statut` AS `statut` FROM ((`RDV` `r` join `Employe` `e` on(`r`.`idEmploye` = `e`.`idEmploye`)) join `Patient` `p` on(`r`.`idPatient` = `p`.`idPatient`)) WHERE `r`.`statut` = 'Facture' ORDER BY `r`.`timestamp_RDV_facture` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_notes_par_ecole`
--
DROP TABLE IF EXISTS `v_notes_par_ecole`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_notes_par_ecole`  AS SELECT `ec`.`idEcole` AS `idEcole`, `ec`.`nomEcole` AS `nomEcole`, count(distinct `s`.`idStagiaire`) AS `nombre_stagiaires`, count(`r`.`idRDV`) AS `nombre_observations_total`, avg(`r`.`noteStagiaire`) AS `note_moyenne_ecole`, min(`r`.`noteStagiaire`) AS `note_min`, max(`r`.`noteStagiaire`) AS `note_max` FROM ((`Ecole` `ec` join `Stagiaire` `s` on(`ec`.`idEcole` = `s`.`idEcole`)) left join `RDV` `r` on(`s`.`idStagiaire` = `r`.`idStagiaire` and `r`.`noteStagiaire` is not null)) GROUP BY `ec`.`idEcole`, `ec`.`nomEcole` ;

-- --------------------------------------------------------

--
-- Structure for view `v_notes_stagiaires`
--
DROP TABLE IF EXISTS `v_notes_stagiaires`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_notes_stagiaires`  AS SELECT `s`.`idStagiaire` AS `idStagiaire`, concat(`s`.`prenomStagiaire`,' ',`s`.`nomStagiaire`) AS `stagiaire`, `ec`.`nomEcole` AS `nomEcole`, count(`r`.`idRDV`) AS `nombre_observations`, avg(`r`.`noteStagiaire`) AS `note_moyenne`, min(`r`.`noteStagiaire`) AS `note_min`, max(`r`.`noteStagiaire`) AS `note_max` FROM ((`Stagiaire` `s` left join `RDV` `r` on(`s`.`idStagiaire` = `r`.`idStagiaire` and `r`.`noteStagiaire` is not null)) join `Ecole` `ec` on(`s`.`idEcole` = `ec`.`idEcole`)) GROUP BY `s`.`idStagiaire`, `s`.`prenomStagiaire`, `s`.`nomStagiaire`, `ec`.`nomEcole` ;

-- --------------------------------------------------------

--
-- Structure for view `v_planning_infirmiers`
--
DROP TABLE IF EXISTS `v_planning_infirmiers`;

CREATE ALGORITHM=UNDEFINED DEFINER=`428258`@`%` SQL SECURITY DEFINER VIEW `v_planning_infirmiers`  AS SELECT `r`.`idRDV` AS `idRDV`, `r`.`timestamp_RDV_prevu` AS `timestamp_RDV_prevu`, `r`.`timestamp_RDV_reel` AS `timestamp_RDV_reel`, `r`.`statut` AS `statut`, concat(`e`.`prenomEmploye`,' ',`e`.`nomEmploye`) AS `infirmier`, `e`.`idEmploye` AS `idEmploye`, concat(`p`.`prenomPatient`,' ',`p`.`nomPatient`) AS `patient`, concat(`p`.`adressePatient`,', ',`p`.`codePostalPatient`,' ',`p`.`villePatient`) AS `adresse_complete`, `pr`.`nomPrestation` AS `nomPrestation`, `c`.`nomCategorie` AS `nomCategorie`, `r`.`montantFacture` AS `montantFacture`, CASE WHEN `r`.`idStagiaire` is not null THEN concat(`s`.`prenomStagiaire`,' ',`s`.`nomStagiaire`) ELSE NULL END AS `stagiaire` FROM (((((`RDV` `r` join `Employe` `e` on(`r`.`idEmploye` = `e`.`idEmploye`)) join `Patient` `p` on(`r`.`idPatient` = `p`.`idPatient`)) join `Prestation` `pr` on(`r`.`IdPrestation` = `pr`.`IdPrestation`)) join `Categorie` `c` on(`pr`.`idCategorie` = `c`.`idCategorie`)) left join `Stagiaire` `s` on(`r`.`idStagiaire` = `s`.`idStagiaire`)) WHERE `r`.`statut` <> 'Annule' ORDER BY `r`.`timestamp_RDV_prevu` ASC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Facture`
--
ALTER TABLE `Facture`
  ADD CONSTRAINT `FK_Facture_Patient` FOREIGN KEY (`idPatient`) REFERENCES `Patient` (`idPatient`) ON UPDATE CASCADE;

--
-- Constraints for table `LigneFacture`
--
ALTER TABLE `LigneFacture`
  ADD CONSTRAINT `FK_LigneFacture_Facture` FOREIGN KEY (`idFacture`) REFERENCES `Facture` (`idFacture`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_LigneFacture_Prestation` FOREIGN KEY (`idPrestation`) REFERENCES `Prestation` (`IdPrestation`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_LigneFacture_Rdv` FOREIGN KEY (`idRdv`) REFERENCES `RDV` (`idRDV`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Prestation`
--
ALTER TABLE `Prestation`
  ADD CONSTRAINT `Prestation_ibfk_1` FOREIGN KEY (`idCategorie`) REFERENCES `Categorie` (`idCategorie`);

--
-- Constraints for table `RDV`
--
ALTER TABLE `RDV`
  ADD CONSTRAINT `RDV_ibfk_1` FOREIGN KEY (`idEmploye`) REFERENCES `Employe` (`idEmploye`),
  ADD CONSTRAINT `RDV_ibfk_2` FOREIGN KEY (`IdPrestation`) REFERENCES `Prestation` (`IdPrestation`),
  ADD CONSTRAINT `RDV_ibfk_3` FOREIGN KEY (`idPatient`) REFERENCES `Patient` (`idPatient`),
  ADD CONSTRAINT `RDV_ibfk_4` FOREIGN KEY (`idStagiaire`) REFERENCES `Stagiaire` (`idStagiaire`),
  ADD CONSTRAINT `RDV_ibfk_5` FOREIGN KEY (`idEmployePlanificateur`) REFERENCES `Employe` (`idEmploye`),
  ADD CONSTRAINT `RDV_ibfk_6` FOREIGN KEY (`idEmployeTraiteurPGI`) REFERENCES `Employe` (`idEmploye`);

--
-- Constraints for table `Stagiaire`
--
ALTER TABLE `Stagiaire`
  ADD CONSTRAINT `Stagiaire_ibfk_1` FOREIGN KEY (`idEcole`) REFERENCES `Ecole` (`idEcole`),
  ADD CONSTRAINT `Stagiaire_ibfk_2` FOREIGN KEY (`idEmployeTuteur`) REFERENCES `Employe` (`idEmploye`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
