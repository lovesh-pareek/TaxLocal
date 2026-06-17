# TASK.md

Project: TaxLocal
Methodology: Spec Driven Development (SDD)
Execution Mode: Wave-Based + Parallel AI Task Execution
Runtime: React + TypeScript + Node.js
Persistence: IndexedDB (Current), Future SQLite/SQLCipher
Status Source Of Truth: THIS FILE

---

# EXECUTION RULES

## Rule 1

Every task must reference:

* Requirement
* Design
* Domain Model
* API Contract

If no reference exists:

STATUS = BLOCKED

---

## Rule 2

AI MUST update task status after completion.

Allowed Status:

```yaml
NOT_STARTED
IN_PROGRESS
DONE
FAILED
BLOCKED
```

---

## Rule 3

If a task is FAILED:

```yaml
status: FAILED
attempts: +1
failureReason: required
```

On next prompt:

AI MUST resume FAILED tasks first.

---

## Rule 4

Wave completion criteria:

ALL tasks inside wave = DONE

Only then:

```yaml
waveStatus: DONE
```

Next wave may start.

---

## Rule 5

Parallel Execution

Tasks marked:

```yaml
parallel: true
```

may execute simultaneously.

Tasks marked:

```yaml
parallel: false
```

must wait for dependency completion.

---

# GLOBAL PROJECT STATUS

```yaml
currentWave: WAVE_0

overallProgress: 0%

lastUpdated: INITIAL

activeTasks: []
failedTasks: []
completedTasks: []
```

---

# WAVE_0_PROJECT_BOOTSTRAP

Purpose:
Create executable project foundation.

Wave Status:

```yaml
status: NOT_STARTED
```

Dependencies:

```yaml
none
```

---

## TASK_W0_001_MONOREPO_SETUP

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Deliverables:

* apps/web
* apps/server
* packages/shared
* packages/domain
* packages/contracts

Acceptance:

* project installs
* workspace resolves packages

---

## TASK_W0_002_TYPESCRIPT_CONFIGURATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Deliverables:

* tsconfig.base.json
* path aliases
* shared compiler settings

Acceptance:

* all packages compile

---

## TASK_W0_003_LINTING_FORMATTING

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Deliverables:

* eslint
* prettier
* import sorting

Acceptance:

* lint passes

---

## TASK_W0_004_CI_PIPELINE

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Deliverables:

* build workflow
* test workflow

Acceptance:

* CI passes

---

## TASK_W0_005_EVENT_BUS_FOUNDATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Deliverables:

* Event interface
* Event dispatcher
* Event registry

Acceptance:

* event publish works

---

# WAVE_1_DOMAIN_FOUNDATION

Purpose:

Create all core domain models.

Dependencies:

```yaml
requires:
  - WAVE_0
```

Wave Status:

```yaml
status: NOT_STARTED
```

---

## TASK_W1_001_USER_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-1

Deliverables:

* User Entity
* User Repository Contract
* User Aggregate

---

## TASK_W1_002_ASSESSMENT_YEAR_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-1

Deliverables:

* AssessmentYear Entity
* Repository Contract

---

## TASK_W1_003_DOCUMENT_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-2

Deliverables:

* ImportedDocument
* DocumentStatus
* Events

---

## TASK_W1_004_TRANSACTION_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-3

Deliverables:

* Transaction Entity
* StandardizedTransaction

---

## TASK_W1_005_TAX_WORKSHEET_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-5

Deliverables:

* TaxWorksheet Aggregate

---

## TASK_W1_006_VALIDATION_DOMAIN

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* FR-6

Deliverables:

* ValidationRule
* ValidationError

---

# WAVE_2_STORAGE_LAYER

Purpose:

Implement repositories and persistence.

Dependencies:

```yaml
requires:
  - WAVE_1
```

---

## TASK_W2_001_INDEXEDDB_SETUP

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W2_002_USER_REPOSITORY

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W2_003_ASSESSMENT_YEAR_REPOSITORY

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W2_004_DOCUMENT_REPOSITORY

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W2_005_TRANSACTION_REPOSITORY

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# WAVE_3_API_CONTRACTS

