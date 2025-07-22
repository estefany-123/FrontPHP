import { deleteArea } from "@/axios/Areas/deleteArea";
import { getArea } from "@/axios/Areas/getArea";
import { postArea } from "@/axios/Areas/postArea";
import { putArea } from "@/axios/Areas/putArea";
import { Area } from "@/types/area";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAreas() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: getArea,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addUserMutation = useMutation({
    mutationFn: postArea,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },

    onError: (error) => {
      console.log("Error al cargar el area", error);
    },
  });

  const getAreaById = (
    id: number,
    areas: Area[] | undefined = data
  ): Area | null => {
    return areas?.find((area) => area.idArea === id) || null;
  };

  const updateAreaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Area }) => {
      const { idArea, ...resto } = data;
      return putArea(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["areas"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addArea = async (area: Area) => {
    return addUserMutation.mutateAsync(area);
  };

  const updateArea = async (id: number, data: Area) => {
    return updateAreaMutation.mutateAsync({ id, data });
  };

  const changeState = async (idArea: number) => {
    return changeStateMutation.mutateAsync(idArea);
  };

  return {
    areas: data,
    isLoading,
    isError,
    error,
    addArea,
    changeState,
    getAreaById,
    updateArea,
  };
}
