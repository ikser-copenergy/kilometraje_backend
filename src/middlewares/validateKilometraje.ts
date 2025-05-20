import { Request, Response, NextFunction } from 'express';

export const validateKilometrajeBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.is('application/json') ||
    typeof req.body !== 'object' ||
    req.body === null
  ) {
    return res.status(400).json({ message: 'Se requiere un cuerpo JSON válido' });
  }

  const {
    kilometraje_inicio,
    kilometraje_fin,
    fecha,
    nombre_conductor,
    vehiculo,
    motivo_uso,
  } = req.body;

  if (
    kilometraje_inicio == null ||
    kilometraje_fin == null ||
    !fecha ||
    !nombre_conductor ||
    !vehiculo ||
    !motivo_uso
  ) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  if (
    typeof kilometraje_inicio !== 'number' ||
    typeof kilometraje_fin !== 'number' ||
    typeof nombre_conductor !== 'string' ||
    typeof vehiculo !== 'string' ||
    typeof motivo_uso !== 'string'
  ) {
    return res.status(400).json({ message: 'Tipos de datos inválidos' });
  }

  const timestamp = Date.parse(fecha);
  if (isNaN(timestamp)) {
    return res.status(400).json({ message: 'Formato de fecha inválido (esperado: ISO 8601)' });
  }

  if(kilometraje_fin <= kilometraje_inicio)
    return res.status(400).json({ message: 'Kilometraje final debe ser mayor que kilometraje inicial'});

  next();
};
