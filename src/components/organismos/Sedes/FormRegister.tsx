import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useCentro } from "@/hooks/Centros/useCentros";
import { sedeCreate, sedeCreateSchema } from "@/schemas/sedes";
import { useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormCentros from "../Centros/FormCentros";

type FormularioSedeProps = {
  addData: (data: sedeCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSede({
  addData,
  onClose,
  id,
}: FormularioSedeProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sedeCreate>({
    resolver: zodResolver(sedeCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { centros, addCentro } = useCentro();

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: sedeCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Sede agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar sede:", error);
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
          label="Nombre de la sede"
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
          name="fkCentro"
          render={({ field }) => (
            <div className="w-full flex">
              <Select
                label="Centro"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full"
                placeholder="Selecciona un centro..."
                aria-label="Seleccionar Centro"
                isInvalid={!!errors.fkCentro}
                errorMessage={errors.fkCentro?.message}
              >
                {centros?.length ? (
                  centros
                    .filter((c) => c.estado === true)
                    .map((centro) => (
                      <SelectItem
                        key={centro.idCentro}
                        textValue={centro.nombre}
                      >
                        {centro.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>No hay centros disponibles</SelectItem>
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
        ModalTitle="Agregar Centro"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormCentros
          id="centro"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addCentro(data);
          }}
        />
        <Buton form="centro" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
