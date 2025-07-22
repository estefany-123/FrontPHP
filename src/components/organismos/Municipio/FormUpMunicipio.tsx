import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { MunicipioUP, MunicipioUPSchema } from "@/schemas/Municipio";
import { useForm } from "react-hook-form";
import Buton from "@/components/molecules/Button";
import { addToast } from "@heroui/react";

type Props = {
  municipios: MunicipioUP[];
  municipioId: number;
  id: string;
  onclose: () => void;
};

const FormUpMunicipio = ({ municipioId, id, onclose }: Props) => {
  const { updateMunicipio, getMunicipioById } = useMunicipio();

  const foundMunicipio = getMunicipioById(municipioId) as MunicipioUP;
  console.log(foundMunicipio);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(MunicipioUPSchema),
    defaultValues: {
      idMunicipio: foundMunicipio.idMunicipio,
      nombre: foundMunicipio.nombre,
    },
  });

  const onSubmit = async (data: MunicipioUP) => {
    console.log("submiting...");
    console.log(data);
    try {
      await updateMunicipio(data.idMunicipio as number, data);
      console.log("Sended success");
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Municipio Actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el municipio", error);
    }
  };

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("nombre")}
        label="Nombre"
        type="text"
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Buton
        text="Guardar"
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
      />
    </Form>
  );
};

export default FormUpMunicipio;
