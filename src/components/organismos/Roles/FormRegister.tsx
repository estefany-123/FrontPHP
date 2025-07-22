import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RolCreate, RolCreateSchema } from "@/schemas/Rol";

type FormularioProps = {
  addData: (rol: RolCreate) => Promise<any>;
  onClose: () => void;
  id: string;
};

export default function FormularioRoles({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RolCreate>({
    resolver: zodResolver(RolCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const onSubmit = async (data: RolCreate) => {
    try {
      console.log("DAtos enviados:", data);
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Rol agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };
  console.log("Errores", errors);
  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        type="text"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
            isInvalid={!!errors.estado}
            errorMessage={errors.estado?.message}
            isDisabled
            defaultSelectedKeys={["true"]}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
    </Form>
  );
}
