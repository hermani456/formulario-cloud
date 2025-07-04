import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { PedidoSchema, type PedidoConId } from '@/lib/schemas';

export async function GET() {
  try {
    const pedidos = await executeQuery(`
      SELECT 
        p.id,
        p.cliente_id,
        p.producto_id,
        p.cantidad,
        p.monto_total,
        p.fecha_pedido,
        c.nombre as cliente_nombre,
        pr.nombre as producto_nombre,
        pr.precio
      FROM pedidos p
      INNER JOIN clientes c ON p.cliente_id = c.id
      INNER JOIN productos pr ON p.producto_id = pr.id
      ORDER BY p.fecha_pedido DESC
    `) as PedidoConId[];
    
    return NextResponse.json({ 
      success: true, 
      data: pedidos 
    });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validacion = PedidoSchema.safeParse(body);
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

    const { cliente_id, producto_id, cantidad } = validacion.data;
    
    // Verificar que el cliente existe
    const cliente = await executeQuery(
      'SELECT id FROM clientes WHERE id = ?',
      [cliente_id]
    ) as { id: number }[];

    if (cliente.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe y tiene stock suficiente
    const producto = await executeQuery(
      'SELECT id, precio, stock FROM productos WHERE id = ?',
      [producto_id]
    ) as { id: number; precio: number; stock: number }[];

    if (producto.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 400 }
      );
    }

    if (producto[0].stock < cantidad) {
      return NextResponse.json(
        { success: false, error: 'Stock insuficiente' },
        { status: 400 }
      );
    }

    const monto_total = producto[0].precio * cantidad;
    
    // Iniciar transacción
    const connection = await import('@/lib/db').then(db => db.getConnection());
    
    try {
      await connection.beginTransaction();
      
      // Insertar pedido
      const [resultadoPedido] = await connection.execute(
        'INSERT INTO pedidos (cliente_id, producto_id, cantidad, monto_total) VALUES (?, ?, ?, ?)',
        [cliente_id, producto_id, cantidad, monto_total]
      ) as [{ insertId: number }, unknown];

      // Actualizar stock del producto
      await connection.execute(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [cantidad, producto_id]
      );

      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: { id: resultadoPedido.insertId, monto_total }
      }, { status: 201 });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error creando pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}
