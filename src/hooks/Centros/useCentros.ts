import { Centro, PutCentro } from "@/types/Centro";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCentro } from "@/axios/Centros/getCentros";
import { postCentros } from "@/axios/Centros/postCentro";
import { updateCentro } from "@/axios/Centros/putCentro";
import { StateCentro } from "@/axios/Centros/putStateCentro";
import { addToast } from "@heroui/react";

export function useCentro() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Centro[]>({
    queryKey: ["centros"],
    queryFn: getCentro,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addCentroMutation = useMutation({
    mutationFn: postCentros,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["centros"],
      });
    },

    onError: (error) => {
      console.log("Error al cargar el centro", error);
    },
  });

  const getCentroById = (
    id: number,
    centro: Centro[] | undefined = data
  ): Centro | null => {
    return centro?.find((centro) => centro.idCentro === id) || null;
  };

  const updateCentroMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PutCentro }) => {
      const { idCentro, ...resto } = data;
      return updateCentro(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["centros"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateCentro,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["centros"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addCentro = async (centro: Centro) => {
    return addCentroMutation.mutateAsync(centro);
  };

  const UpCentro = async (id: number, data: PutCentro) => {
    return updateCentroMutation.mutateAsync({ id, data });
  };

  const changeState = async (idCentro: number) => {
    return changeStateMutation.mutateAsync(idCentro);
  };

  return {
    centros: data,
    isLoading,
    isError,
    error,
    addCentro,
    changeState,
    getCentroById,
    UpCentro,
  };
}
