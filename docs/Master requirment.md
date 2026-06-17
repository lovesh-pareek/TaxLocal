# TaxLocal – Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

TaxLocal is an offline-first Income Tax Return (ITR) preparation platform supporting ITR-1, ITR-2, ITR-3, and ITR-4 filing. The system enables taxpayers to prepare returns locally, validate tax data, calculate liabilities, and generate government-compliant JSON files without uploading sensitive information to cloud servers.

### Vision

TaxLocal is an offline-first tax return preparation platform for individual taxpayers.

Users can:

- Create tax returns
- Validate tax returns
- Save drafts locally
- Export filing packages
- Upload generated files manually to the Income Tax Portal

### 1.2 Objectives

* Support ITR-1, ITR-2, ITR-3, and ITR-4.
* Provide complete local data processing.
* Maintain zero-knowledge privacy architecture.
* Generate government upload-ready JSON files.
* Support automated tax computation and validation.

## 2. Functional Requirements

### FR-1 User Management

* Create taxpayer profiles.
* Store encrypted PAN and personal information.
* Support multiple users on a single installation.

### FR-2 Document Ingestion

System shall import:

* Previous ITR JSON files
* AIS JSON/PDF files
* Form 16 PDFs
* Broker Excel/CSV statements

### FR-3 Data Normalization

* Convert source formats into standardized internal models.
* Map broker-specific fields into unified transaction structures.
* Perform transaction deduplication.

### FR-4 JSON Generation

* Convert internal data into government schema.
* Generate upload-ready JSON files.
* Block generation when critical validation errors exist.

### FR-5 Tax Computation

* Compute tax under Old and New Regimes.
* Support salary, house property, capital gains, business income and other sources.
* Calculate rebate, surcharge and cess.
* Support loss set-off and carry-forward rules.

### FR-6 Validation Engine

Tier-1:

* PAN validation
* Aadhaar validation
* IFSC validation

Tier-2:

* Salary consistency checks
* Capital gains reconciliation
* Tax credit reconciliation

Tier-3:

* Regime compliance validation
* Loss adjustment validation
* Audit threshold alerts

### FR-7 Filing Workflow

* Dynamically identify ITR type.
* Route users to relevant schedules.
* Display real-time tax comparison.

## 3. Non-Functional Requirements

### Security

* AES-256 encrypted storage.
* Argon2id key derivation.
* No cloud storage.
* No telemetry tracking.

### Performance

* Process all files locally.
* Handle large broker statements efficiently.

### Reliability

* Deterministic tax calculations.
* Consistent validation results.

### Usability

* Three-column guided workflow.
* Error-driven navigation.
* Context-aware filing screens.

## 4. External Interfaces

### User Interface

* browser-based application.
* Dashboard-based navigation.

### Database

* SQLCipher encrypted SQLite.

### File Interfaces

Input:

* JSON
* PDF
* XLSX
* CSV

Output:

* Government-compliant ITR JSON

## 5. Acceptance Criteria

* User can create encrypted profile.
* User can import tax documents.
* System computes tax successfully.
* Validation framework identifies errors.
* Government JSON file is generated successfully


# TaxLocal – High Level Design (HLD)

## 1. System Overview

TaxLocal follows a modular offline-first architecture where all processing occurs on the client machine.

## 2. Architecture

```
text
React
Vite
TypeScript
     ↓
Application Layer
     ↓
Domain Layer
     ↓
Storage Layer (IndexedDB)
```

### Storage

Primary storage: IndexedDB

Requirements:

- Offline-first
- No internet dependency
- Local draft persistence
- Export / Import support

### Export

Supported exports:

- JSON
- Filing package formats (future)

### Future Extensions

- Node.js API
- Cloud sync
- Direct filing integration
- Multi-user support

## 3. Major Modules

### Module 1: Authentication & Security

Responsibilities:

* Password handling
* Argon2id key derivation
* Database initialization
* Secure session management

### Module 2: Data Ingestion Engine

Responsibilities:

* Import files
* Parse source documents
* Extract tax information
* Deduplicate records

### Module 3: Data Normalization Engine

Responsibilities:

* Standardize transaction structures
* Map broker-specific fields
* Create unified tax datasets

### Module 4: Tax Calculation Engine

Responsibilities:

* Income aggregation
* Loss adjustments
* Deduction processing
* Tax regime comparison
* Final liability computation

### Module 5: Validation Framework

Responsibilities:

* Schema validation
* Tax rule validation
* Reconciliation checks
* Error generation

### Module 6: UI Navigation Layer

Responsibilities:

* Dynamic ITR routing
* Schedule navigation
* Error-driven focus management
* Real-time tax dashboard

### Module 7: JSON Schema Generator

Responsibilities:

* Government field mapping
* JSON assembly
* Export generation
* Final validation enforcement

## 4. Database Design

Core Tables:

1. users
2. assessment_years
3. ingested_raw_data
4. tax_worksheets

Relationship:

users (1)
|
v
assessment_years (N)
|
v
tax_worksheets (1)

assessment_years (1)
|
v
ingested_raw_data (N)

## 5. Security Design

### Encryption

* SQLCipher AES-256-CBC
* Encrypted PAN storage
* Encrypted raw document storage

### Key Management

Password
→ Argon2id
→ Encryption Key
→ SQLCipher Database

### Data Protection

* No cloud synchronization
* No plaintext temporary files
* RAM-only intermediate processing

## 6. Validation Workflow

Imported Data
↓
Schema Validation
↓
Calculation Validation
↓
Statutory Validation
↓
Error Dashboard
↓
User Corrections
↓
Revalidation

## 7. Export Workflow

Encrypted Database
↓
Validated Data
↓
Mapping Engine
↓
Government Schema Builder
↓
JSON Export
↓
Upload to Income Tax Portal

## 8. Deployment Model

Browser-based web application.

No desktop runtime is required.

# Domain Model

