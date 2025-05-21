import { Request, Response, NextFunction } from 'express';

export const validateKilometrajeBody = (
  req: Request,
  res: Response,
  next: NextFunction
):void => {
  if (
    !req.is('application/json') ||
    typeof req.body !== 'object' ||
    req.body === null
  ) {
    res.status(400).json({ message: 'Se requiere un cuerpo JSON válido' });
    return;
  }

  const {
    kilometraje_inicio,
    kilometraje_fin,
    fecha,
    nombre_conductor,
    id_vehiculo,
    motivo_uso,
  } = req.body;

  if (
    kilometraje_inicio == null ||
    kilometraje_fin == null ||
    !fecha ||
    !nombre_conductor ||
    id_vehiculo ==0 ||
    !motivo_uso
  ) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  if (
    typeof kilometraje_inicio !== 'number' ||
    typeof kilometraje_fin !== 'number' ||
    typeof nombre_conductor !== 'string' ||
    typeof id_vehiculo !== 'number' ||
    typeof motivo_uso !== 'string'
  ) {
    res.status(400).json({ message: 'Tipos de datos inválidos' });
    return; 
  }

  const timestamp = Date.parse(fecha);
  if (isNaN(timestamp)) {
    res.status(400).json({ message: 'Formato de fecha inválido (esperado: ISO 8601)' });
    return;
  }

  if(kilometraje_fin <= kilometraje_inicio){
    res.status(400).json({ message: 'Kilometraje final debe ser mayor que kilometraje inicial'});
    return;
  }

  next();
};
