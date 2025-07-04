import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { ProductoSchema, type ProductoConId } from '@/lib/schemas';

export async function GET() {
  try {
    const productos = await executeQuery(
      'SELECT * FROM productos ORDER BY fecha_creacion DESC'
    ) as ProductoConId[];
    
    return NextResponse.json({ 
      success: true, 
      data: productos 
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validacion = ProductoSchema.safeParse(body);
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

    const { nombre, precio, categoria, stock, descripcion } = validacion.data;
    
    // Insertar producto en la base de datos
    const resultado = await executeQuery(
      'INSERT INTO productos (nombre, precio, categoria, stock, descripcion) VALUES (?, ?, ?, ?, ?)',
      [nombre, precio, categoria, stock, descripcion || null]
    ) as { insertId: number };

    return NextResponse.json({
      success: true,
      message: 'Producto creado exitosamente',
      data: { id: resultado.insertId }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
