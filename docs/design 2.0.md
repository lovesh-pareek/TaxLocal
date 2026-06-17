# TaxLocal Design Specification

Version: 1.0

## Design Philosophy

TaxLocal follows:

* Spec Driven Development (SDD)
* Domain Driven Design (DDD)
* Offline First Architecture
* Privacy By Design
* Incremental Wave Delivery

Every implementation must trace back to:

* SRS Requirement
* Domain Model
* API Contract
* Validation Rule
* Tax Rule

No feature may be implemented without a corresponding specification reference.

---

# System Layers

## Layer 1 - Presentation

Technology:

* React
* TypeScript
* Vite

Responsibilities:

* User workflow
* Form management
* Validation display
* Tax dashboard
* Import wizard

---

## Layer 2 - Application

Responsibilities:

* Use Cases
* Workflow orchestration
* Event dispatching
* State transitions

Modules:

* User Service
* Assessment Year Service
* Import Service
* Validation Service
* Tax Engine Service
* Export Service

---

## Layer 3 - Domain

Responsibilities:

* Tax calculations
* Validation rules
* Loss adjustment rules
* Regime comparison logic

Contains:

* Aggregates
* Entities
* Value Objects
* Domain Events

---

## Layer 4 - Infrastructure

Responsibilities:

* File system
* PDF parsing
* AIS parsing
* Excel parsing


---

## Tax Context

Entities:

* TaxWorksheet
* AssessmentYear
* TaxResult

Responsibilities:

* Tax computation
* Loss adjustments
* Regime comparison

---

## Validation Context

Entities:

* ValidationRule
* ValidationError

Responsibilities:

* Tier 1 Validation
* Tier 2 Validation
* Tier 3 Validation

---

## Import Context

Entities:

* ImportedDocument
* Transaction

Responsibilities:

* Parsing
* Mapping
* Deduplication

---

## Export Context

Entities:

* JsonExport

Responsibilities:

* Government Mapping
* JSON Generation

---

# Event Driven Flow

DocumentImported
↓

DocumentParsed
↓

TransactionsNormalized
↓

TaxCalculated
↓

ValidationExecuted
↓

JsonGenerated

---

# Database Modules

01_users

02_assessment_years

03_documents

04_transactions

05_tax_worksheets

06_tax_results

07_validation_errors

08_audit_logs

---

# Definition Of Done

A module is DONE only if:

1. Domain model completed
2. Database schema completed
3. API contract implemented
4. Unit tests passing
5. Integration tests passing
6. Documentation updated
7. Wave status updated

Otherwise status remains WIP.

---

# Wave Execution Rule

Each wave must:

1. Compile successfully
2. Pass tests
3. Produce deployable artifact

Next wave cannot start until previous wave reaches DONE.

This enables interruption-safe AI development.
