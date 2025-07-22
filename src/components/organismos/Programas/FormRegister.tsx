import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { programaCreate, programaCreateSchema } from "@/schemas/programas";
import { useAreas } from "@/hooks/areas/useAreas";
import { useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioArea from "../areas/FormRegister";

type FormularioProps = {
  addData: (data: programaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioPrograma({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<programaCreate>({
    resolver: zodResolver(programaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { areas, addArea } = useAreas();

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: programaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Programa agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el programa:", error);
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
          label="Nombre del programa"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
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
            <div className="w-full flex ">
              <Select
                label="Área"
                placeholder="Selecciona un área"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                isInvalid={!!errors.fkArea}
                errorMessage={errors.fkArea?.message}
              >
                {areas?.length ? (
                  areas
                    .filter((p) => p.estado === true)
                    .map((area) => (
                      <SelectItem key={area.idArea}>{area.nombre}</SelectItem>
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
    </>
  );
}