## Core Aggregates

User
└── AssessmentYear
├── TaxWorksheet
├── ImportedDocuments
├── ValidationErrors
└── ComputationResults

## Entities

### User

```typescript
interface User {
  id: string;
  pan: string;
  fullName: string;
  dob: string;
}
```

### AssessmentYear

```typescript
interface AssessmentYear {
  id: string;
  userId: string;
  assessmentYear: string;
  financialYear: string;
  itrType: 'ITR1' | 'ITR2' | 'ITR3';
  regime: 'OLD' | 'NEW';
}
```

### TaxWorksheet

```typescript
interface TaxWorksheet {
  personalInfo: PersonalInfo;
  salarySchedule?: SalarySchedule;
  capitalGainsSchedule?: CapitalGainsSchedule;
  businessSchedule?: BusinessSchedule;
  taxesPaidSchedule?: TaxesPaidSchedule;
}
```



# Tax Rules Catalog

RULE_001
Name: Standard Deduction New Regime
Value: 75000

RULE_002
Name: Standard Deduction Old Regime
Value: 50000

RULE_003
Name: Section 87A Rebate New Regime
Threshold: 1200000
Maximum Rebate: 60000

RULE_004
Name: Section 87A Rebate Old Regime
Threshold: 500000
Maximum Rebate: 12500

RULE_005
Name: STCG 111A Tax Rate
Rate: 15%

RULE_006
Name: LTCG 112A Tax Rate
Rate: 10%
Exemption Threshold: 100000

RULE_007
Name: VDA Tax
Rate: 30%

RULE_008
Name: Health And Education Cess
Rate: 4%


# Loss_Adjustment_Rules

## Purpose

This document defines all loss set-off and carry-forward rules used by the Tax Calculation Engine for ITR-2, ITR-3, and ITR-4 filings.

---

## Rule Schema

```yaml
Rule:
  id: string
  lossType: string
  currentYearAdjustment:
    allowedAgainst: []
    prohibitedAgainst: []
  carryForward:
    allowed: boolean
    years: number
    allowedAgainst: []
  validation:
    errorCode: string
```

---

## LOSS_001 - Short Term Capital Loss (STCL)

```yaml
id: LOSS_001

lossType: SHORT_TERM_CAPITAL_LOSS

currentYearAdjustment:
  allowedAgainst:
    - SHORT_TERM_CAPITAL_GAIN
    - LONG_TERM_CAPITAL_GAIN

  prohibitedAgainst:
    - SALARY
    - HOUSE_PROPERTY
    - BUSINESS_INCOME
    - OTHER_SOURCES

carryForward:
  allowed: true
  years: 8

  allowedAgainst:
    - SHORT_TERM_CAPITAL_GAIN
    - LONG_TERM_CAPITAL_GAIN

validation:
  errorCode: VAL_LOSS_001
```

---

## LOSS_002 - Long Term Capital Loss (LTCL)

```yaml
id: LOSS_002

lossType: LONG_TERM_CAPITAL_LOSS

currentYearAdjustment:
  allowedAgainst:
    - LONG_TERM_CAPITAL_GAIN

  prohibitedAgainst:
    - SHORT_TERM_CAPITAL_GAIN
    - SALARY
    - HOUSE_PROPERTY
    - BUSINESS_INCOME
    - OTHER_SOURCES

carryForward:
  allowed: true
  years: 8

  allowedAgainst:
    - LONG_TERM_CAPITAL_GAIN

validation:
  errorCode: VAL_LOSS_002
```

---

## LOSS_003 - Speculative Business Loss (Intraday)

```yaml
id: LOSS_003

lossType: SPECULATIVE_BUSINESS_LOSS

currentYearAdjustment:
  allowedAgainst:
    - SPECULATIVE_BUSINESS_PROFIT

  prohibitedAgainst:
    - NON_SPECULATIVE_BUSINESS_PROFIT
    - CAPITAL_GAINS
    - SALARY
    - HOUSE_PROPERTY
    - OTHER_SOURCES

carryForward:
  allowed: true
  years: 4

  allowedAgainst:
    - SPECULATIVE_BUSINESS_PROFIT

validation:
  errorCode: VAL_LOSS_003
```

---

## LOSS_004 - Non Speculative Business Loss (F&O)

```yaml
id: LOSS_004

lossType: NON_SPECULATIVE_BUSINESS_LOSS

currentYearAdjustment:
  allowedAgainst:
    - NON_SPECULATIVE_BUSINESS_PROFIT
    - SPECULATIVE_BUSINESS_PROFIT
    - HOUSE_PROPERTY
    - CAPITAL_GAINS

  prohibitedAgainst:
    - SALARY

carryForward:
  allowed: true
  years: 8

  allowedAgainst:
    - BUSINESS_INCOME

validation:
  errorCode: VAL_LOSS_004
```

---

## LOSS_005 - House Property Loss

```yaml
id: LOSS_005

lossType: HOUSE_PROPERTY_LOSS

currentYearAdjustment:
  allowedAgainst:
    - SALARY
    - BUSINESS_INCOME
    - CAPITAL_GAINS
    - OTHER_SOURCES

  maximumAdjustment:
    amount: 200000

carryForward:
  allowed: true
  years: 8

  allowedAgainst:
    - HOUSE_PROPERTY_INCOME

validation:
  errorCode: VAL_LOSS_005
```

---

## LOSS_006 - Unabsorbed House Property Loss

```yaml
id: LOSS_006

lossType: CARRY_FORWARD_HOUSE_PROPERTY_LOSS

currentYearAdjustment:
  allowedAgainst:
    - HOUSE_PROPERTY_INCOME

  prohibitedAgainst:
    - SALARY
    - BUSINESS_INCOME
    - CAPITAL_GAINS
    - OTHER_SOURCES

carryForward:
  allowed: true
  years: 8

validation:
  errorCode: VAL_LOSS_006
```

---

