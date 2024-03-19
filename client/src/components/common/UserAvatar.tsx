import { Avatar } from "@chakra-ui/react";

const UserAvatar = ({
  avatar,
  size = "md",
  children,
}: {
  avatar?: string;
  size?: string;
  children?: React.ReactNode;
}) => {
  const avatarPath = avatar
    ? new URL("../../assets/" + avatar, import.meta.url).href
    : undefined;

  return (
    <Avatar
      src={avatarPath}
      size={size}
      {...(avatarPath === undefined && { bgColor: "gray.400" })}
    >
      {children}
    </Avatar>
  );
};

export default UserAvatar;
