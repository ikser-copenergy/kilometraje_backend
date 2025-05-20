import { Request, Response } from 'express';
import * as VehiculoService from '../services/vehiculo.service';
import { Vehiculo } from '../types/vehiculo';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // paginar: const { limit, offset } = req.query as { limit?: string; offset?: string };
    const data = await VehiculoService.getAllVehiculos();
    res.json({
      success: true,
      message: 'Vehículos obtenidos correctamente',
      data,
    });
  } catch (error) {
    console.error('Error en getAll Vehiculos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vehículos',
      data: [],
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    const data = await VehiculoService.getVehiculoById(id);
    if (data) {
      res.json({
        success: true,
        message: 'Vehículo obtenido correctamente',
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error en getById Vehiculo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el vehículo',
      data: null,
    });
  }
};

export const create = async (
  req: Request<{}, {}, Omit<Vehiculo, 'id'>>,
  res: Response
): Promise<void> => {
  try {
    const nuevo = await VehiculoService.createVehiculo(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: nuevo,
    });
  } catch (error) {
    console.error('Error en create Vehiculo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el vehículo',
      data: null,
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    await VehiculoService.updateVehiculo(id, req.body);
    res.json({
      success: true,
      message: 'Vehículo actualizado correctamente',
      data: { id, ...req.body },
    });
  } catch (error: any) {
    console.error('Error en update Vehiculo:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      success: false,
      message: error.message || 'Error al actualizar el vehículo',
      data: null,
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID inválido', data: null });
      return;
    }

    await VehiculoService.deleteVehiculo(id);
    res.json({
      success: true,
      message: 'Vehículo eliminado correctamente',
      data: null,
    });
  } catch (error: any) {
    console.error('Error en remove Vehiculo:', error);
    res.status(error.message?.includes('no encontrado') ? 404 : 500).json({
      success: false,
      message: error.message || 'Error al eliminar el vehículo',
      data: null,
    });
  }
};
