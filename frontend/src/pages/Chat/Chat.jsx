import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./Chat.css";

export default function Chat() {
  const { user, token, isAuthenticated } = useAuth();

  // State for regular user (Client or Freelancer)
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State for Admin ("We")
  const isAdmin = user?.role === "admin";
  const [adminTab, setAdminTab] = useState("client"); // "client" | "freelancer"
  const [adminConversations, setAdminConversations] = useState([]);
  const [activeAdminConvId, setActiveAdminConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  const mergeMessages = (existingMessages, incomingMessages) => {
    if (!Array.isArray(existingMessages) && !Array.isArray(incomingMessages)) {
      return [];
    }

    const merged = new Map();

    [...(existingMessages || []), ...(incomingMessages || [])].forEach((msg) => {
      if (!msg || !msg._id) return;
      merged.set(msg._id, msg);
    });

    return [...merged.values()].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial load
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (isAdmin) {
      fetchAdminConversations();
    } else {
      fetchUserConversation();
    }
  }, [token, isAdmin, adminTab]);

  // Polling for new messages every 3.5s
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isAdmin && activeAdminConvId) {
        pollMessages(activeAdminConvId);
      } else if (!isAdmin && conversation?._id) {
        pollMessages(conversation._id);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [token, isAdmin, activeAdminConvId, conversation]);

  // 1. Fetch user's dedicated conversation with Project Desk
  const fetchUserConversation = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/chat/my-conversation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setConversation(data.data);
        await fetchMessages(data.data._id);
      } else {
        setErrorMessage(data.message || "Could not initialize Project Desk conversation.");
      }
    } catch (err) {
      setErrorMessage("Network error connecting to Project Desk.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch admin conversations list
  const fetchAdminConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/admin/conversations?role=${adminTab}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data)) {
        setAdminConversations(data.data);
        // Automatically select first conversation if none selected
        if (!activeAdminConvId && data.data.length > 0) {
          setActiveAdminConvId(data.data[0]._id);
          fetchMessages(data.data[0]._id);
        } else if (activeAdminConvId) {
          fetchMessages(activeAdminConvId);
        }
      }
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch messages for a conversation
  const fetchMessages = async (convId) => {
    try {
      const res = await fetch(`/api/chat/messages/${convId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setMessages((prev) => mergeMessages(prev, data.data));
        // Mark as read
        fetch(`/api/chat/messages/${convId}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // 4. Background polling
  const pollMessages = async (convId) => {
    try {
      const res = await fetch(`/api/chat/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setMessages((prev) => mergeMessages(prev, data.data));
      }
    } catch (e) {}
  };

  // 5. Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const targetConvId = isAdmin ? activeAdminConvId : conversation?._id;
    if (!targetConvId) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: targetConvId,
          text: messageText,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setMessages((prev) => mergeMessages(prev, [data.data]));
        if (isAdmin) {
          fetchAdminConversations();
        }
      } else {
        alert(data.message || "Failed to deliver message.");
      }
    } catch (err) {
      alert("Network error sending message.");
    } finally {
      setSending(false);
    }
  };

  // Quick suggestions for clients and freelancers
  const clientQuickChips = [
    "I need a quote for document translation",
    "What is the turnaround time for audio dubbing?",
    "Can you assign a native Japanese translator?",
    "I have submitted new project files",
  ];

  const freelancerQuickChips = [
    "I have submitted the milestone draft",
    "Clarification needed on glossary terminology",
    "Audio sync is completed and ready for QA review",
    "Requesting timeline extension",
  ];

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar />
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <div style={{ maxWidth: "440px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "40px" }}>💬</span>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginTop: "12px", marginBottom: "8px" }}>
              Freeio Project Desk
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              Please log in to communicate with your dedicated Freeio Project Manager.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
              Log In to Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active conversation object for Admin
  const activeAdminConv = adminConversations.find((c) => c._id === activeAdminConvId);

  // Filtered conversations for admin
  const filteredAdminConvs = adminConversations.filter((c) => {
    const name = c.user?.name || "";
    const email = c.user?.email || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="chat-page-wrapper">
      <Navbar />

      <main className="chat-main-area">
        <div className="container chat-container-fluid">
          {isAdmin ? (
            /* ========================================================
               ADMIN VIEW ("WE"): MULTI-CLIENT & FREELANCER INBOX
               ======================================================== */
            <div className="admin-chat-console">
              {/* Left Column: Inbox List */}
              <aside className="admin-inbox-sidebar">
                <div className="admin-inbox-header">
                  <div className="admin-header-title">
                    <h2>Project Desk Console</h2>
                    <span className="badge badge-blue">Admin Mode</span>
                  </div>

                  {/* Tabs: Clients vs Freelancers */}
                  <div className="admin-role-tabs">
                    <button
                      className={`admin-tab-btn ${adminTab === "client" ? "active" : ""}`}
                      onClick={() => {
                        setAdminTab("client");
                        setActiveAdminConvId(null);
                      }}
                    >
                      💼 Clients
                    </button>
                    <button
                      className={`admin-tab-btn ${adminTab === "freelancer" ? "active" : ""}`}
                      onClick={() => {
                        setAdminTab("freelancer");
                        setActiveAdminConvId(null);
                      }}
                    >
                      ⚡ Freelancers
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="admin-search-wrap">
                    <input
                      type="text"
                      placeholder={`Search ${adminTab === "client" ? "clients" : "freelancers"}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Conversation Items */}
                <div className="admin-threads-list">
                  {loading ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                      Loading channels...
                    </div>
                  ) : filteredAdminConvs.length === 0 ? (
                    <div style={{ padding: "32px 20px", textAlign: "center", color: "#64748b", fontSize: "13.5px" }}>
                      No active {adminTab} conversations found.
                    </div>
                  ) : (
                    filteredAdminConvs.map((conv) => {
                      const isSelected = conv._id === activeAdminConvId;
                      return (
                        <div
                          key={conv._id}
                          className={`admin-thread-item ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setActiveAdminConvId(conv._id);
                            fetchMessages(conv._id);
                          }}
                        >
                          <div className="thread-avatar">
                            {conv.user?.name ? conv.user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="thread-content">
                            <div className="thread-top">
                              <span className="thread-user-name">{conv.user?.name || "User"}</span>
                              <span className="thread-time">
                                {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="thread-snippet">{conv.lastMessage || "No messages yet"}</p>
                          </div>
                          {conv.unreadCountAdmin > 0 && (
                            <span className="thread-unread-badge">{conv.unreadCountAdmin}</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Right Column: Chat Window for Selected User */}
              <section className="admin-chat-pane">
                {activeAdminConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-pane-header">
                      <div className="user-profile-header">
                        <div className="chat-header-avatar">
                          {activeAdminConv.user?.name ? activeAdminConv.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h3 className="chat-header-name">{activeAdminConv.user?.name || "User"}</h3>
                            <span className={`badge ${activeAdminConv.userRole === "client" ? "badge-blue" : "badge-green"}`}>
                              {activeAdminConv.userRole === "client" ? "Client" : "Freelancer"}
                            </span>
                          </div>
                          <span className="chat-header-meta">
                            {activeAdminConv.user?.email} • {activeAdminConv.user?.location || "Global"}
                          </span>
                        </div>
                      </div>

                      <div className="chat-security-tag">
                        🔒 Platform-Mediated Channel
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="chat-messages-body">
                      {messages.map((msg) => {
                        const isFromMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                        return (
                          <div key={msg._id} className={`message-bubble-row ${isFromMe ? "outgoing" : "incoming"}`}>
                            {!isFromMe && (
                              <div className="message-sender-avatar">
                                {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <div className={`message-bubble ${isFromMe ? "bubble-blue" : "bubble-gray"}`}>
                              <p className="message-text">{msg.text}</p>
                              <span className="message-timestamp">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Typing Input */}
                    <form onSubmit={handleSendMessage} className="chat-input-bar">
                      <input
                        type="text"
                        placeholder={`Reply to ${activeAdminConv.user?.name || "user"} as Freeio Project Desk...`}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        autoFocus
                      />
                      <button type="submit" className="btn btn-primary btn-chat-send" disabled={sending}>
                        Send Reply →
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ margin: "auto", textAlign: "center", color: "#64748b" }}>
                    Select a conversation on the left to start chatting.
                  </div>
                )}
              </section>
            </div>
          ) : (
            /* ========================================================
               CLIENT / FREELANCER VIEW: MEDIATED WITH PROJECT DESK
               ======================================================== */
            <div className="user-chat-wrapper">
              <div className="user-chat-card">
                {/* Header */}
                <div className="user-chat-header">
                  <div className="project-desk-info">
                    <div className="desk-avatar">
                      F
                      <span className="online-indicator-dot" />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h2 className="desk-name">Freeio Project Desk</h2>
                        <span className="badge badge-blue">Official Management</span>
                      </div>
                      <span className="desk-status">
                        🟢 Active & Mediated • Typically replies within minutes
                      </span>
                    </div>
                  </div>

                  <div className="mediated-badge-box">
                    <span>🛡️ Direct client-to-freelancer contact is disabled</span>
                  </div>
                </div>

                {/* Mediated Notice Bar */}
                <div className="mediated-notice-banner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>
                    {user?.role === "client"
                      ? "All project specifications, translation quotes, milestones, and deliverables are managed directly with your Freeio Project Manager."
                      : "Receive verified task guidelines, ask language & pronunciation questions, and submit milestone draft deliverables to the Freeio operations team."}
                  </span>
                </div>

                {/* Messages Body */}
                <div className="user-chat-body">
                  {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      Connecting to Freeio Project Desk...
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      No messages yet. Send a message below to start chatting!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isFromMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                      return (
                        <div key={msg._id} className={`message-bubble-row ${isFromMe ? "outgoing" : "incoming"}`}>
                          {!isFromMe && (
                            <div className="desk-mini-avatar">
                              F
                            </div>
                          )}
                          <div className={`message-bubble ${isFromMe ? "bubble-blue" : "bubble-gray"}`}>
                            {!isFromMe && (
                              <span className="bubble-sender-title">Freeio Project Desk</span>
                            )}
                            <p className="message-text">{msg.text}</p>
                            <span className="message-timestamp">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions chips */}
                <div className="quick-chips-row">
                  <span className="quick-chips-label">Quick topics:</span>
                  {(user?.role === "client" ? clientQuickChips : freelancerQuickChips).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="quick-chip-btn"
                      onClick={() => setInputText(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="user-chat-input-bar">
                  <input
                    type="text"
                    placeholder="Type your message to Freeio Project Desk (Press Enter to send)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-chat-send" disabled={sending}>
                    {sending ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
