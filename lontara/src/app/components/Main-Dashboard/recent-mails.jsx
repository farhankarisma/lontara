"use client";

import { useState, useEffect } from "react";
import { Send, Trash2, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/button";
import emailService from "@/services/mailManagement";

const STATUS_OPTIONS = ["Unread", "In-Progress", "Done"];
const STATUS_COLORS = {
  Unread: "bg-red-100 text-red-600",
  "In-Progress": "bg-yellow-100 text-yellow-600",
  Done: "bg-green-100 text-green-600",
};

export default function RecentMails({ onRefresh }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [selectedMails, setSelectedMails] = useState(new Set());

  useEffect(() => {
    fetchRecentMails();
  }, []);

  const fetchRecentMails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching recent mails...");

      const response = await emailService.getInboxEmails(5);
      console.log("📥 Recent mails response:", response);

      // ✅ FIX: Check success first
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch emails");
      }

      // ✅ FIX: Access data.messages
      const emails = response.data?.messages || [];
      console.log("✅ Got emails:", emails.length);

      // Format emails for display
      const formattedMails = emails.map((email) => ({
        id: email.id,
        subject: email.subject || "(No Subject)",
        senderName: extractSenderName(email.from),
        senderEmail: email.from,
        senderAvatar: getAvatarUrl(email.from),
        status: email.isRead ? "Done" : "Unread",
        date: email.date,
        snippet: email.snippet,
      }));

      setMails(formattedMails);
    } catch (error) {
      console.error("❌ Error fetching recent mails:", error);
      setError(error.message);
      setMails([]); // ✅ Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const extractSenderName = (from) => {
    if (!from) return "Unknown";
    const match = from.match(/^([^<]+)</);
    return match ? match[1].trim() : from.split("@")[0];
  };

  const getAvatarUrl = (email) => {
    const name = extractSenderName(email);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=32`;
  };

  const handleSelectMail = (id) => {
    setSelectedMails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      console.log("🗑️ Deleting emails:", Array.from(selectedMails));

      // Delete selected emails
      await Promise.all(
        Array.from(selectedMails).map((id) => emailService.deleteEmail(id))
      );

      // Remove from local state
      setMails((prev) => prev.filter((mail) => !selectedMails.has(mail.id)));
      setSelectedMails(new Set());

      console.log("✅ Emails deleted");

      // Refresh parent stats
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("❌ Error deleting emails:", error);
      alert("Failed to delete emails: " + error.message);
    }
  };

  const handleMarkSelectedComplete = async () => {
    try {
      console.log("✅ Marking as complete:", Array.from(selectedMails));

      // Mark selected emails as read
      await Promise.all(
        Array.from(selectedMails).map((id) => emailService.markAsRead(id))
      );

      // Update local state
      setMails((prev) =>
        prev.map((mail) =>
          selectedMails.has(mail.id) ? { ...mail, status: "Done" } : mail
        )
      );
      setSelectedMails(new Set());

      console.log("✅ Marked as complete");

      // Refresh parent stats
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("❌ Error marking emails as complete:", error);
      alert("Failed to mark emails: " + error.message);
    }
  };

  const handleChangeStatus = async (id, nextStatus) => {
    try {
      console.log(`🔄 Changing status for ${id} to ${nextStatus}`);

      // Update status based on selection
      if (nextStatus === "Done") {
        await emailService.markAsRead(id);
      } else if (nextStatus === "Unread") {
        await emailService.markAsUnread(id);
      }

      // Update local state
      setMails((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
      );
      setOpenId(null);

      console.log("✅ Status changed");

      // Refresh parent stats
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("❌ Error changing status:", error);
      alert("Failed to change status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-gray-600">Loading recent mails...</span>
      </div>
    );
  }

  // ✅ Add error state UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-red-600 mb-4">❌ {error}</p>
        <button
          onClick={fetchRecentMails}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (mails.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No recent emails found</p>
        <button
          onClick={fetchRecentMails}
          className="mt-4 text-blue-500 hover:text-blue-600 underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {mails.map((mail) => (
        <Link
          key={mail.id}
          href={`/incomingMail`}
          className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-50 transition relative"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={selectedMails.has(mail.id)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectMail(mail.id);
              }}
              className="w-4 h-4 text-blue-500 rounded border-gray-300 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-800 truncate">
                {mail.subject}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {mail.senderName}
              </p>
              {mail.snippet && (
                <p className="text-xs text-gray-500 truncate mt-1">
                  {mail.snippet}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={mail.senderAvatar}
                alt={mail.senderName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            {/* STATUS BADGE + DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenId((cur) => (cur === mail.id ? null : mail.id));
                }}
                className={`w-40 text-sm px-3 py-1 rounded-xl flex items-center justify-center gap-2 ${
                  STATUS_COLORS[mail.status]
                }`}
              >
                {mail.status}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition ${
                    openId === mail.id ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openId === mail.id && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-20"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChangeStatus(mail.id, opt)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        opt === mail.status
                          ? "font-semibold text-black/70"
                          : "text-black/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Forward"
            >
              <Send size={18} />
            </button>
          </div>
        </Link>
      ))}

      {/* Action Buttons - Only show when emails are selected */}
      {selectedMails.size > 0 && (
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
          >
            <Trash2 size={16} />
            Delete ({selectedMails.size})
          </Button>
          <Button
            onClick={handleMarkSelectedComplete}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg"
          >
            <CheckCircle size={16} />
            Mark as Complete ({selectedMails.size})
          </Button>
        </div>
      )}
    </div>
  );
}
