import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { fichaUpdateSchema, fichaUpdate } from "@/schemas/fichas";
import { Form } from "@heroui/form";
import { useFichas } from "@/hooks/fichas/useFichas";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type FormuProps = {
  fichas: (fichaUpdate & { key: string })[];
  fichaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdateFicha = ({
  fichas,
  fichaId,
  id,
  onclose,
}: FormuProps) => {
  const { updateFicha, getFichaById } = useFichas();

  const foundFicha = getFichaById(fichaId, fichas) as fichaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<fichaUpdate>({
    resolver: zodResolver(fichaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_ficha: foundFicha.id_ficha,
      codigo_ficha: foundFicha.codigo_ficha,
    },
  });

  const onSubmit = async (data: fichaUpdate) => {
    if (!data.id_ficha) return;
    try {
      await updateFicha(data.id_ficha, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Ficha actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar la ficha:", error);
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
        label="Código Ficha"
        placeholder="Ingrese el código de ficha"
        {...register("codigo_ficha", { valueAsNumber: true })}
        isInvalid={!!errors.codigo_ficha}
        errorMessage={errors.codigo_ficha?.message}
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