## LOSS_007 - Business Loss Carry Forward

```yaml
id: LOSS_007

lossType: BUSINESS_LOSS_CARRY_FORWARD

currentYearAdjustment:
  allowedAgainst:
    - BUSINESS_INCOME

  prohibitedAgainst:
    - SALARY

carryForward:
  allowed: true
  years: 8

validation:
  errorCode: VAL_LOSS_007
```

---

## LOSS_008 - Capital Loss Expiry

```yaml
id: LOSS_008

lossType: CAPITAL_LOSS_EXPIRY

condition:
  carryForwardYearsExceeded: true

action:
  expireLoss: true
  availableForSetoff: false

validation:
  errorCode: VAL_LOSS_008
```

---

## LOSS_009 - Speculative Loss Expiry

```yaml
id: LOSS_009

lossType: SPECULATIVE_LOSS_EXPIRY

condition:
  carryForwardYearsExceeded: true

maximumCarryForwardYears: 4

action:
  expireLoss: true

validation:
  errorCode: VAL_LOSS_009
```

---

## Processing Priority

```yaml
executionOrder:
  1: SPECULATIVE_BUSINESS_LOSS
  2: NON_SPECULATIVE_BUSINESS_LOSS
  3: HOUSE_PROPERTY_LOSS
  4: SHORT_TERM_CAPITAL_LOSS
  5: LONG_TERM_CAPITAL_LOSS
  6: CARRY_FORWARD_LOSSES
```

---

## Engine Output Contract

```typescript
interface LossAdjustmentResult {
  lossType: string;
  amountAvailable: number;
  amountAdjusted: number;
  amountCarriedForward: number;
  carryForwardExpiryAY: string;
}
```

---

## Validation Error Codes

```yaml
VAL_LOSS_001:
  severity: CRITICAL
  message: STCL adjusted against invalid income head

VAL_LOSS_002:
  severity: CRITICAL
  message: LTCL adjusted against non LTCG income

VAL_LOSS_003:
  severity: CRITICAL
  message: Speculative loss adjusted against prohibited income

VAL_LOSS_004:
  severity: CRITICAL
  message: Non speculative loss adjusted against salary

VAL_LOSS_005:
  severity: WARNING
  message: House property adjustment exceeds statutory limit

VAL_LOSS_006:
  severity: WARNING
  message: Carry forward house property loss expired

VAL_LOSS_007:
  severity: WARNING
  message: Business loss carry forward expired
```


# Validation Rules

## Validation Rules Catalog

### Metadata

```yaml
documentVersion: 1.0.0

supportedAssessmentYears:
  - AY_2026_27

ruleEngineVersion: 1.0.0
```

---

## Validation Rule Schema

```yaml
ValidationRule:
  ruleId: string
  category: string
  severity: CRITICAL | WARNING | INFO
  condition: string
  validationLogic: string
  errorCode: string
  uiRoute: string
```

---

## SECTION A : Identity Validation

### VAL_ID_001 - PAN Format Validation

```yaml
ruleId: VAL_ID_001

category: IDENTITY

severity: CRITICAL

field: pan

regex: ^[A-Z]{5}[0-9]{4}[A-Z]{1}$

errorCode: ERR_INVALID_PAN

uiRoute: /personal-information
```

---

### VAL_ID_002 - PAN Mandatory

```yaml
ruleId: VAL_ID_002

category: IDENTITY

severity: CRITICAL

field: pan

condition:
  valueNotNull: true

errorCode: ERR_PAN_REQUIRED

uiRoute: /personal-information
```

---

### VAL_ID_003 - Aadhaar Validation

```yaml
ruleId: VAL_ID_003

category: IDENTITY

severity: CRITICAL

field: aadhaar

constraints:
  digits: 12

algorithm:
  name: VERHOEFF

errorCode: ERR_INVALID_AADHAAR

uiRoute: /personal-information
```

---

### VAL_ID_004 - Date Of Birth Validation

```yaml
ruleId: VAL_ID_004

category: IDENTITY

severity: CRITICAL

field: dob

constraints:
  validDate: true
  ageGreaterThan: 18

errorCode: ERR_INVALID_DOB

uiRoute: /personal-information
```

---

## SECTION B : Banking Validation

### VAL_BANK_001 - IFSC Validation

```yaml
ruleId: VAL_BANK_001

category: BANKING

severity: CRITICAL

field: ifsc

regex: ^[A-Z]{4}0[A-Z0-9]{6}$

errorCode: ERR_INVALID_IFSC

uiRoute: /bank-details
```

---

### VAL_BANK_002 - Account Number Validation

```yaml
ruleId: VAL_BANK_002

category: BANKING

severity: CRITICAL

field: accountNumber

constraints:
  minLength: 9
  maxLength: 18

errorCode: ERR_INVALID_ACCOUNT

uiRoute: /bank-details
```

---

## SECTION C : Salary Validation

### VAL_SAL_001 - Salary Reconciliation

```yaml
ruleId: VAL_SAL_001

category: SALARY

severity: CRITICAL

formula:
  grossSalary =
    section17_1 +
    section17_2 +
    section17_3

errorCode: ERR_SALARY_RECON

uiRoute: /salary
```

---

### VAL_SAL_002 - Standard Deduction Limit

```yaml
ruleId: VAL_SAL_002

category: SALARY

severity: CRITICAL

condition:
  regime: NEW

allowedMaximum:
  standardDeduction: 75000

errorCode: ERR_STANDARD_DEDUCTION_LIMIT

uiRoute: /salary
```

---

## SECTION D : Capital Gains Validation

### VAL_CG_001 - STCG Validation

```yaml
ruleId: VAL_CG_001

category: CAPITAL_GAINS

severity: CRITICAL

condition:
  taxSection: 111A

validation:
  gainAmount >= 0

errorCode: ERR_INVALID_STCG

uiRoute: /capital-gains
```

---

