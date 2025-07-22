import { Form } from "@heroui/form";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { programaUpdate, programaUpdateSchema } from "@/schemas/programas";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type Props = {
  programas: programaUpdate[];
  programaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ programas, programaId, id, onclose }: Props) => {
  const { updatePrograma, getProgramaById } = usePrograma();

  const foundPrograma = getProgramaById(
    programaId,
    programas
  ) as programaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<programaUpdate>({
    resolver: zodResolver(programaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idPrograma: foundPrograma.idPrograma,
      nombre: foundPrograma.nombre,
    },
  });

  const onSubmit = async (data: programaUpdate) => {
    console.log(data);
    if (!data.idPrograma) return;
    try {
      await updatePrograma(data.idPrograma, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Programa actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el programa: ", error);
    }
  };

  console.log("Errores", errors);

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre del Programa"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
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
