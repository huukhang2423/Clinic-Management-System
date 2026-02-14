import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import medicationService from '../services/medicationService';
import patientService from '../services/patientService';

export default function HomePage() {
  const [stats, setStats] = useState({ medications: 0, patients: 0 });

  useEffect(() => {
    Promise.all([medicationService.getAll(), patientService.getAll()]).then(
      ([medRes, patRes]) => {
        setStats({
          medications: medRes.data.data.length,
          patients: patRes.data.data.length,
        });
      }
    ).catch(() => {});
  }, []);

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Phòng Khám</h1>
        <p className="text-gray-500">Hệ thống quản lý bệnh nhân</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
        <Link
          to="/thuoc"
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-900 mb-1">Quản lý thuốc</h2>
          <p className="text-sm text-gray-500">{stats.medications} loại thuốc</p>
        </Link>

        <Link
          to="/benh-nhan"
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-900 mb-1">Quản lý bệnh nhân</h2>
          <p className="text-sm text-gray-500">{stats.patients} bệnh nhân</p>
        </Link>
      </div>
    </div>
  );
}