### VAL_CG_002 - LTCG Reconciliation

```yaml
ruleId: VAL_CG_002

category: CAPITAL_GAINS

severity: CRITICAL

condition:
  taxSection: 112A

validation:
  totalLTCG =
    sum(transactionLTCG)

errorCode: ERR_LTCG_RECON

uiRoute: /capital-gains
```

---

### VAL_CG_003 - FMV Mandatory

```yaml
ruleId: VAL_CG_003

category: CAPITAL_GAINS

severity: CRITICAL

condition:
  acquisitionDateBefore: 2018-01-31

requiredField:
  fmvJan312018

errorCode: ERR_FMV_REQUIRED

uiRoute: /capital-gains
```

---

## SECTION E : Tax Credit Validation

### VAL_TDS_001 - TDS Reconciliation

```yaml
ruleId: VAL_TDS_001

category: TAX_CREDIT

severity: CRITICAL

validation:
  claimedTDS =
    form16TDS +
    form26ASTDS +
    manualTDS

errorCode: ERR_TDS_RECON

uiRoute: /taxes-paid
```

---

### VAL_TCS_001 - TCS Validation

```yaml
ruleId: VAL_TCS_001

category: TAX_CREDIT

severity: WARNING

validation:
  claimedTCS <= availableTCS

errorCode: ERR_TCS_EXCESS

uiRoute: /taxes-paid
```

---

## SECTION F : Regime Compliance Validation

### VAL_REG_001 - New Regime Deduction Restriction

```yaml
ruleId: VAL_REG_001

category: REGIME

severity: CRITICAL

condition:
  regime: NEW

prohibitedDeductions:
  - 80C
  - 80D
  - 80G

errorCode: ERR_NEW_REGIME_DEDUCTION

uiRoute: /deductions
```

---

### VAL_REG_002 - HRA Restriction

```yaml
ruleId: VAL_REG_002

category: REGIME

severity: CRITICAL

condition:
  regime: NEW

field:
  hraExemption

mustBe:
  0

errorCode: ERR_HRA_NOT_ALLOWED

uiRoute: /salary
```

---

## SECTION G : Business Validation

### VAL_BUS_001 - Speculative Loss Restriction

```yaml
ruleId: VAL_BUS_001

category: BUSINESS

severity: CRITICAL

condition:
  lossType: SPECULATIVE

cannotOffset:
  - SALARY
  - CAPITAL_GAINS
  - HOUSE_PROPERTY

errorCode: ERR_SPECULATIVE_LOSS

uiRoute: /business
```

---

### VAL_BUS_002 - F&O Loss Restriction

```yaml
ruleId: VAL_BUS_002

category: BUSINESS

severity: CRITICAL

condition:
  lossType: NON_SPECULATIVE

cannotOffset:
  - SALARY

errorCode: ERR_FNO_LOSS

uiRoute: /business
```

---

### VAL_BUS_003 - Audit Threshold Alert

```yaml
ruleId: VAL_BUS_003

category: BUSINESS

severity: WARNING

condition:
  absoluteTurnover > 100000000

message:
  Tax audit review required

errorCode: ERR_AUDIT_THRESHOLD

uiRoute: /business
```

---

## SECTION H : JSON Generation Validation

### VAL_JSON_001 - Mandatory Fields

```yaml
ruleId: VAL_JSON_001

category: JSON

severity: CRITICAL

requiredFields:
  - PAN
  - AssessmentYear
  - FilingStatus
  - PersonalInfo

errorCode: ERR_JSON_REQUIRED_FIELD
```

---

### VAL_JSON_002 - Government Mapping Validation

```yaml
ruleId: VAL_JSON_002

category: JSON

severity: CRITICAL

mappingRules:
  NEW:
    115BAC_IEA_Y

  OLD:
    115BAC_IEA_N

errorCode: ERR_JSON_MAPPING
```

---

## SECTION I : Validation Result Contract

```typescript
interface ValidationError {
  errorId: string;
  ruleId: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: string;
  field: string;
  message: string;
  uiRoute: string;
  domElementId: string;
}
```

---

## SECTION J : Export Blocking Rules

```yaml
BLOCK_EXPORT_IF:
  - ERR_INVALID_PAN
  - ERR_PAN_REQUIRED
  - ERR_INVALID_AADHAAR
  - ERR_SALARY_RECON
  - ERR_TDS_RECON
  - ERR_NEW_REGIME_DEDUCTION
  - ERR_JSON_REQUIRED_FIELD
```

---

## SECTION K : Validation Execution Order

```yaml
executionOrder:
  1: IDENTITY
  2: BANKING
  3: SALARY
  4: CAPITAL_GAINS
  5: TAX_CREDIT
  6: REGIME
  7: BUSINESS
  8: JSON
```


# API Contracts

## API Contracts Specification

### Metadata

```yaml
version: 1.0.0

application:
  TaxLocal

supportedITR:
  - ITR1
  - ITR2
  - ITR3
```

---

## Standard Response Contract

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ApiError[];
  timestamp: string;
}
```

```typescript
interface ApiError {
  code: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}
