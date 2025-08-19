import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useEffect, useState } from "react";
import { MovimientoCreate, MovimientoCreateSchema } from "@/schemas/Movimento";
import { mapMovimiento } from "@/utils/MapMovimientos";
import { MovimientoPostData } from "@/axios/Movimentos/postMovimiento";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioTiposMovimiento from "../TiposMovimiento/FormRegister";
import FormularioU from "../Usuarios/FormRegister";
import FormularioInventario from "../Inventarios/FormRegister";
import FormularioSitio from "../Sitios/FormRegister";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";

type FormularioProps = {
  addData: (movimiento: MovimientoPostData) => Promise<void>;
  onClose: () => void;
  id: string;
};

type CodigoDisponible = {
  idCodigoInventario: number;
  codigo: string;
  uso: boolean;
};

export default function Formulario({ onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    resolver: zodResolver(MovimientoCreateSchema),
    mode: "onChange",
    defaultValues: {
      cantidad: 0,
      estado: true,
      aceptado: false,
      en_proceso: true,
      cancelado: false,
      devolutivo: false,
      no_devolutivo: true,
      hora_ingreso: "00:00",
      hora_salida: "00:00",
      fecha_devolucion: undefined,
      lugar_destino: undefined,
      codigos: [],
    },
  });

  const { users, addUser } = useUsuario();
  const { addMovimiento } = useMovimiento();
  const { tipos, addTipoMovimiento } = useTipoMovimiento();
  const { sitios, addSitio } = useSitios();
  const { inventarios, addInventario } = useInventario();
  const [sitioSeleccionado, setSitioSeleccionado] = useState<number | null>(
    null
  );
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState<
    number | null
  >(null);
  const [tipoMovimientoSeleccionado, setTipoMovimientoSeleccionado] = useState<
    string | null
  >(null);
  const [isDevolutivo, setIsDevolutivo] = useState(false);
  const [tieneCaracteristicas, setTieneCaracteristicas] = useState(false);
  const [codigosDisponibles, setCodigosDisponibles] = useState<
    CodigoDisponible[]
  >([]);
  // console.log("Códigos disponibles que llegan del inventario:", inventarios?.codigos);

  //modales
  const [showModal, setShowModal] = useState(false);
  const [showModalTipo, setShowModalTipo] = useState(false);
  const [showModalSitio, setShowModalSitio] = useState(false);
  const [showModalInventario, setShowModalInventario] = useState(false);

  const onSubmit = async (data: MovimientoCreate) => {
    const payload = {
      ...mapMovimiento(data),
      codigos: data.codigos?.map((c) => c.trim()),
      hora_ingreso: data.hora_ingreso || undefined,
      hora_salida: data.hora_salida || undefined,
      fecha_devolucion: data.fecha_devolucion
        ? new Date(data.fecha_devolucion)
        : undefined,

      cantidad: tieneCaracteristicas
        ? data.codigos?.length || 0
        : data.cantidad,
    };

    // Validación de códigos obligatorios en algunos tipos de movimiento
    if (
      tipoMovimientoSeleccionado &&
      ["salida", "baja", "préstamo"].includes(tipoMovimientoSeleccionado) &&
      tieneCaracteristicas &&
      (!payload.codigos || payload.codigos.length === 0)
    ) {
      addToast({
        title: "Error",
        description: "Debes seleccionar al menos un código",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    console.log("🚀 Enviando payload al backend:", payload);

    try {
      const res = await addMovimiento(payload);
      console.log("✅ Respuesta del servidor:", res);

      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      const campo = error?.response?.data?.campo;
      const mensaje = error?.response?.data?.message;

      console.log("🔍 Error completo:", error);
      console.log("🔍 Error response:", error?.response?.data);
    }
  };

  console.log("Errores", errors);

  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          label="Descripción"
          placeholder="Descripción"
          type="text"
          {...register("descripcion")}
          isInvalid={!!errors.descripcion}
          errorMessage={errors.descripcion?.message}
        />
        <Input
          label="Destino"
          type="text"
          {...register("lugar_destino")}
          isInvalid={!!errors.lugar_destino}
          errorMessage={errors.lugar_destino?.message}
        />

        <Controller
          control={control}
          name="tipo_bien"
          render={({ field }) => (
            <Select
              label="Tipo de Bien"
              placeholder="Selecciona un tipo"
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                setIsDevolutivo(value === "devolutivo");
              }}
              value={field.value}
              isInvalid={!!errors.tipo_bien}
              errorMessage={errors.tipo_bien?.message}
            >
              <SelectItem key="devolutivo" textValue="Devolutivo">
                Devolutivo
              </SelectItem>
              <SelectItem key="no_devolutivo" textValue="No Devolutivo">
                No Devolutivo
              </SelectItem>
            </Select>
          )}
        />

        {isDevolutivo && (
          <Controller
            control={control}
            name="fecha_devolucion"
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Fecha de Devolución"
                onChange={(e) => field.onChange(e.target.value || null)}
                isInvalid={!!errors.fecha_devolucion}
                errorMessage={errors.fecha_devolucion?.message}
                value={field.value ?? ""}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="fk_usuario"
          render={({ field }) => {
            const [queryUsuario, setQueryUsuario] = useState("");
            const [showOptionsUsuario, setShowOptionsUsuario] = useState(false);

            const filteredUsuarios = (users ?? []).filter((u) =>
              u.nombre.toLowerCase().includes(queryUsuario.toLowerCase())
            );

            const selectedUsuario = users?.find((u) => u.id === field.value);

            useEffect(() => {
              if (selectedUsuario) {
                setQueryUsuario(selectedUsuario.nombre);
              }
            }, [selectedUsuario?.id]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Usuario"
                    placeholder="Selecciona un usuario..."
                    value={queryUsuario}
                    onChange={(e) => {
                      setQueryUsuario(e.target.value);
                      setShowOptionsUsuario(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsUsuario(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsUsuario(false), 150)
                    }
                    isInvalid={!!errors.fk_usuario}
                    errorMessage={errors.fk_usuario?.message}
                  />
                  {showOptionsUsuario && filteredUsuarios.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredUsuarios.map((usuario) => (
                        <div
                          key={usuario.id}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(usuario.id);
                            setQueryUsuario(usuario.nombre);
                            setShowOptionsUsuario(false);
                          }}
                        >
                          {usuario.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModal(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="fk_tipo_movimiento"
          render={({ field }) => {
            const [queryTipo, setQueryTipo] = useState("");
            const [showOptionsTipo, setShowOptionsTipo] = useState(false);

            const filteredTipos = (tipos ?? []).filter((t) =>
              t.nombre.toLowerCase().includes(queryTipo.toLowerCase())
            );

            const selectedTipo = tipos?.find((t) => t.id_tipo === field.value);

            useEffect(() => {
              if (selectedTipo) {
                setQueryTipo(selectedTipo.nombre);
              }
            }, [selectedTipo?.id_tipo]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Tipo de Movimiento"
                    placeholder="Selecciona un tipo..."
                    value={queryTipo}
                    onChange={(e) => {
                      setQueryTipo(e.target.value);
                      setShowOptionsTipo(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsTipo(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsTipo(false), 150)
                    }
                    isInvalid={!!errors.fk_tipo_movimiento}
                    errorMessage={errors.fk_tipo_movimiento?.message}
                  />
                  {showOptionsTipo && filteredTipos.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredTipos.map((tipo) => (
                        <div
                          key={tipo.id_tipo}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(tipo.id_tipo);
                            setQueryTipo(tipo.nombre);
                            setShowOptionsTipo(false);
                            setTipoMovimientoSeleccionado(
                              tipo?.nombre.toLowerCase() ?? null
                            );
                          }}
                        >
                          {tipo.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalTipo(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        {tipoMovimientoSeleccionado === "ingreso" ? (
          <Input
            label="Hora de Ingreso"
            type="time"
            {...register("hora_ingreso")}
            isInvalid={!!errors.hora_ingreso}
            errorMessage={errors.hora_ingreso?.message}
          />
        ) : tipoMovimientoSeleccionado &&
          ["salida", "baja", "préstamo"].includes(
            tipoMovimientoSeleccionado
          ) ? (
          <Input
            label="Hora de Salida"
            type="time"
            {...register("hora_salida")}
            isInvalid={!!errors.hora_salida}
            errorMessage={errors.hora_salida?.message}
          />
        ) : null}

        <Controller
          control={control}
          name="fk_sitio"
          render={({ field }) => {
            const [querySitio, setQuerySitio] = useState("");
            const [showOptionsSitio, setShowOptionsSitio] = useState(false);

            const filteredSitios = (sitios ?? []).filter((s) =>
              s.nombre.toLowerCase().includes(querySitio.toLowerCase())
            );

            const selectedSitio = sitios?.find(
              (s) => s.id_sitio === field.value
            );

            useEffect(() => {
              if (selectedSitio) {
                setQuerySitio(selectedSitio.nombre);
              }
            }, [selectedSitio?.id_sitio]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Sitio"
                    placeholder="Selecciona un sitio..."
                    value={querySitio}
                    onChange={(e) => {
                      setQuerySitio(e.target.value);
                      setShowOptionsSitio(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsSitio(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsSitio(false), 150)
                    }
                    isInvalid={!!errors.fk_sitio}
                    errorMessage={errors.fk_sitio?.message}
                  />
                  {showOptionsSitio && filteredSitios.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredSitios.map((sitio) => (
                        <div
                          key={sitio.id_sitio}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const sitioId = sitio.id_sitio;
                            field.onChange(sitioId);
                            setQuerySitio(sitio.nombre);
                            setShowOptionsSitio(false);
                            setSitioSeleccionado(sitioId ?? null);
                          }}
                        >
                          {sitio.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className=" m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalSitio(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        {sitioSeleccionado && (
          <Controller
            control={control}
            name="fk_inventario"
            render={({ field }) => {
              const [query, setQuery] = useState("");
              const [showOptions, setShowOptions] = useState(false);

              const inventariosFiltrados =
                (inventarios ?? [])
                  .filter((i) => i.sitio?.id_sitio === sitioSeleccionado)
                  .filter((i) => i.estado === true)
                  .filter((i) =>
                    i.elemento?.nombre
                      ?.toLowerCase()
                      .includes(query.toLowerCase())
                  ) || [];

              const inventarioSeleccionado = (inventarios ?? []).find(
                (i) => i.id_inventario === field.value
              );

              useEffect(() => {
                if (inventarioSeleccionado) {
                  setQuery(inventarioSeleccionado.elemento?.nombre ?? "");
                }
              }, [inventarioSeleccionado?.id_inventario]);

              return (
                <div className="relative w-full flex items-start gap-2">
                  <div className="w-full">
                    <Input
                      label="Elemento del Inventario"
                      placeholder="Escribe para buscar..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowOptions(true);
                        field.onChange(null);
                      }}
                      onFocus={() => setShowOptions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowOptions(false), 150)
                      }
                      isInvalid={!!errors.fk_inventario}
                      errorMessage={errors.fk_inventario?.message}
                    />

                    {showOptions && inventariosFiltrados.length > 0 && (
                      <div
                        className="absolute z-20 mt-1 w-full max-h-52 overflow-auto 
                  rounded-lg border border-gray-200 bg-white/80 
                  shadow-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        {inventariosFiltrados.map((inv) => (
                          <div
                            key={inv.id_inventario}
                            className="px-4 py-2 text-sm text-black hover:bg-gray-300 cursor-pointer"
                            onBlur={() => {
                              setTimeout(() => {
                                setShowOptions(false);
                                if (!field.value) setQuery(""); // opcional
                              }, 200); // darle tiempo al onMouseDown
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              field.onChange(inv.id_inventario);
                              setQuery(inv.elemento?.nombre ?? "");
                              setShowOptions(false);
                              setInventarioSeleccionado(
                                inv.id_inventario ?? null
                              );

                              const disponibles =
                                inv.codigos?.filter((c) => !c.uso) || [];
                              setCodigosDisponibles(
                                disponibles.map((c) => ({
                                  idCodigoInventario: c.id_codigo_inventario,
                                  codigo: c.codigo,
                                  uso: c.uso,
                                }))
                              );
                              setTieneCaracteristicas(disponibles.length > 0);
                            }}
                          >
                            {inv.elemento?.nombre ?? "Elemento sin nombre"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Buton
                    type="button"
                    className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                    onPress={() => setShowModalInventario(true)}
                  >
                    <PlusCircleIcon />
                  </Buton>
                </div>
              );
            }}
          />
        )}

        {inventarioSeleccionado &&
          tipoMovimientoSeleccionado &&
          [
            "salida",
            "baja",
            "préstamo",
            "prestamo",
            "devolución",
            "devolucion",
          ].includes(tipoMovimientoSeleccionado) && (
            <>
              {console.log(">>> Movimiento:", tipoMovimientoSeleccionado)}
              {console.log(
                ">>> Inventario seleccionado:",
                inventarioSeleccionado
              )}
              {console.log(">>> Tiene características?:", tieneCaracteristicas)}
              {console.log(">>> Codigos disponibles:", codigosDisponibles)}

              {tieneCaracteristicas ? (
                <Controller
                  control={control}
                  name="codigos"
                  render={({ field }) => {
                    // Si es devolución, solo mostrar códigos en uso
                    const codigosFiltrados =
                      tipoMovimientoSeleccionado.toLowerCase() === "devolucion"
                        ? codigosDisponibles.filter((c) => c.uso === true)
                        : codigosDisponibles;

                    console.log(">>> Codigos filtrados:", codigosFiltrados);
                    console.log(">>> Field value:", field.value);

                    return (
                      <div className="space-y-2">
                        <label className="font-semibold">
                          Selecciona Códigos
                        </label>
                        {codigosFiltrados.map((codigoObj) => (
                          <div
                            key={codigoObj.idCodigoInventario}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={codigoObj.codigo}
                              checked={field.value?.includes(codigoObj.codigo)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...(field.value ?? []), codigoObj.codigo]
                                  : (field.value ?? []).filter(
                                      (c) => c !== codigoObj.codigo
                                    );
                                console.log(
                                  ">>> Nuevo value después del cambio:",
                                  updated
                                );
                                field.onChange(updated);
                              }}
                            />
                            <span>{codigoObj.codigo}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              ) : (
                <Input
                  label="Cantidad"
                  type="number"
                  {...register("cantidad", { valueAsNumber: true })}
                  isInvalid={!!errors.cantidad}
                  errorMessage={errors.cantidad?.message}
                />
              )}
            </>
          )}

        {tipoMovimientoSeleccionado === "ingreso" && (
          <>
            {console.log(">>> Movimiento:", tipoMovimientoSeleccionado)}
            {console.log(
              ">>> Inventario seleccionado:",
              inventarioSeleccionado
            )}
            {console.log(">>> Tiene características?:", tieneCaracteristicas)}
            {console.log(">>> Codigos disponibles:", codigosDisponibles)}
            {tieneCaracteristicas ? (
              <Controller
                control={control}
                name="codigos"
                render={({ field }) => (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-800">
                      Ingresar Códigos Nuevos
                    </h3>

                    <div className="space-y-2">
                      {(field.value ?? [""]).map((codigo, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
                        >
                          <Input
                            className="flex-1"
                            placeholder={`Código ${index + 1}`}
                            value={codigo}
                            onChange={(e) => {
                              const updated = [...(field.value ?? [])];
                              updated[index] = e.target.value;
                              field.onChange(updated);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(field.value ?? [])];
                              updated.splice(index, 1);
                              field.onChange(updated);
                            }}
                            className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange([...(field.value ?? []), ""])
                        }
                        className="px-4 py-2 mt-2 text-sm rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        + Añadir otro código
                      </button>
                    </div>
                  </div>
                )}
              />
            ) : (
              <Input
                label="Cantidad"
                type="number"
                {...register("cantidad", { valueAsNumber: true })}
                isInvalid={!!errors.cantidad}
                errorMessage={errors.cantidad?.message}
              />
            )}
          </>
        )}
      </Form>

      <Modal
        ModalTitle="Agregar Tipo de Movimiento"
        isOpen={showModalTipo}
        onOpenChange={() => setShowModalTipo(false)}
      >
        <FormularioTiposMovimiento
          id="tipoMovimiento"
          onClose={() => setShowModalTipo(false)}
          addData={async (data) => {
            await addTipoMovimiento(data);
          }}
        />
        <Buton form="tipoMovimiento" text="Guardar" type="submit" />
      </Modal>

      <Modal
        ModalTitle="Agregar Usuario"
        isOpen={showModal}
        onOpenChange={() => setShowModal(false)}
      >
        <FormularioU
          id="usuario"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addUser(data);
          }}
        />
        <Buton form="usuario" text="Guardar" type="submit" />
      </Modal>

      {/* Modal: Inventario */}
      <Modal
        ModalTitle="Agregar Inventario"
        isOpen={showModalInventario}
        onOpenChange={() => setShowModalInventario(false)}
      >
        <FormularioInventario
          id="inventario"
          onClose={() => setShowModalInventario(false)}
          addData={async (data) => {
            await addInventario(data);
          }}
          id_sitio={0}
        />
        <Buton form="inventario" text="Guardar" type="submit" />
      </Modal>

      <Modal
        ModalTitle="Agregar Sitio"
        isOpen={showModalSitio}
        onOpenChange={() => setShowModalSitio(false)}
      >
        <FormularioSitio
          id="sitio"
          onClose={() => setShowModalSitio(false)}
          addData={async (data) => {
            await addSitio(data);
          }}
        />
        <Buton form="sitio" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
