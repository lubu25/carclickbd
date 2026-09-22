import { IProduct } from "@/Interface/product";

export const LOCAL_WISHLIST_UPDATED_EVENT = "carclickbd:wishlist-updated";

const getStorageKey = (userKey?: string) =>
  `carclickbd_local_wishlist_${userKey || "default"}`;

export const getWishlistUserKey = (profile?: {
  _id?: string;
  email?: string;
  role?: string;
}) => profile?._id || profile?.email || profile?.role || "default";

export const getLocalWishlist = (userKey?: string): IProduct[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(getStorageKey(userKey));
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isLocalWishlisted = (productId: string, userKey?: string) =>
  getLocalWishlist(userKey).some((product) => product?._id === productId);

export const setLocalWishlistItem = (
  product: IProduct,
  shouldAdd: boolean,
  userKey?: string,
) => {
  if (typeof window === "undefined") return [];

  const current = getLocalWishlist(userKey);
  const next = shouldAdd
    ? [
        product,
        ...current.filter((item) => item?._id !== product._id),
      ]
    : current.filter((item) => item?._id !== product._id);

  window.localStorage.setItem(getStorageKey(userKey), JSON.stringify(next));
  window.dispatchEvent(new Event(LOCAL_WISHLIST_UPDATED_EVENT));
  return next;
};

