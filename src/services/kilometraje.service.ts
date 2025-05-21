import { pool } from '../database/connection';
import { Kilometraje } from '../types/kilometraje';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const KILOMETRAJE_FIELDS = `
  id, kilometraje_inicio, kilometraje_fin, fecha,
  nombre_conductor, vehiculo, motivo_uso, id_vehiculo
`;

export const getAllKilometrajes = async (
  fechaInicio?: string,
  fechaFin?: string,
  limit?: number,
  offset?: number
): Promise<Kilometraje[]> => {
  try {
    let query = 
    `
    SELECT km.id, kilometraje_inicio, kilometraje_fin, fecha, nombre_conductor, v.nombre as vehiculo, motivo_uso, id_vehiculo 
      FROM kilometraje_vehiculos km
      INNER JOIN vehiculos v 
      ON km.id_vehiculo = v.id
    `;
    const params: any[] = [];

    if (fechaInicio && fechaFin) {
      const start = `${fechaInicio} 00:00:00.000`;
      const end = `${fechaFin} 23:59:59.999`;
      query += ' WHERE fecha BETWEEN ? AND ?';
      params.push(start, end);
    }

    query += ' ORDER BY fecha DESC';

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Kilometraje[];
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    throw new Error('No se pudieron obtener los datos');
  }
};

export const getKilometrajeById = async (id: number): Promise<Kilometraje | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ${KILOMETRAJE_FIELDS} FROM kilometraje_vehiculos WHERE id = ?`,
      [id]
    );
    const result = rows as Kilometraje[];
    return result[0] || null;
  } catch (error) {
    console.error(`Error al obtener el registro con id ${id}:`, error);
    throw new Error('No se pudo obtener el registro');
  }
};

export const createKilometraje = async (
  data: Omit<Kilometraje, 'id'>
): Promise<Kilometraje> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO kilometraje_vehiculos SET ?',
      [data]
    );
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Error al crear el registro:', error);
    throw new Error('No se pudo crear el registro');
  }
};

export const updateKilometraje = async (
  id: number,
  data: Omit<Kilometraje, 'id'>
): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE kilometraje_vehiculos SET ? WHERE id = ?',
      [data, id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Registro no encontrado para actualizar');
    }
  } catch (error) {
    console.error(`Error al actualizar el registro con id ${id}:`, error);
    throw new Error('No se pudo actualizar el registro');
  }
};

export const deleteKilometraje = async (id: number): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE kilometraje_vehiculos SET activo = FALSE WHERE id = ? AND activo = TRUE',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Registro no encontrado o ya inactivo');
    }
  } catch (error) {
    console.error(`Error al realizar borrado lógico del registro con id ${id}:`, error);
    throw new Error('No se pudo eliminar el registro');
  }
};
