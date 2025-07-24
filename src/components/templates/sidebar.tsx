import { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  CubeIcon,
  DocumentChartBarIcon,
  Bars3Icon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  GlobeAmericasIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";


const menuItems = [
  {name: "Inicio", icon: HomeIcon, href:"/"},
  {
    name: "Admin",
    icon: UserIcon,
    href: "#",
    subMenu: [
      { name: "Usuarios", icon: UserIcon, href: "/admin/usuarios" },
      { name: "Fichas", icon: TagIcon, href: "/admin/fichas" },
      { name: "Areas", icon: GlobeAmericasIcon, href: "/admin/areas" },
      { name: "Sitios", icon: BuildingOfficeIcon, href: "/admin/sitios" },
      { name: "Permisos", icon: ClipboardDocumentCheckIcon  , href: "/admin/permisos" },
    ],
  },

  {
    name: "Bodega",
    icon: ArchiveBoxIcon,
    href: "#",
    subMenu: [
      { name: "Elementos", icon: CubeIcon, href: "/bodega/elementos" },
      {
        name: "Movimientos",
        icon: ArrowsRightLeftIcon,
        href: "/bodega/movimientos",
      },
      {
        name: "Inventario",
        icon: ClipboardDocumentListIcon,
        href: "bodega/inventario/areas",
      },
    ],
  },

  { name: "Reportes", icon: DocumentChartBarIcon, href: "/reportes" },
];


export default function Sidebar (){
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

   const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };


  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-15" : "w-64"
      } bg-blue-950 text-white dark:bg-zinc-800 dark:text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-bold flex items-center">
            <img
              className="w-12"
              src="/src/assets/Formatrack.png"
              alt="Formatrack"
            />
            Formatrack
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-blue-950 text-white dark:bg-zinc-800 dark:text-white"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-2 px-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {menuItems.map((item) => (
          <div key={item.name}>
            <Link
              to={item.href}
              onClick={() => toggleItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                location.pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 text-black-300"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
            {item.subMenu && openItems.includes(item.name) && (
              <div className="pl-6">
                {item.subMenu.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                      location.pathname === subItem.href
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-600 text-black-300"
                    }`}
                  >
                    <subItem.icon className="w-6 h-6" />
                    {!collapsed && <span>{subItem.name}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}