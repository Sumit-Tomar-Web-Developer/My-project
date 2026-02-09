import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolAppBar from "../Components/Layout/ToolAppBar";
import SignIn from "../Pages/PublicPages/SignIn";
import ResetPassword from "../Pages/PublicPages/ResetPassword";
import Logout from "../Pages/PrivatePages/CommonPages/Logout";
import ProtectedRoute from "./ProtectedRoute";
import { USER_ROLES } from "../Utils/Constants";
import Users from "../Pages/PrivatePages/AdminPages/Users";
import DashBoard from "../Pages/PrivatePages/CommonPages/DashBoard";
import ErrorPage from "../Pages/PublicPages/ErrorPage";
import EditTender from "../Pages/PrivatePages/CommonPages/TenderPages/EditTender";
import UpdateTenderCorrigendum from "../Pages/PrivatePages/DAPages/UpdateTenderCorrigendum";
import ViewTender from "../Pages/PrivatePages/CommonPages/TenderPages/ViewTender";
import ApproveTender from "../Pages/PrivatePages/CommonPages/TenderPages/ApproveTender";
import TechTenderApproval from "../Pages/PrivatePages/TechTeamPages/TechTenderApproval";
import DocumentSubmission from "../Pages/PrivatePages/DAPages/DocumentSubmission";
import FinanceApproval from "../Pages/PrivatePages/FinancePages/FinanceApproval";
import FinanceLZeroApproval from "../Pages/PrivatePages/FinancePages/FinanceLZeroApproval";
import UpdateTenderStatus from "../Pages/PrivatePages/DAPages/UpdateTenderStatus";
import UpdateTenderDocs from "../Pages/PrivatePages/DAPages/UpdateTenderDocs";
import L1ApprovalPage from "../Pages/PrivatePages/DAPages/L1ApprovalPage";
import PhysicalTrackingSetup from "../Pages/PrivatePages/TechTeamPages/PhysicalTrackingSetup";
import PhysicalTrackingProgress from "../Pages/PrivatePages/TechTeamPages/PhysicalTrackingProgress";
import FinancialTrackingProgress from "../Pages/PrivatePages/FinancePages/FinancialTrackingProgress";
import FinancialClosure from "../Pages/PrivatePages/FinancePages/FinancialClosure";
import FinalClosure from "../Pages/PrivatePages/DAPages/FinalClosure";
import AddExpense from "../Pages/PrivatePages/DAPages/AddExpense"
import ViewExpenseDetails from "../Pages/PrivatePages/CommonPages/ExpensePages/ViewExpenseDetails";
import ApproveExpense from "../Pages/PrivatePages/CommonPages/ExpensePages/ApproveExpense";
import FinanceExpenseApproval from "../Pages/PrivatePages/CommonPages/ExpensePages/FinanceExpenseApproval";
import DepartmentExpenseReportPage from "../Pages/PrivatePages/MDPages/DepartmentExpenseReportPage";
import TenderAggExpenseReportPage from "../Pages/PrivatePages/MDPages/TenderAggExpenseReportPage";
import TenderExpenseReportPage from "../Pages/PrivatePages/MDPages/TenderExpenseReportPage";
import TenderMonitorReportPage from "../Pages/PrivatePages/MDPages/TenderMonitorReportPage";

