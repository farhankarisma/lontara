import apiClient from "./apiClient";

class MailService {
  // ==================== GET EMAILS ====================

  async getInboxEmails(maxResults = 50) {
    return apiClient.get(`/user/emails/inbox?maxResults=${maxResults}`);
  }

  async getSentEmails(maxResults = 50) {
    return apiClient.get(`/user/emails/sent?maxResults=${maxResults}`);
  }

  async getTrashEmails(maxResults = 50) {
    return apiClient.get(`/user/emails/trash?maxResults=${maxResults}`);
  }

  async getDraftEmails(maxResults = 50) {
    return apiClient.get(`/user/emails/drafts?maxResults=${maxResults}`);
  }

  async getUnreadCount() {
    return apiClient.get("/user/emails/unread-count");
  }

  async getEmailById(id) {
    return apiClient.get(`/user/emails/${id}`);
  }

  async getThread(threadId) {
    return apiClient.get(`/user/emails/thread/${threadId}`);
  }

  // ==================== EMAIL ACTIONS ====================

  async markAsRead(id) {
    return apiClient.post(`/user/emails/${id}/read`);
  }

  async markAsUnread(id) {
    return apiClient.post(`/user/emails/${id}/unread`);
  }

  async starEmail(id) {
    return apiClient.post(`/user/emails/${id}/star`);
  }

  async unstarEmail(id) {
    return apiClient.post(`/user/emails/${id}/unstar`);
  }

  async deleteEmail(id) {
    return apiClient.delete(`/user/emails/${id}`);
  }

  async restoreEmail(id) {
    return apiClient.post(`/user/emails/${id}/restore`);
  }

  async permanentlyDeleteEmail(id) {
    return apiClient.delete(`/user/emails/${id}/permanent`);
  }

  async archiveEmail(id) {
    return apiClient.post(`/user/emails/${id}/archive`);
  }

  async unarchiveEmail(id) {
    return apiClient.post(`/user/emails/${id}/unarchive`);
  }

  async markAsSpam(id) {
    return apiClient.post(`/user/emails/${id}/spam`);
  }

  async markAsNotSpam(id) {
    return apiClient.post(`/user/emails/${id}/not-spam`);
  }

  // ==================== SEND & COMPOSE ====================

  async sendEmail(emailData, attachments = []) {
    try {
      const formData = new FormData();

      formData.append("to", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("body", emailData.body);

      if (emailData.priority) {
        formData.append("priority", emailData.priority);
      }

      if (emailData.link) {
        formData.append("link", emailData.link);
      }

      if (attachments && attachments.length > 0) {
        attachments.forEach((attachment) => {
          formData.append("attachments", attachment.file);
        });
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token. Please login again.");
      }

      console.log("📧 Sending email to:", emailData.to);

      const response = await fetch(
        "http://localhost:5000/api/user/emails/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log("📊 Response status:", response.status);

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          `Server error (${response.status}): Backend returned HTML. Check backend logs.`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN") {
          localStorage.removeItem("token");
          throw new Error("Your session has expired. Redirecting to login...");
        }

        if (data.code === "GMAIL_TOKEN_EXPIRED") {
          throw new Error(
            "Your Gmail connection has expired. Please reconnect in Settings."
          );
        }

        if (data.code === "MISSING_SEND_SCOPE") {
          throw new Error(
            "Missing Gmail send permission. Please reconnect in Settings."
          );
        }

        throw new Error(data.message || data.error || "Failed to send email");
      }

      console.log("✅ Email sent successfully");
      return { success: true, data };
    } catch (error) {
      console.error("❌ Send email error:", error);

      if (error.message.includes("session has expired")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }

      throw error;
    }
  }

