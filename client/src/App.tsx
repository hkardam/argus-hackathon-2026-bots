/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicCatalogue from './pages/PublicCatalogue';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';

// Applicant Pages
import ApplicantDashboard from './pages/ApplicantDashboard';
import OrganisationProfile from './pages/OrganisationProfile';
import DocumentVault from './pages/DocumentVault';
import MyApplications from './pages/MyApplications';
import ApplicationWizard from './pages/applicant/ApplicationWizard';
import MyGrants from './pages/MyGrants';
import Messages from './pages/Messages';

// Staff Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerApplications from './pages/officer/OfficerApplications';
import ApplicationReview from './pages/officer/ApplicationReview';
import OfficerGrants from './pages/officer/OfficerGrants';
import OfficerReports from './pages/officer/OfficerReports';
import OfficerMessages from './pages/officer/OfficerMessages';
import ReviewerDashboard from './pages/reviewer/ReviewerDashboard';
import ReviewerReviews from './pages/reviewer/ReviewerReviews';
import ReviewSubmission from './pages/reviewer/ReviewSubmission';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FinanceDisbursements from './pages/finance/FinanceDisbursements';
import FinanceDisbursementDetails from './pages/finance/FinanceDisbursementDetails';
import FinanceExpenditures from './pages/finance/FinanceExpenditures';
import FinanceExpenditureDetails from './pages/finance/FinanceExpenditureDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicCatalogue />} />
        <Route path="/login" element={<Login />} />

        {/* Applicant Portal */}
        <Route path="/applicant" element={<DashboardLayout />}>
          <Route index element={<ApplicantDashboard />} />
          <Route path="profile" element={<OrganisationProfile />} />
          <Route path="documents" element={<DocumentVault />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/new" element={<ApplicationWizard />} />
          <Route path="grants" element={<MyGrants />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        {/* Program Officer Portal */}
        <Route path="/officer" element={<DashboardLayout />}>
          <Route index element={<OfficerDashboard />} />
          <Route path="applications" element={<OfficerApplications />} />
          <Route path="applications/review" element={<ApplicationReview />} />
          <Route path="grants" element={<OfficerGrants />} />
          <Route path="reports" element={<OfficerReports />} />
          <Route path="messages" element={<OfficerMessages />} />
        </Route>

        {/* Grant Reviewer Portal */}
        <Route path="/reviewer" element={<DashboardLayout />}>
          <Route index element={<ReviewerDashboard />} />
          <Route path="reviews" element={<ReviewerReviews />} />
          <Route path="reviews/:id" element={<ReviewSubmission />} />
        </Route>

        {/* Finance Officer Portal */}
        <Route path="/finance" element={<DashboardLayout />}>
          <Route index element={<FinanceDashboard />} />
          <Route path="disbursements" element={<FinanceDisbursements />} />
          <Route path="disbursements/:id" element={<FinanceDisbursementDetails />} />
          <Route path="expenditures" element={<FinanceExpenditures />} />
          <Route path="expenditures/:id" element={<FinanceExpenditureDetails />} />
        </Route>

        {/* Platform Admin Portal */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="audit" element={<AdminAuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