```

---

## Authentication Module

### Create Database

#### Request

```typescript
interface CreateDatabaseRequest {
  masterPassword: string;
}
```

#### Response

```typescript
interface CreateDatabaseResponse {
  databaseId: string;
  createdAt: string;
}
```

---

### Unlock Database

#### Request

```typescript
interface UnlockDatabaseRequest {
  masterPassword: string;
}
```

#### Response

```typescript
interface UnlockDatabaseResponse {
  unlocked: boolean;
  sessionId: string;
}
```

---

## User Management Module

### Create User

#### Request

```typescript
interface CreateUserRequest {
  pan: string;
  fullName: string;
  dob: string;
}
```

#### Response

```typescript
interface CreateUserResponse {
  userId: string;
}
```

---

### Get User

#### Response

```typescript
interface UserDto {
  id: string;
  panMask: string;
  fullName: string;
  dob: string;
}
```

---

## Assessment Year Module

### Create Assessment Year

#### Request

```typescript
interface CreateAssessmentYearRequest {
  userId: string;
  assessmentYear: string;
  financialYear: string;
  itrType: 'ITR1' | 'ITR2' | 'ITR3';
  regime: 'OLD' | 'NEW';
}
```

#### Response

```typescript
interface AssessmentYearDto {
  id: string;
  assessmentYear: string;
  financialYear: string;
  itrType: string;
  regime: string;
}
```

---

## Document Ingestion Module

### Upload Document

#### Request

```typescript
interface UploadDocumentRequest {
  assessmentYearId: string;
  documentType:
    | 'AIS_JSON'
    | 'AIS_PDF'
    | 'FORM16'
    | 'PREVIOUS_ITR'
    | 'BROKER_STATEMENT';

  fileName: string;
}
```

#### Response

```typescript
interface UploadDocumentResponse {
  documentId: string;
  processingStatus:
    | 'QUEUED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED';
}
```

---

### Parse Document

#### Request

```typescript
interface ParseDocumentRequest {
  documentId: string;
}
```

#### Response

```typescript
interface ParseDocumentResponse {
  recordsExtracted: number;
  warnings: string[];
}
```

---

## Tax Worksheet Module

### Save Personal Information

#### Request

```typescript
interface PersonalInformationDto {
  firstName: string;
  lastName: string;
  aadhaar?: string;
  mobileNumber: string;
  email: string;
}
```

#### Response

```typescript
interface SavePersonalInformationResponse {
  saved: boolean;
}
```

---

## Capital Gains Module

### Add Capital Gain Transaction

#### Request

```typescript
interface CapitalGainTransactionRequest {
  isinCode: string;
  acquisitionDate: string;
  transferDate: string;
  quantity: number;
  acquisitionCost: number;
  saleValue: number;
  sectionClassification:
    | '111A'
    | '112A'
    | 'VDA';
}
```

#### Response

```typescript
interface CapitalGainTransactionResponse {
  transactionId: string;
}
```

---

## Business Income Module

### Save Business Information

#### Request

```typescript
interface BusinessIncomeRequest {
  businessType:
    | 'SPECULATIVE'
    | 'NON_SPECULATIVE'
    | 'PROFESSIONAL'
    | 'PRESUMPTIVE';

  turnover: number;
  netProfit: number;
}
```

#### Response

```typescript
interface BusinessIncomeResponse {
  saved: boolean;
}
```

---

## Tax Calculation Engine

### Calculate Tax

#### Request

```typescript
interface CalculateTaxRequest {
  assessmentYearId: string;
}
```

#### Response

```typescript
interface CalculateTaxResponse {
  grossTotalIncome: number;
  taxableIncome: number;

  oldRegimeTax: number;
  newRegimeTax: number;

  recommendedRegime:
    | 'OLD'
    | 'NEW';

  cess: number;
  surcharge: number;

  finalTaxLiability: number;
}
```

---

## Validation Engine

### Execute Validation

#### Request

```typescript
interface ValidationRequest {
  assessmentYearId: string;
}
```

#### Response

```typescript
interface ValidationResponse {
  validationStatus:
    | 'PASS'
    | 'FAIL';

  criticalErrors: number;
  warningErrors: number;

  errors: ValidationError[];
}
```

---

### Validation Error

```typescript
interface ValidationError {
  errorId: string;
  ruleId: string;

  severity:
    | 'CRITICAL'
    | 'WARNING'
    | 'INFO';

  category: string;

  fieldName: string;

  message: string;

  uiRoute: string;

  domElementId: string;
}
```

---

## Loss Adjustment Module

### Execute Loss Adjustment

#### Request

```typescript
interface LossAdjustmentRequest {
  assessmentYearId: string;
}
```

#### Response

```typescript
interface LossAdjustmentResponse {
  adjustments: LossAdjustmentResult[];
}
```

```typescript
interface LossAdjustmentResult {
  lossType: string;
  adjustedAmount: number;
  carriedForwardAmount: number;
  expiryAssessmentYear: string;
}
```

---

## JSON Generation Module

### Generate JSON

#### Request

```typescript
interface GenerateJsonRequest {
  assessmentYearId: string;
}
```

#### Response

```typescript
interface GenerateJsonResponse {
  generated: boolean;
  fileName: string;
  generatedAt: string;
}
```

---

## Dashboard Module

### Dashboard Summary

#### Response

```typescript
interface DashboardSummaryResponse {
  userId: string;

  itrType: string;

  filingStatus:
    | 'DRAFT'
    | 'VALIDATED'
    | 'EXPORTED';

  criticalErrors: number;

  warnings: number;

  taxPayable: number;

  refundAmount: number;
}
```

---

## Audit Log Module

### Audit Event

```typescript
interface AuditEvent {
  id: string;

  eventType: string;

  entityType: string;

  entityId: string;

  action: string;

  timestamp: string;

  performedBy: string;
}
```

---

## Internal Event Contracts

### Document Parsed Event

```typescript
interface DocumentParsedEvent {
  documentId: string;
  recordsExtracted: number;
}
```

---

### Tax Recalculated Event

```typescript
interface TaxRecalculatedEvent {
  assessmentYearId: string;
  taxLiability: number;
}
```

---

### Validation Completed Event

```typescript
interface ValidationCompletedEvent {
  assessmentYearId: string;
  status:
    | 'PASS'
    | 'FAIL';

  criticalErrors: number;
}
```

---

## API Versioning Strategy

```yaml
apiVersion: v1

futureVersions:
  - v2
  - v3

backwardCompatibility:
  supported: true
