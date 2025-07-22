import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { MovimientoUpdate, MovimientoUpdateSchema } from "@/schemas/Movimento";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type Props = {
  movimientos: (MovimientoUpdate & { idMovimiento?: number })[];
  movimientoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  movimientos,
  movimientoId,
  id,
  onclose,
}: Props) => {
  const { updateMovimiento, getMovimientoById } = useMovimiento();

  const foundMovimiento = getMovimientoById(
    movimientoId,
    movimientos
  ) as MovimientoUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovimientoUpdate>({
    resolver: zodResolver(MovimientoUpdateSchema),
    mode: "onChange",
    defaultValues: foundMovimiento,
  });

  const onSubmit = async (data: MovimientoUpdate) => {
    console.log(data);
    if (!data.idMovimiento) return;
    try {
      await updateMovimiento(data.idMovimiento, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Movimiento actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el rol : ", error);
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
        label="Cantidad"
        placeholder="Ingreses la Cantidad ..."
        {...register("cantidad", { valueAsNumber: true })}
        isInvalid={!!errors.cantidad}
        errorMessage={errors.cantidad?.message}
      />
      <Input
        label="Descripcion"
        placeholder="Ingresa la descripcion ..."
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        label="Hora Ingreso"
        placeholder="Seleccione la Hora Ingreso"
        type="time"
        {...register("horaIngreso")}
        isInvalid={!!errors.horaIngreso}
        errorMessage={errors.horaIngreso?.message}
      />
      <Input
        label="Hora Salida"
        placeholder="Ingrese la hora de Salida"
        type="time"
        {...register("horaSalida")}
        isInvalid={!!errors.horaSalida}
        errorMessage={errors.horaSalida?.message}
      />
      <div className="justify-center pl-10">
        <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        />
      </div>
    </Form>
  );
};
