"use client";
import { MdDashboard, MdOutlineEmojiEvents } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaPaperPlane, FaCalendarAlt, FaWpforms, FaBook } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/admin/courses", label: "Manage Courses", icon: FaWpforms },
  { href: "/admin/students", label: "Manage Students", icon: PiStudent },
  { href: "/admin/teachers", label: "Manage Teacher", icon: GiTeacher },
  { href: "/admin/subjects", label: "Subjects", icon: FaBook },
  { href: "/admin/assignGroup", label: "Assign Group", icon: FaPeopleGroup },
  { href: "/admin/timetable", label: "Timetable", icon: IoIosTime },
  { href: "/admin/manageNotices", label: "Notices", icon: FaPaperPlane },
  { href: "/admin/calendar", label: "Academic Calendar", icon: FaCalendarAlt },
  { href: "/admin/manageEvents", label: "Events", icon: MdOutlineEmojiEvents },
];

const AdminSidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname().split("/")[2];

  useEffect(() => {
    const matchedItem = navItems.find((item) => item.href.split("/")[2] === pathname);
    let title = matchedItem ? matchedItem.label : "Dashboard";
    document.title = `Admin - ${title}`;
  }, [pathname]);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden md:block h-full border-r-2 border-blue-100 bg-gray-200 p-2">
          <nav className="mt-8">
            <ul className="space-y-1">
              {navItems.map((item, ind) => {
                const isActive = pathname === item.href.split("/")[2];
                return (
                  <li
                    key={ind}
                    className={`p-3 flex gap-2 items-center text-gray-600 ${isActive ? "bg-orange-500" : "hover:bg-orange-500"} transition-all duration-200 rounded-md`}
                  >
                    <item.icon className="w-7 h-7 text-green-500" />
                    <Link href={item.href} className="text-gray-700">
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 bg-blue-50">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="mt-8 md:hidden border-t-2 border-blue-100 bg-white fixed bottom-0 left-0 right-0 overflow-x-auto">
        <ul className="flex gap-2 justify-between">
          {navItems.map((item, ind) => {
            const isActive = pathname === item.href.split("/")[2];
            return (
              <li
                key={ind}
                className={`p-3 flex flex-col items-center text-gray-600 ${isActive ? "bg-orange-500" : "hover:bg-orange-500"} transition-all duration-200`}
              >
                <item.icon className="w-7 h-7 text-green-500" />
                <Link href={item.href}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default AdminSidebar;
