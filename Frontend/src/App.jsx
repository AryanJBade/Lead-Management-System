import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LeadList from "./pages/LeadList";
import LeadForm from "./pages/LeadForm";
import LeadDetails from "./pages/LeadDetails";
import EditLead from "./pages/EditLead";
import ActivityLogs from "./pages/ActivityLogs";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <LeadList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-lead"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <LeadForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <ActivityLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lead/:id"
          element={
            <ProtectedRoute>
              <LeadDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-lead/:id"
          element={
            <ProtectedRoute>
              <EditLead />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;