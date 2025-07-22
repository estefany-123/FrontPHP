import { TipoSitio, UpTipoSitio } from "@/types/TipoSitio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTipoSitio } from "@/axios/TipoSitio/getTipoSitio";
import { postTipoSitio } from "@/axios/TipoSitio/postTipoSitio";
import { updateTipoSitio } from "@/axios/TipoSitio/putTipoSitio";
import { StateTipoSitio } from "@/axios/TipoSitio/putStateTipoSitio";
import { addToast } from "@heroui/react";

export function useTipoSitio() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<TipoSitio[]>({
    queryKey: ["tipoSitio"],
    queryFn: getTipoSitio,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addTipoMutation = useMutation({
    mutationFn: postTipoSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipoSitio"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el tipo de sitio", error);
    },
  });

  const getTipoById = (
    id: number,
    tipo: TipoSitio[] | undefined = data
  ): TipoSitio | null => {
    return tipo?.find((tipos) => tipos.idTipo === id) || null;
  };

  const updateTipoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpTipoSitio }) => {
      const { idTipo, ...resto } = data;
      return updateTipoSitio(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipoSitio"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateTipoSitio,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["tipoSitio"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addTipo = async (tipos: TipoSitio) => {
    return addTipoMutation.mutateAsync(tipos);
  };

  const updateTipo = async (id: number, data: UpTipoSitio) => {
    return updateTipoMutation.mutateAsync({ id, data });
  };

  const changeState = async (idTipo: number) => {
    return changeStateMutation.mutateAsync(idTipo);
  };

  return {
    tipos: data,
    isLoading,
    isError,
    error,
    addTipo,
    changeState,
    getTipoById,
    updateTipo,
  };
}