```

# Core Structural Validation Layers
To verify data integrity before file assembly, the validation utility passes the local database state through three independent checking layers:
* **Tier 1: System Schema Constraints:** Checks lengths, formats, and basic data types.
* **Tier 2: Mathematical Balance Ledger:** Prevents internal sum mismatches and checks balance invariance[cite: 2].
* **Tier 3: Statutory Rule Engine Compliance:** Validates compliance with tax laws, regime restrictions, and loss offsets[cite: 2].

---

## 2. Validation Engine Reference Rules
### 2.1 Tier 1: Schema Invariant Regex & Constraints
* **Permanent Account Number (PAN):** Must match pattern: `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`[cite: 2].
* **Aadhaar Identity String:** Must be exactly 12 numeric digits and validate against the mathematical **Verhoeff checksum algorithm**[cite: 2].
* **Indian Financial System Code (IFSC):** Must match pattern: `/^[A-Z]{4}0[A-Z0-9]{6}$/`[cite: 2].

### 2.2 Tier 2: Mathematical Balance Ledger Checks
* **Salary Schedule Consistency:**
  $$ \text{Gross Salary Value} = \text{Section 17(1) Value} + \text{Section 17(2) Value} + \text{Section 17(3) Value} $$
* **Quarterly Gain Distribution Verification:** Aggregate capital gains across quarterly tracking blocks in Schedule CG must equal total net capital gains for the year[cite: 2].
* **Tax Credit Claim Reconciliation:** Total tax credits claimed must exactly match the mathematical sum of all entries extracted from Form 16, Form 26AS, and manual records[cite: 2].

### 2.3 Tier 3: Statutory Rule Engine Compliance Checks
* **New Regime Deduction Check:** If `regime_opted == 'NEW'`, the engine blocks active deduction fields under Sections 80C, 80D, 80G, or HRA allowances[cite: 2].
* **Loss Offset Verification:** Validates that speculative intraday business losses have not been used to reduce non-speculative business income, capital gains, or salary balances[cite: 2].
* **Audit Requirement Alert Rule:** If absolute trading turnover (sum of absolute profits and losses across F&O transactions) exceeds $₹10,00,00,000$ (10 Crores), the system flags an audit warning under Section 44AB[cite: 2].

---

## 3. Structured Local Validation Object Schema
When errors are caught, the framework outputs a structured metadata node[cite: 2]:
```typescript
interface ValidationErrorNode {
  errorId: string;                     
  severityLevel: 'CRITICAL' | 'WARNING'; 
  targetModuleCategory: string;        
  descriptiveMessage: string;          
  workspaceUIRouteTarget: string;      
  domInputElementIdTarget: string;     
}
```


## 4. UI Error Resolution Interface Navigation Loop
The user interface converts error nodes into actionable behaviors[cite: 2]:

The Consolidated Error Panel: Displays a clear dashboard at the base of the active form container tracking unresolved errors[cite: 2].

Automated Focus Action: Clicking an error card automatically updates the layout directly to workspaceUIRouteTarget, scrolls to the target input field, applies a red alert border to domInputElementIdTarget, and places focus inside the field[cite: 2].

# Government Portal JSON Utility Schema Generator Specification
**Transformation Layer Target:** Official Income Tax Department JSON Schema Mapping  
**Filing Output Target:** Validated Uploadable Production File Asset Delivery

---

## 1. Architectural File Translation Vector
The final phase of the application lifecycle takes the verified internal data structures and converts them into the precise JSON format required by the Income Tax Department's offline filing framework.

┌──────────────────────────────┐
│  Internal SQLite DB Tables   │
│ (Normalized Relational Data) │
└──────────────┬───────────────┘
│
▼
┌──────────────────────────────┐
│  Transformation Mapping Pass │ ──► Translates internal names to official codes
└──────────────┬───────────────┘      (e.g., 'NEW' -> '115BAC_IEA_Y')
│
▼
┌──────────────────────────────┐
│   Official Schema Composer   │ ──► Builds nested JSON array blocks
└──────────────┬───────────────┘
│
▼
┌──────────────────────────────┐
│  Final ITR Utility JSON File │
└──────────────────────────────┘

## 2. Core Field Mapping Matrix Definitions
Internal system database values are transformed into official code values using strict translation rules:

| Functional Business Domain | Internal DB State Variable Key | Official Gov Schema Target Key Path | Statutory Code Value Mapping Requirement |
| :--- | :--- | :--- | :--- |
| **Tax Regime Flag** | `regime_opted: "NEW"` | `ITR.ITR_Form.FilingStatus.OptingInRegime` | `"115BAC_IEA_Y"` |
| **Tax Regime Flag** | `regime_opted: "OLD"` | `ITR.ITR_Form.FilingStatus.OptingInRegime` | `"115BAC_IEA_N"` |
| **Employment Class** | `emp_type: "PRIVATE"` | `ITR.ITR_Form.PersonalInfo.EmployerCategory` | `"PVT"` |
| **Filing Section Marker**| `filing_mode: "ORIGINAL"` | `ITR.ITR_Form.FilingStatus.FilingSection` | `"139_1"`[cite: 1] |

---

## 3. Comprehensive Target JSON Structural Blueprint (ITR-3 Extract)
The export component outputs a single, nested JSON structure matching the schema format required by the government's upload utility[cite: 1]:

```json
{
  "ITR": {
    "Header": {
      "SchemaVersion": "2.1.0",
      "FormType": "ITR-3",
      "AssessmentYear": "2026"
    },
    "ITR_Form": {
      "PersonalInfo": {
        "AssesseeName": {
          "FirstName": "RAHUL",
          "SurName": "SHARMA"
        },
        "PAN": "ABCDE1234F",
        "DOB": "1988-11-23",
        "EmployerCategory": "PVT"
      },
      "FilingStatus": {
        "FilingSection": "139_1",
        "OptingInRegime": "115BAC_IEA_Y"
      },
      "ScheduleComputation": {
        "GrossTotalIncome": {
          "Salary": 1450000,
          "BusinessProfession": 450000,
          "CapitalGains": 120000,
          "OtherSources": 35000
        },
        "TotalTaxPayable": 46800
      }
    }
  }
}
```

## 4. System Validation & Secure File Generation Output Pipeline
	1. Dependency Verification: The engine runs a final verification check against the validation matrix[cite: 1]. If any unresolved CRITICAL flags exist in the database, the generation sequence aborts[cite: 1].

	2. Memory Serialization: The software reads all normalized tables from the local encrypted SQLite database (SQLCipher) and constructs the target JSON structure entirely within a RAM text buffer[cite: 1].

	3. Local File Export Handshake: The system opens a native OS file dialog prompt, allowing the user to select their preferred output destination directory[cite: 1].

	4. Buffer Clearing Secure Protocol: The file stream writes the serialized data to the target location as a clean text block (e.g., ITR3_Return_Output.json)[cite: 1]. The application immediately overwrites and clears the intermediate volatile RAM buffers to ensure absolute data privacy[cite: 1].

#  Core Tax Calculation Engine Technical Specification
**Execution Profile:** Functional Deterministic Mathematical Runtime  
**Core Objective:** High-Precision Multi-Regime Liability Arithmetic Compliance  

---

## 1. Engine Execution Sequence (Order of Operations)
To guarantee accurate mathematical outputs without circular dependency errors, the computation engine passes data through an unalterable sequential pipeline:

```
┌────────────────────────────────────────────────────────┐
│ 1. Aggregate Gross Total Income (GTI) Across All Heads │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Execute Intra-Head Loss Set-Off Reductions          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Execute Inter-Head Loss Balance Offset Operations   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Extract Deductions (Chapter VIA Verification Caps)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 5. Segregate Special Rate Income from Slab Base Assets │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 6. Apply Surcharge, Apply Section 87A Rebate Framework │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 7. Calculate Health &amp; Education Cess (Final Liability) │
└────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Regime Slab Mathematical Logic
The engine computes tax metrics across dual logic sets concurrently to power comparative UI dashboards.

