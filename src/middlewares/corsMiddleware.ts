import { Request, Response, NextFunction } from "express";

export interface CorsOptions {
  origin?: string | string[] | boolean | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
}

export function cors(options: CorsOptions = {}) {
  const {
    origin = process.env.FRONTEND_URL || 'http://localhost:3000',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control'
    ],
    credentials = true,
    maxAge = 86400 // 24 heures
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = req.headers.origin;

    // Gestion de l'origine
    if (typeof origin === 'boolean') {
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin || '*');
      }
    } else if (typeof origin === 'string') {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (Array.isArray(origin)) {
      if (requestOrigin && origin.includes(requestOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      }
    } else if (typeof origin === 'function') {
      origin(requestOrigin, (err, allow) => {
        if (err) {
          return next(err);
        }
        if (allow && requestOrigin) {
          res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        }
      });
    }

    // Gestion des méthodes
    const methodsString = Array.isArray(methods) ? methods.join(', ') : methods;
    res.setHeader('Access-Control-Allow-Methods', methodsString);

    // Gestion des headers
    const headersString = Array.isArray(allowedHeaders) ? allowedHeaders.join(', ') : allowedHeaders;
    res.setHeader('Access-Control-Allow-Headers', headersString);

    // Gestion des credentials
    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Gestion du cache préflight
    if (maxAge) {
      res.setHeader('Access-Control-Max-Age', maxAge.toString());
    }

    // Répondre aux requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }

    next();
  };
}

export const corsConfig = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ]
});