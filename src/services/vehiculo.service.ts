import { pool } from '../database/connection';
import { Vehiculo } from '../types/vehiculo';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllVehiculos = async (
  limit?: number,
  offset?: number
): Promise<Vehiculo[]> => {
  try {
    let query = 'SELECT id, codigo, nombre FROM vehiculos ORDER BY nombre ASC';
    const params: any[] = [];

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows as Vehiculo[];
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    throw new Error('No se pudieron obtener los vehículos');
  }
};

export const getVehiculoById = async (id: number): Promise<Vehiculo | null> => {
  try {
    const [rows] = await pool.query(
      'SELECT id, codigo, nombre FROM vehiculos WHERE id = ?',
      [id]
    );
    const result = rows as Vehiculo[];
    return result[0] || null;
  } catch (error) {
    console.error(`Error al obtener el vehículo con id ${id}:`, error);
    throw new Error('No se pudo obtener el vehículo');
  }
};

export const createVehiculo = async (
  data: Omit<Vehiculo, 'id'>
): Promise<Vehiculo> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO vehiculos (codigo, nombre) VALUES (?, ?)',
      [data.codigo, data.nombre]
    );
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error al crear el vehículo:', error);
    throw new Error('No se pudo crear el vehículo');
  }
};

export const updateVehiculo = async (
  id: number,
  data: Omit<Vehiculo, 'id'>
): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE vehiculos SET codigo = ?, nombre = ? WHERE id = ?',
      [data.codigo, data.nombre, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Vehículo no encontrado para actualizar');
    }
  } catch (error) {
    console.error(`Error al actualizar el vehículo con id ${id}:`, error);
    throw new Error('No se pudo actualizar el vehículo');
  }
};

export const deleteVehiculo = async (id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM vehiculos WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Vehículo no encontrado para eliminar');
    }
  } catch (error) {
    console.error(`Error al eliminar el vehículo con id ${id}:`, error);
    throw new Error('No se pudo eliminar el vehículo');
  }
};
