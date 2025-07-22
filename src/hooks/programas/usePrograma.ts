import { deletePrograma } from "@/axios/ProgramasFormacion/deletePrograma";
import { getPrograma } from "@/axios/ProgramasFormacion/getPrograma";
import { postPrograma } from "@/axios/ProgramasFormacion/postPrograma";
import { putPrograma } from "@/axios/ProgramasFormacion/putPrograma";
import { Pformacion } from "@/types/programaFormacion";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePrograma() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Pformacion[]>({
    queryKey: ["programa"],
    queryFn: getPrograma,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addProgramaMutation = useMutation({
    mutationFn: postPrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programa"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar la Ficha", error);
    },
  });

  const getProgramaById = (
    id: number,
    Programa: Pformacion[] | undefined = data
  ): Pformacion | null => {
    return Programa?.find((Programa) => Programa.idPrograma === id) || null;
  };

  const updateProgramaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Pformacion }) => {
      const { idPrograma, ...resto } = data;
      return putPrograma(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programa"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deletePrograma,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["programa"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addPrograma = async (programa: Pformacion) => {
    return addProgramaMutation.mutateAsync(programa);
  };

  const updatePrograma = async (id: number, data: Pformacion) => {
    return updateProgramaMutation.mutateAsync({ id, data });
  };

  const changeState = async (idPrograma: number) => {
    return changeStateMutation.mutateAsync(idPrograma);
  };

  return {
    programas: data,
    isLoading,
    isError,
    error,
    addPrograma,
    changeState,
    getProgramaById,
    updatePrograma,
  };
}
