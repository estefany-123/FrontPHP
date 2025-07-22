import { Centro } from "@/schemas/Centro";
import { Form } from "@heroui/form";
import { useCentro } from "@/hooks/Centros/useCentros";
import { useForm } from "react-hook-form";
import { CentroUpdate, CentroUpdateSchema } from "@/schemas/Centro";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import Buton from "@/components/molecules/Button";
import { addToast } from "@heroui/react";

type Props = {
  centros: (Centro & { key: string })[];
  centroId: number;
  id: string;
  onclose: () => void;
};

const FormUpCentro = ({ centroId, id, onclose }: Props) => {
  const { UpCentro, getCentroById } = useCentro();

  const foundCentro = getCentroById(centroId) as CentroUpdate;
  console.log(foundCentro);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CentroUpdateSchema),
    defaultValues: {
      idCentro: foundCentro.idCentro,
      nombre: foundCentro.nombre,
    },
  });

  const onSubmit = async (data: CentroUpdate) => {
    console.log("submiting...");
    console.log(data);
    try {
      await UpCentro(data.idCentro, data);
      console.log("Sended success");
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Centro Actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el centro", error);
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
          className="w-full rounded-xl"
        />

    </Form>
  );
};

export default FormUpCentro;
