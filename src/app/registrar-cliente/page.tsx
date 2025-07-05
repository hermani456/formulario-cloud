"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClienteSchema, type Cliente } from "@/lib/schemas";
import cliente from "@/../public/youth.png";
import Image from "next/image";

export default function RegistrarCliente() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Cliente>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
    },
  });

  const onSubmit = async (data: Cliente) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      // Enviar datos al servidor
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("¡Cliente registrado exitosamente!");
        reset(); // Limpiar formulario

        // Redirigir después de 1 segundos
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setServerError(result.error || "Error al registrar cliente");
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={cliente}
                alt="Agregar Producto"
                width={32}
                height={32}
                className="inline-block"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Registrar Cliente
              </h1>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-green-600 hover:text-green-800 transition-colors flex items-center gap-2"
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 text-black"
          >
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                {...register("nombre")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: María González López"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: maria.gonzalez@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                {...register("telefono")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: +56 9 1234 5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Formato: números, espacios, +, -, paréntesis
              </p>
            </div>

            {/* Dirección */}
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dirección Completa *
              </label>
              <textarea
                id="direccion"
                {...register("direccion")}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.direccion ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Providencia 123, Santiago, Chile"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                }`}
              >
                {isLoading ? "Registrando cliente..." : "Registrar Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
