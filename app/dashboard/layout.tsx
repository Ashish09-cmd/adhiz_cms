import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pt-20 h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
