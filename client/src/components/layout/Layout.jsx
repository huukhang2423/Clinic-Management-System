import { Outlet } from 'react-router';
import Header from './Header';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-4 pb-20 md:pb-4">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
