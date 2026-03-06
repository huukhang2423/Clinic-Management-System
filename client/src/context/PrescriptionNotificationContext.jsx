import { createContext, useContext, useState, useCallback, useRef } from 'react';

const PrescriptionNotificationContext = createContext();

const DISMISS_AFTER = 10 * 60 * 1000; // 10 minutes

export function PrescriptionNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showPrescription = useCallback(({ patientName, diagnosis, medications }) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, patientName, diagnosis, medications }]);
    timers.current[id] = setTimeout(() => dismiss(id), DISMISS_AFTER);
  }, [dismiss]);

  return (
    <PrescriptionNotificationContext.Provider value={{ showPrescription }}>
      {children}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 max-w-xs w-full pointer-events-none">
          {notifications.map((n) => (
            <PrescriptionCard key={n.id} notification={n} onDismiss={() => dismiss(n.id)} />
          ))}
        </div>
      )}
    </PrescriptionNotificationContext.Provider>
  );
}

export function usePrescription() {
  return useContext(PrescriptionNotificationContext);
}

function PrescriptionCard({ notification, onDismiss }) {
  const { patientName, diagnosis, medications } = notification;

  return (
    <div
      className="bg-white border border-green-200 rounded-xl shadow-xl p-4 pointer-events-auto"
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-0.5">
            Đơn thuốc mới
          </div>
          <div className="font-semibold text-gray-900 text-sm">{patientName}</div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 ml-2 p-0.5 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {diagnosis && (
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">Chẩn đoán:</span> {diagnosis}
        </div>
      )}

      {medications && medications.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">Thuốc & Liều dùng:</div>
          <div className="space-y-1">
            {medications.map((m, i) => (
              <div key={i} className="text-xs bg-green-50 border border-green-100 rounded-lg px-2 py-1.5">
                <span className="font-medium text-gray-800">{m.name}</span>
                {m.dosage && <span className="text-gray-500"> — {m.dosage}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 italic">Không kê thuốc</div>
      )}
    </div>
  );
}
