"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PieChart } from "@mui/x-charts/PieChart";
import { FiRefreshCw } from "react-icons/fi";
import RecentMails from "../components/Main-Dashboard/recent-mails";
import emailService from "@/services/mailManagement";

function PieCard({ title, total, data, loading }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center min-w-[300px]">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FiRefreshCw className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <>
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
                <span className="font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [mailStats, setMailStats] = useState({
    incoming: {
      total: 0,
      unread: 0,
      completed: 0,
    },
    outgoing: {
      total: 0,
      unread: 0,
      drafts: 0,
      completed: 0,
    },
  });

  useEffect(() => {
    fetchMailStats();
  }, []);

  const fetchMailStats = async () => {
    try {
      setLoading(true);

      // Fetch inbox emails
      const inboxResponse = await emailService.getInboxEmails(100);
      const inboxEmails = inboxResponse.messages || [];

      // Fetch sent emails
      const sentResponse = await emailService.getSentEmails(100);
      const sentEmails = sentResponse.messages || [];

      // Fetch drafts
      const draftsResponse = await emailService.getDraftEmails(100);
      const draftEmails = draftsResponse.messages || [];

      // Calculate incoming mail stats
      const unreadIncoming = inboxEmails.filter((e) => !e.isRead).length;
      const completedIncoming = inboxEmails.filter((e) => e.isRead).length;

      // Calculate outgoing mail stats
      const unreadOutgoing = sentEmails.filter((e) => !e.isRead).length;
      const completedOutgoing = sentEmails.filter((e) => e.isRead).length;

      setMailStats({
        incoming: {
          total: inboxEmails.length,
          unread: unreadIncoming,
          completed: completedIncoming,
        },
        outgoing: {
          total: sentEmails.length + draftEmails.length,
          unread: unreadOutgoing,
          drafts: draftEmails.length,
          completed: completedOutgoing,
        },
      });
    } catch (error) {
      console.error("Error fetching mail stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const incomingMailData = [
    {
      id: 0,
      value: mailStats.incoming.unread,
      label: "Unread",
      color: "#f97316",
    },
    {
      id: 1,
      value: mailStats.incoming.completed,
      label: "Completed",
      color: "#10b981",
    },
  ];

  const outgoingMailData = [
    {
      id: 0,
      value: mailStats.outgoing.unread,
      label: "Unread",
      color: "#f97316",
    },
    {
      id: 1,
      value: mailStats.outgoing.drafts,
      label: "Drafts",
      color: "#34d399",
    },
    {
      id: 2,
      value: mailStats.outgoing.completed,
      label: "Completed",
      color: "#10b981",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Welcome Section */}
      <div className="flex mb-8 justify-between items-center">
        <h1 className="text-3xl font-medium text-gray-800">Mail Overview</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMailStats}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiRefreshCw
              className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
              size={20}
            />
          </button>
          <Link
            href="/compose"
            className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md font-semibold transition-colors"
          >
            + Create New Mail
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Card */}
        <div className="flex-1 bg-white border border-gray-200 text-black/70 rounded-2xl shadow-sm p-4 flex flex-col min-w-[300px]">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>
        </div>

        {/* Pie Chart Cards */}
        <PieCard
          title="Incoming Mail"
          total={mailStats.incoming.total}
          data={incomingMailData}
          loading={loading}
        />
        <PieCard
          title="Outgoing Mail"
          total={mailStats.outgoing.total}
          data={outgoingMailData}
          loading={loading}
        />
      </div>

      {/* Recent Mails Section */}
      <div className="flex mb-8 mt-8 justify-between items-center">
        <h1 className="text-3xl font-medium text-gray-800">Recent Mails</h1>
        <Link
          href="/incomingMail"
          className="text-md text-black/50 hover:text-black/70"
        >
          See All
        </Link>
      </div>
      <h1 className="text-xl text-gray-800 ml-3 mb-5">Today</h1>
      <RecentMails onRefresh={fetchMailStats} />
    </div>
  );
}
