import Adminnav from "./adminnav";
import Sidebar from "./sidebar";

export default async function AdminLayout({ children }) {
  let user = null;
  let login = null;

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <Adminnav />
      <div className="w-full relative flex pt-[4.5rem]">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4.5rem)] overflow-auto">
          <div className="p-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
