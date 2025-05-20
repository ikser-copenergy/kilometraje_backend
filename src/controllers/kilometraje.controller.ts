import { Request, Response } from 'express';
import * as KilometrajeService from '../services/kilometraje.service';
import { Kilometraje } from '../types/kilometraje';

export const getAll = async (_: Request, res: Response) => {
  try {
    const data = await KilometrajeService.getAllKilometrajes();
    res.json(data);
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    const data = await KilometrajeService.getKilometrajeById(id);
    if (data) res.json(data);
    else res.status(404).json({ message: 'Registro no encontrado' });
  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ message: 'Error al obtener el registro' });
  }
};

export const create = async (
  req: Request<{}, {}, Omit<Kilometraje, 'id'>>,
  res: Response
) => {
  try {
    const nuevo = await KilometrajeService.createKilometraje(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({ message: 'Error al crear el registro' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    await KilometrajeService.updateKilometraje(id, req.body);
    res.json({ id, ...req.body });
  } catch (error: any) {
    console.error('Error en update:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      message: error.message || 'Error al actualizar el registro',
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    await KilometrajeService.deleteKilometraje(id);
    res.sendStatus(204);
  } catch (error: any) {
    console.error('Error en remove:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      message: error.message || 'Error al eliminar el registro',
    });
  }
};
