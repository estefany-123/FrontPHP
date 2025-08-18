import Globaltable from "@/components/organismos/table.tsx";
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { Elemento } from "@/types/Elemento";
import { FormUpdate } from "@/components/organismos/Elementos/FormUpdate";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { ElementoCreate } from "@/schemas/Elemento";
import FormularioElementos from "@/components/organismos/Elementos/FormRegister";

export const ElementosTable = () => {

  const { elementos, isLoading, isError, error, addElemento, changeState } =
    useElemento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedElemento, setSelectedElemento] = useState<Elemento | null>(
    null
  );

  const navigate = useNavigate();

  const handleGoToUnidad = () => {
    navigate("/bodega/unidades");
  };
  const handleGoToCategoria = () => {
    navigate("/bodega/categorias");
  };
  const handleGoToCaracteristica = () => {
    navigate("/bodega/caracteristicas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedElemento(null);
  };

  const handleState = async (id_elemento: number) => {
    await changeState(id_elemento);
  };

  const handleAddElemento = async (
    elemento: ElementoCreate
  ): Promise<{ id_elemento: number }> => {
    try {
      const response = await addElemento(elemento);
      if (!response || !response.id_elemento) {
        throw new Error(
          "No se pudo agregar el elemento. La respuesta no contiene id_elemento."
        );
      }
      handleClose(); // Cierra el modal solo si se ha agregado correctamente
      return { id_elemento: response.id_elemento };
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      throw new Error("Error al agregar el elemento: ");
    }
  };

  const handleEdit = (elemento: Elemento) => {
    setSelectedElemento(elemento);
    setIsOpenUpdate(true);
  };

  const columns: TableColumn<Elemento>[] = [
    {
      label: "Imagen",
      key: "imagen_elemento",
      render: (item: Elemento) => {
        const imagen_elemento = item.imagen_elemento;
        console.log(imagen_elemento);
  
        return imagen_elemento ? (
          <img
            src={`http://localhost:8000/${imagen_elemento}`}
            alt="Imagen"
            width={200}
            height={50}
          />
        ) : (
          <span>Sin imagen_elemento</span>
        );
      },
    },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    {
      key: "tipoElemento",
      label: "Tipo Elemento",
      render: (elementos: Elemento) => (
        <span>
          {elementos.perecedero
            ? "Perecedero"
            : elementos.no_perecedero
              ? "No Perecedero"
              : "No Especificado"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (elemento: Elemento) => (
        <span>
          {elemento.created_at
            ? new Date(elemento.created_at).toLocaleDateString("es-ES", {
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
      render: (elemento: Elemento) => (
        <span>
          {elemento.updated_at
            ? new Date(elemento.updated_at).toLocaleDateString("es-ES", {
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

  const ElementosWithKey = elementos
    ?.filter((elemento) => elemento?.id_elemento !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_elemento
        ? elemento.id_elemento.toString()
        : crypto.randomUUID(),
      id_elemento: elemento.id_elemento || 0,
      estado: Boolean(elemento.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Elementos</h1>
              <div className="flex gap-2">
                <Buton text="Gestionar Unidad" onPress={handleGoToUnidad} />
                <Buton
                  text="Gestionar Categoria"
                  onPress={handleGoToCategoria}
                />
                <Buton
                  text="Gestionar Caracteristica"
                  onPress={handleGoToCaracteristica}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Elemento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioElementos
          id="element-form"
          addData={handleAddElemento}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="element-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Elemento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedElemento && (
          <FormUpdate
            elementos={ElementosWithKey ?? []}
            elementoId={selectedElemento.id_elemento as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      <Globaltable
        data={ElementosWithKey ?? []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(elemento) => handleState(elemento.id_elemento)}
        extraHeaderContent={
          <div>
            {<Buton text="Nuevo elemento" onPress={() => setIsOpen(true)} />}
          </div>
        }
      />
    </div>
  );
};
