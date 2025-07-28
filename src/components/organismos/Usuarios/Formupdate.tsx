import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { UserUpdateSchema, UserUpdate } from "@/schemas/User";
import { Form } from "@heroui/form";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { zodResolver } from "@hookform/resolvers/zod";
import Buton from "@/components/molecules/Button";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useRol } from "@/hooks/Roles/useRol";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "../modal";
import FormularioRoles from "../Roles/FormRegister";

type FormuProps = {
  Users: (UserUpdate & { id: number })[];
  userId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ Users, userId, id, onclose }: FormuProps) => {
  const { updateUser, getUserById } = useUsuario();
 

  const [showModalRol, setShowModalRol] = useState(false);
   const handleClose = () => setShowModalRol(false);



  const {
    roles,
    isLoading:loadingRoles,
    isError:errorRoles,
    addRol
  } = useRol();

  const foundUser = getUserById(userId, Users) as UserUpdate;

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdate>({
    resolver: zodResolver(UserUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id: foundUser.id,
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
    if (!data.id) return;
    try {
      await updateUser(data.id, data);
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
    <>

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
       

        {!loadingRoles && !errorRoles && roles && (
          <div className="w-full flex">
            <Select
              label="Rol"
              onChange={(e) => {
                const fkRol = parseInt(e.target.value);
                setValue("fk_rol", isNaN(fkRol) ? undefined : fkRol);
                console.log(watch("fk_rol"));
              }}
              defaultSelectedKeys={`${foundUser.fk_rol}`}
            >
              {roles?.map(rol =>
                <SelectItem key={`${rol.id_rol}`}>{rol.nombre}</SelectItem>
              )}
            </Select>
            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModalRol(true)}
            >
              <PlusCircleIcon />
            </Buton>

          </div>
        )}

         <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full rounded-xl"
        />
      </Form>

      <Modal
        ModalTitle="Agregar Rol"
        isOpen={showModalRol}
        onOpenChange={handleClose}
      >
        <FormularioRoles
          id="rol"
          onClose={() => setShowModalRol(false)}
          addData={async (data) => {
            await addRol(data);
          }}
        />
        <Buton form="rol" text="Guardar" type="submit" />
      </Modal>
    </>

  );
};
