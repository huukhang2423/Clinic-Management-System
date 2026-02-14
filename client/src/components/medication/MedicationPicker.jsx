import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import medicationService from '../../services/medicationService';

export default function MedicationPicker({ isOpen, onClose, onSelect, excludeIds = [] }) {
  const [medications, setMedications] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      medicationService.getAll(search).then((res) => {
        setMedications(res.data.data.filter((m) => !excludeIds.includes(m._id)));
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isOpen, search, excludeIds]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chọn thuốc">
      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm thuốc..."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Đang tải...</div>
      ) : medications.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">Không tìm thấy thuốc</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {medications.map((med) => (
            <button
              key={med._id}
              onClick={() => {
                onSelect(med);
                onClose();
              }}
              className="w-full text-left p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="font-medium text-sm">{med.name}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{med.effects}</div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
