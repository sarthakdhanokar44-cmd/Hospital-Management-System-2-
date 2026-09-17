# Security Specification & Threat Model

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `request.auth.uid == userId`.
2. **PII Protection Invariant**: Personal health info and demographics (phone, email, age, blood group) in `/users/{userId}` cannot be read by any user other than the document owner.
3. **Appointment Ownership Invariant**: An appointment document at `/appointments/{appointmentId}` must have `incoming().userId == request.auth.uid`. A patient cannot book or query appointments on behalf of other user IDs.
4. **Appointment Status Lifecycle**: Once an appointment is cancelled, status cannot be toggled back without proper validation.
5. **No Blind Query Listing**: List queries on `/appointments` MUST filter by `userId == request.auth.uid`.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Payload 1 (Ghost Field in User)**: Write to `/users/{userId}` with an unsolicited field `isAdmin: true`. Must be rejected.
2. **Payload 2 (User ID Hijack)**: User A tries to create `/users/{userB_id}` with `id: userB_id`. Must be rejected with PERMISSION_DENIED.
3. **Payload 3 (Unauthenticated Read)**: Anonymous or unauthenticated request to `/users/{userId}`. Must be rejected.
4. **Payload 4 (Cross-User Read)**: Authenticated User A tries to read `/users/{userB_id}`. Must be rejected.
5. **Payload 5 (Appointment Spoofing)**: User A creates appointment with `userId: "userB"`. Must be rejected because `incoming().userId != request.auth.uid`.
6. **Payload 6 (Oversized Reason Injection)**: Injection of 50KB string into `reason` field on appointment creation. Must be rejected by size check `<= 500`.
7. **Payload 7 (Oversized Name Injection)**: Injection of 5KB string into `patientName`. Must be rejected by size check `<= 100`.
8. **Payload 8 (Invalid Status)**: Appointment creation with `status: "SuperAdminApproved"`. Must be rejected.
9. **Payload 9 (Unauthenticated Appointment Booking)**: Write to `/appointments/{appointmentId}` without auth token. Must be rejected.
10. **Payload 10 (Cross-User Appointment Cancellation)**: User B attempts to delete or update User A's appointment. Must be rejected.
11. **Payload 11 (Blanket Collection Scraping)**: Unbounded list query on `/appointments` without checking resource ownership. Must be blocked by `resource.data.userId == request.auth.uid`.
12. **Payload 12 (Malicious Document ID)**: Path variable with characters `../../etc/passwd` or excessive length (> 128 chars). Must be blocked by `isValidId`.

## 3. Test Runner Invariant Assertions
All 12 payloads must return `PERMISSION_DENIED`.
