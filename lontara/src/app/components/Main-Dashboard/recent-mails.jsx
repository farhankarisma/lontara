"use client";

import { useState } from "react";
import { Send, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/button";

const STATUS_OPTIONS = ["Unread", "In-Progress", "Done"];
const STATUS_COLORS = {
  Unread: "bg-red-100 text-red-600",
  "In-Progress": "bg-yellow-100 text-yellow-600",
  Done: "bg-green-100 text-green-600",
};

export default function RecentMails(className = "") {
  const [mails, setMails] = useState([
    {
      id: 1,
      subject: "Project Approval",
      senderName: "Sally",
      senderAvatar: "profile-test.jpg",
      status: "Unread",
      statusColor: "red",
    },
    {
      id: 2,
      subject: "Meeting Schedule",
      senderName: "Amanda",
      senderAvatar: "profile-test.jpg",
      status: "In-Progress",
      statusColor: "yellow",
    },
  ]);

  const [openId, setOpenId] = useState(null);
  const [selectedMails, setSelectedMails] = useState(new Set());

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

  const handleDeleteSelected = () => {
    setMails((prev) => prev.filter((mail) => !selectedMails.has(mail.id)));
    setSelectedMails(new Set());
  };

  const handleMarkSelectedComplete = () => {
    setMails((prev) =>
      prev.map((mail) =>
        selectedMails.has(mail.id) ? { ...mail, status: "Done" } : mail
      )
    );
    setSelectedMails(new Set());
  };

  const handleChangeStatus = (id, nextStatus) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    setOpenId(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {mails.map((mail) => (
        <Link
          key={mail.id}
          href={`/mails/${mail.id}`}
          className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-50 transition relative"
        >
          <div className="flex items-center gap-3">
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
              className="w-4 h-4 text-blue-500 rounded border-gray-300"
            />
            <div>
              <h3 className="font-bold text-gray-800">{mail.subject}</h3>
              <p className="text-sm text-gray-400">{mail.senderName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={`/${mail.senderAvatar}`}
                alt={mail.senderName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            {/* BADGE + DROPDOWN */}
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
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 size={16} />
            Delete ({selectedMails.size})
          </Button>
          <Button
            onClick={handleMarkSelectedComplete}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
          >
            <CheckCircle size={16} />
            Mark as Complete ({selectedMails.size})
          </Button>
        </div>
      )}
    </div>
  );
}
