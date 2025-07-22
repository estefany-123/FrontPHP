import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { Pformacion } from "@/types/programaFormacion";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormUpdate } from "@/components/organismos/Programas/Formupdate";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import FormularioPrograma from "@/components/organismos/Programas/FormRegister";

const ProgramasTable = () => {

  const { userHasPermission } = usePermissions();

  const { programas, isLoading, isError, error, addPrograma, changeState } =
    usePrograma();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<Pformacion | null>(
    null
  );

  const navigate = useNavigate();

  const handleGoToFicha = () => {
    navigate("/admin/fichas");
  };
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedPrograma(null);
  };

  const handleState = async (idPrograma: number) => {
    await changeState(idPrograma);
  };

  const handleAddPrograma = async (programa: Pformacion) => {
    try {
      await addPrograma(programa);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el programa:", error);
    }
  };

  const handleEdit = (programa: Pformacion) => {
    setSelectedPrograma(programa);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Pformacion>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (programa: Pformacion) => (
        <span>
          {programa.createdAt
            ? new Date(programa.createdAt).toLocaleDateString("es-ES", {
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
      render: (programa: Pformacion) => (
        <span>
          {programa.updatedAt
            ? new Date(programa.updatedAt).toLocaleDateString("es-ES", {
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

  const usersWithKey = programas
    ?.filter(
      (programa) =>
        programa?.idPrograma !== undefined &&
        programa?.createdAt &&
        programa?.updatedAt
    )
    .map((programa) => ({
      ...programa,
      key: programa.idPrograma
        ? programa.idPrograma.toString()
        : crypto.randomUUID(),
      idPrograma: programa.idPrograma || 0,
      estado: Boolean(programa.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Fichas</h1>
              <div className="flex gap-2">
                {userHasPermission(7) &&
                  <Buton text="Fichas" onPress={handleGoToFicha} />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Programa"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioPrograma
          id="programa-form"
          addData={handleAddPrograma}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="programa-form"
          className="rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Programa"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedPrograma && (
          <FormUpdate
            programas={usersWithKey ?? []}
            programaId={selectedPrograma.idPrograma as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(40) && usersWithKey && (
        <Globaltable
          data={usersWithKey}
          columns={columns}
          onEdit={userHasPermission(41) ? handleEdit : undefined}
          onDelete={userHasPermission(42) ? (programa) => handleState(programa.idPrograma) : undefined}
          extraHeaderContent={
            <div>
              {userHasPermission(39) &&
                <Buton text="Añadir Programa" onPress={() => setIsOpen(true)} />
              }
            </div>
          }
        />
      )}
    </div>
  );
};

export default ProgramasTable;
