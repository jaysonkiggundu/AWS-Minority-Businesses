# Risk & Technical Debt Inventory  
## Module 1 – Capstone II Reset: From Prototypes to Products  

**Project:** AWS CAMP Minority Business Directory  
**Team:** Group 7  
**Course:** Senior Capstone II  

---

## Overview & Objective

During Senior Capstone I, our team leveraged AI-assisted development tools to rapidly prototype the AWS CAMP Minority Business Directory. This approach accelerated visible feature development but prioritized speed over long-term maintainability, verification, and architectural governance.

As we transition into Senior Capstone II, our role shifts from rapid feature builders to deliberate system stewards. This document formalizes that shift by:

- Auditing technical debt introduced during AI-assisted prototyping  
- Evaluating AI-specific risks using required risk categories  
- Converting risks into measurable engineering backlog items  
- Linking remediation work to formal requirements  
- Establishing verification and accountability controls  

This inventory represents a controlled reset from prototype to production-quality engineering.

---

# Part 1: Technical Debt Audit (Operationalized)

Each identified debt item is mapped to a formal requirement and converted into actionable backlog work.

---

## 1. Mock Data Dependency

**Category:** Architectural Debt  
**Linked Requirement:** FR-5 – Business data must be stored and retrieved reliably  
**Mapped Feature:** F-5 – Database Integration  

### Description  
The frontend currently relies on mock or hardcoded business listing data. While UI components are structured, no persistent backend integration exists.

### Why This Is Debt  
AI-assisted prototypes optimize for visible functionality rather than structural integrity. Continuing development on mock data introduces schema fragility and refactor risk once live backend services are connected.

### Backlog Operationalization

**Issue Title:** Replace Mock Data with AWS AppSync + DynamoDB Integration  
**Priority:** High  
**Sprint Target:** Sprint 3  

**Acceptance Criteria**
- Apollo Client connected to AppSync endpoint  
- `listBusinesses` GraphQL query retrieves live DynamoDB data  
- All mock data removed from repository  
- Loading and error states implemented  
- Deployment validated in AWS environment  

**Verification**
- Successful query in deployed environment  
- Peer-reviewed pull request  
- Manual validation of CRUD flow  

---

## 2. Incomplete Authentication & Authorization Enforcement

**Category:** Architectural / Security Debt  
**Linked Requirement:** FR-4 – Users can securely sign up and log in  
**Mapped Feature:** F-4 – Authentication System  

### Description  
Authentication-related UI elements exist, but role-based access enforcement is incomplete and inconsistently applied.

### Why This Is Debt  
Security assumptions are currently implicit rather than enforced at the system boundary.

### Backlog Operationalization

**Issue Title:** Complete End-to-End Cognito Integration  
**Priority:** High  
**Sprint Target:** Sprint 3  

**Acceptance Criteria**
- Amazon Cognito fully integrated  
- Protected routes guarded client-side  
- Role-based checks enforced in AppSync resolvers  
- Unauthorized access attempts handled gracefully  

**Verification**
- Role-switch testing  
- Access boundary validation  
- Security review checklist completed  

---

## 3. Absence of Testing & Verification Layer

**Category:** Quality Debt  
**Linked Requirement:** QR-2 – Core logic must be testable  
**Mapped Feature:** F-11 – Introduce Basic Unit Tests  

### Description  
The current codebase contains no unit or integration tests for AI-generated components.

### Why This Is Debt  
AI-generated code increases the probability of subtle logical errors. Without verification, defects compound as features scale.

### Backlog Operationalization

**Issue Title:** Introduce Baseline Unit Testing  
**Priority:** High  
**Sprint Target:** Sprint 3  

**Acceptance Criteria**
- Core business logic components tested  
- Minimum 70% coverage on core workflows  
- Tests integrated into CI pipeline  

**Verification**
- Coverage report generated  
- CI build passes  
- Peer review of test quality  

---

## 4. Weak Error Handling & Observability

**Category:** Reliability / Quality Debt  
**Linked Requirement:** QR-3 – Errors must be handled gracefully  
**Mapped Feature:** F-12 – Error Handling Improvements  

### Description  
The application lacks standardized error boundaries, structured logging, and consistent failure feedback.

### Remediation
- Implement global error boundaries  
- Add structured backend interaction logging  
- Standardize loading and failure states  

---

# Part 2: AI & System Risk Assessment (Rubric-Aligned Categories)

Because this project incorporates AI-assisted development, risk evaluation must extend beyond traditional software concerns.

---

## 1. Reliability Risk (Hallucination & Logical Integrity)

**Risk:** AI-generated components may contain incorrect assumptions or schema mismatches.

**System Example:** Frontend GraphQL queries implemented before backend schema finalized.

**Impact:** Runtime failures and hidden logic defects.

**Mitigation Controls**
- Mandatory human review of AI-generated pull requests (TR-1)  
- GraphQL schema validation tests  
- CI enforcement  

**RTM Linkage:** QR-2, TR-1  

---

## 2. Security Risk

**Risk:** AI-generated authentication flows may omit enforcement boundaries.

**Impact:** Unauthorized access to business data.

**Mitigation Controls**
- Cognito enforcement at identity boundary  
- Resolver-level authorization checks  
- Least-privilege IAM policies  

**RTM Linkage:** FR-4, AR-3  

---

## 3. Privacy & Data Handling Risk

**Risk:** AI-generated forms may mishandle sensitive business owner information.

**Impact:** Exposure of contact data.

**Mitigation Controls**
- Secure DynamoDB storage patterns  
- Restricted IAM roles  
- Logging and audit monitoring (QR-4)  

---

## 4. Maintainability Risk

**Risk:** AI-generated code lacks contextual documentation.

**Impact:** High refactor cost and onboarding difficulty.

**Mitigation Controls**
- Architecture documentation (AR-1)  
- ADR implementation (PR-3)  
- Code standardization enforcement (QR-1)  

---

## 5. Process & Governance Risk

**Risk:** AI-accelerated development may outpace structured backlog control.

**Impact:** Accumulating unmanaged technical debt.

**Mitigation Controls**
- Weekly RTM updates  
- Backlog grooming enforcement (PR-1)  
- Formal Risk & Technical Debt Register (PR-4)  

---

# Part 3: Backlog Integration & Accountability

All identified risks and technical debt items have been formally converted into structured backlog work and mapped to requirement IDs.

Each remediation item includes:
- Requirement ID linkage  
- Feature / Work Item ID  
- GitHub Issue classification  
- Assigned Sprint target  
- Defined acceptance criteria  
- Explicit verification method  

Technical debt remediation is treated as first-class engineering work.

The Requirements Traceability Matrix (RTM) and corresponding GitHub Project Board have been formally updated to reflect these mappings, ensuring that each identified risk and technical debt item is linked to a requirement ID, backlog issue, sprint target, and verification method.

---

# Conclusion

This Risk & Technical Debt Inventory establishes a governance framework for Capstone II.

The team has:

- Identified structural weaknesses introduced during AI-assisted prototyping  
- Classified AI risks using formal risk domains  
- Converted risks into actionable backlog items  
- Linked remediation work to formal requirements  
- Defined verification and accountability mechanisms  

This document transitions the project from prototype velocity to controlled, production-oriented engineering practice.
