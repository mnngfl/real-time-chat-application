export const getFilenameFromPath = (path: string): string => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return filename;
};

export const createUrlParams = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
};
