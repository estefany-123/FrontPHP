import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useFichas } from "@/hooks/fichas/useFichas";
import { Ficha } from "@/types/Ficha";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FormUpdateFicha } from "@/components/organismos/fichas/Formupdate";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import FormularioFichas from "@/components/organismos/fichas/FormRegister";


const FichasTable = () => {

  const { userHasPermission } = usePermissions();

  const { fichas, isLoading, isError, error, addFicha, changeState } =
    useFichas();

  // Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);
  const navigate = useNavigate();

  const handleGoToPrograma = () => {
    navigate("/admin/programas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedFicha(null);
  };

  const handleState = async (idFicha: number) => {
    await changeState(idFicha);
  };

  const handleAddFicha = async (ficha: Ficha) => {
    try {
      await addFicha(ficha);
      handleClose();
    } catch (error) {
      console.error("Error al agregar la ficha:", error);
    }
  };

  const handleEdit = (ficha: Ficha) => {
    setSelectedFicha(ficha);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Ficha>[] = [
    { key: "codigoFicha", label: "Codigo ficha" },
    {
      key: "createdAt",
      label: "Fecha CReacion",
      render: (ficha: Ficha) => (
        <span>
          {ficha.createdAt
            ? new Date(ficha.createdAt).toLocaleDateString("es-ES", {
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
      render: (ficha: Ficha) => (
        <span>
          {ficha.updatedAt
            ? new Date(ficha.updatedAt).toLocaleDateString("es-ES", {
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

  const fichasWithKey = fichas
    ?.filter(
      (ficha) =>
        ficha?.idFicha !== undefined && ficha?.createdAt && ficha?.updatedAt
    )
    .map((ficha) => ({
      ...ficha,
      key: ficha.idFicha ? ficha.idFicha.toString() : crypto.randomUUID(),
      idFicha: ficha.idFicha || 0,
      estado: Boolean(ficha.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Fichas</h1>
              <div className="flex gap-2">
                {userHasPermission(40) && //listar programas
                  <Buton
                    text="Gestionar Programas"
                    onPress={handleGoToPrograma}
                  />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar Ficha"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioFichas
          id="ficha-form"
          addData={handleAddFicha}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="ficha-form"
            className="w-full rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Ficha"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedFicha && (
          <FormUpdateFicha
            fichas={fichasWithKey ?? []}
            fichaId={selectedFicha.idFicha as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(7) && fichasWithKey && ( //listar
        <Globaltable
          data={fichasWithKey}
          columns={columns}
          onEdit={userHasPermission(8) ? handleEdit : undefined}
          onDelete={userHasPermission(9) ? (ficha) => handleState(ficha.idFicha) : undefined}
          extraHeaderContent={
            <div>
              {userHasPermission(6) &&
                <Buton text="Añadir Ficha" onPress={() => setIsOpen(true)} />
              }
            </div>
          }
        />
      )}
    </div>
  );
};

export default FichasTable;
