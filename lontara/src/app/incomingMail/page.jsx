"use client";

import { useState, useEffect } from "react";
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
  FiRefreshCw,
} from "react-icons/fi";
import emailService from "@/services/mailManagement";
import ViewMail from "../components/VIew-mail/ViewMail";

export default function IncomingMailPage() {
  const [activeTab, setActiveTab] = useState("unread");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null);
  
  const [visibleCounts, setVisibleCounts] = useState({
    unread: 3,
    inProgress: 3,
    completed: 3,
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await emailService.getInboxEmails(100);
      console.log("✅ Fetched emails:", response);
      setEmails(response.messages || []);
    } catch (err) {
      console.error("❌ Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await emailService.searchEmails(searchQuery);
        setEmails(response.messages || []);
      } catch (err) {
        console.error("Error searching emails:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewMore = (category) => {
    setVisibleCounts(prev => ({
      ...prev,
      [category]: prev[category] + 5
    }));
  };

  // ✅ Handle email click
  const handleEmailClick = async (emailId) => {
    try {
      const emailDetail = await emailService.getEmailById(emailId);
      console.log("✅ Email detail:", emailDetail);
      setSelectedEmail(emailDetail);
      
      // Mark as read
      if (!emailDetail.isRead) {
        await emailService.markAsRead(emailId);
        // Refresh emails to update read status
        fetchEmails();
      }
    } catch (err) {
      console.error("Error fetching email detail:", err);
    }
  };

  // ✅ Handle back from email view
  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const categorizeEmails = (emailList) => {
    const categories = {
      peminjaman: [],
      izin: [],
      pengaduan: [],
      spam: [],
    };

    emailList.forEach((email) => {
      const subject = (email.subject || "").toLowerCase();

      if (
        subject.includes("pinjam") ||
        subject.includes("sewa") ||
        subject.includes("booking")
      ) {
        categories.peminjaman.push(email);
      } else if (
        subject.includes("izin") ||
        subject.includes("cuti") ||
        subject.includes("leave")
      ) {
        categories.izin.push(email);
      } else if (
        subject.includes("pengaduan") ||
        subject.includes("complaint") ||
        subject.includes("lapor")
      ) {
        categories.pengaduan.push(email);
      } else if (email.labelIds?.includes("SPAM")) {
        categories.spam.push(email);
      }
    });

    return categories;
  };

  const categorizedEmails = categorizeEmails(emails);

  const classifications = [
    {
      id: 1,
      title: "Email Peminjaman Tempat dan Barang",
      count: categorizedEmails.peminjaman.length,
      icon: FiMail,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      id: 2,
      title: "Email Izin",
      count: categorizedEmails.izin.length,
      icon: FiCheckCircle,
      color: "bg-green-500",
      textColor: "text-green-500",
      bgLight: "bg-green-50",
    },
    {
      id: 3,
      title: "Email Pengaduan",
      count: categorizedEmails.pengaduan.length,
      icon: FiAlertCircle,
      color: "bg-orange-500",
      textColor: "text-orange-500",
      bgLight: "bg-orange-50",
    },
    {
      id: 4,
      title: "Email Spam",
      count: categorizedEmails.spam.length,
      icon: FiClock,
      color: "bg-red-500",
      textColor: "text-red-500",
      bgLight: "bg-red-50",
    },
  ];

  const unreadEmails = emails.filter((e) => !e.isRead);
  const readEmails = emails.filter((e) => e.isRead);

  const formatEmailForDisplay = (email) => {
    const getSenderName = (from) => {
      if (!from) return "Unknown";
      const match = from.match(/^([^<]+)</);
      return match ? match[1].trim() : from.split("@")[0];
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } catch {
        return "";
      }
    };

    const subject = (email.subject || "").toLowerCase();
    let priority = "Low Priority";
    let priorityColor = "text-blue-500 bg-blue-50";

    if (
      subject.includes("urgent") ||
      subject.includes("asap") ||
      subject.includes("penting")
    ) {
      priority = "High Priority";
      priorityColor = "text-red-500 bg-red-50";
    } else if (subject.includes("important") || subject.includes("reminder")) {
      priority = "Medium Priority";
      priorityColor = "text-orange-500 bg-orange-50";
    }

    return {
      id: email.id,
      subject: email.subject || "(No Subject)",
      department: getSenderName(email.from),
      description: email.snippet || "",
      priority: priority,
      priorityColor: priorityColor,
      comments: 0,
      date: formatDate(email.date),
      avatar: email.from,
      hasAttachment: email.labelIds?.includes("HAS_ATTACHMENT") || false,
    };
  };

  const mailCategories = {
    unread: {
      title: "Unread",
      count: unreadEmails.length,
      color: "text-red-500",
      mails: unreadEmails.slice(0, visibleCounts.unread).map(formatEmailForDisplay),
      totalMails: unreadEmails.length,
      visibleCount: visibleCounts.unread,
    },
    inProgress: {
      title: "In-Progress",
      count: Math.floor(readEmails.length * 0.4),
      color: "text-orange-500",
      mails: readEmails.slice(0, visibleCounts.inProgress).map(formatEmailForDisplay),
      totalMails: readEmails.length,
      visibleCount: visibleCounts.inProgress,
    },
    completed: {
      title: "Completed",
      count: Math.floor(readEmails.length * 0.6),
      color: "text-green-500",
      mails: readEmails.slice(visibleCounts.inProgress, visibleCounts.inProgress + visibleCounts.completed).map(formatEmailForDisplay),
      totalMails: readEmails.length - visibleCounts.inProgress,
      visibleCount: visibleCounts.completed,
    },
  };

  const totalEmails = emails.length || 1;

  // ✅ Render email detail view if selected
  if (selectedEmail) {
    return <ViewMail email={selectedEmail} onBack={handleBackToList} />;
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={fetchEmails}
              disabled={loading}
            >
              <FiRefreshCw
                className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
                size={20}
              />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiRefreshCw className="animate-spin text-blue-500" size={40} />
              <span className="ml-3 text-gray-600">Loading emails...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {classifications.map((classification) => {
                  const Icon = classification.icon;
                  const percentage = (classification.count / totalEmails) * 100;

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
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {Object.entries(mailCategories).map(([key, category]) => (
                <div key={key} className="mb-6">
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

                  <div className="space-y-3">
                    {category.mails.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No emails in this category
                      </div>
                    ) : (
                      category.mails.map((mail) => (
                        <div
                          key={mail.id}
                          onClick={() => handleEmailClick(mail.id)}
                          className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
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
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {mail.description}
                                </p>
                              )}
                              {mail.hasAttachment && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <FiPaperclip size={16} />
                                  <span>Attachment</span>
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
                                  <span className="text-sm">
                                    {mail.comments}
                                  </span>
                                </div>
                                {mail.date && (
                                  <div className="flex items-center gap-1">
                                    <FiCalendar size={16} />
                                    <span className="text-sm">{mail.date}</span>
                                  </div>
                                )}
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    mail.department
                                  )}&background=random`}
                                  alt={`${mail.department} avatar`}
                                  className="w-6 h-6 rounded-full"
                                />
                                <button className="hover:bg-gray-100 rounded p-1">
                                  <FiMoreVertical size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {category.mails.length > 0 && category.visibleCount < category.totalMails && (
                    <button 
                      onClick={() => handleViewMore(key)}
                      className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <FiChevronDown size={16} />
                      View More ({Math.min(5, category.totalMails - category.visibleCount)} more)
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}