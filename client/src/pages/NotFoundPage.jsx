import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-300 mb-2">404</h1>
      <p className="text-gray-500 mb-4">Trang không tồn tại</p>
      <Link to="/" className="text-blue-600 text-sm font-medium hover:underline">
        Về trang chủ
      </Link>
    </div>
  );
}
