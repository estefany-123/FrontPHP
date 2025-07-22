import { Municipio, UpdMunicipio } from "@/types/Municipio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMunicipio } from "@/axios/Municipio/getMunicipio";
import { postMunicipio } from "@/axios/Municipio/postMunicipio";
import { UpMunicipio } from "@/axios/Municipio/putMunicipio";
import { StateMunicipio } from "@/axios/Municipio/putStateMunicipio";
import { addToast } from "@heroui/react";

export function useMunicipio() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Municipio[]>({
    queryKey: ["municipio"],
    queryFn: getMunicipio,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addMunicipioMutation = useMutation({
    mutationFn: postMunicipio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["municipio"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el municipio", error);
    },
  });

  const getMunicipioById = (
    id: number,
    municipios: Municipio[] | undefined = data
  ): Municipio | null => {
    return (
      municipios?.find((municipio) => municipio.idMunicipio === id) || null
    );
  };

  const updateMunicipioMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdMunicipio }) =>{
      const {idMunicipio, ...resto} = data
      return UpMunicipio(id, resto)},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["municipio"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateMunicipio,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["municipio"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addMunicipio = async (municipio: Municipio) => {
    return addMunicipioMutation.mutateAsync(municipio);
  };

  const updateMunicipio = async (id: number, data: UpdMunicipio) => {
    return updateMunicipioMutation.mutateAsync({ id, data });
  };

  const changeState = async (idMunicipio: number) => {
    return changeStateMutation.mutateAsync(idMunicipio);
  };

  return {
    municipios: data,
    isLoading,
    isError,
    error,
    addMunicipio,
    changeState,
    getMunicipioById,
    updateMunicipio,
  };
}
