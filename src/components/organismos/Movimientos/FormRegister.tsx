import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useState } from "react";
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

type FormularioProps = {
  addData: (movimiento: MovimientoPostData) => Promise<void>;
  onClose: () => void;
  id: string;
};

type CodigoDisponible = {
  id_codigo_inventario: number;
  codigo: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
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
    };

    console.log("🎯 Inventario seleccionado:", data.fk_inventario);
    console.log("🎯 Códigos seleccionados:", data.codigos);

    // Mostrar todos los valores del formulario con su tipo de dato
    console.log("📦 Datos del formulario (campos y tipos):");
    Object.entries(data).forEach(([key, value]) => {
      let tipo: string;
      if (Array.isArray(value)) {
        tipo = "array";
      } else if (value === null) {
        tipo = "null";
      } else {
        tipo = typeof value;
      }
      console.log(`- ${key}:`, value, `(tipo: ${tipo})`);
    });

    // Mostrar el payload que se enviará al backend
    console.log("✅ Payload enviado al backend:", payload);

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
    try {
      await addData(payload);

      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      const mensaje = error?.response?.data?.message;
      addToast({
        title: "Error al guardar movimiento",
        description: Array.isArray(mensaje)
          ? mensaje.join(", ")
          : (mensaje ?? "Ocurrió un error inesperado."),
        color: "danger",
        timeout: 3000,
      });
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
          render={({ field }) => (
            <>
              <div className="w-full flex">
                <Select
                  label="Usuario"
                  placeholder="Selecciona un usuario"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  isInvalid={!!errors.fk_usuario}
                  errorMessage={errors.fk_usuario?.message}
                >
                  {(users ?? []).map((usuario) => (
                    <SelectItem
                      key={usuario.id}
                      textValue={usuario.nombre}
                    >
                      {usuario.nombre}
                    </SelectItem>
                  ))}
                </Select>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModal(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            </>
          )}
        />

        <Controller
          control={control}
          name="fk_tipo_movimiento"
          render={({ field }) => (
            <>
              <div className="flex w-full">
                <Select
                  label="Tipo de Movimiento"
                  placeholder="Selecciona un tipo"
                  {...field}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    field.onChange(id);
                    const tipo = tipos?.find((t) => t.id_tipo === id);
                    setTipoMovimientoSeleccionado(
                      tipo?.nombre.toLowerCase() ?? null
                    );
                  }}
                  isInvalid={!!errors.fk_tipo_movimiento}
                  errorMessage={errors.fk_tipo_movimiento?.message}
                >
                  {(tipos ?? []).map((tipo) => (
                    <SelectItem key={tipo.id_tipo} textValue={tipo.nombre}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </Select>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalTipo(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            </>
          )}
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
          render={({ field }) => (
            <>
              <div className="w-full flex">
                <Select
                  label="Sitio"
                  placeholder="Selecciona un sitio"
                  {...field}
                  onChange={(e) => {
                    const sitioId = Number(e.target.value);
                    field.onChange(sitioId);
                    setSitioSeleccionado(sitioId);
                  }}
                  isInvalid={!!errors.fk_sitio}
                  errorMessage={errors.fk_sitio?.message}
                >
                  {(sitios ?? []).map((sitio) => (
                    <SelectItem key={sitio.id_sitio} textValue={sitio.nombre}>
                      {sitio.nombre}
                    </SelectItem>
                  ))}
                </Select>
                <Buton
                  type="button"
                  className=" m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalSitio(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            </>
          )}
        />

        {sitioSeleccionado && (
          <Controller
            control={control}
            name="fk_inventario"
            render={({ field }) => (
              <>
                <div className="flex w-full">
                  <Select
                    label="Elemento del Inventario"
                    placeholder="Selecciona un elemento"
                    {...field}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      field.onChange(id);
                      setInventarioSeleccionado(id);
                      const inventario = (inventarios ?? []).find(
                        (i) => i.id_inventario === id
                      );
                      if (
                        inventario?.codigos &&
                        Array.isArray(inventario.codigos)
                      ) {
                        const disponibles = inventario.codigos.filter(
                          (c) => !c.uso
                        );
                        setCodigosDisponibles(
                          disponibles.map((c) => ({
                            id_codigo_inventario: c.id_codigo_inventario,
                            codigo: c.codigo,
                          }))
                        );
                        setTieneCaracteristicas(disponibles.length > 0);
                      } else {
                        setCodigosDisponibles([]);
                        setTieneCaracteristicas(false);
                      }
                    }}
                    isInvalid={!!errors.fk_inventario}
                    errorMessage={errors.fk_inventario?.message}
                  >
                    {(inventarios ?? [])

                      .filter((i) => i.fk_sitio.id_sitio === sitioSeleccionado)
                      .filter((i) => i.estado === true)
                      .map((inventario) => {
                        console.log(
                          "Inventarios del sitio seleccionado:",
                          inventarios?.filter(
                            (i) => i.fk_sitio.id_sitio === sitioSeleccionado
                          )
                        );
                        return (
                          <SelectItem
                            key={inventario.id_inventario}
                            textValue={
                              inventario.fk_elemento?.nombre ||
                              "Elemento no disponible"
                            }
                          >
                            {inventario.fk_elemento?.nombre ||
                              "Elemento no disponible"}
                          </SelectItem>
                        );
                      })}
                  </Select>
                  <Buton
                    type="button"
                    className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                    onPress={() => setShowModalInventario(true)}
                  >
                    <PlusCircleIcon />
                  </Buton>
                </div>
              </>
            )}
          />
        )}

        {inventarioSeleccionado &&
          tipoMovimientoSeleccionado &&
          ["salida", "baja", "préstamo"].includes(
            tipoMovimientoSeleccionado
          ) && (
            <>
              {tieneCaracteristicas ? (
                <Controller
                  control={control}
                  name="codigos"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="font-semibold">
                        Selecciona Códigos
                      </label>
                      {codigosDisponibles.map((codigoObj) => (
                        <div
                          key={codigoObj.id_codigo_inventario}
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
                              field.onChange(updated);
                            }}
                          />
                          <span>{codigoObj.codigo}</span>
                        </div>
                      ))}
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

        {tipoMovimientoSeleccionado === "ingreso" && (
          <>
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
          idSitio={0}
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
