import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormTipos from "@/components/organismos/TiposSitio/FormTipos";
import { useState } from "react";
import FormUpTipos from "@/components/organismos/TiposSitio/FormUpTipos";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { TipoSitio } from "@/types/TipoSitio";

const TipoSitioTable = () => {
  const { tipos, isLoading, isError, error, addTipo, changeState } =
    useTipoSitio();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TipoSitio | null>(null);

  const navigate = useNavigate();

  const handleGoToSitio = () => {
    navigate("/admin/sitios");
  };
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUser(null);
  };

  const handleState = async (tipos: TipoSitio) => {
    await changeState(tipos.idTipo as number);
    console.log(tipos.idTipo);
  };

  const handleAddCentro = async (tipos: TipoSitio) => {
    try {
      await addTipo(tipos);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el tipo de sitio:", error);
    }
  };

  const handleEdit = (tipos: TipoSitio) => {
    setSelectedUser(tipos);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<TipoSitio>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha Creacion",
      render: (tipoSitio: TipoSitio) => (
        <span>
          {tipoSitio.createdAt
            ? new Date(tipoSitio.createdAt).toLocaleDateString("es-ES", {
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
      render: (tipoSitio: TipoSitio) => (
        <span>
          {tipoSitio.updatedAt
            ? new Date(tipoSitio.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const tiposWithKey = tipos
    ?.filter((tipos) => tipos?.idTipo !== undefined)
    .map((tipos) => ({
      ...tipos,
      key: tipos.idTipo ? tipos.idTipo.toString() : crypto.randomUUID(),
      idTipo: tipos.idTipo as number,
      estado: Boolean(tipos.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Tipos de Sitio</h1>
              <div className="flex gap-2">
                <Buton text="Sitios" onPress={handleGoToSitio} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar Tipo de sitio"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormTipos
          id="tipo-form"
          addData={handleAddCentro}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="tipo-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Tipo Sitio"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUser && (
          <FormUpTipos
            tipos={tiposWithKey ?? []}
            tipoSitioId={selectedUser.idTipo as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {tiposWithKey && (
        <Globaltable
          data={tiposWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton
              text="Añadir Tipo de sitio"
              onPress={() => setIsOpen(true)}
            />
          }
        />
      )}
    </div>
  );
};

export default TipoSitioTable;
