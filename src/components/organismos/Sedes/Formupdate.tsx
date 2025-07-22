import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { sedeUpdate, sedeUpdateSchema } from "@/schemas/sedes";
import { useSede } from "@/hooks/sedes/useSedes";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type Props = {
  sedes: (sedeUpdate & { idSede?: number })[];
  sedeId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ sedes, sedeId, id, onclose }: Props) => {
  const { updateSede, getSedeById } = useSede();

  const foundSede = getSedeById(sedeId, sedes) as sedeUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<sedeUpdate>({
    resolver: zodResolver(sedeUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idSede: foundSede.idSede,
      nombre: foundSede.nombre,
    },
  });

  const onSubmit = async (data: sedeUpdate) => {
    console.log(data);
    if (!data.idSede) return;
    try {
      await updateSede(data.idSede, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Sede actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la sede : ", error);
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
        label="Nombre"
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
