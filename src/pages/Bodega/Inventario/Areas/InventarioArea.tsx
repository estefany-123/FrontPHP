import { useParams } from "react-router-dom";
import { useAreas } from "@/hooks/areas/useAreas";
import { useSitios } from "@/hooks/sitios/useSitios";
import {  Card } from "@heroui/react";
import { Link } from "react-router-dom";
import Buton from "@/components/molecules/Button";

export const InventarioArea = () => {
  const { id } = useParams();
  const areaId = parseInt(id || "0");
  const { areas } = useAreas();
  const { sitios, isLoading, isError } = useSitios();

  const area = areas?.find((a) => a.idArea === areaId);
const sitiosFiltrados = sitios?.filter(
  (sitio) => Number(sitio.fkArea?.idArea) === Number(id)
);

  if (isLoading) return <p>Cargando sitios...</p>;
  if (isError) return <p>Error al cargar los sitios</p>;
  if (!area) return <p>Área no encontrada</p>;


  return (
    <div>
      <Link to={`/bodega/inventario/areas/`}>
        <h2 className="text-lg m-4 font-semibold">
          <Buton className="hover: hover:text-white dark:hover:text-white">Regresar</Buton>
        </h2>
      </Link>
      <h1 className="text-2xl text-center font-bold mb-4">
        Sitios en el área: {area.nombre}
      </h1>
      <div className="flex flex-wrap gap-4">
        {sitiosFiltrados?.map((sitio) => (
          <Card key={sitio.idSitio} 
          className="w-64 p-4 ml-3 shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white dark:hover:text-black border-1 transition"
>
            <Link
              to={`/bodega/inventario/areas/${areaId}/sitios/${sitio.idSitio}`}
            >
              <h2 className="text-lg text-center font-semibold">{sitio.nombre}</h2>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
