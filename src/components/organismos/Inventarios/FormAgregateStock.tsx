import Buton from "@/components/molecules/Button";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { addToast, Input } from "@heroui/react";
import { useState } from "react";

type Props = {
  fkInventario?: number;
  fkElemento: number;
  fkSitio: number;
  onClose: () => void;
};

export const FormAgregateStock = ({ fkElemento, fkSitio, onClose }: Props) => {
  console.log("🚀 Se montó <FormAgregateStock />", { fkElemento, fkSitio });
  const [codigos, setCodigos] = useState<string[]>([]);
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const { agregarStockInventario } = useInventario();

  const agregarCodigo = () => {
    if (!nuevoCodigo.trim() || codigos.includes(nuevoCodigo)) return;
    setCodigos([...codigos, nuevoCodigo]);
    setNuevoCodigo("");
  };

  const guardar = async () => {
    try {
      await agregarStockInventario({ fkElemento, fkSitio, codigos });
      addToast({
        title: "Éxito",
        description: `${codigos.length} códigos agregados correctamente`,
        color: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar códigos", error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Nuevo Código"
        placeholder="Escribe el código"
        value={nuevoCodigo}
        onChange={(e) => setNuevoCodigo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && agregarCodigo()}
      />
      <Buton text="Agregar código" onPress={agregarCodigo} />
      <ul className="border rounded p-2 max-h-40 overflow-auto">
        {codigos.map((c, i) => (
          <li key={i} className="text-sm border-b py-1">
            {c}
          </li>
        ))}
      </ul>
      <Buton
        text="Guardar y actualizar stock"
        onPress={guardar}
        disabled={codigos.length === 0}
      />
    </div>
  );
};
