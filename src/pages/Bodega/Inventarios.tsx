import { Card } from "@heroui/react";
import { useAreas } from "@/hooks/areas/useAreas";
import { Link } from "react-router-dom";

export const Inventario = () => {
  const { areas, isLoading, isError, error } = useAreas();

  if (isLoading) return <p>Cargando áreas...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <h1 className="text-2xl text-center font-bold mb-6">
        Inventarios Por Área
      </h1>
      <div className="flex flex-wrap gap-4">
        {areas?.map((area) => (
          <Card
            key={area.id_area}
            className="w-64 p-4 ml-3 shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white dark:hover:text-black border-1 transition"
          >
            <Link to={`/bodega/inventario/areas/${area.id_area}`}>
              <h2 className="text-lg text-center font-semibold">
                {area.nombre}
              </h2>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
};
