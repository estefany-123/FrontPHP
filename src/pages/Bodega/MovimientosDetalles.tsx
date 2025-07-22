import { useParams, useNavigate } from "react-router-dom";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { MovimientoExtendido } from "@/types/Movimiento";

export default function MovimientoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movimientoId = Number(id);

  const {
    isLoading,
    getMovimientoById,
    acceptMovimiento,
    cancelMovimiento,
  } = useMovimiento();

  const movimiento = getMovimientoById(movimientoId) as MovimientoExtendido;

  if (isLoading) return <p className="p-4">Cargando movimientos...</p>;
  if (!movimiento) return <p className="p-4 text-red-500">Movimiento no encontrado.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-zinc-800 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Detalle del Movimiento</h1>

      <div className="space-y-2">
        <p><strong>Tipo:</strong> {movimiento.fkTipoMovimiento?.nombre || "N/A"}</p>
        <p><strong>Elemento:</strong> {movimiento.fkInventario?.fkElemento?.nombre || "N/A"}</p>
        <p><strong>Cantidad:</strong> {movimiento.cantidad}</p>
        <p><strong>Usuario:</strong> {movimiento?.fkUsuario?.nombre || "N/A"}</p>
        <p><strong>Estado:</strong> {
          movimiento.aceptado ? "Aceptado" :
          movimiento.cancelado ? "Rechazado" :
          "Pendiente"
        }</p>
        <p><strong>Descripción:</strong> {movimiento.descripcion || "Sin descripción"}</p>
      </div>

      {movimiento.enProceso && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={async () => {
              await acceptMovimiento(movimientoId);
              navigate("/bodega/movimientos"); 
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Aceptar
          </button>

          <button
            onClick={async () => {
              await cancelMovimiento(movimientoId);
              navigate("/bodega/movimientos"); 
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}
