import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Form } from "@heroui/form";
import { addToast, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { ElementoCreate, ElementoCreateSchema } from "@/schemas/Elemento";
import { useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioUnidades from "../UnidadesMedida/FormRegister";
import FormCategorias from "../Categorias/FormCategorias";
import FormularioCaracteristicas from "../Caracteristicas/FormRegister";

type FormularioProps = {
  addData: (elemento: ElementoCreate) => Promise<{ idElemento: number }>;
  onClose: () => void;
  id: string;
};

export default function FormularioElementos({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ElementoCreate>({
    resolver: zodResolver(ElementoCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { unidades, addUnidad } = useUnidad();
  const { categorias, addCategoria } = useCategoria();
  const { caracteristicas, addCaracteristica } = useCaracteristica();

  const tipoElemento = watch("tipoElemento");
  const [tieneCaracteristica, setTieneCaracteristica] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalCaracteristica, setShowModalCaracteristica] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseCategoria = () => setShowModalCategoria(false);
  const handleCloseCaracteristica = () => setShowModalCaracteristica(false);

  const onSubmit = async (data: ElementoCreate) => {
    try {
      await addData({
        ...data,
        estado: data.estado,
        tipoElemento: data.tipoElemento as "perecedero" | "noPerecedero",
        fkCaracteristica: tieneCaracteristica
          ? data.fkCaracteristica
          : undefined,
      });

      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Elemento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
    }
  };
  console.log("Errores", errors);
  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          label="Nombre"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />
        <Input
          label="Descripción"
          placeholder="Descripción"
          {...register("descripcion")}
          isInvalid={!!errors.descripcion}
          errorMessage={errors.descripcion?.message}
        />

        <Controller
          control={control}
          name="tipoElemento"
          render={({ field }) => (
            <Select
              label="Tipo de Elemento"
              placeholder="Selecciona tipo"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                setValue("perecedero", value === "perecedero");
                setValue("noPerecedero", value === "noPerecedero");
              }}
              isInvalid={!!errors.tipoElemento}
              errorMessage={errors.tipoElemento?.message}
            >
              <SelectItem key="perecedero">Perecedero</SelectItem>
              <SelectItem key="noPerecedero">No Perecedero</SelectItem>
            </Select>
          )}
        />

        {tipoElemento === "perecedero" && (
          <Controller
            control={control}
            name="fechaVencimiento"
            render={({ field }) => (
              <Input
                type="date"
                label="Fecha de Vencimiento"
                {...field}
                isInvalid={!!errors.fechaVencimiento}
                errorMessage={errors.fechaVencimiento?.message}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder="Seleccione un estado"
              {...field}
              value={field.value ? "true" : "false"}
              onChange={(e) => field.onChange(e.target.value === "true")}
              isInvalid={!!errors.estado}
              errorMessage={errors.estado?.message}
              isDisabled
              defaultSelectedKeys={["true"]}
            >
              <SelectItem key="true">Activo</SelectItem>
              <SelectItem key="false">Inactivo</SelectItem>
            </Select>
          )}
        />

        <Input
          label="Imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? undefined;
            setValue("imagen", file);
          }}
        />

        <Controller
          control={control}
          name="fkUnidadMedida"
          render={({ field }) => (
            <div className="w-full flex">
              <Select
                label="Unidad"
                {...field}
                className="w-full"
                placeholder="Selecciona una unidad de medida..."
                aria-label="Seleccionar Unidad de Medida"
                onChange={(e) => field.onChange(Number(e.target.value))}
                isInvalid={!!errors.fkUnidadMedida}
                errorMessage={errors.fkUnidadMedida?.message}
              >
                {unidades?.length ? (
                  unidades
                    .filter((u) => u.estado === true)
                    .map((unidad) => (
                      <SelectItem
                        key={unidad.idUnidad}
                        textValue={unidad.nombre}
                      >
                        {unidad.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>
                    No hay unidades disponibles
                  </SelectItem>
                )}
              </Select>
              <Buton
                type="button"
                className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl "
                onPress={() => setShowModal(true)}
              >
                <PlusCircleIcon />
              </Buton>
            </div>
          )}
        />

        <Controller
          control={control}
          name="fkCategoria"
          render={({ field }) => (
            <div className="w-full flex">
              <Select
                label="Categoria"
                {...field}
                className="w-full"
                placeholder="Selecciona una categoría..."
                aria-label="Seleccionar Categoría"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  field.onChange(value);
                }}
                isInvalid={!!errors.fkCategoria}
                errorMessage={errors.fkCategoria?.message}
              >
                {categorias?.length ? (
                  categorias
                    .filter((cat) => cat.estado === true)
                    .map((cat) => (
                      <SelectItem key={cat.idCategoria} textValue={cat.nombre}>
                        {cat.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>
                    No hay categorías disponibles
                  </SelectItem>
                )}
              </Select>
              <Buton
                type="button"
                className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl "
                onPress={() => setShowModalCategoria(true)}
              >
                <PlusCircleIcon />
              </Buton>
            </div>
          )}
        />

        <Checkbox
          isSelected={tieneCaracteristica}
          onChange={(e) => setTieneCaracteristica(e.target.checked)}
          className="mb-2"
        >
          ¿Posee características?
        </Checkbox>

        {tieneCaracteristica && (
          <div className="flex items-end gap-2 w-full ">
            <div className="flex w-full">
              <Controller
                control={control}
                name="fkCaracteristica"
                render={({ field }) => (
                  <Select
                    label="Característica"
                    {...field}
                    className="w-full"
                    placeholder="Selecciona una característica..."
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    isInvalid={!!errors.fkCaracteristica}
                    errorMessage={errors.fkCaracteristica?.message}
                  >
                    {caracteristicas?.length ? (
                      caracteristicas.map((cat) => (
                        <SelectItem key={cat.idCaracteristica}>
                          {cat.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem isDisabled>
                        No hay características disponibles
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            </div>

            <Buton
              type="button"
              className="mb-3 w-10 h-10 !px-0 !min-w-0 rounded-xl"
              onPress={() => setShowModalCaracteristica(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}
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
}
