import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaUpdateSchema, AreaUpdate } from "@/schemas/Area";
import { useAreas } from "@/hooks/areas/useAreas";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type FormuProps = {
  areas: AreaUpdate[];
  areaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ areas, areaId, id, onclose }: FormuProps) => {
  const { updateArea, getAreaById } = useAreas();

  const foundArea = getAreaById(areaId, areas) as AreaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AreaUpdate>({
    resolver: zodResolver(AreaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      nombre: foundArea.nombre,
      id_area: foundArea.id_area,
    },
  });

  const onSubmit = async (data: AreaUpdate) => {
    console.log("Enviando datos:", data);
    if (!data.id_area) return;
    try {
      await updateArea(data.id_area, { nombre: data.nombre });
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Area actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el área: ", error);
    }
  };

  console.log("Errores", errors);
  return (
    <form
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
      <div className="justify-center">
        <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full rounded-xl"
        />
      </div>
    </form>
  );
};
