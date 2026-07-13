import { Suspense, lazy } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AromiChat from "./components/AromiChat";

const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const WorkoutList = lazy(() => import("./pages/workouts/WorkoutList"));
const WorkoutDetail = lazy(() => import("./pages/workouts/WorkoutDetail"));
const WorkoutGenerate = lazy(() => import("./pages/workouts/WorkoutGenerate"));
const NutritionList = lazy(() => import("./pages/nutrition/NutritionList"));
const NutritionDetail = lazy(() => import("./pages/nutrition/NutritionDetail"));
const NutritionGenerate = lazy(() => import("./pages/nutrition/NutritionGenerate"));
const HealthAssessment = lazy(() => import("./pages/health/HealthAssessment"));
const Progress = lazy(() => import("./pages/progress/Progress"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Contributors = lazy(() => import("./pages/contributors/Contributors"));
const License = lazy(() => import("./pages/license/License"));

const MetricsDashboard = lazy(() => import("./pages/analytics/MetricsDashboard"));
const InsightsDashboard = lazy(() => import("./pages/analytics/InsightsDashboard"));
const GoalTracker = lazy(() => import("./pages/analytics/GoalTracker"));
const ReportCompare = lazy(() => import("./pages/analytics/ReportCompare"));

const DoctorCalendar = lazy(() => import("./pages/appointments/DoctorCalendar"));
const WaitingList = lazy(() => import("./pages/appointments/WaitingList"));
const SmartReminders = lazy(() => import("./pages/appointments/SmartReminders"));
const FollowUpRecommendations = lazy(() => import("./pages/appointments/FollowUpRecommendations"));

const DocumentOrganizer = lazy(() => import("./pages/records/DocumentOrganizer"));
const HealthTimeline = lazy(() => import("./pages/records/HealthTimeline"));
const FamilyProfiles = lazy(() => import("./pages/records/FamilyProfiles"));
const EmergencyCard = lazy(() => import("./pages/records/EmergencyCard"));

const SymptomJournal = lazy(() => import("./pages/tracking/SymptomJournal"));
const MedicationReminders = lazy(() => import("./pages/tracking/MedicationReminders"));
const VaccinationSchedule = lazy(() => import("./pages/tracking/VaccinationSchedule"));
const NotificationCenter = lazy(() => import("./pages/tracking/NotificationCenter"));

const HospitalFinder = lazy(() => import("./pages/services/HospitalFinder"));
const LabTestBooking = lazy(() => import("./pages/services/LabTestBooking"));

function AppShell() {
  return (
    <div className="min-h-screen app-bg">
      <div className="content-shell py-8">
        <div className="skeleton h-8 w-52 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface-2)",
            color: "var(--text-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "var(--success)", secondary: "var(--surface-2)" } },
          error: { iconTheme: { primary: "var(--danger)", secondary: "var(--surface-2)" } },
        }}
      />
      <Suspense fallback={<AppShell />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutList />} />
            <Route path="/workouts/generate" element={<WorkoutGenerate />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/nutrition" element={<NutritionList />} />
            <Route path="/nutrition/generate" element={<NutritionGenerate />} />
            <Route path="/nutrition/:id" element={<NutritionDetail />} />
            <Route path="/health" element={<HealthAssessment />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/license" element={<License />} />
            
            <Route path="/analytics/metrics" element={<MetricsDashboard />} />
            <Route path="/analytics/insights" element={<InsightsDashboard />} />
            <Route path="/analytics/goals" element={<GoalTracker />} />
            <Route path="/analytics/reports" element={<ReportCompare />} />
            
            <Route path="/appointments/calendar" element={<DoctorCalendar />} />
            <Route path="/appointments/waiting-list" element={<WaitingList />} />
            <Route path="/appointments/reminders" element={<SmartReminders />} />
            <Route path="/appointments/follow-ups" element={<FollowUpRecommendations />} />
            
            <Route path="/records/documents" element={<DocumentOrganizer />} />
            <Route path="/records/timeline" element={<HealthTimeline />} />
            <Route path="/records/family" element={<FamilyProfiles />} />
            <Route path="/records/emergency" element={<EmergencyCard />} />
            
            <Route path="/tracking/symptoms" element={<SymptomJournal />} />
            <Route path="/tracking/medications" element={<MedicationReminders />} />
            <Route path="/tracking/vaccinations" element={<VaccinationSchedule />} />
            <Route path="/tracking/notifications" element={<NotificationCenter />} />
            
            <Route path="/services/hospitals" element={<HospitalFinder />} />
            <Route path="/services/labs" element={<LabTestBooking />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <AromiChat />
    </HashRouter>
  );
}

export default App;
