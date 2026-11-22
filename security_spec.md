# Security Specification & Payload-First TDD

## 1. Data Invariants
1. Public catalog collections (`/categories`, `/products`, `/reviews`, `/comparisons`, `/guides`, `/articles`) are publicly readable (`get`, `list`), but writes (`create`, `update`, `delete`) are strictly restricted to verified administrators (`isAdmin()`).
2. PII collections (`/newsletter_subscribers`, `/contact_inquiries`) allow public `create` with strict field allowlists, size bounds, and server timestamps (`request.time`), while `read`, `update`, and `delete` are strictly restricted to `isAdmin()`.
3. Admin status cannot be self-assigned by arbitrary signed-in users (`isAdmin()` requires either `request.auth.token.email == 'elieza12321@gmail.com' && request.auth.token.email_verified == true` or an existing `/admins/{uid}` record created by an admin).
4. Every string and list field enforces explicit `.size()` boundaries; all document IDs enforce `^[a-zA-Z0-9_-]+$` and `<= 128` chars.
5. `createdAt` is immutable on update (`incoming().createdAt == existing().createdAt`) and must equal `request.time` on create.

## 2. Adversarial Payloads Tested ("Dirty Dozen")
1. **Unverified Admin Email Spoof**: `{ email: "elieza12321@gmail.com", email_verified: false }` trying to write `/products/p1` -> `PERMISSION_DENIED`.
2. **Non-Admin Authenticated Write**: Verified regular user writing `/products/p1` -> `PERMISSION_DENIED`.
3. **Self-Admin Escalation**: Non-admin user creating `/admins/{ownUid}` with `{ role: "admin" }` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection on Product Create**: Adding `isPromotedSecret: true` -> `PERMISSION_DENIED` (`hasOnly()` gate).
5. **Shadow Field on Newsletter Create**: Adding `isAdmin: true` to `/newsletter_subscribers/sub1` -> `PERMISSION_DENIED`.
6. **Public PII Scraping**: Unauthenticated or non-admin user calling `get` or `list` on `/newsletter_subscribers` or `/contact_inquiries` -> `PERMISSION_DENIED`.
7. **Oversized Document ID Poisoning**: Creating `/products/${'a'.repeat(500)}` -> `PERMISSION_DENIED` (`isValidId`).
8. **Oversized String Payload (Denial of Wallet)**: Contact inquiry `message` of 10,000 characters -> `PERMISSION_DENIED`.
9. **Spoofed Client Timestamp**: Creating inquiry with `createdAt` set to past date instead of `request.time` -> `PERMISSION_DENIED`.
10. **Immutable `createdAt` Tampering**: Updating a product while altering `createdAt` -> `PERMISSION_DENIED`.
11. **Terminal Status Bypass on Inquiry**: Unauthenticated user trying to update `/contact_inquiries/inq1` status to `'reviewed'` -> `PERMISSION_DENIED`.
12. **Unlisted Collection Access**: Reading or writing `/internal_secrets/doc1` -> `PERMISSION_DENIED` (default-deny catch-all).