  async saveDraft(draftData, attachments = []) {
    try {
      const formData = new FormData();

      formData.append("to", draftData.to || "");
      formData.append("subject", draftData.subject || "");
      formData.append("body", draftData.body || "");

      if (draftData.priority) {
        formData.append("priority", draftData.priority);
      }

      if (draftData.link) {
        formData.append("link", draftData.link);
      }

      if (attachments && attachments.length > 0) {
        attachments.forEach((attachment) => {
          formData.append("attachments", attachment.file);
        });
      }

      const token = localStorage.getItem("token");

      console.log("💾 Saving draft");

      const response = await fetch(
        "http://localhost:5000/api/user/emails/save-drafts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "MISSING_COMPOSE_SCOPE") {
          throw new Error(
            "Missing Gmail compose permission. Please reconnect in Settings."
          );
        }

        throw new Error(data.message || data.error || "Failed to save draft");
      }

      console.log("✅ Draft saved successfully");
      return { success: true, data };
    } catch (error) {
      console.error("❌ Save draft error:", error);
      throw error;
    }
  }

  async replyToEmail(id, replyData) {
    return apiClient.post(`/user/emails/${id}/reply`, replyData);
  }

  async forwardEmail(id, forwardData) {
    return apiClient.post(`/user/emails/${id}/forward`, forwardData);
  }

  // ==================== DRAFTS ====================

  async updateDraft(id, draftData) {
    return apiClient.put(`/user/emails/draft/${id}`, draftData);
  }

  async deleteDraft(id) {
    return apiClient.delete(`/user/emails/draft/${id}`);
  }

  // ==================== SEARCH & LABELS ====================

  async searchEmails(query, maxResults = 50) {
    return apiClient.get(
      `/user/emails/search?q=${encodeURIComponent(
        query
      )}&maxResults=${maxResults}`
    );
  }

  async getLabels() {
    return apiClient.get("/user/emails/labels");
  }

  async addLabel(id, labelId) {
    return apiClient.post(`/user/emails/${id}/labels`, { labelId });
  }

  async removeLabel(id, labelId) {
    return apiClient.delete(`/user/emails/${id}/labels/${labelId}`);
  }

  // ==================== ATTACHMENTS ====================

  async getAttachment(messageId, attachmentId) {
    return apiClient.get(
      `/user/emails/${messageId}/attachments/${attachmentId}`
    );
  }

  // ==================== GMAIL SYNC ====================

  async checkGmailStatus() {
    return apiClient.get("/user/gmail-status");
  }

  async syncGmail() {
    return apiClient.post("/user/emails/sync");
  }

  // ==================== BULK OPERATIONS ====================

  async bulkMarkAsRead(ids) {
    return apiClient.post("/user/emails/bulk/read", { ids });
  }

  async bulkDelete(ids) {
    return apiClient.post("/user/emails/bulk/delete", { ids });
  }

  async bulkArchive(ids) {
    return apiClient.post("/user/emails/bulk/archive", { ids });
  }

  async bulkMarkAsUnread(ids) {
    return apiClient.post("/user/emails/bulk/unread", { ids });
  }

  async bulkStar(ids) {
    return apiClient.post("/user/emails/bulk/star", { ids });
  }

  async bulkUnstar(ids) {
    return apiClient.post("/user/emails/bulk/unstar", { ids });
  }

  async bulkAddLabel(ids, labelId) {
    return apiClient.post("/user/emails/bulk/label", { ids, labelId });
  }

  async bulkRemoveLabel(ids, labelId) {
    return apiClient.post("/user/emails/bulk/remove-label", { ids, labelId });
  }

  async bulkTrash(ids) {
    return apiClient.post("/user/emails/bulk/trash", { ids });
  }

  async bulkRestore(ids) {
    return apiClient.post("/user/emails/bulk/restore", { ids });
  }

  async bulkMarkAsSpam(ids) {
    return apiClient.post("/user/emails/bulk/spam", { ids });
  }

  // ==================== ML CLASSIFICATION ====================

  async getClassifiedInbox(maxResults = 50) {
    return apiClient.get(`/user/emails/classify-inbox?maxResults=${maxResults}`);
  }

  async getClassificationStats(maxResults = 50) {
    return apiClient.get(`/user/emails/classification-stats?maxResults=${maxResults}`);
  }

  async classifyEmail(id) {
    return apiClient.get(`/user/emails/classify/${id}`);
  }
}

export default new MailService();
