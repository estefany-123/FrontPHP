import { getPerfil } from "@/axios/Usuarios/getPerfil";
import { patchFotoPerfil } from "@/axios/Usuarios/patchFotoPerfil";
import { Perfil } from "@/types/Usuario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function usePerfil() {
   const queryClient = useQueryClient();
  const { data: perfilInfo, isLoading, error } = useQuery<Perfil>({
    queryKey: ['perfil'], // Clave única para cache
    queryFn: getPerfil, // Tu función de fetch
    staleTime: 5 * 60 * 1000, // Cache válido por 5 minutos (ajusta según necesidades)
  });

  const updatefoto = useMutation({
    mutationFn: async (file: File) => {
      const response = await patchFotoPerfil(file);
      return response.updated; 
    }, onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["perfil"],
      });
    },
  })

  return { perfilInfo, isLoading, error,updatefoto };
}