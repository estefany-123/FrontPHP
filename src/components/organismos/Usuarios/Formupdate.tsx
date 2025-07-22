import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { UserUpdateSchema, UserUpdate } from "@/schemas/User";
import { Form } from "@heroui/form";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { zodResolver } from "@hookform/resolvers/zod";
import Buton from "@/components/molecules/Button";
import { addToast } from "@heroui/react";

type FormuProps = {
  Users: (UserUpdate & { idUsuario: number })[];
  userId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ Users, userId, id, onclose }: FormuProps) => {
  const { updateUser, getUserById } = useUsuario();

  const foundUser = getUserById(userId, Users) as UserUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdate>({
    resolver: zodResolver(UserUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idUsuario: foundUser.idUsuario,
      nombre: foundUser.nombre,
      apellido: foundUser.apellido,
      edad: Number(foundUser.edad),
      telefono: foundUser.telefono,
      correo: foundUser.correo,
      cargo: foundUser.cargo,
    },
  });

  const onSubmit = async (data: UserUpdate) => {
    console.log(data);
    if (!data.idUsuario) return;
    try {
      await updateUser(data.idUsuario, data);
      onclose();
      addToast({
        title: "Actualiacion Exitosa",
        description: "Usuario actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "Error al actualizar el usuario",
        description: "Hubo un error intentando actualizar el usuario",
        color: "danger",
      });
      console.log("Error al actualizar el usuario : ", error);
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
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Apellido"
        placeholder="Apellido"
        {...register("apellido")}
        isInvalid={!!errors.apellido}
        errorMessage={errors.apellido?.message}
      />
      <Input
        label="Edad"
        placeholder="Edad"
        type="text"
        {...register("edad", { valueAsNumber: true })}
        isInvalid={!!errors.edad}
        errorMessage={errors.edad?.message}
      />
      <Input
        label="Telefono"
        placeholder="Telefono"
        {...register("telefono")}
        isInvalid={!!errors.telefono}
        errorMessage={errors.telefono?.message}
      />
      <Input
        label="Correo"
        placeholder="Correo"
        type="email"
        {...register("correo")}
        isInvalid={!!errors.correo}
        errorMessage={errors.correo?.message}
      />
      <Input
        label="Cargo"
        placeholder="Cargo"
        {...register("cargo")}
        isInvalid={!!errors.cargo}
        errorMessage={errors.cargo?.message}
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
