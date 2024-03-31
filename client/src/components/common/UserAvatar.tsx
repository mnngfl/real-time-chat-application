import { Avatar } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

export type UserAvatarProps = {
  avatar?: string;
  size?: string;
};

const UserAvatar: FC<PropsWithChildren<UserAvatarProps>> = ({
  avatar,
  size = "md",
  children,
}) => {
  const avatarPath = avatar
    ? new URL("/static/" + avatar, import.meta.url).href
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