### 2.1 The New Tax Regime Engine Rules (Default Paradigm)
* **Standard Deduction Allocation:** Automatically reduces qualified Salaried income categories by a fixed $₹75,000$ limit.
* **Section 87A Rebate Algorithm:** Applies to individuals whose total Net Taxable Income does not exceed $₹12,00,000$. The engine caps the maximum slab rebate at $₹60,000$. 
    * *Critical Operational Restriction:* The Section 87A rebate applies fully to normal slab-rate liabilities. However, it *cannot* be used to offset special-rate tax generated by Short-term Capital Gains under Section 111A or Long-term Capital Gains under Section 112A.

```typescript
function calculateNewRegimeSlabTax(netSlabIncome: number): number {
  let tax = 0;
  if (netSlabIncome &lt;= 400000) return 0;
  
  if (netSlabIncome &gt; 2400000) {
    tax += (netSlabIncome - 2400000) * 0.30;
    netSlabIncome = 2400000;
  }
  if (netSlabIncome &gt; 2000000) {
    tax += (netSlabIncome - 2000000) * 0.25;
    netSlabIncome = 2000000;
  }
  if (netSlabIncome &gt; 1600000) {
    tax += (netSlabIncome - 1600000) * 0.20;
    netSlabIncome = 1600000;
  }
  if (netSlabIncome &gt; 1200000) {
    tax += (netSlabIncome - 1200000) * 0.15;
    netSlabIncome = 1200000;
  }
  if (netSlabIncome &gt; 800000) {
    tax += (netSlabIncome - 800000) * 0.10;
    netSlabIncome = 800000;
  }
  if (netSlabIncome &gt; 400000) {
    tax += (netSlabIncome - 400000) * 0.05;
  }
  return tax;
}
```

### 2.2 The Old Tax Regime Engine Rules
* **Standard Deduction Allocation:** Sets a fixed reduction limit of $₹50,000$ against valid salary lines.
* **Section 87A Rebate Algorithm:** Grants a rebate up to $₹12,500$ for total taxable net profiles capping out at exactly $₹5,00,000$.
* **Slab Layout Matrix:** 0–2.5L (Nil) | 2.5–5L (5%) | 5–10L (20%) | Above 10L (30%).

---

## 3. Loss Offset and Carry-Forward Execution Framework
When processing multi-category asset trades under ITR-2, ITR-3, and ITR-4 configurations, the engine executes strict loss matching logic across tax heads:

1.  **Intraday Speculative Block:** Net business losses from speculative intraday stock activity can *only* offset profits generated within other speculative intraday lines. They cannot reduce F&amp;O returns, salary distributions, or capital gains. Unabsorbed balances carry forward for a maximum of 4 assessment years.
2.  **F&amp;O Non-Speculative Vector:** Current-year losses from Futures and Options trading are classified as non-speculative business losses. They can offset any other category of business profits, rental income streams, or capital gains—but they are strictly blocked from reducing salary income lines. Unabsorbed balances carry forward for up to 8 assessment years to offset future business income.
3.  **Capital Gains Sorting Rules:**
    * *Short-Term Capital Losses (STCL):* Can offset both short-term capital gains (STCG) and long-term capital gains (LTCG).
    * *Long-Term Capital Losses (LTCL):* Restricted to offsetting *only* valid long-term capital gains (LTCG).
    * *Section 112A Threshold:* Long-term capital gains on listed equities are taxed at 10% only on the portion of aggregate gains that exceeds $₹1,00,00,00$ per financial year.

---

## 4. Special Rates, Surcharges, and Final Taxes
Before running final tax calculations, the engine extracts special-rate income components from the standard slab logic:
* **Section 111A:** 15% flat tax on short-term gains from listed equity transactions.
* **Section 112A:** 10% flat tax on long-term gains from listed equity transactions (calculated after subtracting the initial $₹1,00,000$ exemption pool).
* **Section 115BBH:** 30% flat tax on gross virtual digital asset/crypto returns. *Critical compliance constraint:* No operational cost deductions, standard allowances, or cross-head loss set-offs are permitted against crypto gains.

