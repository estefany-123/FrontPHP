import { deleteTipo } from "@/axios/TiposMovimiento/deleteTipo";
import { getTipo } from "@/axios/TiposMovimiento/getTipo";
import { postTipo } from "@/axios/TiposMovimiento/postTipo";
import { putTipo } from "@/axios/TiposMovimiento/putTipo";
import { TipoMovimiento } from "@/types/TipoMovimiento";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTipoMovimiento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<TipoMovimiento[]>({
    queryKey: ["tipos"],
    queryFn: getTipo,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addTipoMutation = useMutation({
    mutationFn: postTipo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el tipo de movimiento", error);
    },
  });

  const getTipoMovimientoById = (
    id: number,
    tipos: TipoMovimiento[] | undefined = data
  ): TipoMovimiento | null => {
    return tipos?.find((tipo) => tipo.idTipo === id) || null;
  };

  const updateTipoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipoMovimiento }) => {
      const { idTipo, ...resto } = data;
      return putTipo(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteTipo,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["tipos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addTipoMovimiento = async (tipoMovimiento: TipoMovimiento) => {
    return addTipoMutation.mutateAsync(tipoMovimiento);
  };

  const updateTipoMovimiento = async (id: number, data: TipoMovimiento) => {
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
    addTipoMovimiento,
    changeState,
    getTipoMovimientoById,
    updateTipoMovimiento,
  };
}
