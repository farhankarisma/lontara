"use client";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiMoreVertical,
  FiPaperclip,
  FiTrash2,
  FiEdit3,
  FiSend,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import emailService from "../../services/mailManagement";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import AppLayout from "../components/ui/AppLayout";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDraft, setSelectedDraft] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📥 Fetching drafts...");

      const response = await emailService.getDraftEmails(100);
      console.log("📧 Drafts response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch drafts");
      }

      const draftList = response.data?.drafts || response.data?.messages || [];
      console.log("✅ Fetched drafts:", draftList.length);

      setDrafts(draftList);
    } catch (err) {
      console.error("❌ Error fetching drafts:", err);
      setError(err.message);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteDraft = async (draftId, e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this draft?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting draft:", draftId);

      await emailService.deleteDraft(draftId);

      console.log("✅ Draft deleted successfully");

      // Remove from list
      setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
    } catch (err) {
      console.error("❌ Error deleting draft:", err);
      alert("Failed to delete draft: " + err.message);
    }
  };

  const handleEditDraft = (draft, e) => {
    e.stopPropagation();

    // TODO: Redirect to compose page with draft data
    console.log("✏️ Edit draft:", draft);
    alert("Edit feature coming soon! Draft ID: " + draft.id);
  };

  const handleSendDraft = async (draft, e) => {
    e.stopPropagation();

    if (!confirm("Send this draft now?")) {
      return;
    }

    try {
      console.log("📤 Sending draft:", draft);

      // Extract email data from draft
      const emailData = {
        to: draft.to || "",
        subject: draft.subject || "",
        body: draft.body || draft.snippet || "",
      };

      const response = await emailService.sendEmail(emailData, []);

      if (!response.success) {
        throw new Error(response.error || "Failed to send email");
      }

      console.log("✅ Draft sent successfully");

      // Delete draft after sending
      await emailService.deleteDraft(draft.id);

      // Remove from list
      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));

      alert("Draft sent successfully!");
    } catch (err) {
      console.error("❌ Error sending draft:", err);
      alert("Failed to send draft: " + err.message);
    }
  };

  const filteredDrafts = drafts.filter((draft) => {
    const query = searchQuery.toLowerCase();
    return (
      (draft.subject || "").toLowerCase().includes(query) ||
      (draft.to || "").toLowerCase().includes(query) ||
      (draft.snippet || "").toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const formatDraft = (draft) => {
    return {
      id: draft.id,
      to:
        draft.to ||
        draft.message?.payload?.headers?.find((h) => h.name === "To")?.value ||
        "No recipient",
      subject:
        draft.subject ||
        draft.message?.payload?.headers?.find((h) => h.name === "Subject")
          ?.value ||
        "(No Subject)",
      snippet: draft.snippet || draft.body || "",
      date: formatDate(draft.date || draft.message?.internalDate),
      hasAttachment: draft.hasAttachments || false,
    };
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex h-full bg-gray-50">
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h1 className="text-2xl font-semibold text-gray-800">Drafts</h1>

                <div className="flex-1 max-w-md relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drafts..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={fetchDrafts}
                  disabled={loading}
                  title="Refresh drafts"
                >
                  <FiRefreshCw
                    className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
                    size={20}
                  />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <FiAlertCircle className="text-red-500" size={20} />
                  <div className="flex-1">
                    <p className="text-red-600">❌ {error}</p>
                    <button
                      onClick={fetchDrafts}
                      className="mt-2 text-sm text-red-700 underline hover:no-underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <FiRefreshCw
                    className="animate-spin text-blue-500"
                    size={40}
                  />
                  <span className="ml-3 text-gray-600">Loading drafts...</span>
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <FiEdit3 className="text-gray-400" size={40} />
                  </div>
                  <p className="text-xl text-gray-600 mb-2">No drafts found</p>
                  <p className="text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Start composing an email to create a draft"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Draft Count */}
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {filteredDrafts.length}{" "}
                      {filteredDrafts.length === 1 ? "draft" : "drafts"}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>

                  {/* Draft List */}
                  <div className="space-y-3">
                    {filteredDrafts.map((draft) => {
                      const formatted = formatDraft(draft);

                      return (
                        <div
                          key={formatted.id}
                          className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                          onClick={() => setSelectedDraft(draft)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Subject */}
                              <h3 className="font-semibold text-gray-800 mb-2">
                                {formatted.subject}
                              </h3>

                              {/* To */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">
                                  To:
                                </span>
                                <span className="text-sm text-blue-600">
                                  {formatted.to}
                                </span>
                              </div>

                              {/* Snippet */}
                              {formatted.snippet && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {formatted.snippet}
                                </p>
                              )}

                              {/* Attachment indicator */}
                              {formatted.hasAttachment && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <FiPaperclip size={16} />
                                  <span>Has attachment</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-start gap-2 ml-4">
                              <span className="text-sm text-gray-500">
                                {formatted.date}
                              </span>

                              {/* Edit button */}
                              <button
                                onClick={(e) => handleEditDraft(draft, e)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit draft"
                              >
                                <FiEdit3 className="text-blue-600" size={16} />
                              </button>

                              {/* Send button */}
                              <button
                                onClick={(e) => handleSendDraft(draft, e)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Send draft"
                              >
                                <FiSend className="text-green-600" size={16} />
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={(e) =>
                                  handleDeleteDraft(formatted.id, e)
                                }
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete draft"
                              >
                                <FiTrash2 className="text-red-600" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
