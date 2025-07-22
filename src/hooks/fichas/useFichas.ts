import { deleteFicha } from "@/axios/Fichas/deleteFicha";
import { getFicha } from "@/axios/Fichas/getFicha";
import { postFicha } from "@/axios/Fichas/postFicha";
import { putFicha } from "@/axios/Fichas/putFicha";
import { Ficha } from "@/types/Ficha";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFichas() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Ficha[]>({
    queryKey: ["ficha"],
    queryFn: getFicha,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addFichasMutation = useMutation({
    mutationFn: postFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar la Ficha", error);
    },
  });

  const getFichaById = (
    id: number,
    Ficha: Ficha[] | undefined = data
  ): Ficha | null => {
    return Ficha?.find((Ficha) => Ficha.idFicha === id) || null;
  };

  const updateAreaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Ficha }) => {
      const { idFicha, ...resto } = data;
      return putFicha(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteFicha,

    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["ficha"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addFicha = async (ficha: Ficha) => {
    return addFichasMutation.mutateAsync(ficha);
  };

  const updateFicha = async (id: number, data: Ficha) => {
    return updateAreaMutation.mutateAsync({ id, data });
  };

  const changeState = async (idFicha: number) => {
    return changeStateMutation.mutateAsync(idFicha);
  };

  return {
    fichas: data,
    isLoading,
    isError,
    error,
    addFicha,
    changeState,
    getFichaById,
    updateFicha,
  };
}
