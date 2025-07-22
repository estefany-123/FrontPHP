import Globaltable from "@/components/organismos/table.tsx"; 
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { Area } from "@/types/area";
import { useAreas } from "@/hooks/areas/useAreas";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormUpdate } from "@/components/organismos/areas/Formupdate";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import FormularioArea from "@/components/organismos/areas/FormRegister";

const AreaTable = () => {

  const { userHasPermission } = usePermissions();

  const { areas, isLoading, isError, error, addArea, changeState } = useAreas();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const navigate = useNavigate();

  const handleGoToSede = () => {
    navigate("/admin/sedes");
  };
  const handleGoToUsuario = () => {
    navigate("/admin/usuarios");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedArea(null);
  };

  const handleState = async (idArea: number) => {
    await changeState(idArea);
  };

  const handleAddArea = async (area: Area) => {
    try {
      const areaToAdd = { ...area, idArea: area.idArea || 0 };
      await addArea(areaToAdd);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el area:", error);
    }
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Area>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (Area: Area) => (
        <span>
          {Area.createdAt
            ? new Date(Area.createdAt).toLocaleDateString("es-ES", {
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
      label: "Fecha Actualizacion",
      render: (Area: Area) => (
        <span>
          {Area.updatedAt
            ? new Date(Area.updatedAt).toLocaleDateString("es-ES", {
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

  const areasWithKey = areas
    ?.filter(
      (area) => area?.idArea !== undefined && area?.createdAt && area?.updatedAt
    )
    .map((area) => ({
      ...area,
      key: area.idArea ? area.idArea.toString() : crypto.randomUUID(), // Asegurando que el key sea único
      estado: Boolean(area.estado), // Asegurar que estado sea un booleano
      idArea: area.idArea || 0, // Asegurar que idArea no sea undefined, asignando 0 si es necesario
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Areas</h1>
              <div className="flex gap-2">
                {userHasPermission(44) &&
                  <Buton text="Gestionar Sedes" onPress={handleGoToSede} />
                }
                {userHasPermission(3) &&
                  <Buton text="Gestionar Usuarios" onPress={handleGoToUsuario} />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Area"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioArea
          id="area-form"
          addData={handleAddArea}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="area-form"
            className="w-full rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Area"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedArea && (
          <FormUpdate
            areas={areasWithKey ?? []}
            areaId={selectedArea.idArea as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(11) && areasWithKey && (
        <Globaltable
          data={areasWithKey}
          columns={columns}
          onEdit={userHasPermission(12) ? handleEdit : undefined}
          onDelete={userHasPermission(13) ? (area) => handleState(area.idArea) : undefined}
          extraHeaderContent={
            <div>
              {userHasPermission(10) &&
              <Buton text="Añadir Area" onPress={() => setIsOpen(true)} />
              }
            </div>

          }
        />
      )}
    </div>
  );
};

export default AreaTable;
