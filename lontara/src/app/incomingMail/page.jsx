"use client";

import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiBell,
  FiMoreVertical,
  FiPaperclip,
  FiMessageSquare,
  FiCalendar,
  FiPlus,
  FiChevronDown,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function IncomingMailPage() {
  const [activeTab, setActiveTab] = useState("unread");

  const classifications = [
    {
      id: 1,
      title: "Email Peminjaman Tempat dan Barang",
      count: 22,
      icon: FiMail,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      id: 2,
      title: "Email Izin",
      count: 70,
      icon: FiCheckCircle,
      color: "bg-green-500",
      textColor: "text-green-500",
      bgLight: "bg-green-50",
    },
    {
      id: 3,
      title: "Email Pengaduan",
      count: 45,
      icon: FiAlertCircle,
      color: "bg-orange-500",
      textColor: "text-orange-500",
      bgLight: "bg-orange-50",
    },
    {
      id: 4,
      title: "Email Spam",
      count: 50,
      icon: FiClock,
      color: "bg-red-500",
      textColor: "text-red-500",
      bgLight: "bg-red-50",
    },
  ];

  const mailCategories = {
    unread: {
      title: "Unread",
      count: 22,
      color: "text-red-500",
      mails: [
        {
          id: 1,
          subject: "Project Approval",
          department: "Software Developer",
          description:
            "Here is the document that need to approve before doing a project.",
          priority: "High Priority",
          priorityColor: "text-red-500 bg-red-50",
          comments: 2,
          avatar: "/avatar1.jpg",
        },
        {
          id: 2,
          subject: "Dashboard Improvements",
          department: "Design",
          description: "",
          attachment: "IMG0012_.JPG",
          priority: "Medium Priority",
          priorityColor: "text-orange-500 bg-orange-50",
          comments: 1,
          avatar: "/avatar2.jpg",
        },
        {
          id: 3,
          subject: "Budget Approval",
          department: "Finance",
          description:
            "Here is the budget report that out our company based on our last discussion.",
          priority: "Low Priority",
          priorityColor: "text-blue-500 bg-blue-50",
          comments: 1,
          avatar: "/avatar3.jpg",
        },
      ],
    },
    inProgress: {
      title: "In-Progress",
      count: 70,
      color: "text-orange-500",
      mails: [
        {
          id: 4,
          subject: "User Testing",
          department: "Software Developer",
          description:
            "Create a User Testing form that collect feedback from stakeholders.",
          priority: "Medium Priority",
          priorityColor: "text-orange-500 bg-orange-50",
          comments: 2,
          date: "Nov 30",
          avatar: "/avatar4.jpg",
        },
        {
          id: 5,
          subject: "UI Design",
          department: "Design",
          description: "",
          attachment: "Reference",
          priority: "High Priority",
          priorityColor: "text-red-500 bg-red-50",
          comments: 1,
          date: "Nov 30",
          avatar: "/avatar5.jpg",
        },
        {
          id: 6,
          subject: "Weekly Reimburse",
          department: "Finance",
          description:
            "Here is the invoice of transaction that happen at this week.",
          priority: "High Priority",
          priorityColor: "text-red-500 bg-red-50",
          comments: 1,
          date: "Dec 1",
          avatar: "/avatar6.jpg",
        },
      ],
    },
    completed: {
      title: "Completed",
      count: 50,
      color: "text-green-500",
      mails: [
        {
          id: 7,
          subject: "Meeting Schedule Confirmation",
          department: "Software Developer",
          description:
            "do you need to attend the meeting that scheduled on 12 P.M. Today?",
          priority: "Low Priority",
          priorityColor: "text-blue-500 bg-blue-50",
          comments: 1,
          date: "Nov 11",
          avatar: "/avatar7.jpg",
        },
        {
          id: 8,
          subject: "UI Design",
          department: "Design",
          description: "",
          attachment: "Reference",
          priority: "Medium Priority",
          priorityColor: "text-orange-500 bg-orange-50",
          comments: 1,
          date: "Nov 11",
          avatar: "/avatar8.jpg",
        },
        {
          id: 9,
          subject: "Weekly Reimburse",
          department: "Finance",
          description:
            "Here is the invoice of transaction that happen at this week.",
          priority: "Medium Priority",
          priorityColor: "text-orange-500 bg-orange-50",
          comments: 1,
          date: "Nov 10",
          avatar: "/avatar9.jpg",
        },
      ],
    },
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              Incoming Mail
            </h1>
            <div className="flex-1 max-w-md relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search mail by subject, number, sender"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FiFilter className="text-gray-600" size={20} />
            </button>
          </div>
        </div>

        {/* Mail Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Classification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {classifications.map((classification) => {
              const Icon = classification.icon;
              return (
                <div
                  key={classification.id}
                  className={`${classification.bgLight} rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-gray-300`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs font-medium mb-2 line-clamp-2 min-h-[32px]">
                        {classification.title}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {classification.count}
                      </h3>
                    </div>
                    <div
                      className={`${classification.color} p-2.5 rounded-lg flex-shrink-0 ml-2`}
                    >
                      <Icon className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`${classification.color} h-1.5 rounded-full transition-all`}
                        style={{
                          width: `${(classification.count / 187) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mail Categories */}
          {Object.entries(mailCategories).map(([key, category]) => (
            <div key={key} className="mb-6">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className={`font-semibold ${category.color}`}>
                    {category.title}
                  </h2>
                  <span className="text-gray-500">({category.count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiPlus className="text-gray-600" size={18} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiMoreVertical className="text-gray-600" size={18} />
                  </button>
                </div>
              </div>

              {/* Mail Cards */}
              <div className="space-y-3">
                {category.mails.map((mail) => (
                  <div
                    key={mail.id}
                    className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {mail.subject}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-sm text-blue-600">
                            {mail.department}
                          </span>
                        </div>
                        {mail.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {mail.description}
                          </p>
                        )}
                        {mail.attachment && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FiPaperclip size={16} />
                            <span>{mail.attachment}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-4 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${mail.priorityColor}`}
                        >
                          {mail.priority}
                        </span>
                        <div className="flex items-center gap-3 text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiMessageSquare size={16} />
                            <span className="text-sm">{mail.comments}</span>
                          </div>
                          {mail.date && (
                            <div className="flex items-center gap-1">
                              <FiCalendar size={16} />
                              <span className="text-sm">{mail.date}</span>
                            </div>
                          )}
                          <img
                            src={`https://ui-avatars.com/api/?name=User${mail.id}&background=random`}
                            alt={`User ${mail.id} avatar`}
                            className="w-6 h-6 rounded-full"
                          />
                          <button className="hover:bg-gray-100 rounded p-1">
                            <FiMoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <button className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1">
                <FiChevronDown size={16} />
                View More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}