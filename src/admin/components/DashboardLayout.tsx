import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  PlayCircle,
  Calculator,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Demo Results",
    path: "/admin/demo-results",
    icon: <PlayCircle size={20} />,
  },
  {
    name: "Pricing Quotes",
    path: "/admin/pricing-quotes",
    icon: <Calculator size={20} />,
  },
  {
    name: "Case Studies",
    path: "/admin/case-studies",
    icon: <TrendingUp size={20} />,
  },
  {
    name: "Projects",
    path: "/admin/projects",
    icon: <FolderKanban size={20} />,
  },
  { name: "Tech Stack", path: "/admin/techstack", icon: <Layers size={20} /> },
  { name: "Blogs", path: "/admin/blogs", icon: <FileText size={20} /> },
  {
    name: "Contacts",
    path: "/admin/contacts",
    icon: <MessageSquare size={20} />,
  },
  { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 glass border-r border-white/10 flex flex-col fixed h-full z-20"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-tighter">
            Admin<span className="text-accent">Panel</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
