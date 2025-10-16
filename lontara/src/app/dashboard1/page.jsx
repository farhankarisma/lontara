"use client";

import React from "react";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PieChart } from "@mui/x-charts/PieChart";
import RecentMails from "../components/Main-Dashboard/recent-mails";

const mailData = [
  {
    name: "Incoming Mail",
    count: 120,
    series: [
      { id: 0, value: 32, label: "Unread", color: "#f97316" },
      { id: 1, value: 88, label: "Completed", color: "#10b981" },
    ],
  },
  {
    name: "Outgoing Mail",
    count: 80,
    series: [
      { id: 0, value: 15, label: "Unread", color: "#f97316" },
      { id: 1, value: 5, label: "Drafts", color: "#34d399" },
      { id: 2, value: 60, label: "Completed", color: "#10b981" },
    ],
  },
];

function PieCard({ title, total, data }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center min-w-[300px]">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-4xl font-bold text-blue-600 my-2">{total}</p>
      <div className="w-full flex-grow flex items-center justify-center -my-4">
        <PieChart
          series={[{ data, innerRadius: 40, outerRadius: 80 }]}
          height={200}
          legend={{ hidden: true }}
        />
      </div>
      <div className="mt-4 w-full space-y-2 text-sm">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-gray-600"
          >
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></span>
              <span>{item.label}</span>
            </div>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-10 min-h-screen bg-white">
      {/* Welcome Section */}
      <div className="flex mb-8 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mail Overview</h1>
        <Link
          href="#"
          className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md font-semibold transition-colors"
        >
          + Create New Mail
        </Link>
      </div>
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Card */}       {" "}
        <div className="flex-1 bg-white border border-gray-200 text-black/70 rounded-2xl shadow-sm p-4 flex flex-col min-w-[300px]">
                   {" "}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                       {" "}
            <DateCalendar
              sx={{
                width: "100%",
                height: "100%",
                maxHeight: "400px",
                "& .MuiPickersCalendarHeader-label": {
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  fontWeight: "medium",
                },
              }}
            />
                     {" "}
          </LocalizationProvider>
                 {" "}
        </div>
        {/* Pie Chart Cards */}
        <PieCard
          title={mailData[0].name}
          total={mailData[0].count}
          data={mailData[0].series}
        />
        <PieCard
          title={mailData[1].name}
          total={mailData[1].count}
          data={mailData[1].series}
        />
             {" "}
      </div>
         {" "}
      <div className="flex mb-8 mt-8 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Recent Mails</h1>

        <Link href="/incoming-mail" className="text-md text-black/50">
          See All
        </Link>
      </div>
      <h1 className="text-xl font-light  text-gray-800 ml-3 mb-5">Today</h1>
      <RecentMails className="ml-3"/>
    </div>
  );
}
