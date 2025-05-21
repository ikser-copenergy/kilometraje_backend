import { pool } from '../database/connection';
import { Vehiculo } from '../types/vehiculo';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Obtiene todos los vehículos activos, con paginación opcional.
 */
export const getAllVehiculos = async (
  limit?: number,
  offset?: number
): Promise<Vehiculo[]> => {
  try {
    let query = 'SELECT id, codigo, nombre, activo FROM vehiculos WHERE activo = TRUE ORDER BY codigo DESC';
    const params: any[] = [];

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Vehiculo[];
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    throw new Error('No se pudieron obtener los vehículos');
  }
};

/**
 * Obtiene un vehículo activo por su ID.
 */
export const getVehiculoById = async (id: number): Promise<Vehiculo | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, codigo, nombre, activo FROM vehiculos WHERE id = ? AND activo = TRUE',
      [id]
    );
    const result = rows as Vehiculo[];
    return result[0] || null;
  } catch (error) {
    console.error(`Error al obtener el vehículo con id ${id}:`, error);
    throw new Error('No se pudo obtener el vehículo');
  }
};

/**
 * Crea un vehículo y lo marca activo por defecto.
 */
export const createVehiculo = async (
  data: Omit<Vehiculo, 'id' | 'activo'>
): Promise<Vehiculo> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO vehiculos (codigo, nombre, activo) VALUES (?, ?, TRUE)',
      [data.codigo, data.nombre]
    );
    return { id: result.insertId, ...data, activo: true };
  } catch (error) {
    console.error('Error al crear el vehículo:', error);
    throw new Error('No se pudo crear el vehículo');
  }
};

/**
 * Actualiza los datos de un vehículo activo (no modifica el estado "activo").
 */
export const updateVehiculo = async (
  id: number,
  data: Omit<Vehiculo, 'id' | 'activo'>
): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE vehiculos SET codigo = ?, nombre = ? WHERE id = ? AND activo = TRUE',
      [data.codigo, data.nombre, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Vehículo no encontrado o inactivo para actualizar');
    }
  } catch (error) {
    console.error(`Error al actualizar el vehículo con id ${id}:`, error);
    throw new Error('No se pudo actualizar el vehículo');
  }
};

/**
 * Realiza un borrado lógico marcando el vehículo como inactivo.
 */
export const deleteVehiculo = async (id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE vehiculos SET activo = FALSE WHERE id = ? AND activo = TRUE',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Vehículo no encontrado o ya inactivo');
    }
  } catch (error) {
    console.error(`Error al eliminar (lógicamente) el vehículo con id ${id}:`, error);
    throw new Error('No se pudo eliminar el vehículo');
  }
};
