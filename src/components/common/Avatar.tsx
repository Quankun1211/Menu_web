
const UserAvatar = ({ avatarUrl }: { avatarUrl: string }) => {
  return (
    <div className="w-full h-full bg-gray-200 overflow-hidden flex items-center justify-center">
      <img 
        src={avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
        alt="User Avatar"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }}
      />
    </div>
  );
};

export default UserAvatar;