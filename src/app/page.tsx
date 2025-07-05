import Link from "next/link";
import Image from "next/image";
import box from "@/../public/box.png";
import cliente from "@/../public/youth.png";
import purchase from "@/../public/purchase.png";
import report from "@/../public/report.png";
import shop from "@/../public/electronics-shop.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div>
            <Image
              src={shop}
              alt="Logo de la Tienda"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Tienda Online
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Gestiona productos, clientes y pedidos de manera facil
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Formulario 1: Agregar Producto */}
          <Link href="/agregar-producto" className="group h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 h-full flex flex-col">
              <div className="text-center flex-1 flex flex-col justify-baseline">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src={box}
                    alt="Agregar Producto"
                    width={64}
                    height={64}
                  />
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
              <div className="text-center flex-1 flex flex-col justify-baseline">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={cliente}
                    alt="Registrar Cliente"
                    width={64}
                    height={64}
                  />
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
              <div className="text-center flex-1 flex flex-col justify-baseline">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={purchase}
                    alt="Crear Pedido"
                    width={64}
                    height={64}
                  />
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
              <div className="text-center flex-1 flex flex-col justify-baseline">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={report}
                    alt="Reporte de Ventas"
                    width={64}
                    height={64}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reporte de Ventas
                </h3>
                <p className="text-gray-600 text-sm">
                  Muestra todos los productos con su información de ventas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
