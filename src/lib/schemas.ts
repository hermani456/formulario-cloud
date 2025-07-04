import { z } from 'zod';

// Esquema para productos
export const ProductoSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre del producto es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  precio: z.number({
    required_error: 'El precio es requerido',
    invalid_type_error: 'El precio debe ser un número válido'
  })
    .int('El precio debe ser un número entero')
    .min(1, 'El precio debe ser mayor a 0')
    .max(99999999, 'El precio es demasiado alto'),
  categoria: z.string()
    .min(1, 'La categoría es requerida')
    .max(100, 'La categoría no puede exceder 100 caracteres'),
  stock: z.number({
    required_error: 'El stock es requerido',
    invalid_type_error: 'El stock debe ser un número válido'
  })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  descripcion: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
});

// Esquema para clientes
export const ClienteSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  email: z.string()
    .email('Debe ser un email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números, espacios, +, -, ()'),
  direccion: z.string()
    .min(1, 'La dirección es requerida')
    .max(500, 'La dirección no puede exceder 500 caracteres')
});

// Esquema para pedidos
export const PedidoSchema = z.object({
  cliente_id: z.number({
    required_error: 'Debe seleccionar un cliente',
    invalid_type_error: 'Debe seleccionar un cliente válido'
  })
    .int('El ID del cliente debe ser un número entero')
    .min(1, 'Debe seleccionar un cliente válido'),
  producto_id: z.number({
    required_error: 'Debe seleccionar un producto',
    invalid_type_error: 'Debe seleccionar un producto válido'
  })
    .int('El ID del producto debe ser un número entero')
    .min(1, 'Debe seleccionar un producto válido'),
  cantidad: z.number({
    required_error: 'La cantidad es requerida',
    invalid_type_error: 'La cantidad debe ser un número válido'
  })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(1000, 'La cantidad no puede exceder 1000 unidades')
});

// Tipos TypeScript basados en los esquemas
export type Producto = z.infer<typeof ProductoSchema>;
export type Cliente = z.infer<typeof ClienteSchema>;
export type Pedido = z.infer<typeof PedidoSchema>;

// Tipos con ID para datos existentes
export type ProductoConId = Producto & { id: number; fecha_creacion?: string };
export type ClienteConId = Cliente & { id: number; fecha_creacion?: string };
export type PedidoConId = Pedido & { 
  id: number; 
  fecha_pedido?: string; 
  monto_total?: number;
  cliente_nombre?: string;
  producto_nombre?: string;
};
