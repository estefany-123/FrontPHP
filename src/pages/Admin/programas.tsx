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

  const handleState = async (id_programa: number) => {
    await changeState(id_programa);
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
      key: "created_at",
      label: "Fecha Creación",
      render: (programa: Pformacion) => (
        <span>
          {programa.created_at
            ? new Date(programa.created_at).toLocaleDateString("es-ES", {
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
      label: "Fecha Actualizacion",
      render: (programa: Pformacion) => (
        <span>
          {programa.updated_at
            ? new Date(programa.updated_at).toLocaleDateString("es-ES", {
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
        programa?.id_programa !== undefined &&
        programa?.created_at &&
        programa?.updated_at
    )
    .map((programa) => ({
      ...programa,
      key: programa.id_programa
        ? programa.id_programa.toString()
        : crypto.randomUUID(),
      id_programa: programa.id_programa || 0,
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
                <Buton text="Fichas" onPress={handleGoToFicha} />
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
            programaId={selectedPrograma.id_programa as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      <Globaltable
        data={usersWithKey ?? []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(programa) => handleState(programa.id_programa)}
        extraHeaderContent={
          <div>
            <Buton text="Añadir Programa" onPress={() => setIsOpen(true)} />
          </div>
        }
      />
    </div>
  );
};

export default ProgramasTable;
