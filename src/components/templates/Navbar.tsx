import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  DropdownItem,
  Spinner
} from "@heroui/react";
import { FormatrackLogo } from "../atoms/Icons";
import { BellIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { usePerfil } from "@/hooks/Usuarios/usePerfil";


type NavProps = {
  children?: ReactNode;
  onOpenNotifications?: () => void;
  cantidadNoLeidas?: number;
};

export function Nav({
  children,
  onOpenNotifications,
  cantidadNoLeidas = 0,
}: NavProps) {
  const navigate = useNavigate();
  const { perfilInfo, setPerfilInfo, isLoading, error } = usePerfil();

  console.log("Perfil Info:", perfilInfo);


  if (isLoading) return <div><Spinner className="flex justify-center" /></div>;
  if (!perfilInfo) return <div>No se encontraron datos del perfil</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (
    <Navbar>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <FormatrackLogo />
          <p className="hidden sm:block font-bold text-inherit">Formatrack</p>
        </NavbarBrand>
      </NavbarContent>

      <div className="flex items-center gap-4 ms-auto">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button
              className="relative text-gray-700 dark:text-white"
              onClick={onOpenNotifications}
            >
              <BellIcon className="w-6 h-6" />

              {cantidadNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                  {cantidadNoLeidas}
                </span>
              )}
            </button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Notificaciones" className="max-w-sm w-72">
            <DropdownItem
              textValue="notificaciones"
              className="font-semibold text-center"
              isReadOnly
              key="notificaciones-header"
            >
              Notificaciones
            </DropdownItem>

            <DropdownItem
              textValue="ver-todo"
              onPress={onOpenNotifications}
              className="text-center text-blue-500 hover:underline"
              key="ver-todo"
            >
              Ver todo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div>
          {children}
        </div>
      
        <User
          name={perfilInfo.nombre}
          avatarProps={{
            src: `http://127.0.0.1:8000/storage/${perfilInfo.perfil ?? "http://127.0.0.1:8000/storage/users/defaultPerfil.png"}`,
            onClick: () => navigate("/perfil"),
            isBordered: true,
          }}
        />
      </div>
    </Navbar>
  );
}
