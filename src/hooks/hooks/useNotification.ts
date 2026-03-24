import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

export const useInAppNotifications = (userId: string | undefined) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userId || !socket) return;

    const roomId = String(userId).trim();

    const onConnect = () => {
      console.log("[APP_DEBUG] Socket connected, joining room:", roomId);
      socket.emit("join_user_room", roomId);
    };

    if (socket.connected) onConnect();
    socket.on("connect", onConnect);

    const handleNewNotification = (notification: any) => {
      console.log("[APP_DEBUG] New notification received, invalidating cache...");
      
      // 1. Cập nhật state local (nếu cần dùng ngay)
      setNotifications((prev) => [notification, ...prev]);

      // 2. QUAN TRỌNG: Làm mới query để Header nhận dữ liệu mới từ API
      queryClient.invalidateQueries({ queryKey: ["get-notification"] });

      // 3. Hiển thị thông báo nổi
      Toast.show({
        type: 'success',
        text1: notification.title,
        text2: notification.body,
        onPress: () => handleNotificationClick(notification)
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new_notification", handleNewNotification);
    };
  }, [userId, socket, queryClient]); // Thêm queryClient vào dependency

  const handleNotificationClick = (notification: any) => {
    const { type, metadata } = notification;
    if (type === 'ORDER_STATUS' && metadata?.orderId) {
      router.push({
        pathname: "/(details)/orderTabs/OrderTabs",
        params: { orderId: String(metadata.orderId) }
      });
    }
    Toast.hide();
  };

  return { notifications, handleNotificationClick };
};