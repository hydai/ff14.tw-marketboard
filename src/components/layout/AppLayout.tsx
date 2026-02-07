import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-56 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
