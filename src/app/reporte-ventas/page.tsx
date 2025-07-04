"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ReporteItem {
  producto_id: number;
  producto_nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  descripcion?: string;
  cliente_id?: number;
  cliente_nombre?: string;
  cliente_email?: string;
  pedido_id?: number;
  cantidad?: number;
  monto_total?: number;
  fecha_pedido?: string;
  estado_venta: string;
}

interface Estadisticas {
  total_productos: number;
  productos_vendidos: number;
  productos_sin_ventas: number;
  total_pedidos: number;
  ventas_totales: number;
  promedio_pedido: number;
}

interface TopProducto {
  nombre: string;
  precio: number;
  categoria: string;
  total_pedidos: number;
  unidades_vendidas: number;
  ingresos_totales: number;
}

export default function ReporteVentas() {
  const [reporte, setReporte] = useState<ReporteItem[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-CL");
  };

  useEffect(() => {
    const loadReporte = async () => {
      try {
        const response = await fetch("/api/reporte-ventas");
        const result = await response.json();

        if (result.success) {
          setReporte(result.data.reporte_completo);
          setEstadisticas(result.data.estadisticas[0]);
          setTopProductos(result.data.top_productos);
        } else {
          setError(result.error || "Error al cargar el reporte");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error de conexión");
      } finally {
        setIsLoading(false);
      }
    };

    loadReporte();
  }, []);

  // Filtrar reporte
  const reporteFiltrado = reporte.filter((item) => {
    if (filtroCategoria && item.categoria !== filtroCategoria) return false;
    if (filtroEstado && item.estado_venta !== filtroEstado) return false;
    return true;
  });

  // Obtener categorías únicas
  const categorias = [...new Set(reporte.map((item) => item.categoria))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generando reporte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            📊 Reporte de Ventas (OUTER JOIN)
          </h1>
          <Link
            href="/"
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* Estadísticas generales */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {estadisticas.total_productos}
                </div>
                <div className="text-sm text-gray-600">Total Productos</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {estadisticas.productos_vendidos}
                </div>
                <div className="text-sm text-gray-600">Productos Vendidos</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {estadisticas.productos_sin_ventas}
                </div>
                <div className="text-sm text-gray-600">Sin Ventas</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {estadisticas.total_pedidos}
                </div>
                <div className="text-sm text-gray-600">Total Pedidos</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  $
                  {Number(estadisticas.ventas_totales || 0).toLocaleString(
                    "es-CL"
                  )}
                </div>
                <div className="text-sm text-gray-600">Ventas Totales</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  $
                  {Number(estadisticas.promedio_pedido || 0).toLocaleString(
                    "es-CL"
                  )}
                </div>
                <div className="text-sm text-gray-600">Promedio Pedido</div>
              </div>
            </div>
          </div>
        )}

        {/* Top Productos */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🏆 Top Productos Más Vendidos
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidades Vendidas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos Totales
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProductos.map((producto, index) => (
                    <tr key={index} className={index < 3 ? "bg-yellow-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 && (
                            <span className="text-2xl mr-2">🥇🥈🥉</span>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {producto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${formatearPrecio(producto.precio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {producto.unidades_vendidas || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        $
                        {Number(producto.ingresos_totales || 0).toLocaleString(
                          "es-CL"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoría
              </label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Todos los estados</option>
                <option value="Vendido">Vendido</option>
                <option value="Sin ventas">Sin ventas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla del reporte completo */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              📋 Reporte Completo - OUTER JOIN
            </h2>
            <p className="text-gray-600 mt-2">
              Esta tabla muestra TODOS los productos con su información de
              ventas (usando LEFT OUTER JOIN). Los productos sin ventas también
              aparecen listados.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio/Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reporteFiltrado.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      item.estado_venta === "Sin ventas"
                        ? "bg-red-50"
                        : "bg-green-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.producto_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {item.categoria}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${formatearPrecio(item.precio)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {item.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.cliente_nombre ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.cliente_nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.cliente_email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Sin cliente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.pedido_id ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            Cant: {item.cantidad}
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            $
                            {Number(item.monto_total || 0).toLocaleString(
                              "es-CL"
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.fecha_pedido &&
                              new Date(item.fecha_pedido).toLocaleDateString(
                                "es-ES"
                              )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Sin pedidos
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.estado_venta === "Sin ventas"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.estado_venta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reporteFiltrado.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No se encontraron datos con los filtros aplicados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
