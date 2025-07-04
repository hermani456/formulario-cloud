import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // OUTER JOIN: Muestra TODOS los productos con información de pedidos (si existen)
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

    // Agrupar los datos para mostrar estadísticas
    const estadisticas = await executeQuery(`
      SELECT 
        COUNT(DISTINCT p.id) as total_productos,
        COUNT(DISTINCT ped.producto_id) as productos_vendidos,
        COUNT(DISTINCT p.id) - COUNT(DISTINCT ped.producto_id) as productos_sin_ventas,
        COUNT(ped.id) as total_pedidos,
        COALESCE(SUM(ped.monto_total), 0) as ventas_totales,
        COALESCE(AVG(ped.monto_total), 0) as promedio_pedido
      FROM productos p
      LEFT OUTER JOIN pedidos ped ON p.id = ped.producto_id
    `);

    // Top productos más vendidos
    const topProductos = await executeQuery(`
      SELECT 
        p.nombre,
        p.precio,
        p.categoria,
        COUNT(ped.id) as total_pedidos,
        SUM(ped.cantidad) as unidades_vendidas,
        SUM(ped.monto_total) as ingresos_totales
      FROM productos p
      LEFT OUTER JOIN pedidos ped ON p.id = ped.producto_id
      GROUP BY p.id, p.nombre, p.precio, p.categoria
      ORDER BY unidades_vendidas DESC, ingresos_totales DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        reporte_completo: reporte,
        estadisticas: estadisticas,
        top_productos: topProductos
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
