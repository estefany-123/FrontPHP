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
  idCodigoInventario: number;
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
      enProceso: true,
      cancelado: false,
      devolutivo: false,
      noDevolutivo: true,
      horaIngreso: "00:00",
      horaSalida: "00:00",
      fechaDevolucion: undefined,
      lugarDestino: undefined,
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
      horaIngreso: data.horaIngreso || undefined,
      horaSalida: data.horaSalida || undefined,
      fechaDevolucion: data.fechaDevolucion
        ? new Date(data.fechaDevolucion)
        : undefined,
    };

    console.log("🎯 Inventario seleccionado:", data.fkInventario);
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
          {...register("lugarDestino")}
          isInvalid={!!errors.lugarDestino}
          errorMessage={errors.lugarDestino?.message}
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
            name="fechaDevolucion"
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Fecha de Devolución"
                onChange={(e) => field.onChange(e.target.value || null)}
                isInvalid={!!errors.fechaDevolucion}
                errorMessage={errors.fechaDevolucion?.message}
                value={field.value ?? ""}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="fkUsuario"
          render={({ field }) => (
            <>
              <div className="w-full flex">
                <Select
                  label="Usuario"
                  placeholder="Selecciona un usuario"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  isInvalid={!!errors.fkUsuario}
                  errorMessage={errors.fkUsuario?.message}
                >
                  {(users ?? []).map((usuario) => (
                    <SelectItem
                      key={usuario.idUsuario}
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
          name="fkTipoMovimiento"
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
                    const tipo = tipos?.find((t) => t.idTipo === id);
                    setTipoMovimientoSeleccionado(
                      tipo?.nombre.toLowerCase() ?? null
                    );
                  }}
                  isInvalid={!!errors.fkTipoMovimiento}
                  errorMessage={errors.fkTipoMovimiento?.message}
                >
                  {(tipos ?? []).map((tipo) => (
                    <SelectItem key={tipo.idTipo} textValue={tipo.nombre}>
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
            {...register("horaIngreso")}
            isInvalid={!!errors.horaIngreso}
            errorMessage={errors.horaIngreso?.message}
          />
        ) : tipoMovimientoSeleccionado &&
          ["salida", "baja", "préstamo"].includes(
            tipoMovimientoSeleccionado
          ) ? (
          <Input
            label="Hora de Salida"
            type="time"
            {...register("horaSalida")}
            isInvalid={!!errors.horaSalida}
            errorMessage={errors.horaSalida?.message}
          />
        ) : null}

        <Controller
          control={control}
          name="fkSitio"
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
                  isInvalid={!!errors.fkSitio}
                  errorMessage={errors.fkSitio?.message}
                >
                  {(sitios ?? []).map((sitio) => (
                    <SelectItem key={sitio.idSitio} textValue={sitio.nombre}>
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
            name="fkInventario"
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
                        (i) => i.idInventario === id
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
                            idCodigoInventario: c.idCodigoInventario,
                            codigo: c.codigo,
                          }))
                        );
                        setTieneCaracteristicas(disponibles.length > 0);
                      } else {
                        setCodigosDisponibles([]);
                        setTieneCaracteristicas(false);
                      }
                    }}
                    isInvalid={!!errors.fkInventario}
                    errorMessage={errors.fkInventario?.message}
                  >
                    {(inventarios ?? [])

                      .filter((i) => i.fkSitio.idSitio === sitioSeleccionado)
                      .filter((i) => i.estado === true)
                      .map((inventario) => {
                        console.log(
                          "Inventarios del sitio seleccionado:",
                          inventarios?.filter(
                            (i) => i.fkSitio.idSitio === sitioSeleccionado
                          )
                        );
                        return (
                          <SelectItem
                            key={inventario.idInventario}
                            textValue={
                              inventario.fkElemento?.nombre ||
                              "Elemento no disponible"
                            }
                          >
                            {inventario.fkElemento?.nombre ||
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
