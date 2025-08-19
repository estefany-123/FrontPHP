import { CategoriaUpdate, CategoriaUpdateSchema } from "@/schemas/Categorias";
import { Form } from "@heroui/form";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import Buton from "@/components/molecules/Button";
import { addToast } from "@heroui/react";

type Props = {
  categorias: CategoriaUpdate[];
  categoriaId: number;
  id: string;
  onclose: () => void;
};

const FormUpCategoria = ({ categoriaId, id, onclose }: Props) => {
  const { updateCategoria, getCategoriaById } = useCategoria();

  const foundCategoria = getCategoriaById(categoriaId) as CategoriaUpdate;
  console.log("foundcate",foundCategoria);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CategoriaUpdateSchema),
    defaultValues: {
      id_categoria: foundCategoria.id_categoria,
      nombre: foundCategoria.nombre,
      codigo_unpsc: foundCategoria.codigo_unpsc,
    },
  });

  const onSubmit = async (data: CategoriaUpdate) => {
    console.log("submiting...");
    console.log(data);
    try {
      await updateCategoria(data.id_categoria as number, data);
      console.log("Sended success");
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Categoria actuaizada correctamente",
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

      <Input
        {...register("codigo_unpsc")}
        label="Codigo UNPSC"
        type="text"
        isInvalid={!!errors.codigo_unpsc}
        errorMessage={errors.codigo_unpsc?.message}
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

export default FormUpCategoria;
