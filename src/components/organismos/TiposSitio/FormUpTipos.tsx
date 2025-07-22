import { Form } from "@heroui/form";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TipoSitioUpdate,
  TipoSitioUpdateSchema,
  TipoSitio,
} from "@/schemas/TipoSitio";
import { Input } from "@heroui/input";
import Buton from "@/components/molecules/Button";
import { addToast } from "@heroui/react";

type Props = {
  tipos: TipoSitio[];
  tipoSitioId: number;
  id: string;
  onclose: () => void;
};

const FormUpTipos = ({ tipos, tipoSitioId, id, onclose }: Props) => {
  console.log("Datos anteriores:", tipos);

  const { updateTipo, getTipoById } = useTipoSitio();

  const foundTipoSitio = getTipoById(tipoSitioId) as TipoSitioUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(TipoSitioUpdateSchema),
    defaultValues: {
      ...foundTipoSitio,
    },
  });

  const onSubmit = async (data: TipoSitioUpdate) => {
    try {
      await updateTipo(data.idTipo, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Sitio actuaizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el tipo de sitio", error);
    }
  };

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        type="text"
        {...register("nombre")}
      />
      {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

      <Buton
        text="Guardar"
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
      />
    </Form>
  );
};

export default FormUpTipos;
