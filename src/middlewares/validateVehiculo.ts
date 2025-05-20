import { Request, Response, NextFunction } from 'express';

export const validateVehiculoBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Debe ser JSON
  if (!req.is('application/json') || typeof req.body !== 'object' || req.body === null) {
    res.status(400).json({ message: 'Se requiere un cuerpo JSON válido' });
    return;
  }

  const { codigo, nombre } = req.body;

  // Campos requeridos
  if (!codigo || !nombre) {
    res.status(400).json({ message: 'Faltan campos requeridos: codigo y/o nombre' });
    return;
  }

  // Tipos
  if (typeof codigo !== 'string' || typeof nombre !== 'string') {
    res.status(400).json({ message: 'Tipos de datos inválidos para codigo o nombre' });
    return;
  }

  next();
};
