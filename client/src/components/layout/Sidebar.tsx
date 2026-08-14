import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type MenuItem = {
  label: string;
  path: string;
};

const customerMenu: MenuItem[] = [
  { label: "Dashboard", path: "/customer" },
  { label: "Browse Venues", path: "/customer/venues" },
  { label: "My Bookings", path: "/customer/bookings" },
  { label: "Reviews", path: "/customer/reviews" },
];

const providerMenu: MenuItem[] = [
  { label: "Dashboard", path: "/provider" },
  { label: "My Venues", path: "/provider/venues" },
  { label: "Time Slots", path: "/provider/time-slots" },
  { label: "Bookings", path: "/provider/bookings" },
  { label: "Calendar", path: "/provider/calendar" },
];

const adminMenu: MenuItem[] = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Providers", path: "/admin/providers" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Analytics", path: "/admin/analytics" },
];

function Sidebar() {
  const { user } = useAuth();

  let menuItems: MenuItem[] = [];

  if (user?.role === "USER") {
    menuItems = customerMenu;
  } else if (user?.role === "PROVIDER") {
    menuItems = providerMenu;
  } else if (user?.role === "ADMIN") {
    menuItems = adminMenu;
  }

  return (
    <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${user?.role?.toLowerCase()}`}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;