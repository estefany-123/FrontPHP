import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { useRol } from "@/hooks/Roles/useRol";
import { FormUpdate } from "@/components/organismos/Roles/FormUpdate";
import { Rol } from "@/types/Rol";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import FormularioRolPermiso from "@/components/organismos/RolPermiso/FormularioRolPermiso";
import FormularioRoles from "@/components/organismos/Roles/FormRegister";

export const RolTable = () => {
  const { roles, isLoading, isError, error, addRol, changeState } = useRol();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [rolParaPermisos, setRolParaPermisos] = useState<number | null>(null);
  const [showPermisosModal, setShowPermisosModal] = useState(false);

  const handleAsignarPermisos = (id_rol: number) => {
    setRolParaPermisos(id_rol);
    setShowPermisosModal(true);
  };

  const handleCerrarPermisos = () => {
    setShowPermisosModal(false);
    setRolParaPermisos(null);
  };

  const navigate = useNavigate();

  const handleGoToUsuario = () => {
    navigate("/admin/usuarios");
  };
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedRol(null);
  };

  const handleState = async (id_rol: number) => {
    await changeState(id_rol);
  };

  const handleAddRol = async (data: Rol) => {
    try {
      await addRol(data);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (rol: Rol) => {
    if (!rol || !rol.id_rol) {
      return;
    }
    setSelectedRol(rol);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Rol>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (rol: Rol) => (
        <span>
          {rol.created_at
            ? new Date(rol.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (rol: Rol) => (
        <span>
          {rol.updated_at
            ? new Date(rol.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
    {
      key: "asignarPermisos",
      label: "Permisos",
      render: (rol: Rol) => (
        <Buton
          text="Asignar"
          onPress={() => handleAsignarPermisos(rol.id_rol as number)}
        />
      ),
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const rolesWithKey = roles
    ?.filter(
      (rol) => rol?.id_rol !== undefined && rol?.created_at && rol?.updated_at
    )
    .map((rol) => ({
      ...rol,
      key: rol.id_rol ? rol.id_rol.toString() : crypto.randomUUID(),
      id_rol: rol.id_rol || 0,
      estado: Boolean(rol.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Roles</h1>
              <div className="flex gap-2">
                <Buton text="Usuarios" onPress={handleGoToUsuario} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Registrar Rol"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioRoles
          id="rol-form"
          addData={handleAddRol}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="rol-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Rol"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedRol && (
          <FormUpdate
            roles={rolesWithKey ?? []}
            rolId={selectedRol.id_rol as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>
      <Modall
        size="5xl"
        ModalTitle="Asignar Permisos"
        isOpen={showPermisosModal}
        onOpenChange={handleCerrarPermisos}
      >
        {typeof rolParaPermisos === "number" && (
          <FormularioRolPermiso rol={rolParaPermisos} />
        )}
      </Modall>

      { rolesWithKey && (
        <Globaltable
          data={rolesWithKey ?? []}
          columns={columns}
          onEdit={handleEdit }
          onDelete={
           (rol) => handleState(rol.id_rol)
          }
          extraHeaderContent={
            <div>
              {(
                <Buton text="Nuevo rol" onPress={() => setIsOpen(true)} />
              }
            </div>
          }
        />

    </div>
  );
};
