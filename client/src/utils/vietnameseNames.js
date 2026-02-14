// Họ phổ biến
export const LAST_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ',
  'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đào', 'Đinh', 'Lâm',
  'Tạ', 'Mai', 'Trịnh', 'Hà', 'Cao', 'Lương', 'Tô', 'Châu', 'Quách', 'Tăng',
  'Thái', 'Kiều', 'Trương', 'Từ', 'Lưu',
];

// Tên đệm phổ biến
export const MIDDLE_NAMES = [
  'Văn', 'Thị', 'Hữu', 'Đức', 'Minh', 'Thanh', 'Ngọc', 'Quốc', 'Xuân',
  'Hoàng', 'Phúc', 'Gia', 'Bảo', 'Anh', 'Đình', 'Công', 'Trọng', 'Quang',
  'Tiến', 'Hồng', 'Kim', 'Tấn', 'Thành', 'Tuấn', 'Duy', 'Nhật', 'Thiên',
  'Như', 'Thuỳ', 'Mỹ', 'Diệu', 'Phương', 'Thúy', 'Bích', 'Tường', 'Khánh',
];

// Tên phổ biến
export const FIRST_NAMES = [
  'An', 'Anh', 'Bảo', 'Bình', 'Chi', 'Cường', 'Danh', 'Dũng', 'Duy',
  'Đạt', 'Giang', 'Hà', 'Hải', 'Hạnh', 'Hiếu', 'Hoà', 'Hùng', 'Hương',
  'Huy', 'Khang', 'Khánh', 'Khoa', 'Khôi', 'Kiên', 'Lâm', 'Lan', 'Linh',
  'Long', 'Lộc', 'Mai', 'Minh', 'My', 'Nam', 'Ngân', 'Ngọc', 'Nhân',
  'Nhi', 'Nhung', 'Phát', 'Phong', 'Phúc', 'Phương', 'Quân', 'Quang',
  'Quyên', 'Sơn', 'Tài', 'Thắng', 'Thảo', 'Thiên', 'Thịnh', 'Thuỷ',
  'Thư', 'Tiến', 'Toàn', 'Trang', 'Trinh', 'Trung', 'Trúc', 'Tú',
  'Tuấn', 'Tùng', 'Uyên', 'Vân', 'Vi', 'Vinh', 'Vy', 'Xuân', 'Yến',
];

/**
 * Gợi ý tên dựa trên input hiện tại.
 * - Đang gõ phần đầu → gợi ý họ
 * - Đã có họ, đang gõ phần 2 → gợi ý tên đệm
 * - Đã có họ + đệm, đang gõ phần 3+ → gợi ý tên
 */
export function getNameSuggestions(input) {
  if (!input || !input.trim()) return [];

  const trimmed = input.trimStart();
  const endsWithSpace = trimmed.endsWith(' ');
  const parts = trimmed.trim().split(/\s+/);

  // Đang gõ ký tự (chưa bấm space) → gợi ý cho phần đang gõ
  if (!endsWithSpace) {
    const currentPart = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ');
    let candidates;

    if (parts.length === 1) {
      candidates = LAST_NAMES;
    } else if (parts.length === 2) {
      candidates = MIDDLE_NAMES;
    } else {
      candidates = FIRST_NAMES;
    }

    const query = currentPart.toLowerCase();
    const matches = candidates.filter((n) =>
      n.toLowerCase().startsWith(query)
    );

    return matches.slice(0, 8).map((n) =>
      prefix ? `${prefix} ${n}` : n
    );
  }

  // Đã bấm space → gợi ý phần tiếp theo
  const base = parts.join(' ');
  let candidates;

  if (parts.length === 1) {
    candidates = MIDDLE_NAMES;
  } else {
    candidates = FIRST_NAMES;
  }

  return candidates.slice(0, 8).map((n) => `${base} ${n}`);
}
