import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormMunicipios from "@/components/organismos/Municipio/FormMunicipios";
import { useState } from "react";
import FormUpMunicipio from "@/components/organismos/Municipio/FormUpMunicipio";
import { Municipio } from "@/types/Municipio";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

const MunicipiosTable = () => {

  
  const { municipios, isLoading, isError, error, addMunicipio, changeState } =
    useMunicipio();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(
    null
  );

  const navigate = useNavigate();

  const handleGoToCentro = () => {
    navigate("/admin/centros");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedMunicipio(null);
  };

  const handleState = async (municipios: Municipio) => {
    await changeState(municipios.idMunicipio as number);
    console.log(municipios.idMunicipio);
  };

  const handleAddMunicipio = async (municipios: Municipio) => {
    try {
      await addMunicipio(municipios);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el municipio:", error);
    }
  };

  const handleEdit = (municipios: Municipio) => {
    setSelectedMunicipio(municipios);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Municipio>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "departamento", label: "Departamento" },
    {
          key: "createdAt",
          label: "Fecha Creacion",
          render: (municipio: Municipio) => (
            <span>
              {municipio.createdAt
                ? new Date(municipio.createdAt).toLocaleDateString("es-ES", {
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
          render: (municipio: Municipio) => (
            <span>
              {municipio.updatedAt
                ? new Date(municipio.updatedAt).toLocaleDateString("es-ES", {
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

  const municipiosWithKey = municipios
    ?.filter((municipios) => municipios?.idMunicipio !== undefined)
    .map((municipios) => ({
      ...municipios,
      key: municipios.idMunicipio
        ? municipios.idMunicipio.toString()
        : crypto.randomUUID(),
      estado: Boolean(municipios.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Municipios</h1>
              <div className="flex gap-2">
                <Buton text="Centros" onPress={handleGoToCentro} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar municipio"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormMunicipios
          id="municipio-form"
          addData={handleAddMunicipio}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="municipio-form"
          className=" w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Municipio"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedMunicipio && (
          <FormUpMunicipio
            municipios={municipiosWithKey ?? []}
            municipioId={selectedMunicipio.idMunicipio as number}
            id="FormUpMuni"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {municipiosWithKey && (
        <Globaltable
          data={municipiosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton text="Añadir Municipio" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default MunicipiosTable;
