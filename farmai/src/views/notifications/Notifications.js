import { useState } from "react";
import {
  Bell,
  CloudRain,
  AlertTriangle,
  Leaf,
  Clock,
  Settings,
  CheckCircle,
  X,
  Camera,
  DeleteIcon,
  ClosedCaptionIcon,
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "weather",
      title: "Heavy Rain Alert",
      message:
        "Heavy rainfall expected in the next 6 hours. Consider delaying irrigation.",
      time: "10 minutes ago",
      priority: "high",
      read: false,
    },
    {
      id: 2,
      type: "crop",
      title: "Fertilization Reminder",
      message: "Time to fertilize your tomato crop in Field A.",
      time: "2 hours ago",
      priority: "medium",
      read: false,
    },
    {
      id: 3,
      type: "disease",
      title: "Disease Risk Alert",
      message:
        "High humidity conditions detected. Monitor for fungal diseases.",
      time: "4 hours ago",
      priority: "high",
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "Weekly Report Ready",
      message: "Your weekly farm analytics report is now available.",
      time: "1 day ago",
      priority: "low",
      read: true,
    },
  ]);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Weather", "Crops", "Alerts"];

  const [settings, setSettings] = useState({
    weatherAlerts: true,
    cropReminders: true,
    diseaseWarnings: true,
    systemUpdates: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === "All") {
      return notifications;
    }
    
    const typeMap = {
      "Weather": "weather",
      "Crops": "crop",
      "Alerts": "disease"
    };
    
    const filterType = typeMap[activeTab];
    return notifications.filter(n => n.type === filterType);
  };

  const filteredNotifications = getFilteredNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "weather":
        return CloudRain;
      case "crop":
        return Leaf;
      case "disease":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-farming-orange border-farming-orange bg-farming-orange/5";
      case "medium":
        return "text-farming-green border-farming-green bg-farming-green/5";
      case "low":
        return "text-farming-gray border-farming-gray bg-farming-gray/5";
      default:
        return "text-farming-gray border-farming-gray bg-farming-gray/5";
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="h3 text-success fw-bold mb-1">Notifications</h1>
            <p className="text-muted">
              Manage your alerts and notification preferences
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            {unreadCount > 0 && (
              <button
                className="btn btn-outline-success d-flex align-items-center"
                onClick={markAllAsRead}
              >
                <i className="bi bi-check-circle me-2"></i> Mark All Read
              </button>
            )}
            <span className="badge bg-warning text-dark">
              {unreadCount} Unread
            </span>
          </div>
        </div>

        <div className="row g-4">
          {/* Notifications List */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-center my-2">

            <div className="d-flex justify-content-center m-2 mb-4">
         
        </div>
             
               <div className="d-flex bg-light rounded-3 shadow-sm w-100" style={{maxWidth: "900px" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-fill btn border-0 fw-semibold py-2 ${
                  activeTab === tab
                    ? "bg-white text-success shadow-sm rounded-3"
                    : "text-muted"
                }`}
              >
               {tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>


            </div>

            <div className="tab-content mt-3">
              {/* All Notifications */}
              <div className="tab-pane fade show active" id="all">
                {filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);

                  // Priority colors
                  const priorityColors = {
                    high: "bg-danger-subtle text-danger-emphasis",
                    medium: "bg-success-subtle text-success-emphasis",
                    low: "bg-secondary-subtle text-secondary-emphasis",
                  };

                  return (
                    <div
                      key={notification.id}
                      className={`p-3 mb-3 border-1 border-success  shadow-sm rounded-4 ${
                        !notification.read
                          ? "bg-success bg-opacity-10 border-1"
                          : "bg-light"
                      }`}
                    >
                      <div className="card-body d-flex justify-content-between align-items-start flex-wrap">
                        {/* Left Side */}
                        <div className="d-flex flex-grow-1 gap-3">
                          {/* Icon */}
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm"
                            style={{ width: "48px", height: "48px" }}
                          >
                            <IconComponent className="fs-4 text-success" />
                          </div>

                          {/* Text */}
                          <div className="flex-grow-1">
                            <h6
                              className={`fw-bold mb-1 ${
                                !notification.read
                                  ? "text-success"
                                  : "text-dark"
                              }`}
                            >
                              {notification.title}{" "}
                              <span className="text-danger">●</span>
                            </h6>
                            <p className="text-muted small mb-2">
                              {notification.message}
                            </p>

                            {/* Time + Priority */}
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <span className="small text-muted d-flex align-items-center gap-1">
                                <i className="bi bi-clock"></i>{" "}
                                {notification.time}
                              </span>
                              <span
                                className={`badge rounded-pill px-3 py-1 text-capitalize ${
                                  priorityColors[notification.priority]
                                }`}
                              >
                                {notification.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                          {!notification.read && (
                            <button
                              className="btn btn-sm btn-light rounded-circle text-success"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-light rounded-circle text-muted"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="col-lg-4">
            {/* Notification Settings */}
            <div className="card mb-4">
              <div className="p-0 fw-bold text-success">
                <i className="bi bi-gear me-2"></i> Notification Settings
                <hr/>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.weatherAlerts}
                    onChange={(e) =>
                      updateSetting("weatherAlerts", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-success">
                    Weather Alerts
                  </label>
                  <div className="small text-muted">
                    Rain, frost, and severe weather
                  </div>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.cropReminders}
                    onChange={(e) =>
                      updateSetting("cropReminders", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-success">
                    Crop Reminders
                  </label>
                  <div className="small text-muted">
                    Fertilization and care tasks
                  </div>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.diseaseWarnings}
                    onChange={(e) =>
                      updateSetting("diseaseWarnings", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-danger">
                    Disease Warnings
                  </label>
                  <div className="small text-muted">High-risk conditions</div>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.systemUpdates}
                    onChange={(e) =>
                      updateSetting("systemUpdates", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-muted">
                    System Updates
                  </label>
                  <div className="small text-muted">
                    App updates and maintenance
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="card mb-4">
              <div className="p-0 fw-bold text-danger">
                Delivery Methods
              </div>
              <hr/>

              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      updateSetting("emailNotifications", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-danger">
                    Email
                  </label>
                  <div className="small text-muted">
                    Sent to your registered email
                  </div>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      updateSetting("pushNotifications", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-danger">
                    Push Notifications
                  </label>
                  <div className="small text-muted">
                    Browser and mobile alerts
                  </div>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) =>
                      updateSetting("smsNotifications", e.target.checked)
                    }
                  />
                  <label className="form-check-label fw-semibold text-muted">
                    SMS
                  </label>
                  <div className="small text-muted">
                    Text messages (Premium)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <div className="p-0 fw-bold text-success">
                Notification Stats
              </div>
              <hr/>

              <div className="card-body text-center">
                <div className="p-3 bg-light rounded mb-3">
                  <h2 className="fw-bold text-success">
                    {filteredNotifications.length}
                  </h2>
                  <div className="small text-muted">Total Notifications</div>
                </div>
                <div className="row g-2">
                  <div className="col">
                    <div className="p-2 bg-warning rounded">
                      <h5 className="fw-bold text-dark">
                        {filteredNotifications.filter((n) => !n.read).length}
                      </h5>
                      <div className="small text-muted">Unread</div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="p-2 bg-success-subtle rounded">
                      <h5 className="fw-bold text-success">
                        {
                          filteredNotifications.filter((n) => n.priority === "high")
                            .length
                        }
                      </h5>
                      <div className="small text-muted">High Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
