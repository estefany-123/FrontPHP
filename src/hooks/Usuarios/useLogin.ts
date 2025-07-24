
import { postLogin } from "@/axios/Usuarios/postLogin";
// import { useAuth } from "@/providers/AuthProvider";
import { Credenciales } from "@/schemas/User";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function useLogin(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const {setAuthenticated, setNombre, setPerfil,setIdUser,setPermissions} = useAuth();

    const navigate = useNavigate();

    async function login(data : Credenciales){
        setIsError(false);
        setIsLoading(true);
        try{
            const response  = await postLogin(data);
            const token = response.data.access_token
             console.log( "respuesta de el axios",token)
             cookies.set("token",token)
    
            //Error handling
            setIsError(false);
            setError(undefined);
            // setPermissions(permissions);
            //Redirection
            navigate("/");
        }
        catch(error:any){
            console.log("Error backend",error)
            setIsError(true);
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

