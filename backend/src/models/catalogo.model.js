import { pool } from '../config/db.js';
import { crearModeloCrud } from './crud.model.js';

export const marcaModel = crearModeloCrud({
  tabla: 'marcas',
  campos: ['nombre', 'pais', 'activo'],
  orden: 'nombre',
});

export const tipoVehiculoModel = crearModeloCrud({
  tabla: 'tipos_vehiculo',
  campos: ['nombre'],
  orden: 'nombre',
});

export const estadoVehiculoModel = crearModeloCrud({
  tabla: 'estados_vehiculo',
  campos: ['nombre'],
  orden: 'id',
});

// Todos los catalogos en una sola peticion, para llenar los <select> del frontend.
export async function catalogosCompletos() {
  const [marcas] = await pool.query('SELECT id, nombre FROM marcas WHERE activo = TRUE ORDER BY nombre');
  const [tipos] = await pool.query('SELECT id, nombre FROM tipos_vehiculo ORDER BY nombre');
  const [estados] = await pool.query('SELECT id, nombre FROM estados_vehiculo ORDER BY id');
  const [roles] = await pool.query('SELECT id, nombre FROM roles WHERE activo = TRUE ORDER BY nombre');
  return { marcas, tipos_vehiculo: tipos, estados_vehiculo: estados, roles };
}
