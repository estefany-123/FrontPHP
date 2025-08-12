import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

type Auth = {
  authenticated: boolean | undefined;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  nombre: string | undefined;
  setNombre: React.Dispatch<React.SetStateAction<string | undefined>>;
  apellido : string | undefined;
  setApellido: React.Dispatch<React.SetStateAction<string | undefined>>;
  perfil: string | undefined;
  setPerfil: React.Dispatch<React.SetStateAction<string | undefined>>;
  id: number | undefined;
  setIdUser: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [nombre, setNombre] = useState<string | undefined>(undefined);
  const [apellido, setApellido] = useState<string | undefined>(undefined);
  const [perfil, setPerfil] = useState<string | undefined>(undefined);
  const [id, setIdUser] = useState<number | undefined>(undefined);

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
   
    if (token) {
      const {
        nombre,
        apellido,
        perfil,
        id,
      }: {
        nombre: string;
        apellido: string;
        perfil: string;
        id: number;
      } = jwtDecode(token);
      setApellido(apellido)
      setNombre(`${nombre} ${apellido}`);
      setPerfil(perfil);
      setAuthenticated(true);
      setIdUser(id);
    }
  
    const reloadPermisos = async () => {
      const token = cookies.get("token"); 

      if (!token) return; 

      
    };
    reloadPermisos();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        nombre,
        setNombre,
        apellido,
        setApellido,
        perfil,
        setPerfil,
        setIdUser,
        id
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