Purpose:

Implement API contracts from specification.

Dependencies:

```yaml
requires:
  - WAVE_2
```

---

## TASK_W3_001_USER_API

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* CreateUserRequest
* GetUser

---

## TASK_W3_002_ASSESSMENT_YEAR_API

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W3_003_DOCUMENT_API

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W3_004_TAX_ENGINE_API

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W3_005_VALIDATION_API

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# WAVE_4_DOCUMENT_INGESTION

Purpose:

Implement all file ingestion.

Dependencies:

```yaml
requires:
  - WAVE_3
```

---

## TASK_W4_001_JSON_IMPORT

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W4_002_CSV_IMPORT

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W4_003_XLSX_IMPORT

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W4_004_PDF_IMPORT

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W4_005_DOCUMENT_STATE_MACHINE

```yaml
status: NOT_STARTED
parallel: false
attempts: 0
```

Depends On:

* TASK_W4_001
* TASK_W4_002
* TASK_W4_003
* TASK_W4_004

---

# WAVE_5_NORMALIZATION_ENGINE

Purpose:

Convert imported data to unified model.

Dependencies:

```yaml
requires:
  - WAVE_4
```

---

## TASK_W5_001_TRANSACTION_NORMALIZER

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W5_002_ZERODHA_MAPPER

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W5_003_GROWW_MAPPER

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W5_004_DEDUPLICATION_ENGINE

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# WAVE_6_TAX_ENGINE

Purpose:

Core computation engine.

Dependencies:

```yaml
requires:
  - WAVE_5
```

---

## TASK_W6_001_INCOME_AGGREGATOR

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W6_002_LOSS_ADJUSTMENT_ENGINE

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

Reference:

* LOSS_001 → LOSS_009

---

## TASK_W6_003_OLD_REGIME_CALCULATOR

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W6_004_NEW_REGIME_CALCULATOR

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W6_005_REGIME_COMPARISON_ENGINE

```yaml
status: NOT_STARTED
parallel: false
attempts: 0
```

Depends On:

* TASK_W6_003
* TASK_W6_004

---

# WAVE_7_VALIDATION_ENGINE

Purpose:

Implement all validation layers.

Dependencies:

```yaml
requires:
  - WAVE_6
```

---

## TASK_W7_001_TIER1_VALIDATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W7_002_TIER2_VALIDATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W7_003_TIER3_VALIDATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W7_004_VALIDATION_ORCHESTRATOR

```yaml
status: NOT_STARTED
parallel: false
attempts: 0
```

---

# WAVE_8_REACT_UI

Purpose:

Build user interface.

Dependencies:

```yaml
requires:
  - WAVE_7
```

---

## TASK_W8_001_APP_SHELL

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W8_002_DASHBOARD

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W8_003_IMPORT_WIZARD

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W8_004_VALIDATION_PANEL

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W8_005_ERROR_NAVIGATION

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# WAVE_9_JSON_EXPORT

Purpose:

Generate government-compliant JSON.

Dependencies:

```yaml
requires:
  - WAVE_8
```

---

## TASK_W9_001_MAPPING_ENGINE

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W9_002_SCHEMA_BUILDER

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W9_003_EXPORT_BLOCKER

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# WAVE_10_INTEGRATION

Purpose:

End-to-end system validation.

Dependencies:

```yaml
requires:
  - WAVE_9
```

---

## TASK_W10_001_E2E_FLOW

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W10_002_PERFORMANCE_TESTING

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

## TASK_W10_003_SECURITY_REVIEW

```yaml
status: NOT_STARTED
parallel: true
attempts: 0
```

---

# AI RESUME PROTOCOL

When prompted:

1. Read TASK.md
2. Find FAILED tasks
3. Resume FAILED tasks first
4. If no FAILED tasks:

   * Continue current wave
5. Update statuses
6. Update overallProgress
7. Commit status changes back into TASK.md

Priority Order:

```yaml
FAILED
IN_PROGRESS
NOT_STARTED
```

End Of File
