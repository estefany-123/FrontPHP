import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormCentros from "@/components/organismos/Centros/FormCentros";
import { useState } from "react";
import FormUpCentro from "@/components/organismos/Centros/FormUpCentro";
import { useCentro } from "@/hooks/Centros/useCentros";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";
import { Centro } from "@/types/Centro";
import usePermissions from "@/hooks/Usuarios/usePermissions";

const CentrosTable = () => {

  const { userHasPermission } = usePermissions();

  const { centros, isLoading, isError, error, addCentro, changeState } =
    useCentro();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Centro | null>(null);

  const navigate = useNavigate();

  const handleGoToMunicipio = () => {
    navigate("/admin/municipios");
  };

  const handleGoToSede = () => {
    navigate("/admin/sedes");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUser(null);
  };

  const handleState = async (centros: Centro) => {
    await changeState(centros.idCentro as number);
    console.log(centros.idCentro);
  };

  const handleAddCentro = async (centros: Centro) => {
    try {
      await addCentro(centros);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el centro:", error);
    }
  };

  const handleEdit = (centros: Centro) => {
    setSelectedUser(centros);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Centro>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creacion",
      render: (centro: Centro) => (
        <span>
          {centro.createdAt
            ? new Date(centro.createdAt).toLocaleDateString("es-ES", {
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
      render: (centro: Centro) => (
        <span>
          {centro.updatedAt
            ? new Date(centro.updatedAt).toLocaleDateString("es-ES", {
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

  const centrosWithKey = centros
    ?.filter((centros) => centros?.idCentro !== undefined)
    .map((centros) => ({
      ...centros,
      key: centros.idCentro ? centros.idCentro.toString() : crypto.randomUUID(),
      idCentro: centros.idCentro as number,
      estado: Boolean(centros.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Centros</h1>
              <div className="flex gap-2">
                {userHasPermission(44) &&
                  <Buton text="Sedes" onPress={handleGoToSede} />
                }
                {userHasPermission(52) &&

                  <Buton
                    text="Gestionar Municipios"
                    onPress={handleGoToMunicipio}
                  />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar centro"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormCentros
          id="user-form"
          addData={handleAddCentro}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="user-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Centro"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUser && (
          <FormUpCentro
            centros={centrosWithKey ?? []}
            centroId={selectedUser.idCentro as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(48) && centrosWithKey && (
        <Globaltable
          data={centrosWithKey}
          columns={columns}
          onEdit={userHasPermission(49) ? handleEdit : undefined}
          onDelete={userHasPermission(50) ? handleState : undefined}
          extraHeaderContent={
            <div>
              {userHasPermission(47) &&
                <Buton text="Añadir Centro" onPress={() => setIsOpen(true)} />
              }
            </div>
          }
        />
      )}
    </div>
  );
};

export default CentrosTable;
