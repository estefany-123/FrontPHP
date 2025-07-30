import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Sitios/Formupdate";
import { useSitios } from "@/hooks/sitios/useSitios";
import { ListarSitios, Sitios } from "@/types/sitios";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import FormularioSitio from "@/components/organismos/Sitios/FormRegister";

const SitiosTable = () => {
  const { userHasPermission } = usePermissions();

  const { sitios, isLoading, isError, error, addSitio, changeState } =
    useSitios();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSitio, setSelectedSitio] = useState<Sitios | null>(null);

  const navigate = useNavigate();

  const handleGoToTipo = () => {
    navigate("/admin/tiposSitio");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSitio(null);
  };

  const handleState = async (id_sitio: number) => {
    await changeState(id_sitio);
  };

  const handleAddSitio = async (sitio: Sitios) => {
    try {
      await addSitio(sitio);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el sitio:", error);
    }
  };

  const handleEdit = (sitio: Sitios) => {
    setSelectedSitio(sitio);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<ListarSitios>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "persona_encargada", label: "persona_encargada" },
    { key: "ubicacion", label: "ubicacion" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (sitio: ListarSitios) => (
        <span>
          {sitio.created_at
            ? new Date(sitio.created_at).toLocaleDateString("es-ES", {
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
      label: "Fecha Actualización",
      render: (sitio: ListarSitios) => (
        <span>
          {sitio.updated_at
            ? new Date(sitio.updated_at).toLocaleDateString("es-ES", {
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

  const sitiosWithKey = sitios
    ?.filter((sitio) => sitio?.id_sitio !== undefined)
    .map((sitio) => ({
      ...sitio,
      key: sitio.id_sitio ? sitio.id_sitio.toString() : crypto.randomUUID(),
      id_sitio: sitio.id_sitio || 0,
      estado: Boolean(sitio.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Sitios</h1>
              <div className="flex gap-2">
                {userHasPermission(56) && (
                  <Buton text="Gestionar Tipos" onPress={handleGoToTipo} />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Sitio"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioSitio
          id="sitio-form"
          addData={handleAddSitio}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="sitio-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Sitio"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSitio && (
          <FormUpdate
            sitios={sitiosWithKey ?? []}
            sitioId={selectedSitio.id_sitio as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {userHasPermission(15) && sitiosWithKey && (
        <Globaltable
          data={sitiosWithKey}
          columns={columns}
          onEdit={
            userHasPermission(16)
              ? (item) => {
                  const sitioParaEditar: Sitios = {
                    ...item,
                    fk_area: item.fk_area?.idArea,
                  };
                  handleEdit(sitioParaEditar);
                }
              : undefined
          }
          onDelete={
            userHasPermission(17)
              ? (sitio) => handleState(sitio.id_sitio)
              : undefined
          }
          extraHeaderContent={
            <div>
              {userHasPermission(14) && (
                <Buton text="Añadir sitio" onPress={() => setIsOpen(true)} />
              )}
            </div>
          }
        />
      )}
    </div>
  );
};

export default SitiosTable;
