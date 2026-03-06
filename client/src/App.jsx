import { BrowserRouter, Routes, Route } from 'react-router';
import { ToastProvider } from './context/ToastContext';
import { PrescriptionNotificationProvider } from './context/PrescriptionNotificationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MedicationPage from './pages/MedicationPage';
import MedicationFormPage from './pages/MedicationFormPage';
import PatientPage from './pages/PatientPage';
import PatientFormPage from './pages/PatientFormPage';
import PatientDetailPage from './pages/PatientDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ToastProvider>
      <PrescriptionNotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="thuoc" element={<MedicationPage />} />
            <Route path="thuoc/tao-moi" element={<MedicationFormPage />} />
            <Route path="thuoc/chinh-sua/:id" element={<MedicationFormPage />} />
            <Route path="benh-nhan" element={<PatientPage />} />
            <Route path="benh-nhan/tao-moi" element={<PatientFormPage />} />
            <Route path="benh-nhan/chinh-sua/:id" element={<PatientFormPage />} />
            <Route path="benh-nhan/:id" element={<PatientDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </PrescriptionNotificationProvider>
    </ToastProvider>
  );
}

export default App;
