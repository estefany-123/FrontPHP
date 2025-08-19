
import { postLogin } from "@/axios/Usuarios/postLogin";
import { useAuth } from "@/providers/AuthProvider";
import { Credenciales } from "@/schemas/User";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function useLogin(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {setAuthenticated, setNombre, setPerfil,setIdUser,setPermissions} = useAuth();


    const navigate = useNavigate();

    async function login(data : Credenciales){
        setIsError(false);
        setIsLoading(true);

        try{
            const response  = await postLogin(data);
            console.log("Respuesta del login:", response);
            const token = response.access_token
            const permissions = response.modules;
             cookies.set("token",token)
            cookies.set("permissions",permissions);

    
          
            setIsError(false);
            setError(undefined);
            setPermissions(permissions);
            setAuthenticated(true);
           
            navigate("/");
        }
        catch(error:any){
            const res = error.response.data.message
            console.log("Error backend",res)
            setIsError(true);
            setError(res);
        }
        finally{
            setIsLoading(false);
        }
    }

    async function logout(){
        try{
            cookies.remove("token");
            navigate('/login');
        }


        catch(error){
            console.log(error);
        }
    }

    return{login,isError,error,logout,isLoading};
}

