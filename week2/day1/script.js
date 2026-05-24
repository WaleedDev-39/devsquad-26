// DOM Elements
const markAllBtn = document.getElementById('mark-all-btn');
const unreadCountBadge = document.getElementById('unread-count');
const notificationsList = document.getElementById('notifications-list');

// Update unread count badge
function updateUnreadCount() {
    const unreadNotifications = document.querySelectorAll('.notification.unread');
    const count = unreadNotifications.length;

    unreadCountBadge.textContent = count;

    if (count === 0) {
        unreadCountBadge.classList.add('hidden');
    } else {
        unreadCountBadge.classList.remove('hidden');
    }
}

// Mark a single notification as read
function markAsRead(notification) {
    if (notification.classList.contains('unread')) {
        notification.classList.remove('unread');
        notification.dataset.unread = 'false';
        updateUnreadCount();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification.unread');
    unreadNotifications.forEach((notification) => {
        notification.classList.remove('unread');
        notification.dataset.unread = 'false';
    });
    updateUnreadCount();
}

// Event: Mark all as read button
markAllBtn.addEventListener('click', markAllAsRead);

// Event: Click on individual notification to mark as read
notificationsList.addEventListener('click', (e) => {
    const notification = e.target.closest('.notification');
    if (notification) {
        markAsRead(notification);
    }
});

// Initialize
updateUnreadCount();
