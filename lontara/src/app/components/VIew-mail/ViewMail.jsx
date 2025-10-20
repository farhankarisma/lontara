"use client";

import { useState } from "react";
import {
  FiChevronLeft,
  FiStar,
  FiMoreVertical,
  FiCornerUpRight,
  FiBell
} from "react-icons/fi";

export default function ViewMail({ email, onBack }) {
  const [isStarred, setIsStarred] = useState(false);

  // Extract sender name
  const getSenderName = (from) => {
    if (!from) return "Unknown";
    const match = from.match(/^([^<]+)</);
    return match ? match[1].trim() : from.split("@")[0];
  };

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      return `${diffHours} hours ago`;
    } catch {
      return dateString;
    }
  };

  // Format full date
  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Extract quick reply suggestions from email body
  const extractQuickReplies = (body) => {
    // Simple logic: extract common phrases or use defaults
    const defaultReplies = [
      "Looking forward to it!",
      "We will be there!",
      "Thanks for the update!",
    ];
    return defaultReplies;
  };

  const quickReplies = extractQuickReplies(email.body);

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {email.subject || "(No Subject)"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiStar
                size={20}
                className={
                  isStarred
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-600"
                }
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiMoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sender Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  getSenderName(email.from)
                )}&background=random`}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-800">
                  User Name{" "}
                  <span className="text-gray-500 font-normal">
                    &lt;{email.from}&gt;
                  </span>
                </h2>
                <p className="text-sm text-gray-500">to me</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {formatDateTime(email.date)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FiStar size={16} className="text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FiBell size={16} className="text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FiMoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="mb-6">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          </div>

          {/* Quick Reply Suggestions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 text-black/70 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiCornerUpRight size={16} className="transform rotate-180" />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-black/70 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiCornerUpRight size={16} />
              <span>Forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
