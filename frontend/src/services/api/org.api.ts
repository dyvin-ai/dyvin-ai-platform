import { get, post, patch } from './client';
import type {
  Organization,
  OrganizationDetails,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  Invitation,
} from '@app-types/org.types';

// ──────────────────────────────────────────────────────────────
// Organization API Service
// ──────────────────────────────────────────────────────────────

/**
 * POST /organizations
 * Creates a new organization. Creator becomes OWNER.
 */
export async function createOrganization(data: CreateOrganizationRequest): Promise<OrganizationDetails> {
  return post<OrganizationDetails>('/organizations', data);
}

/**
 * GET /organizations
 * Returns all organizations the current user belongs to.
 */
export async function getUserOrganizations(): Promise<Organization[]> {
  return get<Organization[]>('/organizations');
}

/**
 * GET /organizations/:id
 * Returns organization details + member roster.
 */
export async function getOrganizationDetails(orgId: string): Promise<OrganizationDetails> {
  return get<OrganizationDetails>(`/organizations/${orgId}`);
}

/**
 * PATCH /organizations/:id
 * Updates organization settings. Requires OWNER or ADMIN.
 */
export async function updateOrganization(orgId: string, data: UpdateOrganizationRequest): Promise<Organization> {
  return patch<Organization>(`/organizations/${orgId}`, data);
}

/**
 * POST /organizations/:id/invitations
 * Sends a member invitation email.
 */
export async function createInvitation(orgId: string, data: CreateInvitationRequest): Promise<Invitation> {
  return post<Invitation>(`/organizations/${orgId}/invitations`, data);
}

/**
 * POST /organizations/invitations/accept
 * Accepts an invitation token.
 */
export async function acceptInvitation(data: AcceptInvitationRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/organizations/invitations/accept', data);
}

