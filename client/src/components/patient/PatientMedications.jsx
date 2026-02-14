import { useState } from 'react';
import MedicationPicker from '../medication/MedicationPicker';
import { DOSAGE_PRESETS } from '../../utils/constants';

export default function PatientMedications({ medications, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectMedication = (med) => {
    onChange([...medications, { medication: med._id, medicationData: med, dosage: '' }]);
  };

  const handleDosageChange = (index, dosage) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], dosage };
    onChange(updated);
  };

  const handleRemove = (index) => {
    onChange(medications.filter((_, i) => i !== index));
  };

  const excludeIds = medications.map((m) => m.medication);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Thuốc & Liều dùng</label>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Thêm thuốc
        </button>
      </div>

      {medications.length === 0 ? (
        <p className="text-sm text-gray-400 py-3 text-center border border-dashed rounded-lg">
          Chưa có thuốc nào được chọn
        </p>
      ) : (
        <div className="space-y-3">
          {medications.map((item, index) => (
            <div key={item.medication} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-sm">{item.medicationData?.name}</div>
                  <div className="text-xs text-gray-500">{item.medicationData?.effects}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {DOSAGE_PRESETS.map((preset) => {
                  const isSelected = item.dosage.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          const newDosage = item.dosage
                            .replace(preset, '')
                            .replace(/,\s*,/g, ',')
                            .replace(/^,\s*|,\s*$/g, '')
                            .trim();
                          handleDosageChange(index, newDosage);
                        } else {
                          const newDosage = item.dosage
                            ? `${item.dosage}, ${preset}`
                            : preset;
                          handleDosageChange(index, newDosage);
                        }
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={item.dosage}
                onChange={(e) => handleDosageChange(index, e.target.value)}
                placeholder="Hoặc nhập liều dùng tùy chỉnh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      <MedicationPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectMedication}
        excludeIds={excludeIds}
      />
    </div>
  );
}
