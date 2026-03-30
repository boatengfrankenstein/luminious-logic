const BASE_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";

export const keyToUrl = (key: string | undefined | null) => {
  if (!key) {
    return "";
  }
  console.log("Converting S3 key to URL:", { key, BASE_URL });
  return `${BASE_URL}/${key}`;
};
