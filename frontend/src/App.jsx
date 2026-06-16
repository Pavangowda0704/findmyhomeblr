import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import AgentLayout from './layouts/AgentLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Buy = lazy(() => import('./pages/Buy'));
const Rent = lazy(() => import('./pages/Rent'));
const Commercial = lazy(() => import('./pages/Commercial'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AgentApply = lazy(() => import('./pages/AgentApply'));

// Dashboard pages
const UserDashboard = lazy(() => import('./pages/Dashboard/Overview'));
const SavedProperties = lazy(() => import('./pages/Dashboard/SavedProperties'));
const MyEnquiries = lazy(() => import('./pages/Dashboard/MyEnquiries'));
const UserProfile = lazy(() => import('./pages/Dashboard/Profile'));
const ChangePassword = lazy(() => import('./pages/Dashboard/ChangePassword'));

// Agent pages
const AgentDashboard = lazy(() => import('./pages/Agent/Dashboard'));
const AgentListings = lazy(() => import('./pages/Agent/Listings'));
const CreateListing = lazy(() => import('./pages/Agent/CreateListing'));
const EditListing = lazy(() => import('./pages/Agent/EditListing'));
const AgentLeads = lazy(() => import('./pages/Agent/Leads'));
const LeadDetail = lazy(() => import('./pages/Agent/LeadDetail'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminProperties = lazy(() => import('./pages/Admin/Properties'));
const AdminLeads = lazy(() => import('./pages/Admin/Leads'));
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'));
const AdminApplications = lazy(() => import('./pages/Admin/Applications'));

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Guest Routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* Agent Application - public, no login required */}
        <Route path="/agent-apply" element={<AgentApply />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="saved" element={<SavedProperties />} />
          <Route path="enquiries" element={<MyEnquiries />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute roles={['agent', 'admin']}>
            <AgentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AgentDashboard />} />
          <Route path="listings" element={<AgentListings />} />
          <Route path="listings/create" element={<CreateListing />} />
          <Route path="listings/edit/:id" element={<EditListing />} />
          <Route path="leads" element={<AgentLeads />} />
          <Route path="leads/:id" element={<LeadDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="applications" element={<AdminApplications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}