"use client"

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminSidebar />
            {children}
        </div>
    );
}