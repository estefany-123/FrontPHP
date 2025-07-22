import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/Home/Home";
import { InventarioSitio } from "./pages/Bodega/Inventario/Sitios/InventarioSitio";
import { InventarioArea } from "./pages/Bodega/Inventario/Areas/InventarioArea";
import { Inventario } from "./pages/Bodega/Inventarios";
import Login from "./pages/Login";
import UsersTable from "./pages/Admin/usuarios";
import SedeTable from "./pages/Admin/sedes";
import AreaTable from "./pages/Admin/areas";
import { RolTable } from "./pages/Admin/Roles";
import FichasTable from "./pages/Admin/fichas";
import ProgramasTable from "./pages/Admin/programas";
import CentrosTable from "./pages/Admin/centros";
import MunicipiosTable from "./pages/Admin/municipio";
import SitiosTable from "./pages/Admin/sitios";
import TipoSitioTable from "./pages/Admin/tipoSitio";
import { ElementosTable } from "./pages/Bodega/Elementos";
import { MovimientoTable } from "./pages/Bodega/Movimientos";
import { TipoMovimientoTable } from "./pages/Bodega/TiposMovimiento";
import { UnidadTable } from "./pages/Bodega/UnidadesMedida";
import CategoriasTable from "./pages/Admin/categorias";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import { CaracteristicasTable } from "./pages/Bodega/Caracteristicas";
import ResetPassword from "./pages/ResetPassword";
import Perfil from "./pages/Perfil";
import {Reportes} from "./pages/Reportes/Reportes";
import MovimientoDetalle from "./pages/Bodega/MovimientosDetalles";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="admin/usuarios" element={<UsersTable />} />
          <Route path="admin/roles" element={<RolTable />} />
          <Route path="admin/fichas" element={<FichasTable />} />
          <Route path="admin/programas" element={<ProgramasTable />} />
          <Route path="admin/areas" element={<AreaTable />} />
          <Route path="admin/sedes" element={<SedeTable />} />
          <Route path="admin/centros" element={<CentrosTable />} />
          <Route path="admin/municipios" element={<MunicipiosTable />} />
          <Route path="admin/sitios" element={<SitiosTable />} />
          <Route path="admin/tiposSitio" element={<TipoSitioTable />} />
          <Route path="bodega/elementos" element={<ElementosTable />} />
          <Route path="bodega/movimientos" element={<MovimientoTable />} />
          <Route path="bodega/movimientosDetalle/:id" element={<MovimientoDetalle />} />
          <Route path="bodega/tipos" element={<TipoMovimientoTable />} />
          <Route path="bodega/unidades" element={<UnidadTable />} />
          <Route path="bodega/categorias" element={<CategoriasTable />} />
          <Route
            path="bodega/caracteristicas"
            element={<CaracteristicasTable />}
          />
          <Route path="bodega/inventario/" element={<Inventario />} />
          <Route path="bodega/inventario/areas" element={<Inventario />} />
          <Route
            path="bodega/inventario/areas/:id"
            element={<InventarioArea />}
          />
          <Route
            path="bodega/inventario/areas/:id/sitios/:sitioId"
            element={<InventarioSitio />}
          />
        <Route path="reportes" element={<Reportes/>}></Route>
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/forgotPass" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;
