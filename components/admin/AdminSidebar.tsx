"use client";
import React from "react";
import { MdDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";
import { FaPaperPlane } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  let needed = pathname.split("/")[2];

  return (
    <div className="bg-gray-200 fixed top-0 left-0 h-full flex flex-col pt-16 px-5">
      {/* Sidebar Links */}
      <div className="flex flex-col gap-3 mt-4 px-2">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "dashboard" ? "bg-orange-500" : ""
          }`}
        >
          <MdDashboard className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Dashboard</p>
        </Link>
        <Link
          href="/admin/manageStudent"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageStudent" ? "bg-orange-500" : ""
          }`}
        >
          <PiStudent className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Manage Student</p>
        </Link>
        <Link
          href="/admin/manageTeacher"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageTeacher" ? "bg-orange-500" : ""
          }`}
        >
          <GiTeacher className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Manage Teacher</p>
        </Link>
        <Link
          href="/admin/manageAttendance"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageAttendance" ? "bg-orange-500" : ""
          }`}
        >
          <FaPeopleGroup className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Attendance</p>
        </Link>
        <Link
          href="/admin/manageTimetable"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageTimetable" ? "bg-orange-500" : ""
          }`}
        >
          <IoIosTime className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Timetable</p>
        </Link>
        <Link
          href="/admin/manageNotices"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageNotices" ? "bg-orange-500" : ""
          }`}
        >
          <FaPaperPlane className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Notices</p>
        </Link>
        <Link
          href="/admin/calendar"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "calendar" ? "bg-orange-500" : ""
          }`}
        >
          <FaCalendarAlt className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Academic Calendar</p>
        </Link>
        <Link
          href="/admin/manageEvents"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageEvents" ? "bg-orange-500" : ""
          }`}
        >
          <MdOutlineEmojiEvents className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Events</p>
        </Link>
        <Link
          href="/admin/manageForms"
          className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-500 transition-all duration-200 ${
            needed === "manageForms" ? "bg-orange-500" : ""
          }`}
        >
          <FaWpforms className="w-7 h-7 text-green-500" />
          <p className="text-gray-700">Forms</p>
        </Link>
      </div>

      {/* Logout Button */}
      <button
        type="submit"
        className="mt-3 w-full h-8 bg-blue-600 text-white font-semibold hover:bg-red-600 transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
