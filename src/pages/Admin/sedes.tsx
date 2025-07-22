import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useSede } from "@/hooks/sedes/useSedes";
import { Card, CardBody } from "@heroui/react";
import { Sede } from "@/types/sedes";
import { useNavigate } from "react-router-dom";
import { FormUpdate } from "@/components/organismos/Sedes/Formupdate";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import FormularioSede from "@/components/organismos/Sedes/FormRegister";

const SedeTable = () => {


  const { userHasPermission } = usePermissions();


  const { sede, isLoading, isError, error, addSede, changeState } = useSede();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);

  const navigate = useNavigate();

  const handleGoToCentro = () => {
    navigate("/admin/centros");
  };
  const handleGoToArea = () => {
    navigate("/admin/areas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSede(null);
  };

  const handleState = async (sede: Sede) => {
    const idSede = sede.idSede ?? 0;
    await changeState(idSede);
  };

  const handleAddSede = async (sede: Sede) => {
    try {
      const idSede = sede.idSede ?? 0;
      await addSede({ ...sede, idSede });
      handleClose();
    } catch (error) {
      console.error("Error al agregar la sede:", error);
    }
  };

  const handleEdit = (sede: Sede) => {
    setSelectedSede(sede);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Sede>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha CReacion",
      render: (sede: Sede) => (
        <span>
          {sede.createdAt
            ? new Date(sede.createdAt).toLocaleDateString("es-ES", {
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
      render: (sede: Sede) => (
        <span>
          {sede.updatedAt
            ? new Date(sede.updatedAt).toLocaleDateString("es-ES", {
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

  const sedeWithKey = sede
    ?.filter((sede) => sede?.idSede !== undefined)
    .map((sede) => ({
      ...sede,
      key: sede.idSede ? sede.idSede.toString() : crypto.randomUUID(),
      idSede: sede.idSede || 0,
      estado: Boolean(sede.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Sedes</h1>
              <div className="flex gap-2">
                {userHasPermission(11) &&
                  <Buton text="Areas" onPress={handleGoToArea} />
                }
                {userHasPermission(48) &&
                  <Buton text="Gestionar Centros" onPress={handleGoToCentro} />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar sede"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioSede
          id="sede-form"
          addData={handleAddSede}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="sede-form"
            className="w-full rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar sede"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSede && (
          <FormUpdate
            sedes={sedeWithKey ?? []}
            sedeId={selectedSede.idSede as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(44) && sedeWithKey && (
        <Globaltable
          data={sedeWithKey}
          columns={columns}
          onEdit={userHasPermission(45) ? handleEdit : undefined}
          onDelete={userHasPermission(46) ? handleState : undefined}
          extraHeaderContent={
            <div>
              {userHasPermission(43) &&
                <Buton text="Añadir sede" onPress={() => setIsOpen(true)} />
              }
            </div>
          }
        />
      )}
    </div>
  );
};

export default SedeTable;
