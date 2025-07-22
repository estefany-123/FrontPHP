import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { ElementoUpdateSchema, ElementoUpdate } from "@/schemas/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";
import Buton from "@/components/molecules/Button";

type Props = {
  elementos: ElementoUpdate[];
  elementoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ elementos, elementoId, id, onclose }: Props) => {
  const { updateElemento, getElementoById } = useElemento();

  const foundElemento = getElementoById(
    elementoId,
    elementos
  ) as ElementoUpdate;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ElementoUpdate>({
    resolver: zodResolver(ElementoUpdateSchema),
    mode: "onChange",
    defaultValues: foundElemento,
    
  });

  const imagen = watch("imagen");

  const onSubmit = async (data: ElementoUpdate) => {
    if (!data.idElemento) return;
    try {
      await updateElemento(data.idElemento, data);
      onclose();
      addToast({
        title: "Elemento actualizado",
        description:
          "Los datos del elemento fueron actualizados correctamente.",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el Elemento", error);
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
        placeholder="Nombre del elemento"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Descripción"
        placeholder="Descripción del elemento"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />

      {imagen && typeof imagen === "string" && (
        <div className="flex justify-center">
          <img
             src={`http://localhost:3000/img/img/elementos/${imagen}`}
            alt="Imagen actual"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      {imagen instanceof File && (
        <div className="flex justify-center">
          <img
            src={URL.createObjectURL(imagen)}
            alt="Nueva imagen"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      <Input
        label="Imagen"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setValue("imagen", file);
        }}
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
