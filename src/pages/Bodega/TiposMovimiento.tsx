import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { FormUpdate } from "@/components/organismos/TiposMovimiento/FormUpdate";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import FormularioTiposMovimiento from "@/components/organismos/TiposMovimiento/FormRegister";

export const TipoMovimientoTable = () => {
  const { tipos, isLoading, isError, error, addTipoMovimiento, changeState } =
    useTipoMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedTipoMovimiento, setSelectedTipoMovimiento] =
    useState<TipoMovimiento | null>(null);

  const navigate = useNavigate();

  const handleGoToElemento = () => {
    navigate("/bodega/movimientos");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedTipoMovimiento(null);
  };

  const handleState = async (idTipo: number) => {
    await changeState(idTipo);
  };

  const handleAddTipoMovimiento = async (tipo: TipoMovimiento) => {
    try {
      await addTipoMovimiento(tipo);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el tipo de movimiento:", error);
    }
  };

  const handleEdit = (tipo: TipoMovimiento) => {
    setSelectedTipoMovimiento(tipo);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<TipoMovimiento>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (tipo: TipoMovimiento) => (
        <span>
          {tipo.createdAt
            ? new Date(tipo.createdAt).toLocaleDateString("es-ES", {
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
      render: (tipo: TipoMovimiento) => (
        <span>
          {tipo.updatedAt
            ? new Date(tipo.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const TipoMovimientosWithKey = tipos
    ?.filter((tipo) => tipo?.idTipo !== undefined)
    .map((tipo) => ({
      ...tipo,
      key: tipo.idTipo ? tipo.idTipo.toString() : crypto.randomUUID(),
      idTipo: tipo.idTipo || 0,
      estado: Boolean(tipo.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Tipos</h1>
              <div className="flex gap-2">
                <Buton
                  text="Movimientos"
                  className="rounded-xl"
                  onPress={handleGoToElemento}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Tipo de Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioTiposMovimiento
          id="tipo-form"
          addData={handleAddTipoMovimiento}
          onClose={handleClose}
        />
        <div>
          <Buton
            text="Guardar"
            type="submit"
            form="tipo-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Tipo de Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedTipoMovimiento && (
          <FormUpdate
            tipos={TipoMovimientosWithKey ?? []}
            tipoId={selectedTipoMovimiento.idTipo as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {TipoMovimientosWithKey && (
        <Globaltable
          data={TipoMovimientosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(tipo) => handleState(tipo.idTipo)}
          extraHeaderContent={
            <Buton text="Nuevo tipo" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};
