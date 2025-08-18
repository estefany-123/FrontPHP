import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Select, SelectItem } from "@heroui/react";
import { ElementoUpdateSchema, ElementoUpdate } from "@/schemas/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";
import Buton from "@/components/molecules/Button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioUnidades from "../UnidadesMedida/FormRegister";
import FormCategorias from "../Categorias/FormCategorias";
import FormularioCaracteristicas from "../Caracteristicas/FormRegister";
import { useState } from "react";

type Props = {
  elementos: ElementoUpdate[];
  elementoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ elementos, elementoId, id, onclose }: Props) => {
  const { updateElemento, getElementoById } = useElemento();
  const {
    unidades,
    isLoading: loadingUnidad,
    isError: errorUnidad,
    addUnidad,
  } = useUnidad();
  const {
    categorias,
    isLoading: loadingCategoria,
    isError: errorCategoria,
    addCategoria,
  } = useCategoria();
  const {
    caracteristicas,
    isLoading: loadingCaracteristica,
    isError: errorCaracteristica,
    addCaracteristica,
  } = useCaracteristica();

  const [showModal, setShowModal] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalCaracteristica, setShowModalCaracteristica] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseCategoria = () => setShowModalCategoria(false);
  const handleCloseCaracteristica = () => setShowModalCaracteristica(false);

  const foundElemento = getElementoById(
    elementoId,
    elementos
  ) as ElementoUpdate;

  const normalizedElemento = {
    ...foundElemento,
    fk_unidad_medida:
      typeof foundElemento.fk_unidad_medida === "object" &&
      foundElemento.fk_unidad_medida !== null
        ? (foundElemento.fk_unidad_medida as { id_unidad: number }).id_unidad
        : foundElemento.fk_unidad_medida,

    fk_categoria:
      typeof foundElemento.fk_categoria === "object" &&
      foundElemento.fk_categoria !== null
        ? (foundElemento.fk_categoria as { id_categoria: number }).id_categoria
        : foundElemento.fk_categoria,

    fk_caracteristica:
      typeof foundElemento.fk_caracteristica === "object" &&
      foundElemento.fk_caracteristica !== null
        ? (foundElemento.fk_caracteristica as { id_caracteristica: number })
            .id_caracteristica
        : foundElemento.fk_caracteristica,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ElementoUpdate>({
    resolver: zodResolver(ElementoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_elemento: normalizedElemento.id_elemento,
      nombre: normalizedElemento.nombre,
      descripcion: normalizedElemento.descripcion,
      imagen_elemento: normalizedElemento.imagen_elemento,
      fk_unidad_medida: normalizedElemento.fk_unidad_medida,
      fk_categoria: normalizedElemento.fk_categoria,
      fk_caracteristica: normalizedElemento.fk_caracteristica,
    },
  });

  const fk_unidad_medida = watch("fk_unidad_medida");
  const fk_categoria = watch("fk_categoria");
  const fk_caracteristica = watch("fk_caracteristica");

  console.log("yfhbdj fkuni:", foundElemento.fk_unidad_medida);

  const imagen_elemento = watch("imagen_elemento");

  const onSubmit = async (data: ElementoUpdate) => {
    if (!data.id_elemento) return;
    try {
      await updateElemento(data.id_elemento, data);
      onclose();
      addToast({
        title: "Elemento actualizado",
        description:
          "Los datos del elemento fueron actualizados correctamente.",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el Elemento", error);
    }
  };
  console.log("Errores", errors);
  return (
    <>
      <Form
        id={id}
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Nombre"
          placeholder="Nombre del elemento"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Input
          label="Descripción"
          placeholder="Descripción del elemento"
          {...register("descripcion")}
          isInvalid={!!errors.descripcion}
          errorMessage={errors.descripcion?.message}
        />

        {imagen_elemento && typeof imagen_elemento === "string" && (
          <div className="flex justify-center">
            <img
              src={`http://localhost:8000/${imagen_elemento}`}
              alt="Imagen actual"
              className="w-40 h-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        {imagen_elemento instanceof File && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(imagen_elemento)}
              alt="Nueva imagen"
              className="w-40 h-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        <Input
          label="Imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("imagen_elemento", file);
          }}
        />

        {/* Unidad de medida */}
        {!loadingUnidad && !errorUnidad && unidades && (
          <div className="w-full flex">
            <Select
              label="Unidad de medida"
              selectedKeys={
                fk_unidad_medida ? [fk_unidad_medida.toString()] : []
              }
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fk_unidad_medida", id);
              }}
            >
              {unidades.map((unidad) => (
                <SelectItem
                  key={unidad.id_unidad?.toString()}
                  textValue={unidad.nombre}
                >
                  {unidad.nombre}
                </SelectItem>
              ))}
            </Select>
            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModal(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        {!loadingCategoria && !errorCategoria && categorias && (
          <div className="w-full flex">
            <Select
              label="Categoría"
              selectedKeys={fk_categoria ? [fk_categoria.toString()] : []}
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fk_categoria", id);
              }}
            >
              {categorias.map((cat) => (
                <SelectItem
                  key={cat.id_categoria?.toString()}
                  textValue={cat.nombre}
                >
                  {cat.nombre}
                </SelectItem>
              ))}
            </Select>
            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModalCategoria(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        {!loadingCaracteristica && !errorCaracteristica && caracteristicas && (
          <div className="w-full flex">
            <Select
              label="Característica"
              selectedKeys={
                fk_caracteristica ? [fk_caracteristica.toString()] : []
              }
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fk_caracteristica", id);
              }}
            >
              {caracteristicas.map((carac) => (
                <SelectItem
                  key={carac.id_caracteristica?.toString()}
                  textValue={carac.nombre}
                >
                  {carac.nombre}
                </SelectItem>
              ))}
            </Select>

            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModalCaracteristica(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full rounded-xl"
        />
      </Form>
      <Modal
        ModalTitle="Agregar Unidad"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioUnidades
          id="unidad"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addUnidad(data);
          }}
        />
        <Buton form="unidad" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Categoria"
        isOpen={showModalCategoria}
        onOpenChange={handleCloseCategoria}
      >
        <FormCategorias
          id="categoria"
          onClose={() => setShowModalCategoria(false)}
          addData={async (data) => {
            await addCategoria(data);
          }}
        />
        <Buton form="categoria" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Caracteristica"
        isOpen={showModalCaracteristica}
        onOpenChange={handleCloseCaracteristica}
      >
        <FormularioCaracteristicas
          id="caracteristica"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addCaracteristica(data);
          }}
        />
        <Buton form="caracteristica" text="Guardar" type="submit" />
      </Modal>
    </>
  );
};
