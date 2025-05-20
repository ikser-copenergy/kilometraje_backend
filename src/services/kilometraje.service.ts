import { pool } from '../database/connection';
import { Kilometraje } from '../types/kilometraje';
import { RowDataPacket } from 'mysql2';

export const getAllKilometrajes = async (
  fechaInicio?: string,
  fechaFin?: string
): Promise<Kilometraje[]> => {
  try {
    let query = 'SELECT * FROM kilometraje_vehiculos';
    const params: any[] = [];

    if (fechaInicio && fechaFin) {
      // Inicio del día con milisegundos exactos
      const start = `${fechaInicio} 00:00:00.000`;
      // Fin del día con milisegundos exactos
      const end = `${fechaFin} 23:59:59.999`;
      query += ' WHERE fecha BETWEEN ? AND ?';
      params.push(start, end);
    }

    const [rows] = await pool.query(query, params);
    return rows as Kilometraje[];
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    throw new Error('No se pudieron obtener los datos');
  }
};


export const getKilometrajeById = async (id: number): Promise<Kilometraje | null> => {
  try {
    const [rows] = await pool.query('SELECT * FROM kilometraje_vehiculos WHERE id = ?', [id]);
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
    const [result] = await pool.query('INSERT INTO kilometraje_vehiculos SET ?', [data]);
    return { id: (result as any).insertId, ...data };
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
    const [result] = await pool.query('UPDATE kilometraje_vehiculos SET ? WHERE id = ?', [data, id]);
    const info = result as RowDataPacket;
    if ((info as any).affectedRows === 0) {
      throw new Error('Registro no encontrado para actualizar');
    }
  } catch (error) {
    console.error(`Error al actualizar el registro con id ${id}:`, error);
    throw new Error('No se pudo actualizar el registro');
  }
};

export const deleteKilometraje = async (id: number): Promise<void> => {
  try {
    const [result] = await pool.query('DELETE FROM kilometraje_vehiculos WHERE id = ?', [id]);
    const info = result as RowDataPacket;
    if ((info as any).affectedRows === 0) {
      throw new Error('Registro no encontrado para eliminar');
    }
  } catch (error) {
    console.error(`Error al eliminar el registro con id ${id}:`, error);
    throw new Error('No se pudo eliminar el registro');
  }
};
