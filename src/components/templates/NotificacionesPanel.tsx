import { useAuth } from "@/providers/AuthProvider";
import { useNotificaciones } from "@/hooks/Notificaciones/useNotificaciones";
import Modall from "../organismos/modal";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NotificacionesPanel({ open, onClose }: Props) {
  const { idUsuario } = useAuth();
  const { notificaciones, isLoading, cambiarEstado, marcarLeida } =
    useNotificaciones(idUsuario!);

  const navigate = useNavigate();

  const redirigirAMovimiento = (idMovimiento: number) => {
    onClose();
    navigate(`/bodega/movimientosDetalle/${idMovimiento}`);
  };

  if (isLoading) return <p className="p-4">Cargando notificaciones...</p>;

  return (
    <Modall isOpen={open} onOpenChange={onClose} ModalTitle="Notificaciones">
      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Notificaciones</h2>

        {notificaciones?.length === 0 && <p>No hay notificaciones.</p>}

        {notificaciones?.map((noti) => (
          <div
            key={noti.idNotificacion}
            onClick={() => {
              if (noti.requiereAccion && noti.data?.idMovimiento) {
                redirigirAMovimiento(noti.data.idMovimiento);
              }
            }}
            className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 border border-gray-200 dark:border-zinc-700 cursor cursor-pointer"
          >
            <h3 className="font-semibold">{noti.titulo}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {noti.mensaje}
            </p>

            {/* Acciones si requiere revisión */}
            {noti.requiereAccion && noti.estado === "enProceso" && (
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await cambiarEstado({
                      id: noti.idNotificacion,
                      estado: "aceptado",
                    });
                    navigate("/bodega/movimientos"); // Redirige después de aceptar
                  }}
                  className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
                >
                  Aceptar
                </button>
                <button
                  onClick={async () =>{
                    await cambiarEstado({
                      id: noti.idNotificacion,
                      estado: "cancelado",
                    })
                    navigate("/bodega/movimientos");
                  }}
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Rechazar
                </button>
              </div>
            )}

            {/* Estado actual */}
            {noti.estado && (
              <p className="text-sm mt-2 text-gray-500">
                Estado: <strong>{noti.estado}</strong>
              </p>
            )}

            {/* Botón marcar como leída */}
            {!noti.leido && (
              <button
                onClick={async () =>{ await marcarLeida(noti.idNotificacion)
                  navigate("/");}}
                className="mt-2 text-blue-500 underline text-sm"
              >
                Marcar como leída
              </button>
            )}
          </div>
        ))}
      </div>
    </Modall>
  );
}
