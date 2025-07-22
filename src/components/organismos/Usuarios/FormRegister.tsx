import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, User } from "@/schemas/User";
import { Form } from "@heroui/form";
import { useRol } from "@/hooks/Roles/useRol";
import Buton from "@/components/molecules/Button";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import FormularioRoles from "../Roles/FormRegister";
import Modal from "../modal";

type FormularioProps = {
  addData: (user: User) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioU({ addData, onClose, id }: FormularioProps) {
  const {
    roles,
    isLoading: loadinRoles,
    isError: errorRoles,
    addRol,
  } = useRol();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const [showModalRol, setShowModalRol] = useState(false);
  const handleClose = () => setShowModalRol(false);

  const onSubmit = async (data: User) => {
    console.log(data);
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Usuario agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          label="Documento"
          type="text"
          placeholder="Documento"
          {...register("documento", { valueAsNumber: true })}
          isInvalid={!!errors.documento}
          errorMessage={errors.documento?.message}
        />
        <Input
          label="Nombre"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />
        <Input
          label="Apellido"
          type="text"
          placeholder="Apellido"
          {...register("apellido")}
          isInvalid={!!errors.apellido}
          errorMessage={errors.apellido?.message}
        />
        <Input
          label="Edad"
          type="text"
          placeholder="Edad"
          {...register("edad", { valueAsNumber: true })}
          isInvalid={!!errors.edad}
          errorMessage={errors.edad?.message}
        />
        <Input
          label="Teléfono"
          type="text"
          placeholder="Teléfono"
          {...register("telefono")}
          isInvalid={!!errors.telefono}
          errorMessage={errors.telefono?.message}
        />
        <Input
          label="Correo"
          type="email"
          placeholder="Correo"
          {...register("correo")}
          isInvalid={!!errors.correo}
          errorMessage={errors.correo?.message}
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

        {errors.estado && (
          <p className="text-red-500">{errors.estado?.message}</p>
        )}
        <Input
          label="Cargo"
          type="text"
          placeholder="Cargo"
          {...register("cargo")}
          isInvalid={!!errors.cargo}
          errorMessage={errors.cargo?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="Password"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />

        {!loadinRoles && !errorRoles && roles && (
          <Controller
            control={control}
            name="fkRol"
            render={({ field }) => (
              <div className="w-full flex">
                <Select
                  label="Rol"
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="Selecciona un rol..."
                  isInvalid={!!errors.fkRol}
                  errorMessage={errors.fkRol?.message}
                >
                  {roles?.length ? (
                    roles
                      .filter((r) => r.estado === true)
                      .map((rol) => (
                        <SelectItem key={rol.idRol} textValue={rol.nombre}>
                          {rol.nombre}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem isDisabled>No hay roles disponibles</SelectItem>
                  )}
                </Select>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalRol(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            )}
          />
        )}
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
}
