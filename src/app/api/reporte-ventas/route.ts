import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // LEFT OUTER JOIN: Muestra TODOS los productos con información de pedidos (si existen)
    // Esto incluye productos que nunca han sido vendidos
    const reporte = await executeQuery(`
      SELECT 
        p.id as producto_id,
        p.nombre as producto_nombre,
        p.precio,
        p.categoria,
        p.stock,
        p.descripcion,
        c.id as cliente_id,
        c.nombre as cliente_nombre,
        c.email as cliente_email,
        ped.id as pedido_id,
        ped.cantidad,
        ped.monto_total,
        ped.fecha_pedido,
        CASE 
          WHEN ped.id IS NULL THEN 'Sin ventas'
          ELSE 'Vendido'
        END as estado_venta
      FROM productos p
      LEFT OUTER JOIN pedidos ped ON p.id = ped.producto_id
      LEFT OUTER JOIN clientes c ON ped.cliente_id = c.id
      ORDER BY p.nombre, ped.fecha_pedido DESC
    `);

    return NextResponse.json({
      success: true,
      data: {
        reporte_completo: reporte
      }
    });
  } catch (error) {
    console.error('Error generando reporte:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar reporte de ventas' },
      { status: 500 }
    );
  }
}
