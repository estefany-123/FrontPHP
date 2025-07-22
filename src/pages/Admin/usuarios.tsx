import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormRegister from "@/components/organismos/Usuarios/FormRegister";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Usuarios/Formupdate";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/Usuario";
import FormRegisterMasivo from "@/components/organismos/Usuarios/FormRegisterMasivo";
import usePermissions from "@/hooks/Usuarios/usePermissions";

const UsersTable = () => {

  const { userHasPermission } = usePermissions();

  const { users, isLoading, isError, error, addUser, changeState } =
    useUsuario();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedUser(null);
  };

  //Modal subida masiva
  const [isOpenMasivo, setIsOpenMasivo] = useState(false);
  const handleCloseMasivo = () => setIsOpenMasivo(false);

  const handleGoToRol = () => {
    navigate("/admin/roles");
  };

  const handleState = async (user: User) => {
    await changeState(user.idUsuario as number);
  };

  const handleAddUser = async (user: User) => {
    try {
      await addUser(user);
      handleClose(); 
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<User>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "edad", label: "edad" },
    { key: "telefono", label: "telefono" },
    { key: "correo", label: "Correo" },
    { key: "cargo", label: "Cargo" },
    { key: "estado", label: "estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const usersWithKey = users
    ?.filter((user): user is User & { idUsuario: number } => user?.idUsuario !== undefined)
    .map((user) => ({
      ...user,
      key: user.idUsuario ? user.idUsuario.toString() : crypto.randomUUID(),
      estado: Boolean(user.estado),
    }));

  return (

    <div className="p-4"> 
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
              <div className="flex gap-2">
                {userHasPermission(34) && //listar roles
                  <Buton
                    text="Gestionar Roles"
                    onPress={handleGoToRol}
                  />
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Modall
        ModalTitle="Agregar Usuario"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormRegister
          id="user-form"
          addData={handleAddUser}
          onClose={handleClose}
        />
        <div>
          <Buton
            text="Guardar"
            type="submit"
            form="user-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedUser && (
                    <FormUpdate Users={usersWithKey ?? []} userId={selectedUser.idUsuario as number} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

        <Modall ModalTitle="Subida masiva de usuarios" isOpen={isOpenMasivo} onOpenChange={handleCloseMasivo}>
          <FormRegisterMasivo/>
        </Modall>
      <Modall
        ModalTitle="Editar Usuario"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedUser && (
          <FormUpdate
            Users={usersWithKey ?? []}
            userId={selectedUser.idUsuario as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>
            <Modall ModalTitle="Editar Usuario" isOpen={IsOpenUpdate} onOpenChange={handleCloseUpdate}>
                {selectedUser && (
                    <FormUpdate Users={usersWithKey ?? []} userId={selectedUser.idUsuario as number} id="FormUpdate" onclose={handleCloseUpdate} />
                )}

            </Modall>

        <Modall ModalTitle="Subida masiva de usuarios" isOpen={isOpenMasivo} onOpenChange={handleCloseMasivo}>
          <FormRegisterMasivo/>
        </Modall>
      
      
      {userHasPermission(3) && usersWithKey && (
        <Globaltable
          data={usersWithKey} 
          columns={columns}
          onEdit={userHasPermission(4) ? handleEdit : undefined}
          onDelete={userHasPermission(5) ? handleState : undefined}
          extraHeaderContent={
            <div className="flex gap-2">
              {userHasPermission(1) &&
                <Buton onPress={() => setIsOpen(true)}>Añadir usuario</Buton>
              }
              {userHasPermission(2) &&
                <Buton onPress={() => setIsOpenMasivo(true)}>Subir masivamente</Buton>
              }
            </div>
          }
        />
      )}
   
    </div>
  );
};

export default UsersTable;
