import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛍️ Sistema de Tienda Online Chile
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gestiona productos, clientes y pedidos de manera eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Formulario 1: Agregar Producto */}
          <Link href="/agregar-producto" className="group h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Agregar Producto
                </h3>
                <p className="text-gray-600 text-sm">
                  Registra nuevos productos en el inventario
                </p>
              </div>
            </div>
          </Link>

          {/* Formulario 2: Registrar Cliente */}
          <Link href="/registrar-cliente" className="group h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Registrar Cliente
                </h3>
                <p className="text-gray-600 text-sm">
                  Añade nuevos clientes al sistema
                </p>
              </div>
            </div>
          </Link>

          {/* Formulario 3: Crear Pedido */}
          <Link href="/crear-pedido" className="group h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crear Pedido
                </h3>
                <p className="text-gray-600 text-sm">
                  Registra nuevas ventas y pedidos
                </p>
              </div>
            </div>
          </Link>

          {/* Reporte con OUTER JOIN */}
          <Link href="/reporte-ventas" className="group h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reporte de Ventas
                </h3>
                <p className="text-gray-600 text-sm">
                  Análisis completo con OUTER JOIN
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
