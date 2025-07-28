import { getCodigoInventario } from "@/axios/CodigoInventario/getCodigoInventario";
import { putCodigoInventario } from "@/axios/CodigoInventario/putCodigoInventario";
import { CodigoInventario } from "@/types/codigoInventario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCodigoInventario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<CodigoInventario[]>({
    queryKey: ["codigosInventario"],
    queryFn: getCodigoInventario,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const getCodigosPorInventario = (
    id_inventario: number,
    codigosData: CodigoInventario[] = data ?? []
  ): CodigoInventario[] => {
    return codigosData.filter((c) => {
      if (typeof c.fk_inventario === "object" && c.fk_inventario !== null) {
        return c.fk_inventario.id_inventario === id_inventario;
      }
      return c.fk_inventario === id_inventario;
    });
  };

  const getCodigoInventarioById = (
    id: number,
    codigos: CodigoInventario[] | undefined = data
  ): CodigoInventario | null => {
    return codigos?.find((codigo) => codigo.id_codigo_inventario === id) || null;
  };

  const updateCodigoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CodigoInventario }) => {
      const { id_codigo_inventario, ...resto } = data;
      return putCodigoInventario(id, resto);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["codigosInventario"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el código de inventario:", error);
    },
  });

  const updateCodigoInventario = async (
    id: number,
    data: Partial<CodigoInventario>
  ) => {
    return updateCodigoMutation.mutateAsync({ id, data });
  };

  return {
    codigos: data,
    isLoading,
    isError,
    error,
    updateCodigoInventario,
    getCodigoInventarioById,
    getCodigosPorInventario,
  };
}
