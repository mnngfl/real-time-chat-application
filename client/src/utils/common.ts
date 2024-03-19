export const getFilenameFromPath = (path: string): string => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return filename;
};
