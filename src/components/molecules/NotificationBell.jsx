import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/dateUtils";

const NotificationBell = ({ notifications = [], onMarkAsRead, onMarkAllAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.Id);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
      >
        <ApperIcon name="Bell" className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    onClick={() => {
                      onMarkAllAsRead();
                      setIsOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <ApperIcon name="Bell" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.Id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-slate-50 transition-colors duration-200",
                        !notification.read && "bg-blue-50"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          "flex-shrink-0 w-2 h-2 rounded-full mt-2",
                          !notification.read ? "bg-blue-500" : "bg-slate-300"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;