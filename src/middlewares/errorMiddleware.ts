import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { statusCode = 500, message } = error;

  // Log de l'erreur
  console.error('🚨 Erreur capturée:', {
    message: error.message,
    statusCode,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Gestion des erreurs spécifiques
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de validation invalides';
  }

  if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Token d\'authentification invalide';
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT invalide';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expiré';
  }

  // Erreurs de base de données MySQL/MariaDB
  if (error.message.includes('ER_DUP_ENTRY')) {
    statusCode = 409;
    message = 'Cette entrée existe déjà';
  }

  if (error.message.includes('ER_NO_REFERENCED_ROW')) {
    statusCode = 400;
    message = 'Référence invalide vers un enregistrement inexistant';
  }

  if (error.message.includes('ER_ROW_IS_REFERENCED')) {
    statusCode = 400;
    message = 'Impossible de supprimer : cet enregistrement est référencé ailleurs';
  }

  // En production, ne pas exposer les détails de l'erreur
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    ...(isDevelopment && {
      stack: error.stack,
      details: error
    })
  };

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new CustomError(`Route non trouvée: ${req.originalUrl}`, 404);
  next(error);
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}