import { Link, useLocation } from 'react-router';

export default function Header() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/thuoc', label: 'Thuốc' },
    { to: '/benh-nhan', label: 'Bệnh nhân' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-600">
          Phòng Khám
        </Link>
        <nav className="hidden md:flex gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to))
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
