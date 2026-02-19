import type { User, UserResource } from "@/types/api";
import type { Role } from "@/types/roles";
import { ROLES } from "@/types/roles";

/**
 * User Mappers
 *
 * These functions convert between backend API responses (UserResource)
 * and frontend domain models (User).
 *
 * Use cases:
 * - toUser: When receiving data from API → use in components
 * - toUserResource: When sending data to API (rare, usually for updates)
 */

/**
 * Convert UserResource (from API) to User (for frontend)
 *
 * Transformations:
 * - snake_case → camelCase
 * - ISO date strings → Date objects
 * - Null full_name → computed from first/last name
 * - image_path → imageUrl (semantic naming)
 *
 * @example
 * const apiUser = await authService.login(credentials);
 * const user = toUser(apiUser.data.user);
 * authStore.login(user, apiUser.data.token);
 */
export function toUser(resource: UserResource): User {
  return {
    id: resource.id,
    firstName: resource.first_name,
    middleName: resource.middle_name,
    lastName: resource.last_name,
    fullName:
      resource.full_name ||
      `${resource.first_name}${resource.middle_name ? ` ${resource.middle_name}` : ""} ${resource.last_name}`.trim(),
    role: resource.role,
    email: resource.email,
    address: resource.address,
    contactNumber: resource.contact_number,
    companyName: resource.company_name,
    imageUrl: resource.image_path,
    createdAt: new Date(resource.created_at),
    updatedAt: new Date(resource.updated_at),
  };
}

/**
 * Convert User (from frontend) to UserResource (for API)
 *
 * Transformations:
 * - camelCase → snake_case
 * - Date objects → ISO strings
 *
 * Note: This is rarely needed since the API typically returns UserResource
 * and you don't send the full user object back (only updates via specific endpoints)
 *
 * @example
 * const updatedUser = { ...user, firstName: 'Jane' };
 * const resource = toUserResource(updatedUser);
 */
export function toUserResource(user: User): UserResource {
  return {
    id: user.id,
    first_name: user.firstName,
    middle_name: user.middleName,
    last_name: user.lastName,
    full_name: user.fullName,
    role: user.role,
    email: user.email,
    address: user.address,
    contact_number: user.contactNumber,
    company_name: user.companyName,
    image_path: user.imageUrl,
    created_at: user.createdAt.toISOString(),
    updated_at: user.updatedAt.toISOString(),
  };
}

/**
 * Get user initials for avatar fallback
 *
 * @example
 * const initials = getUserInitials(user); // "JD" for John Doe
 */
export function getUserInitials(user: User | UserResource): string {
  const firstName = "firstName" in user ? user.firstName : user.first_name;
  const lastName = "lastName" in user ? user.lastName : user.last_name;

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Get user's full display name
 * Handles cases where full_name might be null
 *
 * @example
 * const displayName = getUserDisplayName(user); // "John M. Doe"
 */
export function getUserDisplayName(user: User | UserResource): string {
  if ("fullName" in user) {
    return user.fullName;
  }

  return (
    user.full_name ||
    `${user.first_name}${user.middle_name ? ` ${user.middle_name}` : ""} ${user.last_name}`.trim()
  );
}

/**
 * Get user's role
 * Returns the Role type directly
 *
 * @example
 * const role = getUserRole(user); // "Account Specialist"
 */
export function getUserRole(user: User | UserResource): Role {
  return user.role;
}

/**
 * Check if user has a specific role
 *
 * @example
 * if (hasRole(user, ROLES.ACCOUNT_SPECIALIST)) {
 *   // Show account specialist features
 * }
 */
export function hasRole(user: User | UserResource, role: Role): boolean {
  return user.role === role;
}

/**
 * Check if user is a client
 *
 * @example
 * if (isClient(user)) {
 *   // Show client-specific features
 * }
 */
export function isClient(user: User | UserResource): boolean {
  return hasRole(user, ROLES.CLIENT);
}

/**
 * Check if user is an account specialist
 *
 * @example
 * if (isAccountSpecialist(user)) {
 *   // Show AS features
 * }
 */
export function isAccountSpecialist(user: User | UserResource): boolean {
  return hasRole(user, ROLES.ACCOUNT_SPECIALIST);
}

/**
 * Check if user is marketing
 *
 * @example
 * if (isMarketing(user)) {
 *   // Show marketing features
 * }
 */
export function isMarketing(user: User | UserResource): boolean {
  return hasRole(user, ROLES.MARKETING);
}

/**
 * Check if user is HR
 *
 * @example
 * if (isHumanResource(user)) {
 *   // Show HR features
 * }
 */
export function isHumanResource(user: User | UserResource): boolean {
  return hasRole(user, ROLES.HUMAN_RESOURCE);
}

/**
 * Check if user is staff (not a client)
 *
 * @example
 * if (isStaff(user)) {
 *   // Show internal features
 * }
 */
export function isStaff(user: User | UserResource): boolean {
  return !isClient(user);
}

/**
 * Get user role display name (same as role value in your case)
 *
 * @example
 * const displayRole = getRoleDisplayName(user); // "Account Specialist"
 */
export function getRoleDisplayName(user: User | UserResource): string {
  return getUserRole(user);
}

/**
 * Format user's contact number for display
 * Example: 09171234567 → +63 917 123 4567
 *
 * @example
 * const formatted = formatContactNumber(user.contactNumber);
 */
export function formatContactNumber(contactNumber: string): string {
  // Remove all non-digits
  const cleaned = contactNumber.replace(/\D/g, "");

  // Check if it's a Philippine number starting with 09
  if (cleaned.startsWith("09") && cleaned.length === 11) {
    return `+63 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  // Return as-is if format is unexpected
  return contactNumber;
}

/**
 * Get relative time since user creation
 *
 * @example
 * const memberSince = getRelativeCreationTime(user); // "2 months ago"
 */
export function getRelativeCreationTime(user: User): string {
  const now = new Date();
  const created = user.createdAt;
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get role-based badge color for UI
 *
 * @example
 * const badgeColor = getRoleBadgeColor(user);
 * <Badge className={badgeColor}>{user.role}</Badge>
 */
// export function getRoleBadgeColor(user: User | UserResource): string {
//   const role = getUserRole(user);

//   switch (role) {
//     case ROLES.CLIENT:
//       return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
//     case ROLES.ACCOUNT_SPECIALIST:
//       return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//     case ROLES.MARKETING:
//       return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
//     case ROLES.HUMAN_RESOURCE:
//       return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
//     default:
//       return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
//   }
// }
