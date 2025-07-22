import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { Movimiento } from "@/types/Movimiento";
import Formulario from "@/components/organismos/Movimientos/FormRegister";
import { FormUpdate } from "@/components/organismos/Movimientos/FormUpdate";
import { Chip } from "@heroui/chip";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";
import usePermissions from "@/hooks/Usuarios/usePermissions";

export const MovimientoTable = () => {
  const { userHasPermission } = usePermissions();

  const { movimientos, isLoading, isError, error, addMovimiento } =
    useMovimiento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<Movimiento | null>(null);

  const navigate = useNavigate();

  const handleGoToTipo = () => {
    navigate("/bodega/tipos");
  };
  const handleGoToSitio = () => {
    navigate("/admin/sitios");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMovimiento(null);
  };

  const handleAddMovimiento = async (movimiento: Movimiento) => {
    try {
      await addMovimiento(movimiento);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el movimiento:", error);
    }
  };

  const handleEdit = (movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Movimiento>[] = [
    { key: "descripcion", label: "Descripcion" },
    { key: "cantidad", label: "Cantidad" },
    { key: "horaIngreso", label: "Ingreso" },
    { key: "horaSalida", label: "Salida" },
    {
      key: "tipo_bien",
      label: "Tipo Movimiento",
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.devolutivo
            ? "Devolutivo"
            : movimiento.noDevolutivo
              ? "No Devolutivo"
              : "No especificado"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.createdAt
            ? new Date(movimiento.createdAt).toLocaleDateString("es-ES", {
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
      render: (movimiento: Movimiento) => (
        <span>
          {movimiento.updatedAt
            ? new Date(movimiento.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (item) => {
        if (item.aceptado)
          return (
            <Chip color="success" variant="flat">
              Aceptado
            </Chip>
          );
        if (item.cancelado)
          return (
            <Chip color="danger" variant="flat">
              Cancelado
            </Chip>
          );
        if (item.enProceso)
          return (
            <Chip color="warning" variant="flat">
              Pendiente
            </Chip>
          );
        return <Chip color="default">Sin estado</Chip>;
      },
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const MovimientoWithKey = movimientos
    ?.filter((movimiento) => movimiento?.idMovimiento !== undefined)
    .map((movimiento) => ({
      ...movimiento,
      key: movimiento.idMovimiento
        ? movimiento.idMovimiento.toString()
        : crypto.randomUUID(),
      idMovimiento: movimiento.idMovimiento || 0,
    }));

    console.log("🧾 Datos para la tabla MovimientoWithKey:", MovimientoWithKey);

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Movimientos</h1>
              <div className="flex gap-2">
                {userHasPermission(72) && (
                  <Buton
                    text="Gestionar Tipos Movimiento"
                    className="rounded-xl"
                    onPress={handleGoToTipo}
                  />
                )}
                {userHasPermission(15) && (
                  <Buton
                    text="Gestionar Sitios"
                    className="rounded-xl"
                    onPress={handleGoToSitio}
                  />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Registrar Nuevo Movimiento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="movimiento-form"
          addData={handleAddMovimiento}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="movimiento-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Movimiento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMovimiento && (
          <FormUpdate
            movimientos={
              MovimientoWithKey?.map((mov) => ({
                ...mov,
                fechaDevolucion: mov.fechaDevolucion
                  ? typeof mov.fechaDevolucion === "string"
                    ? mov.fechaDevolucion
                    : mov.fechaDevolucion.toISOString().split("T")[0]
                  : undefined,
              })) ?? []
            }
            movimientoId={selectedMovimiento.idMovimiento as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(23) && MovimientoWithKey && (
        <Globaltable
          data={MovimientoWithKey}
          columns={columns}
          onEdit={userHasPermission(24) ? handleEdit : undefined}
          showEstado={false}
          extraHeaderContent={
            <div>
              {userHasPermission(22) && (
                <Buton
                  text="Nuevo Movimiento"
                  onPress={() => setIsOpen(true)}
                />
              )}
            </div>
          }
        />
      )}
    </div>
  );
};
