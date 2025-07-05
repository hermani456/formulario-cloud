"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PedidoSchema, type Pedido } from "@/lib/schemas";
import purchase from "@/../public/purchase.png";
import Image from "next/image";

interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export default function CrearPedido() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Pedido>({
    resolver: zodResolver(PedidoSchema),
    defaultValues: {
      cliente_id: 0,
      producto_id: 0,
      cantidad: 1,
    },
  });

  // Observar cambios en producto_id para actualizar selectedProduct
  const watchedProductoId = watch("producto_id");

  // Actualizar selectedProduct cuando cambie el producto seleccionado
  useEffect(() => {
    if (watchedProductoId && watchedProductoId > 0) {
      const producto = productos.find((p) => p.id === watchedProductoId);
      setSelectedProduct(producto || null);
    } else {
      setSelectedProduct(null);
    }
  }, [watchedProductoId, productos]);

  // Cargar clientes y productos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          fetch("/api/clientes"),
          fetch("/api/productos"),
        ]);

        const clientesData = await clientesRes.json();
        const productosData = await productosRes.json();

        if (clientesData.success) {
          setClientes(clientesData.data);
        }

        if (productosData.success) {
          setProductos(productosData.data);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setServerError("Error cargando datos. Recarga la página.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const calcularTotal = () => {
    const cantidad = watch("cantidad");
    if (selectedProduct && cantidad && cantidad > 0) {
      return (selectedProduct.precio * cantidad).toLocaleString("es-CL");
    }
    return "0";
  };

  const formatearPrecio = (precio: number) => {
    return precio.toLocaleString("es-CL");
  };

  const onSubmit = async (data: Pedido) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      // Verificar stock disponible
      if (selectedProduct && data.cantidad > selectedProduct.stock) {
        setServerError(
          `Stock insuficiente. Disponible: ${selectedProduct.stock}`
        );
        return;
      }

      // Enviar datos al servidor
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(
          `¡Pedido creado exitosamente! Total: $${result.data.monto_total.toLocaleString(
            "es-CL"
          )}`
        );
        reset(); // Limpiar formulario
        setSelectedProduct(null);

        // Recargar productos para actualizar stock
        const productosRes = await fetch("/api/productos");
        const productosData = await productosRes.json();
        if (productosData.success) {
          setProductos(productosData.data);
        }

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        if (result.detalles) {
          setServerError(
            result.detalles
              .map((d: { message: string }) => d.message)
              .join(", ")
          );
        } else {
          setServerError(result.error || "Error al crear pedido");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={purchase}
                alt="Agregar Producto"
                width={32}
                height={32}
                className="inline-block"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Agregar Producto
              </h1>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left-icon lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Volver
            </Link>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {serverError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {serverError}
            </div>
          )}

          {/* Verificar si hay datos disponibles */}
          {clientes.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              ⚠️ No hay clientes registrados.
              <Link
                href="/registrar-cliente"
                className="font-medium underline ml-1"
              >
                Registra un cliente primero
              </Link>
            </div>
          )}

          {productos.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              ⚠️ No hay productos disponibles.
              <Link
                href="/agregar-producto"
                className="font-medium underline ml-1"
              >
                Agrega un producto primero
              </Link>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 text-black"
          >
            {/* Seleccionar Cliente */}
            <div>
              <label
                htmlFor="cliente_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cliente *
              </label>
              <select
                id="cliente_id"
                {...register("cliente_id", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.cliente_id ? "border-red-500" : "border-gray-300"
                }`}
                disabled={clientes.length === 0}
              >
                <option value={0}>Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} ({cliente.email})
                  </option>
                ))}
              </select>
              {errors.cliente_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cliente_id.message}
                </p>
              )}
            </div>

            {/* Seleccionar Producto */}
            <div>
              <label
                htmlFor="producto_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Producto *
              </label>
              <select
                id="producto_id"
                {...register("producto_id", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.producto_id ? "border-red-500" : "border-gray-300"
                }`}
                disabled={productos.length === 0}
              >
                <option value={0}>Selecciona un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${formatearPrecio(producto.precio)}{" "}
                    (Stock: {producto.stock})
                  </option>
                ))}
              </select>
              {errors.producto_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.producto_id.message}
                </p>
              )}
            </div>

            {/* Información del producto seleccionado */}
            {selectedProduct && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  📦 Producto seleccionado:
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Nombre:</strong> {selectedProduct.nombre}
                  </p>
                  <p>
                    <strong>Precio:</strong> $
                    {formatearPrecio(selectedProduct.precio)}
                  </p>
                  <p>
                    <strong>Categoría:</strong> {selectedProduct.categoria}
                  </p>
                  <p>
                    <strong>Stock disponible:</strong> {selectedProduct.stock}{" "}
                    unidades
                  </p>
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cantidad *
              </label>
              <input
                type="number"
                id="cantidad"
                {...register("cantidad", { valueAsNumber: true })}
                min="1"
                max={selectedProduct?.stock || 1000}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.cantidad ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: 1"
              />
              {errors.cantidad && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cantidad.message}
                </p>
              )}
              {selectedProduct && (
                <p className="mt-1 text-sm text-gray-500">
                  Stock disponible: {selectedProduct.stock} unidades
                </p>
              )}
            </div>

            {/* Resumen del pedido */}
            {selectedProduct && watch("cantidad") && watch("cantidad") > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  💰 Resumen del pedido:
                </h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <strong>Producto:</strong> {selectedProduct.nombre}
                  </p>
                  <p>
                    <strong>Precio unitario:</strong> $
                    {formatearPrecio(selectedProduct.precio)}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {watch("cantidad")}
                  </p>
                  <p className="text-lg font-bold">
                    <strong>Total:</strong> ${calcularTotal()}
                  </p>
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={
                  isLoading || clientes.length === 0 || productos.length === 0
                }
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                  isLoading || clientes.length === 0 || productos.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                }`}
              >
                {isLoading ? "Creando pedido..." : "Crear Pedido"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
