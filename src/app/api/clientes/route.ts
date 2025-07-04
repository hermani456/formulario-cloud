import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ClienteSchema, type ClienteConId } from '@/lib/schemas';

export async function GET() {
  try {
    const clientes = await executeQuery(
      'SELECT * FROM clientes ORDER BY fecha_creacion DESC'
    ) as ClienteConId[];

    return NextResponse.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validacion = ClienteSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          detalles: validacion.error.issues
        },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, direccion } = validacion.data;

    // Verificar si el email ya existe
    const emailExistente = await executeQuery(
      'SELECT id FROM clientes WHERE email = ?',
      [email]
    ) as { id: number }[];

    if (emailExistente.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Insertar cliente en la base de datos
    const resultado = await executeQuery(
      'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, direccion]
    ) as { insertId: number };

    return NextResponse.json({
      success: true,
      message: 'Cliente registrado exitosamente',
      data: { id: resultado.insertId }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando cliente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al registrar cliente' },
      { status: 500 }
    );
  }
}
