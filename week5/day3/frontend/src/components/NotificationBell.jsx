import { useState } from "react";
import { FiBell } from "react-icons/fi";

const NotificationBell = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
              {notifications.length} Total
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FiBell className="mx-auto mb-2 opacity-20" size={24} />
                <p className="text-xs italic">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div 
                  key={i} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'BROADCAST' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div>
                      <p className="text-xs text-gray-800 leading-normal">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <button className="w-full py-3 text-center text-[11px] font-bold tracking-widest text-gray-500 hover:text-gray-900 border-t border-gray-50 bg-white transition-colors uppercase">
              View All Activity
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
