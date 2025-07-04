# 🛍️ Sistema de Tienda Online

Un sistema completo de e-commerce desarrollado con Next.js 15, MariaDB y validación con Zod + react-hook-form.

## 🚀 Características

- **Formulario 1**: Agregar productos al inventario
- **Formulario 2**: Registrar clientes 
- **Formulario 3**: Crear pedidos (relaciona productos y clientes)
- **Reporte con OUTER JOIN**: Análisis completo de ventas que muestra TODOS los productos, incluso los que nunca se han vendido
- **Validación robusta**: react-hook-form + zodResolver + Zod en todos los formularios
- **Adaptado para Chile**: precios en CLP (enteros), formatos locales, ejemplos chilenos

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Formularios**: react-hook-form + @hookform/resolvers (zodResolver)
- **Backend**: Next.js API Routes
- **Base de datos**: MariaDB en AWS RDS
- **Validación**: Zod (frontend y backend)
- **ORM/Conexión**: mysql2

## 📋 Prerrequisitos

1. Node.js 18+ y pnpm instalados
2. Acceso a la base de datos MariaDB en AWS RDS
3. Variables de entorno configuradas

## ⚙️ Configuración

### 1. Clonar e instalar dependencias

```bash
cd /home/diego/code/form
pnpm install
```

### 2. Configurar variables de entorno

El archivo `.env.local` ya está configurado con:

```env
DB_HOST=database-1.ci4vpdou2rym.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=wi9=b!fMMq8W$~U
DB_NAME=tienda_online
```

### 3. Crear la base de datos

Ejecuta el script SQL en tu base de datos MariaDB:

```bash
# Conectarse a la base de datos y ejecutar:
mariadb -h database-1.ci4vpdou2rym.us-east-1.rds.amazonaws.com -u admin -p < database_setup.sql
```

O copia y pega el contenido de `database_setup.sql` en tu cliente MySQL/MariaDB.

### 4. Ejecutar la aplicación

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Funcionalidades

### Formularios

1. **Agregar Producto** (`/agregar-producto`)
   - Nombre, precio (CLP), categoría, stock, descripción
   - Validación con react-hook-form + zodResolver + Zod
   - Precios manejados como enteros (sin decimales)

2. **Registrar Cliente** (`/registrar-cliente`)
   - Nombre, email, teléfono chileno, dirección
   - Validación con react-hook-form + zodResolver + Zod
   - Validación de email único y formatos chilenos

3. **Crear Pedido** (`/crear-pedido`)
   - Selección de cliente y producto con react-hook-form
   - Control de stock automático
   - Cálculo de total en tiempo real
   - Validación completa con Zod

### Reporte con OUTER JOIN

**Página**: `/reporte-ventas`

**Query SQL principal**:
```sql
SELECT 
    p.id as producto_id,
    p.nombre as producto_nombre,
    p.precio,
    p.categoria,
    p.stock,
    c.nombre as cliente_nombre,
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
ORDER BY p.nombre, ped.fecha_pedido DESC;
```

**Muestra**:
- Todos los productos (incluso sin ventas)
- Estadísticas generales
- Top productos más vendidos
- Filtros por categoría y estado

## 🗄️ Estructura de la Base de Datos

### Tablas

1. **productos**
   - id (PK), nombre, precio, categoria, stock, descripcion, fecha_creacion

2. **clientes**  
   - id (PK), nombre, email (unique), telefono, direccion, fecha_creacion

3. **pedidos**
   - id (PK), cliente_id (FK), producto_id (FK), cantidad, monto_total, fecha_pedido

### Relaciones

- `pedidos.cliente_id` → `clientes.id`
- `pedidos.producto_id` → `productos.id`

## 🔧 API Endpoints

- `GET/POST /api/productos` - Gestión de productos
- `GET/POST /api/clientes` - Gestión de clientes
- `GET/POST /api/pedidos` - Gestión de pedidos
- `GET /api/reporte-ventas` - Reporte con OUTER JOIN

## ✅ Validaciones

### Productos
- Nombre: requerido, máx 255 caracteres
- Precio: número positivo, máx 999999.99
- Stock: entero no negativo
- Categoría: requerida

### Clientes
- Nombre: requerido, máx 255 caracteres  
- Email: formato válido, único
- Teléfono: mín 10 caracteres, solo números y símbolos
- Dirección: requerida, máx 500 caracteres

### Pedidos
- Cliente: debe existir
- Producto: debe existir con stock suficiente
- Cantidad: entero positivo

## 🎯 Valor del OUTER JOIN

El OUTER JOIN permite:

1. **Visibilidad completa**: Ver todos los productos, no solo los vendidos
2. **Análisis de inventario**: Identificar productos sin rotación
3. **Estrategias comerciales**: Productos que necesitan promoción
4. **Reportes gerenciales**: Vista integral del negocio

## 🚦 Cómo Probar

1. **Agregar productos** desde `/agregar-producto`
2. **Registrar clientes** desde `/registrar-cliente`  
3. **Crear pedidos** desde `/crear-pedido`
4. **Ver reporte completo** en `/reporte-ventas`

El reporte mostrará:
- ✅ Productos vendidos con detalles del cliente
- ❌ Productos sin ventas (gracias al OUTER JOIN)
- 📊 Estadísticas y análisis

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── agregar-producto/page.tsx    # Formulario 1
│   ├── registrar-cliente/page.tsx   # Formulario 2
│   ├── crear-pedido/page.tsx        # Formulario 3
│   ├── reporte-ventas/page.tsx      # Reporte OUTER JOIN
│   ├── api/
│   │   ├── productos/route.ts       # API productos
│   │   ├── clientes/route.ts        # API clientes
│   │   ├── pedidos/route.ts         # API pedidos
│   │   └── reporte-ventas/route.ts  # API reporte
│   └── page.tsx                     # Página principal
└── lib/
    ├── db.ts                        # Conexión a BD
    └── schemas.ts                   # Validaciones Zod
```

## 🎨 Diseño

- **Responsive**: Funciona en desktop y móvil
- **Tailwind CSS**: Diseño moderno y consistente
- **UX/UI**: Formularios intuitivos con validación en tiempo real
- **Estados**: Loading, errores, éxito claramente indicados

¡El sistema está listo para ser usado! 🎉
