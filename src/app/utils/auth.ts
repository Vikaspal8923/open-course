export type StoredUser = {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
};

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem('user');
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
}

export function getStoredUserId() {
  const user = getStoredUser();
  return user?._id || user?.id || null;
}

export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('token') && getStoredUserId());
}

export function matchesUserId(
  value: string | { _id?: string; id?: string } | null | undefined,
  userId: string | null,
) {
  if (!value || !userId) {
    return false;
  }

  if (typeof value === 'string') {
    return value === userId;
  }

  return value._id === userId || value.id === userId;
}
