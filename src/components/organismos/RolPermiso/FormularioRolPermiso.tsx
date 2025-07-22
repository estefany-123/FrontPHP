import { getRolePermisos } from "@/axios/RolPermiso/getRolePermisos";
import { patchRolePermiso } from "@/axios/RolPermiso/patchRolePermiso";
import { Checkbox, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

export default function FormularioRolPermiso(
  { rol }: { rol: number },
) {
  const [loading, setLoading] = useState<boolean>(true);

  const [allPermisos, setAllPermisos] = useState<any[]>([]);
  const [assignedPermisos, setAssignedPermisos] = useState<any[]>([]);

  useEffect(() => {
    async function getPermisos() {
      const data: any = await getRolePermisos(rol);
      setAllPermisos(data.permisos);
      setAssignedPermisos(data.permisosAsignados);
      setLoading(false);
    }
    getPermisos();
  }, []);

  async function handleChange(permiso: number) {
    await patchRolePermiso(permiso, rol);
  }

  if (loading) return <Spinner className="my-12" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {allPermisos?.map((permiso) => {
        const checked = assignedPermisos.find((ap) => ap === permiso.idPermiso)
          ? true
          : false;
        return (
          <div key={permiso.idPermiso} className="w-full flex">
            <Checkbox
              defaultSelected={checked}
              onChange={() => handleChange(permiso.idPermiso)}
            />
            {permiso.permiso}
        
          </div>
        );
      })}

    </div>
  );
}
