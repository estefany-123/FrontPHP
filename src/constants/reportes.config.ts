export const reports = [
  {
    id: "usuarios-con-mas-movimientos",
    title: "Movimientos Realizados por los Usarios",
    description:
      "Muestra los usuarios que han realizado movimientos y a que elementos.",
    accessors: ["usuario", "sitio", "total_movimientos", "cantidad", "codigos"],
    headers: [
      "Usuario",
      "Sitio",
      "Total de Movimientos",
      "Cantidad",
      "Códigos",
    ],
  },
  {
    id: "historial-movimientos",
    title: "Histotial de Movimientos",
    description:
      "Da un historial acerca de los moviemitos que se han realizado.",
    headers: [
      "Tipo",
      "Elemento",
      "Usuario",
      "Sitio",
      "Área",
      "Lugar destino",
      "Fecha",
      "Cantidad",
      "Códigos",
    ],
    accessors: [
      "tipo",
      "elemento",
      "usuario",
      "sitio",
      "area",
      "lugar_destino",
      "fecha",
      "cantidad",
      "codigos",
    ],
  },
  {
    id: "sitios-con-mayor-stock",
    title: "Stock del inventraio por Sitios",
    description: "Elementos disponibles por sitio.",
    headers: ["Sitio", "Área", "Encargado", "Elemento", "Cantidad"],
    accessors: ["sitio", "area", "encargado", "elemento", "cantidad"],
  },
  {
    id: "elementos-por-caducar",
    title: "Elementos por caducar",
    description: "Lista de elementos que vencen próximamente.",
    headers: [
      "Nombre",
      "Vencimiento",
      "Creado",
      "Registrado por",
      "Sitio",
      "Área",
      "Días restantes",
    ],
    accessors: [
      "nombre",
      "vencimiento",
      "creado",
      "registrado_por",
      "sitio",
      "area",
      "dias_restantes",
    ],
  },
];

export const filtrosPorReporte: Record<
  string,
  Array<
    | "fecha"
    | "tipoMovimiento"
    | "sitio"
    | "estado"
    | "nombre"
    | "usuario"
    | "area"
  >
> = {
  "usuarios-con-mas-movimientos": ["fecha", "sitio", "usuario"],
  "historial-movimientos": ["fecha", "tipoMovimiento", "sitio", "usuario"],
  "sitios-con-mayor-stock": ["sitio"],
  "elementos-por-caducar": ["fecha", "sitio", "nombre"],
};
