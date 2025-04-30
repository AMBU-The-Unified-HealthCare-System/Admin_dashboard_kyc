# Admin KYC Dashboard

A secure, centralized real-time verification system to streamline and monitor driver KYC (Know Your Customer) submissions efficiently across the platform.

---

##  Table of Contents

- [Introduction](#introduction)
- [Purpose](#purpose)
- [How It Works](#how-it-works)
  - [Driver Login and KPIs](#driver-login-and-kpis)
  - [Verification Status](#verification-status)
- [Driver KYC Details Structure](#driver-kyc-details-structure)
- [Document Verification Process](#document-verification-process)
  - [Viewing Submitted Documents](#viewing-submitted-documents)
  - [Approving or Rejecting Documents](#approving-or-rejecting-documents)
- [KYC Completion Measurement](#kyc-completion-measurement)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [System Components Summary](#system-components-summary)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

---

##  Introduction

**Admin KYC Dashboard** is a real-time platform that manages and monitors driver onboarding by securely tracking login and KYC document verification processes.

---

##  Purpose

The Admin KYC Dashboard aims to eliminate manual, insecure verification systems. It empowers administrators to:

- Track driver logins and KYC submissions
- Validate uploaded documents securely
- Approve or reject driver onboarding decisions based on verified data

---

##  How It Works

### Driver Login and KPIs

When a driver signs up and logs in:

- **Login Drivers**: Indicates registered drivers, even if subsequent steps aren't completed.
- **KPIs Tracked**:
  - **L-Submission**: Tracks driver login info submission.
  - **K-Submission**: Tracks submission and approval status of KYC documents.

### Verification Status

- **V1 Approval**: Login details verified.
- **V2 Approval**: Full KYC and login information verified and matched.

---

##  Driver KYC Details Structure

### Data Layout

- **Rows**: Each row represents an individual driver.
- **Columns**: Each column represents a specific document (e.g., Aadhaar, PAN, License).

---

##  Document Verification Process

### Viewing Submitted Documents

- A 👁️ (eye) icon is available next to each document.
- Clicking the icon previews the document via **Cashfree API** integration.

### Approving or Rejecting Documents

- Admins **must** add comments while approving or rejecting documents.
- Comments ensure transparency and auditability.

---

##  KYC Completion Measurement

- Each document is tracked to calculate a percentage completion.
- Upon reaching **100% verification**, a **final overall comment** and decision (Approved/Rejected) is mandatory.
- **Rule**: If any single attribute is rejected, the entire KYC is rejected.

---

##  Role-Based Access Control (RBAC)

- Ensures only authorized admins can access sensitive data.
- Role-based permissions include:
  - **View-Only**
  - **Verifier**
  - **Approver**

---

## System Components Summary

| Feature               | Description                                                |
|-----------------------|------------------------------------------------------------|
| Dashboard View        | Displays login and KYC status in real-time                 |
| Document Verification | Preview via Eye Icon, Approve/Reject with mandatory comments |
| KYC Status Tracking   | V1 (Login Approved), V2 (Full KYC Approved)                |
| Final KYC Decision    | Based on 100% document verification or single rejection    |
| RBAC Implementation   | Different roles with appropriate access levels             |
| Cashfree Integration  | Secure document fetching via API                           |

---

##  Future Enhancements (Optional)

- AI-based document verification.
- Auto-suggestions for document upload errors.
- Batch processing for bulk KYC approvals.

---

##  Conclusion

The **Admin KYC Dashboard** is a robust tool for managing driver onboarding, enhancing compliance, reducing operational risk, and improving verification efficiency across platforms.

##  Disclaimer

This document and the Admin KYC Dashboard are intended solely for internal development, testing, and product documentation purposes. All KYC-related data, APIs, and processes described are hypothetical and must comply with relevant data protection laws and regulations (e.g., GDPR, IT Act). The use of real user data without proper consent or legal basis is strictly prohibited.

The development team and associated stakeholders hold no responsibility for misuse or unauthorized deployment of this software.
