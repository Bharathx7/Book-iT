import MyBookings from "../pages/customer/MyBookings";
import Reviews from "../pages/customer/Reviews";
import ProviderVenues from "../pages/provider/ProviderVenues";
import BrowseVenues from "../pages/customer/BrowseVenues";
import VenueDetails from "../pages/customer/VenueDetails";
import ProviderTimeSlots from "../pages/provider/ProviderTimeSlots";
import ProviderBookings from "../pages/provider/ProviderBookings";
import ProviderCalendar from "../pages/provider/ProviderCalendar";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
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
          <Route path="venues" element={<BrowseVenues />} />
          <Route path="venues/:id" element={<VenueDetails />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>
      </Route>

      
      {/* Provider routes */}
<Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
  <Route path="/provider" element={<ProviderLayout />}>
    <Route index element={<ProviderDashboard />} />
    <Route path="venues" element={<ProviderVenues />} />
    <Route path="time-slots" element={<ProviderTimeSlots />} />
    <Route path="bookings" element={<ProviderBookings />} />
    <Route path="calendar" element={<ProviderCalendar />} />
  </Route>
</Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
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