### Consolidated Final Aggregation Logic:
Final Aggregation Formulas:
$$ \text{Base Tax Liability} = \text{Slab Tax Result} + \sum \text{Special Rate Line Calculations} $$
$$ \text{Tax Post Rebate} = \text{Max}(0, \text{Base Tax Liability} - \text{Applicable Rebates}) $$
$$ \text{Surcharge Cost} = \text{Tax Post Rebate} \times \text{Surcharge Percentage Threshold} $$
$$ \text{Final Payable Tax Liability} = (\text{Tax Post Rebate} + \text{Surcharge Cost}) \times 1.04 $$

# Data Ingestion Pipeline &amp; Normalization Specifications
**Processing Runtime Environment:** Local System Web-Workers / Isolated Native Threads  
**File Pipeline Strategy:** Local Stream Parsing with Deduplication Anchors  

---

## 1. Document Extraction Specification Matrix
The ingestion architecture accepts multiple unstructured and semi-structured external document file payloads. It converts them entirely inside system RAM into clean structural profiles mapped straight to standard application data interfaces.

| Source Document Type | Format Target | Ingestion Mechanism | Extracted Domain Fields |
| :--- | :--- | :--- | :--- |
| **Previous Year ITR Utility File** | Extensible `.json` text stream | Native JSON structure stream mapping | User ID profile strings, Bank routing metadata array, **Schedule CFL historical loss carry-forward vectors**. |
| **Annual Information Statement (AIS)** | Standard `.json` / Secure PDF | Password-cracking stream layout mapper | Corporate dividend arrays, bank saving ledger metrics, gross capital asset transaction markers. |
| **Employer Form 16 (Part B)** | Structural PDF Layout | Coordinate-targeted tabular text extractor | Gross Salary [Sec 17(1)], Perquisites [Sec 17(2)], Section 10 exemptions, Employer TAN. |
| **Broker Profit &amp; Loss Ledger** | Custom Excel (`.xlsx`) / `.csv` | Stream-buffered SheetJS file parser | Transaction timestamps, asset identifier codes (ISIN), acquisition/transfer values, contract types. |

---

## 2. Ingestion Pipeline &amp; Normalization Workflow
The files pass through an automated sequence of local transformations to ensure data uniformity:

```
[Target File Entry] ──► [Password Handler] ──► [Structural Parser Engine]
                                                        │
[Unified DB Payload] ◄── [Deduplication Matcher] ◄── [Normalization Field Map]
```

### 2.1 Password Clearance Protocol
For protected documents (such as official AIS outputs or Form 16 distributions secured by combined PAN and date-of-birth string profiles):
1.  The layout engine isolates the document structure and checks for security authorization requirements.
2.  An inline UI credential prompt modal captures the pass-phrase from the user.
3.  The system attempts decryption in memory using a lightweight handler like **PDF.js**:
    ```typescript
    // Inside a local Web Worker thread
    const loadingTask = pdfjsLib.getDocument({
      data: fileBufferArray,
      password: userInputPasswordString.toLowerCase()
    });
    const pdfDocument = await loadingTask.promise;
    ```
4.  If authorization succeeds, the system processes the unencrypted file buffer. The password string is immediately scrubbed from volatile memory variables.

### 2.2 Normalization and Transformation Fields
Because brokers maintain individual naming conventions for trade transactions, the data normalization engine passes structural field arrays through a mapping dictionary. This dictionary translates vendor variables into standardized application data objects:

```typescript
interface StandardizedTransaction {
  isinCode: string;
  assetDescription: string;
  acquisitionDate: string; // YYYY-MM-DD
  transferDate: string;    // YYYY-MM-DD
  assetQuantity: number;
  costAcquisition: number;
  considerationValue: number;
  periodOfHoldingDays: number;
  taxSectionClassification: '111A' | '112A' | 'INTRADAY' | 'FNO' | 'VDA';
}
```

#### Mapping Dictionary Examples:
* *Zerodha Ledger Input:* `ISIN` → `isinCode`, `Buy Date` → `acquisitionDate`, `Quantity` → `assetQuantity`, `Cleared Profit/Loss` → Map to internal target buckets.
* *Groww Ledger Input:* `Instrument ISIN` → `isinCode`, `Purchase Date` → `acquisitionDate`, `Sell Value` → `considerationValue`.

---

## 3. Deduplication Algorithm Strategy
A common data-entry issue occurs when users import overlapping financial data sets—such as dropping both a Zerodha Excel export and an official AIS transaction report containing matching stock sales.

To prevent duplicating tax liabilities, the engine runs an identity-matching hash validation pass across all incoming transaction sets:

$$	ext{Transaction Hash} = 	ext{CryptoHash}(	ext{ISIN} + 	ext{Transfer Date} + 	ext{Asset Quantity} + 	ext{Consideration Value})$$

```typescript
function deduplicateTransactions(
  existingRecords: StandardizedTransaction[],
  incomingRecords: StandardizedTransaction[]
): { cleanRecords: StandardizedTransaction[]; conflictCount: number } {
  const existingHashSet = new Set(existingRecords.map(r =&gt; generateHash(r)));
  const cleanRecords = [...existingRecords];
  let conflictCount = 0;

  for (const record of incomingRecords) {
    const incomingHash = generateHash(record);
    if (existingHashSet.has(incomingHash)) {
      conflictCount++;
      // Skip insertion to prevent transaction duplication
      continue;
    }
    cleanRecords.push(record);
    existingHashSet.add(incomingHash);
  }

  return { cleanRecords, conflictCount };
}
```

If the `conflictCount` tracking metric exceeds zero, the system halts execution. It surfaces an inline reconciliation dashboard component allowing the filer to select their preferred data source of truth.