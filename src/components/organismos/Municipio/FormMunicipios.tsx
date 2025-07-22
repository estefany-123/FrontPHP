import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Municipio, MunicipioSchema } from "@/schemas/Municipio";

type FormularioProps = {
  addData: (municipios: Municipio) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormMunicipios({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Municipio>({
    resolver: zodResolver(MunicipioSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const onSubmit = async (data: Municipio) => {
    console.log(data);
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Municipio agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Departamento"
        type="text"
        placeholder="Departamento"
        {...register("departamento")}
        isInvalid={!!errors.departamento}
        errorMessage={errors.departamento?.message}
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
