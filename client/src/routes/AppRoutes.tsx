import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import CustomerLayout from "../components/layout/CustomerLayout";
import ProviderLayout from "../components/layout/ProviderLayout";
import AdminLayout from "../components/layout/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer routes */}
      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
        </Route>
      </Route>

      {/* Provider routes */}
      <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<ProviderDashboard />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;