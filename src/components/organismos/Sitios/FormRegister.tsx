import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useAreas } from "@/hooks/areas/useAreas";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { sitioCreate, sitioCreateSchema } from "@/schemas/sitios";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Buton from "@/components/molecules/Button";
import Modal from "../modal";
import FormularioArea from "../areas/FormRegister";
import FormTipos from "../TiposSitio/FormTipos";

type FormularioProps = {
  addData: (data: sitioCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSitio({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sitioCreate>({
    resolver: zodResolver(sitioCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { areas, addArea } = useAreas();
  const { tipos, addTipo } = useTipoSitio();

  const [showModal, setShowModal] = useState(false);
  const [showModalTipoSitio, setShowModalTipoSitio] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseTipoSitio = () => setShowModalTipoSitio(false);

  const onSubmit = async (data: sitioCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Sitio agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar sitio:", error);
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
          label="Nombre del sitio"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Input
          label="Persona encargada"
          type="text"
          placeholder="Encargado"
          {...register("personaEncargada")}
          isInvalid={!!errors.personaEncargada}
          errorMessage={errors.personaEncargada?.message}
        />

        <Input
          label="Ubicación"
          type="text"
          placeholder="Ubicación"
          {...register("ubicacion")}
          isInvalid={!!errors.ubicacion}
          errorMessage={errors.ubicacion?.message}
        />

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

        <Controller
          control={control}
          name="fkArea"
          render={({ field }) => (
            <div className="w-full mb-4 flex">
              <Select
                label="Area"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="Selecciona un área..."
                isInvalid={!!errors.fkArea}
                errorMessage={errors.fkArea?.message}
              >
                {areas?.length ? (
                  areas
                    .filter((s) => s.estado === true)
                    .map((area) => (
                      <SelectItem key={area.idArea} textValue={area.nombre}>
                        {area.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>No hay áreas disponibles</SelectItem>
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
          name="fkTipoSitio"
          render={({ field }) => (
            <div className="w-full flex">
              <Select
                label="Tipo Sitio"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="Selecciona un tipo..."
                isInvalid={!!errors.fkTipoSitio}
                errorMessage={errors.fkTipoSitio?.message}
              >
                {tipos?.length ? (
                  tipos
                    .filter((t) => t.estado === true)
                    .map((tipo) => (
                      <SelectItem key={tipo.idTipo} textValue={tipo.nombre}>
                        {tipo.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>No hay tipos disponibles</SelectItem>
                )}
              </Select>
              <Buton
                type="button"
                className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl "
                onPress={() => setShowModalTipoSitio(true)}
              >
                <PlusCircleIcon />
              </Buton>
            </div>
          )}
        />
      </Form>
      <Modal
        ModalTitle="Agregar Area"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioArea
          id="area"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addArea(data);
          }}
        />
        <Buton form="area" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Tipo Sitio"
        isOpen={showModalTipoSitio}
        onOpenChange={handleCloseTipoSitio}
      >
        <FormTipos
          id="tipo"
          onClose={() => setShowModalTipoSitio(false)}
          addData={async (data) => {
            await addTipo(data);
          }}
        />
        <Buton form="tipo" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
