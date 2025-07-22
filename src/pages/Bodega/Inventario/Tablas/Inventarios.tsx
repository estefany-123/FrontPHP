import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
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
import usePermissions from "@/hooks/Usuarios/usePermissions";
import { DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface InventariosTableProps {
  inventarios?: Inventario[];
  idSitio?: number;
}

export const InventariosTable = ({
  inventarios: inventariosProp,
  idSitio,
}: InventariosTableProps) => {
  const { userHasPermission } = usePermissions();

  const {
    inventarios: inventariosHook,
    isLoading,
    isError,
    error,
    changeState,
  } = useInventario();

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedInventarioStock, setSelectedInventarioStock] =
    useState<InventarioConElemento | null>(null);
  const [isOpenCodigos, setIsOpenCodigos] = useState(false);
  const [inventarioCodigos, setInventarioCodigos] =
    useState<InventarioConElemento | null>(null);
  // const [, setSelectedInventario] = useState<Inventario | null>(null);

  const handleCloseCodigos = () => {
    setIsOpenCodigos(false);
    setInventarioCodigos(null);
  };

  const handleOpenCodigos = (inventario: InventarioConElemento) => {
    setInventarioCodigos(inventario);
    setIsOpenCodigos(true);
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedInventarioStock(null);
  };

  const handleState = async (idInventario: number) => {
    await changeState(idInventario);
  };

  const handleOpenAddStock = (inventario: InventarioConElemento) => {
    setSelectedInventarioStock(inventario);
    setIsOpenUpdate(true);
  };


  const columns: TableColumn<Inventario>[] = [
    {
      key: "fkElemento",
      label: "Elemento",
      render: (inventario: Inventario) => {
        const fkElemento = (inventario as any).fkElemento;

        const nombre =
          typeof fkElemento === "object" && fkElemento?.nombre
            ? fkElemento.nombre
            : "No encontrado";

        return <span>{nombre}</span>;
      },
    },
    {
      key: "imagenElemento",
      label: "Imagen",
      render: (inventario: Inventario) => {
        const fkElemento = (inventario as any).fkElemento;
        const imagen = fkElemento?.imagen;

        if (!imagen) return <span>No encontrado</span>;

        const src = `http://localhost:3000/img/img/elementos/${imagen}`;

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
      key: "createdAt",
      label: "Fecha Creación",
      render: (inventario: Inventario) => (
        <span>
          {inventario.createdAt
            ? new Date(inventario.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Fecha Actualización",
      render: (inventario: Inventario) => (
        <span>
          {inventario.updatedAt
            ? new Date(inventario.updatedAt).toLocaleDateString("es-ES", {
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

  if (isLoading && !inventariosProp) {
    return <span>Cargando datos...</span>;
  }

  if (isError && !inventariosProp) {
    return <span>Error: {error?.message}</span>;
  }

  const filtered = (inventariosProp ?? inventariosHook) as InventarioConSitio[];

  const InventariosWithKey = filtered
    ?.filter(
      (inventario) =>
        inventario?.idInventario !== undefined &&
        (idSitio ? inventario.fkSitio?.idSitio === idSitio : true)
    )
    .map((inventario) => ({
      ...inventario,
      key: inventario.idInventario
        ? inventario.idInventario.toString()
        : crypto.randomUUID(),
      idInventario: inventario.idInventario || 0,
      estado: Boolean(inventario.estado),
      tieneCaracteristicas: Array.isArray(
        inventario.fkElemento?.fkCaracteristica
      )
        ? inventario.fkElemento.fkCaracteristica.length > 0
        : !!inventario.fkElemento?.fkCaracteristica,
    }));

  console.log("Inventarios filtrados:", filtered);
  console.log("idSitio recibido por props:", idSitio);

  return (
    <div className="p-4">
      {!idSitio && (
        <h1 className="text-2xl font-bold mb-4 text-center">
          Inventarios Registrados
        </h1>
      )}

      <Modall
        ModalTitle="Agregar Stock"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedInventarioStock ? (
          selectedInventarioStock.fkElemento?.fkCaracteristica ? (
            <FormAgregateStock
              fkInventario={selectedInventarioStock.idInventario!}
              fkElemento={selectedInventarioStock.fkElemento.idElemento!}
              fkSitio={selectedInventarioStock.fkSitio.idSitio!}
              onClose={handleCloseUpdate}
            />
          ) : (
            <FormUpdate
              inventarios={InventariosWithKey ?? []}
              inventarioId={selectedInventarioStock.idInventario!}
              id="FormUpdate"
              onclose={handleCloseUpdate}
            />
          )
        ) : null}
      </Modall>
      <Modall
        ModalTitle="Códigos del Inventario"
        isOpen={isOpenCodigos}
        onOpenChange={handleCloseCodigos}
      >
        {inventarioCodigos && (
          <CodigoInventario
            idInventario={inventarioCodigos.idInventario!}
            tieneCaracteristicas={
              Array.isArray(inventarioCodigos.fkElemento?.fkCaracteristica)
                ? inventarioCodigos.fkElemento.fkCaracteristica.length > 0
                : !!inventarioCodigos.fkElemento?.fkCaracteristica
            }
            isOpen={isOpenCodigos}
            onClose={handleCloseCodigos}
          />
        )}
      </Modall>

      {userHasPermission(29) && InventariosWithKey && (
        <Globaltable
          data={InventariosWithKey}
          columns={columns ?? []}
          // onEdit={userHasPermission(30) ? handleEdit : undefined}
          onDelete={
            userHasPermission(31)
              ? (inventario) => handleState(inventario.idInventario)
              : undefined
          }
        />
      )}
    </div>
  );
};
