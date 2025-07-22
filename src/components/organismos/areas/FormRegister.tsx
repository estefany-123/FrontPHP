import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { AreaCreate, AreaCreateSchema } from "@/schemas/Area";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useSede } from "@/hooks/sedes/useSedes";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useState } from "react";
import Modal from "@/components/organismos/modal";
import FormularioSede from "../Sedes/FormRegister";
import Buton from "@/components/molecules/Button";
import Formulario from "../Usuarios/FormRegister";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type FormularioProps = {
  addData: (area: AreaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioArea({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AreaCreate>({
    resolver: zodResolver(AreaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { sede, addSede } = useSede();
  const { users, addUser } = useUsuario();

  const [showModal, setShowModal] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseUser = () => setShowModalUser(false);

  const onSubmit = async (data: AreaCreate) => {
    try {
      console.log("Datos que se van a enviar al backend:", data); //errores

      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Area agregada correctamente",
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
    <>
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

        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder="Seleccione un estado"
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

        <Controller
          control={control}
          name="fkSede"
          render={({ field }) => (
            <div className=" flex w-full">
              <Select
                label="Sede"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full"
                placeholder="Selecciona una sede..."
                aria-label="Seleccionar Sede"
                isInvalid={!!errors.fkSede}
                errorMessage={errors.fkSede?.message}
              >
                {sede?.length ? (
                  sede
                    .filter((s) => s.estado === true)
                    .map((s) => (
                      <SelectItem key={s.idSede} textValue={s.nombre}>
                        {s.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>No hay sedes disponibles</SelectItem>
                )}
              </Select>
              <Buton
                type="button"
                className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl "
                onPress={() => setShowModal(true)}
              >
                <PlusCircleIcon />
              </Buton>
            </div>
          )}
        />

        <Controller
          control={control}
          name="fkUsuario"
          render={({ field }) => (
            <div className="flex w-full">
              <Select
                label="Usuario"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full"
                placeholder="Selecciona un usuario..."
                aria-label="Seleccionar Usuario"
                isInvalid={!!errors.fkUsuario}
                errorMessage={errors.fkUsuario?.message}
              >
                {users?.length ? (
                  users
                    .filter((u) => u.estado === true)
                    .map((u) => (
                      <SelectItem key={u.idUsuario} textValue={u.nombre}>
                        {u.nombre}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem isDisabled>
                    No hay usuarios disponibles
                  </SelectItem>
                )}
              </Select>
              <Buton
                type="button"
                className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                onPress={() => setShowModalUser(true)}
              >
                <PlusCircleIcon />
              </Buton>
            </div>
          )}
        />
        
      </Form>
      <Modal
        ModalTitle="Agregar Sede"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioSede
          id="sede"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addSede(data);
          }}
        />
        <Buton form="sede" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Usuario"
        isOpen={showModalUser}
        onOpenChange={handleCloseUser}
      >
        <Formulario
          id="user"
          onClose={() => setShowModalUser(false)}
          addData={async (data) => {
            await addUser(data);
          }}
        />
        <Buton form="user" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
