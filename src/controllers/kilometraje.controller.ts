import { Request, Response } from 'express';
import * as KilometrajeService from '../services/kilometraje.service';
import { Kilometraje } from '../types/kilometraje';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {

    const { fechaInicio, fechaFin } = req.query as {
      fechaInicio?: string;
      fechaFin?: string;
    };

    const data = await KilometrajeService.getAllKilometrajes(
      fechaInicio,
      fechaFin
    );

    res.json({
      success: true,
      message: 'Registros obtenidos correctamente',
      data,
    });
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos',
      data: [],
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    const data = await KilometrajeService.getKilometrajeById(id);
    if (data) {
      res.json({
        success: true,
        message: 'Registro obtenido correctamente',
        data
      });
    } else {
      res.status(404).json({ success: false, message: 'Registro no encontrado', data: null });
    }
  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el registro', data: null });
  }
};

export const create = async (
  req: Request<{}, {}, Omit<Kilometraje, 'id'>>,
  res: Response
): Promise<void> => {
  try {
    const nuevo = await KilometrajeService.createKilometraje(req.body);
    res.status(201).json({
      success: true,
      message: 'Registro creado exitosamente',
      data: nuevo
    });
  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el registro',
      data: null
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    await KilometrajeService.updateKilometraje(id, req.body);
    res.json({
      success: true,
      message: 'Registro actualizado correctamente',
      data: { id, ...req.body }
    });
  } catch (error: any) {
    console.error('Error en update:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      success: false,
      message: error.message || 'Error al actualizar el registro',
      data: null
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    await KilometrajeService.deleteKilometraje(id);
    res.status(200).json({
      success: true,
      message: 'Registro eliminado correctamente',
      data: null
    });
  } catch (error: any) {
    console.error('Error en remove:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      success: false,
      message: error.message || 'Error al eliminar el registro',
      data: null
    });
  }
};
