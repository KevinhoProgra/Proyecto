/**
 * Carga los datos MINIMOS para que el sistema arranque: roles, permisos,
 * catalogos y un usuario administrador. No inserta clientes, vehiculos ni ventas.
 * Se puede correr varias veces sin duplicar nada.
 *
 * Uso:  npm run seed
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './config/db.js';

const MODULOS = {
  usuarios: 'usuarios y roles',
  clientes: 'clientes',
  vehiculos: 'vehiculos y catalogos',
  distribuidores: 'distribuidores',
  proveedores: 'proveedores',
  repuestos: 'repuestos',
  ventas: 'ventas',
  mantenimientos: 'mantenimientos',
};
const ACCIONES = ['ver', 'crear', 'editar', 'eliminar'];

const ROLES = [
  ['Administrador', 'Acceso total al sistema'],
  ['Vendedor', 'Registra clientes y ventas de vehiculos'],
  ['Mecanico', 'Gestiona mantenimientos y consumo de repuestos'],
  ['Recepcionista', 'Atiende clientes, recibe vehiculos y consulta reportes'],
];

const PERMISOS_POR_ROL = {
  Vendedor: [
    'clientes.ver', 'clientes.crear', 'clientes.editar',
    'vehiculos.ver', 'repuestos.ver', 'distribuidores.ver',
    'ventas.ver', 'ventas.crear', 'ventas.editar', 'reportes.ver',
  ],
  Mecanico: [
    'clientes.ver', 'vehiculos.ver', 'vehiculos.editar',
    'repuestos.ver', 'repuestos.editar',
    'mantenimientos.ver', 'mantenimientos.crear', 'mantenimientos.editar',
  ],
  Recepcionista: [
    'clientes.ver', 'clientes.crear', 'clientes.editar',
    'vehiculos.ver', 'ventas.ver',
    'mantenimientos.ver', 'mantenimientos.crear', 'reportes.ver',
  ],
};

const MARCAS = ['Toyota', 'Nissan', 'Hyundai', 'Kia', 'Mitsubishi', 'Suzuki', 'Honda', 'Ford', 'Chevrolet', 'Mazda'];
const TIPOS = ['Sedan', 'SUV', 'Pick-up', 'Hatchback', 'Microbus', 'Camion', 'Motocicleta'];
// El orden importa: el codigo busca estos nombres exactos al vender y al dar mantenimiento.
const ESTADOS = ['Disponible', 'Reservado', 'Vendido', 'En mantenimiento', 'Fuera de servicio'];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Empresa2026*';

async function sembrar() {
  await pool.query('INSERT IGNORE INTO roles (nombre, descripcion) VALUES ?', [ROLES]);

  const permisos = [];
  for (const [modulo, descripcion] of Object.entries(MODULOS)) {
    for (const accion of ACCIONES) {
      permisos.push([`${modulo}.${accion}`, modulo, accion, `${accion} ${descripcion}`]);
    }
  }
  permisos.push(['reportes.ver', 'reportes', 'ver', 'Ver reportes y estadisticas']);
  permisos.push(['reportes.exportar', 'reportes', 'exportar', 'Exportar reportes']);
  permisos.push(['bitacora.ver', 'bitacora', 'ver', 'Ver la bitacora de auditoria']);
  await pool.query('INSERT IGNORE INTO permisos (clave, modulo, accion, descripcion) VALUES ?', [permisos]);

  // El administrador recibe todos los permisos que existan.
  await pool.query(`
    INSERT IGNORE INTO rol_permiso (rol_id, permiso_id)
    SELECT r.id, p.id FROM roles r CROSS JOIN permisos p WHERE r.nombre = 'Administrador'`);

  for (const [rol, claves] of Object.entries(PERMISOS_POR_ROL)) {
    await pool.query(
      `INSERT IGNORE INTO rol_permiso (rol_id, permiso_id)
       SELECT r.id, p.id FROM roles r CROSS JOIN permisos p
       WHERE r.nombre = ? AND p.clave IN (?)`,
      [rol, claves],
    );
  }

  await pool.query('INSERT IGNORE INTO marcas (nombre) VALUES ?', [MARCAS.map((nombre) => [nombre])]);
  await pool.query('INSERT IGNORE INTO tipos_vehiculo (nombre) VALUES ?', [TIPOS.map((nombre) => [nombre])]);
  await pool.query('INSERT IGNORE INTO estados_vehiculo (nombre) VALUES ?', [ESTADOS.map((nombre) => [nombre])]);

  const [[admin]] = await pool.query("SELECT id FROM usuarios WHERE usuario = 'admin'");
  if (admin) {
    console.log('El usuario admin ya existe, no se toco su contrasena.');
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      `INSERT INTO usuarios (cedula, nombre, apellidos, usuario, email, password_hash, rol_id)
       SELECT '000000000', 'Administrador', 'del Sistema', 'admin', 'admin@empresavehiculos.cr', ?, id
       FROM roles WHERE nombre = 'Administrador'`,
      [hash],
    );
    console.log(`Usuario creado -> admin / ${ADMIN_PASSWORD}`);
  }

  const [[conteo]] = await pool.query(`
    SELECT (SELECT COUNT(*) FROM roles) AS roles,
           (SELECT COUNT(*) FROM permisos) AS permisos,
           (SELECT COUNT(*) FROM rol_permiso) AS asignaciones,
           (SELECT COUNT(*) FROM marcas) AS marcas`);
  console.log('Datos base listos:', conteo);
}

try {
  await sembrar();
} catch (error) {
  console.error('Fallo el seed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
