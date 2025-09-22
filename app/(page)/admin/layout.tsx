
import ThemeToggle from "@/components/admin/ThemeToggle";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-black to-emerald-950  ">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminTopbar right={<ThemeToggle />} />
                {children}

        </div>
      </div>
    </div>
  );
}   
