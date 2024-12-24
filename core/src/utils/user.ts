export const getUserImageUrl = (userId: string) => {
  return `${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/user-images/${userId}`;
};