export default function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ToolAppBar />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/access_denied" element={<ErrorPage title="403 : Access Denied" message="You do not have access to this page." />} />


          {/* ADMIN ROUTING */}
          <Route path="/users" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.ADMIN.id]}>
              <Users />
            </ProtectedRoute>}
          />

          {/* DASHBOARD COMMON ROUTING */}
          <Route path="/dashboard" element={
            <ProtectedRoute
              allowedRoles={[
                USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id,
                USER_ROLES.FINANCE.id, USER_ROLES.MD.id, USER_ROLES.ADMIN.id]}>
              <DashBoard isVeiwAll={true} />
            </ProtectedRoute>}
          />

          <Route path="/worklist" element={
            <ProtectedRoute
              allowedRoles={[
                USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id,
                USER_ROLES.FINANCE.id, USER_ROLES.MD.id]}>
              <DashBoard isVeiwAll={false} />
            </ProtectedRoute>}
          />

          {/* EXPENSE COMMON ROUTING */}
          <Route path="/view_expense_details/:expenseId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id,
              USER_ROLES.FINANCE.id, USER_ROLES.MD.id]}>
              <ViewExpenseDetails />
            </ProtectedRoute>}
          />
          <Route path="/expense_approval/:expenseId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id]}>
              <ApproveExpense />
            </ProtectedRoute>}
          />
          <Route path="/fin_expense_approval/:expenseId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinanceExpenseApproval />
            </ProtectedRoute>}
          />

          {/* TENDER COMMON ROUTING */}
          <Route path="/edit_tender_details" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id]}>
              <EditTender />
            </ProtectedRoute>}
          />
          <Route path="/edit_tender_details/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id]}>
              <EditTender />
            </ProtectedRoute>}
          />
          <Route path="/view_tender_details/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id, USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id,
              USER_ROLES.FINANCE.id, USER_ROLES.MD.id]}>
              <ViewTender />
            </ProtectedRoute>}
          />
          <Route path="/tender_approval/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.TECH_TEAM.id, USER_ROLES.DIRECTOR.id]}>
              <ApproveTender />
            </ProtectedRoute>}
          />

          {/* DA ROUTING */}
          <Route path="/update_tender_corrigendum" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <UpdateTenderCorrigendum />
            </ProtectedRoute>}
          />
          <Route path="/da_doc_upload/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <UpdateTenderDocs />
            </ProtectedRoute>}
          />
          <Route path="/da_doc_submission/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <DocumentSubmission />
            </ProtectedRoute>}
          />
          <Route path="/update_tender_status/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <UpdateTenderStatus />
            </ProtectedRoute>}
          />
          <Route path="/l1_approval/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <L1ApprovalPage />
            </ProtectedRoute>}
          />
          <Route path="/add_expense" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DATA_APPLICANT.id]}>
              <AddExpense />
            </ProtectedRoute>}
          />

          {/* TL ROUTING */}
          <Route path="/tl_tender_approval/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.TECH_TEAM.id]}>
              <TechTenderApproval />
            </ProtectedRoute>}
          />
          <Route path="/physical_tracking_setup/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.TECH_TEAM.id]}>
              <PhysicalTrackingSetup />
            </ProtectedRoute>}
          />
          <Route path="/physical_tracking_progress/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.TECH_TEAM.id]}>
              <PhysicalTrackingProgress />
            </ProtectedRoute>}
          />

          {/* Finance ROUTING */}
          <Route path="/fin_tender_approval/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinanceApproval />
            </ProtectedRoute>}
          />
          <Route path="/fin_lzero_acceptance/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinanceLZeroApproval />
            </ProtectedRoute>}
          />
          <Route path="/financial_tracking_setup/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinancialTrackingProgress isSetup={true} />
            </ProtectedRoute>}
          />
          <Route path="/financial_tracking_progress/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinancialTrackingProgress isSetup={false} />
            </ProtectedRoute>}
          />
          <Route path="/financial_closure/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.FINANCE.id]}>
              <FinancialClosure />
            </ProtectedRoute>}
          />

          {/*Director ROUTING*/}
          <Route path="/project_closure/:projectId" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DIRECTOR.id]}>
              <FinalClosure />
            </ProtectedRoute>}
          />

          {/*Reports ROUTING*/}
          <Route path="/report/departmentExpenseReport" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DIRECTOR.id, USER_ROLES.MD.id]}>
              <DepartmentExpenseReportPage />
            </ProtectedRoute>}
          />

          <Route path="/report/tenderAggExpenseReport" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DIRECTOR.id, USER_ROLES.MD.id]}>
              <TenderAggExpenseReportPage />
            </ProtectedRoute>}
          />

          <Route path="/report/tenderExpenseReport" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DIRECTOR.id, USER_ROLES.MD.id]}>
              <TenderExpenseReportPage />
            </ProtectedRoute>}
          />

          <Route path="/report/tenderMonitorReport" element={
            <ProtectedRoute
              allowedRoles={[USER_ROLES.DIRECTOR.id, USER_ROLES.MD.id]}>
              <TenderMonitorReportPage />
            </ProtectedRoute>}
          />

          <Route path="/" element={<DashBoard isVeiwAll={true} />} />
          <Route path="*" element={<ErrorPage title="404 : Page not Found" message="The page you are trying to access doesn't exist" />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}