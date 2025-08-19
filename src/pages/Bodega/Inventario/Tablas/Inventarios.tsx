import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import {
  Inventario,
  InventarioConElemento,
  InventarioConSitio,
} from "@/types/Inventario";
import { FormAgregateStock } from "@/components/organismos/Inventarios/FormAgregateStock";
import { FormUpdate } from "@/components/organismos/Inventarios/FormUpdate";
import { CodigoInventario } from "../../CodigoInventario";
import { DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface InventariosTableProps {
  inventarios?: Inventario[];
  id_sitio?: number;
}

export const InventariosTable = ({
  inventarios: inventariosProp,
  id_sitio,
}: InventariosTableProps) => {
  const {
    inventarios: inventariosHook,
    isLoading,
    isError,
    error,
    changeState,
  } = useInventario();

  // Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedInventarioStock, setSelectedInventarioStock] =
    useState<InventarioConElemento | null>(null);

  // Modal códigos
  const [isOpenCodigos, setIsOpenCodigos] = useState(false);
  const [inventarioCodigos, setInventarioCodigos] =
    useState<InventarioConElemento | null>(null);

  const handleCloseCodigos = () => {
    setIsOpenCodigos(false);
    setInventarioCodigos(null);
  };

  const handleOpenCodigos = (inventario: InventarioConElemento) => {
    console.log("📑 handleOpenCodigos - inventario recibido:", inventario);
    console.log(
      "📑 Características del elemento:",
      inventario.fk_elemento?.fk_caracteristica
    );
    setInventarioCodigos(inventario);
    setIsOpenCodigos(true);
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedInventarioStock(null);
  };

  const handleState = async (id_inventario: number) => {
    await changeState(id_inventario);
  };

  const handleOpenAddStock = (inventario: InventarioConElemento) => {
    console.log("👉 handleOpenAddStock - inventario recibido:", inventario);
    console.log(
      "👉 Características del elemento:",
      inventario.fk_elemento?.fk_caracteristica
    );
    setSelectedInventarioStock({
      ...inventario,
      tieneCaracteristicas: Array.isArray(
        inventario.fk_elemento?.fk_caracteristica
      )
        ? inventario.fk_elemento.fk_caracteristica.length > 0
        : !!inventario.fk_elemento?.fk_caracteristica,
    });
    setIsOpenUpdate(true);
  };

  const filtered = (inventariosProp ?? inventariosHook) as InventarioConSitio[];

  const InventariosWithKey = filtered
    ?.filter((inventario) => {
      return (
        inventario?.id_inventario !== undefined &&
        (id_sitio
          ? inventario.fk_sitio === id_sitio ||
            inventario.fk_sitio?.id_sitio === id_sitio
          : true)
      );
    })
    .map((inventario) => {
      console.log("📦 Inventario mapeado:", inventario);
      console.log(
        "📦 fk_caracteristica:",
        inventario.fk_elemento?.fk_caracteristica
      );

      return {
        ...inventario,
        key: inventario.id_inventario?.toString() ?? crypto.randomUUID(),
        id_inventario: inventario.id_inventario || 0,
        estado: Boolean(inventario.estado),
        tieneCaracteristicas: Array.isArray(
          inventario.fk_elemento?.fk_caracteristica
        )
          ? inventario.fk_elemento.fk_caracteristica.length > 0
          : !!inventario.fk_elemento?.fk_caracteristica,
      };
    });

  const columns: TableColumn<Inventario>[] = [
    {
      key: "fk_elemento",
      label: "Elemento",
      render: (inventario: Inventario) => {
        const elemento = (inventario as any).elemento;
        const nombre = elemento?.nombre ?? "No encontrado";
        return <span>{nombre}</span>;
      },
    },
    {
      key: "imagen_elemento",
      label: "Imagen",
      render: (inventario: Inventario) => {
        const elemento = (inventario as any).elemento;
        const imagen_elemento = elemento?.imagen_elemento;
        if (!imagen_elemento) return <span>No encontrado</span>;
        const src = `http://localhost:8000/${imagen_elemento}`;
        return (
          <img
            src={src}
            alt="Imagen del elemento"
            className="justify-center relative left-6 h-28 rounded shadow"
          />
        );
      },
    },
    {
      key: "stock",
      label: "Cantidad",
      render: (inventario: Inventario) => {
        const cantidad = inventario.stock ?? 0;
        let color = "text-gray-500";
        let estado = "Sin stock";

        if (cantidad >= 50) {
          color = "text-green-600 font-bold";
          estado = "Suficiente";
        } else if (cantidad >= 16) {
          color = "text-yellow-500 font-semibold";
          estado = "Moderado";
        } else if (cantidad > 0 && cantidad <= 15) {
          color = "text-red-500 font-semibold";
          estado = "Bajo";
        }

        return (
          <span className={color}>
            {cantidad} <span className="ml-1 text-sm">({estado})</span>
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (inventario: Inventario) => (
        <span>
          {inventario.created_at
            ? new Date(inventario.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (inventario: Inventario) => (
        <span>
          {inventario.updated_at
            ? new Date(inventario.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
    {
      key: "acciones",
      label: "",
      render: (inventario: Inventario & { tieneCaracteristicas?: boolean }) => (
        <div className="flex gap-2">
          <Buton
            className="w-[50px] h-[40px] p-0 min-w-0"
            onPress={() =>
              handleOpenAddStock(inventario as InventarioConElemento)
            }
          >
            <PlusCircleIcon />
          </Buton>

          {inventario.tieneCaracteristicas && (
            <Buton
              className="w-[50px] h-[40px] p-0 min-w-0 bg-green-600 hover:bg-gray-700 text-white"
              onPress={() =>
                handleOpenCodigos(inventario as InventarioConElemento)
              }
            >
              <DocumentTextIcon />
            </Buton>
          )}
        </div>
      ),
    },
  ];

  if (isLoading && !inventariosProp) return <span>Cargando datos...</span>;
  if (isError && !inventariosProp) return <span>Error: {error?.message}</span>;

  return (
    <div className="p-4">
      {!id_sitio && (
        <h1 className="text-2xl font-bold mb-4 text-center">
          Inventarios Registrados
        </h1>
      )}

      {/* Modal Agregar Stock */}
      <Modall
        ModalTitle="Agregar Stock"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedInventarioStock?.tieneCaracteristicas ? (
          <FormAgregateStock
            fk_inventario={selectedInventarioStock.id_inventario!}
            fk_elemento={selectedInventarioStock.fk_elemento.id_elemento!}
            fk_sitio={selectedInventarioStock.fk_sitio.id_sitio!}
            onClose={handleCloseUpdate}
          />
        ) : selectedInventarioStock ? (
          <FormUpdate
            inventarios={InventariosWithKey ?? []}
            inventarioId={selectedInventarioStock.id_inventario!}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        ) : null}
      </Modall>

      {/* Modal Códigos */}
      <Modall
        ModalTitle="Códigos del Inventario"
        isOpen={isOpenCodigos}
        onOpenChange={handleCloseCodigos}
      >
        {inventarioCodigos && (
          <CodigoInventario
            id_inventario={inventarioCodigos.id_inventario!}
            tieneCaracteristicas={
              !!inventarioCodigos.fk_elemento?.fk_caracteristica
            }
            isOpen={isOpenCodigos}
            onClose={handleCloseCodigos}
          />
        )}
      </Modall>

      {/* Tabla */}
      <Globaltable
        data={InventariosWithKey}
        columns={columns ?? []}
        onDelete={(inventario) => handleState(inventario.id_inventario)}
      />
    </div>
  );
};
