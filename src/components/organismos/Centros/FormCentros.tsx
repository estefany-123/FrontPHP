import { Form } from "@heroui/form";
import { Centro, CentroSchema } from "@/schemas/Centro";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormMunicipios from "../Municipio/FormMunicipios";

type FormularioProps = {
  addData: (centros: Centro) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormCentros({ addData, onClose, id }: FormularioProps) {
  const {
    municipios,
    isLoading: loadingMuni,
    isError: errormuni,
    addMunicipio,
  } = useMunicipio();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Centro>({
    resolver: zodResolver(CentroSchema),
    defaultValues: {
      estado: true,
    },
  });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: Centro) => {
    console.log(data);
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Centro agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          {...register("nombre")}
          label="Nombre"
          placeholder="Nombre"
          type="text"
          isInvalid={!!errors.nombre} //color
          errorMessage={errors.nombre?.message}
        />

        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder="Selecciona estado"
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

        {!loadingMuni && !errormuni && municipios && (
          <Controller
            control={control}
            name="fkMunicipio"
            render={({ field }) => (
              <div className="w-full flex">
                <Select
                  label="Municipio"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full"
                  placeholder="Selecciona un municipio..."
                  aria-label="Seleccionar Municipio"
                  isInvalid={!!errors.fkMunicipio}
                  errorMessage={errors.fkMunicipio?.message}
                >
                  {municipios?.length ? (
                    municipios
                      .filter((m) => m.estado === true)
                      .map((m) => (
                        <SelectItem key={m.idMunicipio} textValue={m.nombre}>
                          {m.nombre}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem isDisabled>
                      No hay municipios disponibles
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
        )}
      </Form>
      <Modal
        ModalTitle="Agregar Municipio"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormMunicipios
          id="municipio"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addMunicipio(data);
          }}
        />
        <Buton form="municipio" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
