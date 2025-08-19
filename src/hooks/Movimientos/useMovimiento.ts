import { acceptMovimiento } from "@/axios/Movimentos/acceptMovimiento";
import { cancelMovimiento } from "@/axios/Movimentos/cancelMovimiento";
import { getCodigosDisponiblesParaDevolver } from "@/axios/Movimentos/getCodigosDisponibles";
import { getMovimiento } from "@/axios/Movimentos/getMovimento";
import {
  MovimientoPostData,
  postMovimiento,
} from "@/axios/Movimentos/postMovimiento";
import { putMovimiento } from "@/axios/Movimentos/putMovimiento";
import { Movimiento } from "@/types/Movimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMovimiento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Movimiento[]>({
    queryKey: ["movimientos"],
queryFn: async () => {
  console.log("🔎 Ejecutando getMovimiento...");
  const res = await getMovimiento();
  console.log("✅ Movimientos obtenidos:", res);

  // 👀 Inspecciona cada movimiento y sus características
  res.forEach((mov: any, idx: number) => {
    console.log(`📦 Movimiento [${idx}] -> ID: ${mov.id_movimiento}`);
    if (mov.inventario?.elemento) {
      console.log("   🔹 Elemento:", mov.inventario.elemento.nombre);
      console.log("   🔹 Características:", mov.inventario.elemento.caracteristicas ?? "❌ No tiene características");
    } else {
      console.log("   ⚠️ Este movimiento no tiene inventario/elemento asociado");
    }
  });

  return res;
},

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const getCodigosParaDevolver = (idInventario: number) => {
    return useQuery<string[]>({
      queryKey: ["codigos-devolucion", idInventario],
      queryFn: async () => {
        console.log("🔎 Buscando códigos para devolver de inventario:", idInventario);
        const res = await getCodigosDisponiblesParaDevolver(idInventario);
        console.log("✅ Códigos obtenidos:", res);
        return res;
      },
      enabled: idInventario !== 0,
    });
  };

  const addMovimientoMutation = useMutation({
    mutationFn: async (movimiento: Movimiento) => {
      console.log("📥 Agregando movimiento:", movimiento);
      const res = await postMovimiento(movimiento);
      console.log("✅ Movimiento agregado:", res);
      return res;
    },
    onSuccess: () => {
      console.log("♻️ Invalidando cache de movimientos...");
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
    onError: (error) => {
      console.error("❌ Error al cargar el movimiento:", error);
    },
  });

  const getMovimientoById = (
    id: number,
    movimientos: Movimiento[] | undefined = data
  ): Movimiento | null => {
    const mov = movimientos?.find((movimiento) => movimiento.id_movimiento === id) || null;
    console.log("🔎 Buscando movimiento por ID:", id, "➡️ Resultado:", mov);
    return mov;
  };

  const updateMovimientoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MovimientoPostData }) => {
      const { id_movimiento, ...resto } = data;
      console.log("📤 Actualizando movimiento:", id, "con datos:", resto);
      const res = await putMovimiento(id, resto);
      console.log("✅ Movimiento actualizado:", res);
      return res;
    },
    onSuccess: () => {
      console.log("♻️ Invalidando cache de movimientos...");
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
    onError: (error) => {
      console.error("❌ Error al actualizar:", error);
    },
  });

  const acceptMovimientoMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("📥 Aceptando movimiento con ID:", id);
      const res = await acceptMovimiento(id);
      console.log("✅ Movimiento aceptado:", res);
      return res;
    },
    onSuccess: () => {
      console.log("♻️ Invalidando cache de movimientos y notificaciones...");
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
    onError: (error) => {
      console.error("❌ Error al aceptar el movimiento:", error);
    },
  });

  const cancelMovimientoMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("📥 Cancelando movimiento con ID:", id);
      const res = await cancelMovimiento(id);
      console.log("✅ Movimiento cancelado:", res);
      return res;
    },
    onSuccess: () => {
      console.log("♻️ Invalidando cache de movimientos y notificaciones...");
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
    onError: (error) => {
      console.error("❌ Error al rechazar el movimiento:", error);
    },
  });

  const addMovimiento = async (movimiento: Movimiento) => {
    console.log("⚡ Ejecutando addMovimiento con:", movimiento);
    return addMovimientoMutation.mutateAsync(movimiento);
  };

  const updateMovimiento = async (id: number, data: Movimiento) => {
    console.log("⚡ Ejecutando updateMovimiento con ID:", id, "y datos:", data);
    return updateMovimientoMutation.mutateAsync({ id, data });
  };

  return {
    movimientos: data,
    isLoading,
    isError,
    error,
    addMovimiento,
    getMovimientoById,
    updateMovimiento,
    acceptMovimiento: acceptMovimientoMutation.mutateAsync,
    cancelMovimiento: cancelMovimientoMutation.mutateAsync,
    getCodigosParaDevolver,
  };
}
