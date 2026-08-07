import { client } from './client';
import type { AuthUser } from '@app-types/auth.types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<AuthUser> {
  const res = await client.patch<AuthUser>('/api/v1/users/profile', data);
  return res.data;
}
