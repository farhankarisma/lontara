const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class EmailService {
  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Get inbox emails
  async getInboxEmails(maxResults = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/inbox?maxResults=${maxResults}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inbox emails");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching inbox:", error);
      throw error;
    }
  }

  // Get sent emails
  async getSentEmails(maxResults = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/sent?maxResults=${maxResults}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sent emails");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sent:", error);
      throw error;
    }
  }

  // Get trash emails
  async getTrashEmails(maxResults = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/trash?maxResults=${maxResults}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trash emails");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching trash:", error);
      throw error;
    }
  }

  // Get draft emails
  async getDraftEmails(maxResults = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/drafts?maxResults=${maxResults}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch draft emails");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching drafts:", error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/unread-count`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  // Get email by ID
  async getEmailById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching email:", error);
      throw error;
    }
  }

  // Mark as read
  async markAsRead(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/read`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as read");
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  }

  // Mark as unread
  async markAsUnread(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/unread`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as unread");
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking as unread:", error);
      throw error;
    }
  }

  // Star email
  async starEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/star`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to star email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error starring email:", error);
      throw error;
    }
  }

  // Unstar email
  async unstarEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/unstar`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to unstar email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error unstarring email:", error);
      throw error;
    }
  }

  // Delete email (move to trash)
  async deleteEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting email:", error);
      throw error;
    }
  }

  // Restore email from trash
  async restoreEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/restore`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to restore email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error restoring email:", error);
      throw error;
    }
  }

  // Permanently delete email
  async permanentlyDeleteEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/permanent`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to permanently delete email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error permanently deleting email:", error);
      throw error;
    }
  }

  // Search emails
  async searchEmails(query, maxResults = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/search?q=${encodeURIComponent(
          query
        )}&maxResults=${maxResults}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search emails");
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching emails:", error);
      throw error;
    }
  }

  // Send email
  async sendEmail(emailData) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/send`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  // Reply to email
  async replyToEmail(id, replyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/reply`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(replyData),
      });

      if (!response.ok) {
        throw new Error("Failed to reply to email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error replying to email:", error);
      throw error;
    }
  }

  // Forward email
  async forwardEmail(id, forwardData) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/forward`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(forwardData),
      });

      if (!response.ok) {
        throw new Error("Failed to forward email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error forwarding email:", error);
      throw error;
    }
  }

  // Save draft
  async saveDraft(draftData) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/draft`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  }

  // Update draft
  async updateDraft(id, draftData) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/draft/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        throw new Error("Failed to update draft");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating draft:", error);
      throw error;
    }
  }

  // Delete draft
  async deleteDraft(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/draft/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete draft");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting draft:", error);
      throw error;
    }
  }

  // Get email attachments
  async getAttachment(messageId, attachmentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/${messageId}/attachments/${attachmentId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attachment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching attachment:", error);
      throw error;
    }
  }

  // Add label to email
  async addLabel(id, labelId) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/labels`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ labelId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add label");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding label:", error);
      throw error;
    }
  }

  // Remove label from email
  async removeLabel(id, labelId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/${id}/labels/${labelId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove label");
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing label:", error);
      throw error;
    }
  }

  // Get labels
  async getLabels() {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/labels`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch labels");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching labels:", error);
      throw error;
    }
  }

  // Check Gmail connection status
  async checkGmailStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/gmail-status`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to check Gmail status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking Gmail status:", error);
      throw error;
    }
  }

  // Sync Gmail
  async syncGmail() {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/sync`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to sync Gmail");
      }

      return await response.json();
    } catch (error) {
      console.error("Error syncing Gmail:", error);
      throw error;
    }
  }

  // Get email thread
  async getThread(threadId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/emails/thread/${threadId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thread");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching thread:", error);
      throw error;
    }
  }

  // Archive email
  async archiveEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/archive`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to archive email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error archiving email:", error);
      throw error;
    }
  }

  // Unarchive email
  async unarchiveEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/unarchive`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to unarchive email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error unarchiving email:", error);
      throw error;
    }
  }

  // Mark as spam
  async markAsSpam(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/spam`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as spam");
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking as spam:", error);
      throw error;
    }
  }

  // Mark as not spam
  async markAsNotSpam(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${id}/not-spam`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to mark as not spam");
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking as not spam:", error);
      throw error;
    }
  }

  // Bulk operations
  async bulkMarkAsRead(ids) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/bulk/read`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk mark as read");
      }

      return await response.json();
    } catch (error) {
      console.error("Error bulk marking as read:", error);
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/bulk/delete`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk delete");
      }

      return await response.json();
    } catch (error) {
      console.error("Error bulk deleting:", error);
      throw error;
    }
  }

  async bulkArchive(ids) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/bulk/archive`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk archive");
      }

      return await response.json();
    } catch (error) {
      console.error("Error bulk archiving:", error);
      throw error;
    }
  }
}

export default new EmailService();
