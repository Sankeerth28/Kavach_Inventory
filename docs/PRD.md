# KAVACH
# AI-POWERED CONSTRUCTION MATERIAL INVENTORY MANAGEMENT SYSTEM

**Product Requirements Document (PRD)**

| Document Information | Details |
|---|---|
| Product | KAVACH |
| Version | 2.0 |
| Date | 12 November 2026 |
| Product Type | Web Application + Mobile Application |
| Industry | Real Estate / Construction |
| Primary Roles | Project Admin, Store Manager |
| Core Technology | AI-Powered Invoice Processing |
| Document Status | Updated Requirements |

---

# 1. PRODUCT OVERVIEW

## 1.1 Introduction

KAVACH is an AI-powered construction material inventory management system designed for ongoing real-estate construction projects.

The application will help project teams manage construction materials across their project stores through a simple and user-friendly interface.

The system will provide:

- Material Master Management.
- AI-powered invoice and challan scanning.
- Automatic material identification.
- Intelligent Material Master matching.
- Automatic new material creation.
- Material In management.
- Material Out management.
- Material Return management.
- Real-time stock tracking.
- Physical stock verification.
- Inventory reports.
- Role-based access control.

The primary objective is to eliminate repetitive manual inventory entry and make inventory management accessible to store personnel without requiring ERP knowledge.

## 1.2 Product Vision

**"Just scan the invoice. AI understands the materials. Confirm and update inventory."**

The application should minimise manual data entry while maintaining accurate inventory records.

## 1.3 Core Product Philosophy

- Simple user experience.
- AI-assisted operations.
- Minimal manual entry.
- Accurate inventory calculations.
- Complete transaction traceability.
- Human verification for uncertain AI results.
- No unnecessary ERP complexity.

---

# 2. BUSINESS OBJECTIVES

1. Reduce manual material entry.
2. Automate invoice and challan processing.
3. Reduce duplicate Material Master records.
4. Maintain accurate stock availability.
5. Track material movement across construction locations.
6. Identify low-stock materials.
7. Maintain supplier-wise material records.
8. Provide management with project inventory visibility.
9. Support mobile-based store operations.
10. Reduce dependence on administrative personnel for routine inventory activities.

## 2.1 Success Metrics

| Metric | Initial Target |
|---|---|
| Invoice processing success | At least 95% on supported test documents |
| Critical field extraction accuracy | At least 95% on validated test set |
| Material matching accuracy | At least 95% on validated test set |
| Duplicate invoice posting | Zero |
| Duplicate material creation | Less than 1% |
| Typical invoice processing time | Under 2 minutes, excluding exceptions |
| Inventory calculation accuracy | 100% according to posted ledger transactions |
| User training | Basic operations understandable after short training |

These are target acceptance metrics, not guaranteed AI performance. Actual accuracy must be measured using representative supplier documents.

---

# 3. USER ROLES AND PERMISSIONS

Initially, KAVACH will support two roles.

## 3.1 Project Admin

Project Admin has complete administrative control over the project inventory.

### Responsibilities

- Manage materials.
- Manage categories.
- Manage project locations.
- Create and manage Store Manager accounts.
- Monitor inventory.
- View all transactions.
- View all reports.
- Perform stock adjustments.
- Approve physical stock discrepancies.
- Reverse incorrect transactions.
- Monitor AI processing activities.
- Manage system settings.

### Permission Matrix

| Module | Project Admin |
|---|---|
| Dashboard | Full Access |
| Material Master | Full Access |
| Material In | View All |
| Material Out | View All |
| Material Return | View All |
| Current Stock | Full Access |
| Stock Verification | Review and Approve |
| Stock Adjustment | Full Access |
| Transactions | View All |
| Reports | Full Access |
| User Management | Full Access |
| Location Management | Full Access |
| Category Management | Full Access |
| Supplier Mapping | Manage |
| AI Processing Logs | View All |
| Audit Logs | Full Access |
| Settings | Full Access |

## 3.2 Store Manager

Store Manager handles all regular inventory operations.

### Responsibilities

- Scan supplier invoices.
- Upload printed invoices.
- Upload handwritten challans.
- Review AI-extracted details.
- Confirm material matches.
- Create new materials through Material In.
- Receive materials.
- Issue materials.
- Record material returns.
- View current stock.
- View transaction history.
- Submit physical stock discrepancies.
- View operational reports.

### Permission Matrix

| Module | Store Manager |
|---|---|
| Dashboard | Operational View |
| Material Master | View; Create Through Material In |
| Material In | Create and View |
| Material Out | Create and View |
| Material Return | Create and View |
| Current Stock | View |
| Stock Verification | Submit Discrepancy |
| Stock Adjustment | No Direct Access |
| Transactions | View |
| Reports | Operational Reports |
| User Management | No Access |
| Location Management | No Access |
| Category Management | No Direct Access |
| Supplier Mapping | Automatic Learning |
| AI Processing Logs | Own Processing Activity |
| Audit Logs | No Access |
| Settings | No Access |

## 3.3 Important Permission Rule

Store Manager should be able to create a new Material Master record directly during AI-assisted Material In.

Project Admin approval should not be required for routine material creation.

However:
- New material records must be audited.
- Existing material specifications must not be changed silently.
- Material deactivation remains an administrative action.
- Stock corrections require Project Admin authorisation.

---

# 4. APPLICATION MODULES

The application will contain:

1. Dashboard.
2. Material Master.
3. Material In.
4. Material Out.
5. Material Return.
6. Current Stock.
7. Stock Verification.
8. Transaction History.
9. Supplier Management.
10. Reports.
11. User Management.
12. Location Management.
13. Category Management.
14. AI Processing History.
15. Settings.
16. Audit Logs.

---

# 5. DASHBOARD

## 5.1 Project Admin Dashboard

Display the following statistics:

- Total Material Types.
- Total Available Stock.
- Low Stock Materials.
- Out of Stock Materials.
- Today's Material In.
- Today's Material Out.

### Dashboard Sections

**A. Stock Overview**

Display material counts and availability.

**B. Recent Transactions**

Show:
- Transaction ID.
- Material.
- Transaction Type.
- Quantity.
- User.
- Date.

**C. Low Stock Alerts**

Show materials below configured minimum stock.

**D. Material Movement**

Display Material In, Material Out, Returns and Adjustments over a selected period.

**E. AI Processing Overview**

Display:
- Total invoices processed.
- Successful extractions.
- Matched materials.
- New materials created.
- Items requiring review.
- Failed processing attempts.

## 5.2 Store Manager Dashboard

The Store Manager dashboard must prioritise daily activities.

Four large quick-action buttons:

1. Material In.
2. Material Out.
3. Return Material.
4. View Stock.

Additional sections:

- Today's Receipts.
- Today's Issues.
- Low Stock Alerts.
- Recent Transactions.
- Frequently Used Materials.

---

# 6. MATERIAL MASTER MANAGEMENT

## 6.1 Purpose

Material Master is the central database of all construction materials used in the project.

Every posted inventory transaction must reference a valid Material Master record.

## 6.2 Material Master Fields

| Field | Description | Required |
|---|---|---|
| Material ID | Unique generated identifier | Yes |
| Material Name | Standardised material name | Yes |
| Category | Material category | Yes |
| Subcategory | Optional classification | No |
| Brand | Manufacturer | No |
| Specification | Technical specification | No |
| Grade | Material grade | No |
| Size | Diameter, thickness, dimensions | No |
| Primary Unit | Bags, Kg, Tons, Nos, etc. | Yes |
| Pack Size | Example: 50 KG per bag | No |
| Minimum Stock | Low-stock threshold | Configurable |
| Description | Additional details | No |
| Status | Active / Inactive | Yes |
| Created By | User or AI-assisted workflow | Yes |
| Created Date | Timestamp | Yes |

## 6.3 Initial Material Categories

- Cement.
- Steel.
- Sand and Aggregate.
- Bricks and Blocks.
- Electrical.
- Plumbing.
- Tiles and Flooring.
- Paint and Finishing.
- Hardware.
- Safety Equipment.
- Tools and Equipment.
- Other Materials.

Project Admin can manage categories.

## 6.4 Material Creation Methods

### Method A: Manual Creation

Project Admin opens Material Master and creates a material manually.

### Method B: AI-Assisted Creation

1. Store Manager scans an invoice.
2. AI identifies an unfamiliar material.
3. AI prepares material details.
4. System checks for duplicates.
5. Store Manager reviews the proposed master record.
6. On confirmation, the system creates the Material Master and Material In transaction.

No separate Material Master navigation is required.

## 6.5 Duplicate Material Detection

The system must compare:

- Normalised name.
- Brand.
- Category.
- Grade.
- Size.
- Specification.
- Unit.
- Pack size.

Example:

Existing:
OPC Cement 53 Grade – 50 KG.

Invoice:
ULTRATECH OPC 53 50KG.

Suggested result:
Existing Material – OPC Cement 53 Grade.

However, similar names with different specifications must remain separate.

Example:

- TMT Steel 12mm.
- TMT Steel 16mm.
- TMT Steel 20mm.

These must never be merged based only on name similarity.

---

# 7. AI-POWERED INVOICE PROCESSING

This is the primary differentiating feature of KAVACH.

## 7.1 Objective

Convert printed invoices, handwritten invoices and delivery challans into structured inventory transactions with minimal manual effort.

## 7.2 Supported Documents

Initial supported formats:

- JPG.
- JPEG.
- PNG.
- PDF.

Supported document types:

1. Printed supplier invoices.
2. Handwritten invoices.
3. Handwritten delivery challans.
4. Mixed printed and handwritten documents.
5. Multi-page invoices.
6. Photographed paper documents.

## 7.3 Complete AI Processing Workflow

### STEP 1 – Upload / Scan

Store Manager opens Material In.

Options:

- Scan Invoice.
- Upload Image.
- Upload PDF.
- Quick Receive.

Mobile camera integration must be available.

The system should support multiple images for multi-page documents.

### STEP 2 – Document Quality Check

Before AI extraction, check:

- Image blur.
- Low resolution.
- Poor lighting.
- Incorrect orientation.
- Cropped document.
- Missing pages.
- Excessive shadows.

If image quality is insufficient, display a clear warning and request a better image.

Do not reject a document solely because it is handwritten.

### STEP 3 – OCR AND DOCUMENT UNDERSTANDING

The document processing layer extracts text and layout.

The system must support:

- Printed text recognition.
- Handwriting recognition.
- Table recognition.
- Multi-page extraction.
- Mixed document layouts.
- Multiple languages where supported.

Recommended implementation:

- OpenAI vision/document understanding for interpretation and structured extraction.
- Dedicated OCR/document processing service as an optional fallback for difficult handwriting or document layouts.

The initial implementation should be validated against actual supplier documents before selecting additional OCR services.

### STEP 4 – AI DATA EXTRACTION

AI extracts the following information.

**Invoice Header**

- Supplier Name.
- Supplier Address.
- Invoice Number.
- Invoice Date.
- Challan Number.
- GSTIN.
- Invoice Total.
- Tax Details, if available.

**Material Lines**

- Original Invoice Description.
- Suggested Material Name.
- Brand.
- Category.
- Specification.
- Grade.
- Size.
- Pack Size.
- Invoice Quantity.
- Unit.
- Unit Price.
- Line Total.
- HSN Code.

All extracted data must be returned in a predefined structured JSON schema.

AI must also identify uncertain or unreadable fields.

### STEP 5 – MATERIAL MATCHING

The extracted invoice items are compared against Material Master.

Matching priority:

1. Previously confirmed supplier-specific mapping.
2. Exact material and specification match.
3. Normalised text matching.
4. Database search for similar records.
5. Semantic similarity matching.
6. AI-assisted candidate selection.

The system must compare technical specifications and unit compatibility.

### STEP 6 – THREE MATCHING OUTCOMES

**A. MATCHED**

An existing Material Master record has been identified.

Example:

Invoice:
ULTRATECH OPC 53 50KG.

Existing Master:
OPC Cement 53 Grade.

Status: MATCHED.

**B. NEW MATERIAL**

No suitable existing record has been found.

AI prepares:

- Material Name.
- Category.
- Brand.
- Specification.
- Unit.
- Pack Size.

Status: NEW MATERIAL.

Store Manager can create it through the same Material In confirmation process.

**C. REVIEW REQUIRED**

AI cannot reliably identify the correct material.

Example:

Invoice Description: GI FITTING HEAVY.

Possible matches:
- GI Fitting 1 Inch.
- GI Fitting 1.5 Inch.
- GI Fitting 2 Inch.

The user must choose or enter the correct specification.

AI must never silently assign a technically incompatible material.

---

# 8. AI CONFIDENCE AND VALIDATION ENGINE

## 8.1 Field-Level Confidence

Confidence must be tracked separately for individual fields.

Example:

| Field | Extracted Value | Confidence |
|---|---|---|
| Supplier | ABC Traders | High |
| Invoice Number | INV-1045 | High |
| Material Name | OPC Cement | High |
| Quantity | 500 | Medium |
| Unit | Bags | High |
| Challan Number | 1045 | Low |

The user should only need to correct uncertain fields.

## 8.2 Initial Confidence Rules

These are initial configurable operating thresholds.

| Confidence | Action |
|---|---|
| 95–100% | Suggest high-confidence match |
| 70–94% | Require user confirmation |
| Below 70% | Require manual review |

Confidence alone must not determine whether a transaction is safe.

Hard business validations override AI confidence.

For example, a 99% match must still be rejected for automatic selection if the steel diameter conflicts with the Material Master.

## 8.3 AI Must Not Decide

AI must not independently:

- Verify actual physical quantities.
- Decide whether materials are interchangeable.
- Approve damaged material.
- Change technical specifications.
- Perform stock adjustments.
- Post inventory transactions.
- Override duplicate invoice protection.

---

# 9. SUPPLIER MAPPING AND AI LEARNING

## 9.1 Objective

Allow the system to improve its matching behaviour based on confirmed user decisions.

## 9.2 Supplier Material Mapping

Maintain a database containing:

- Supplier ID.
- Supplier Invoice Description.
- Normalised Description.
- Material ID.
- Confirmation Status.
- Confirmed By.
- Confirmation Date.

Example:

| Supplier Description | Standard Material |
|---|---|
| ULTR OPC53 50KG | OPC Cement 53 Grade |
| TMT FE550 12MM | TMT Steel 12mm |
| CPVC SDR11 25MM | CPVC Pipe 25mm |

## 9.3 Learning Workflow

1. AI identifies a material.
2. System suggests a Material Master match.
3. Store Manager confirms the match.
4. Supplier mapping is saved.
5. Future invoices reuse the mapping.
6. If a mapping produces a specification conflict, the system requests review.

The system must not automatically retrain an AI model after each transaction.

Learning initially happens through saved mappings and verified records.

---

# 10. MATERIAL IN MODULE

## 10.1 Objective

Receive materials with minimal manual entry.

AI-powered invoice scanning is the primary receiving method.

## 10.2 Web Workflow

### SCREEN 1 – MATERIAL IN

Display:

- Scan Invoice.
- Upload Invoice.
- Quick Receive.

Below:

- Recent Receipts.
- Pending Reviews.
- Processing Status.

### SCREEN 2 – DOCUMENT PROCESSING

Display progress:

1. Uploading.
2. Checking Document Quality.
3. Reading Invoice.
4. Identifying Materials.
5. Matching Material Master.
6. Preparing Receipt.

Processing should happen asynchronously.

### SCREEN 3 – REVIEW AND CONFIRM

Display invoice header information.

Example:

Supplier: ABC Traders.

Invoice Number: INV-1045.

Invoice Date: 09/11/2026.

Display the extracted material table.

| Invoice Description | KAVACH Material | Category | Invoice Qty | Received Qty | Status |
|---|---|---|---:|---:|---|
| OPC 53 Grade 50KG | OPC Cement 53 Grade | Cement | 500 Bags | 500 Bags | Matched |
| TMT FE550 12MM | TMT Steel 12mm | Steel | 2.5 Tons | 2.5 Tons | Matched |
| CPVC Pipe 25MM | CPVC Pipe 25mm | Plumbing | 100 Nos | 100 Nos | New |
| GI Fitting | GI Fitting | Plumbing | 25 Nos | 25 Nos | Review |

The user can edit:

- Material mapping.
- Material name for new records.
- Category.
- Specification.
- Unit, where appropriate.
- Actual received quantity.
- Notes.

New materials should be clearly marked.

The user should be able to view the original invoice alongside the extracted information.

### SCREEN 4 – ACTUAL RECEIVED QUANTITY

Invoice Quantity and Actual Received Quantity must be separate fields.

Example:

Invoice Quantity: 500 Bags.

Actual Received Quantity: 490 Bags.

Difference: 10 Bags.

Possible reasons:

- Short Supply.
- Damaged.
- Rejected.
- Other.

The system must capture the reason when there is a discrepancy.

Only accepted usable quantity increases available stock.

### SCREEN 5 – CONFIRM & RECEIVE

Before confirmation, display:

- Supplier.
- Invoice Number.
- Total Material Lines.
- New Materials.
- Items Requiring Review.
- Accepted Quantities.
- Damaged / Rejected Quantities.

Primary button:

**CONFIRM & RECEIVE**

After confirmation:

1. Validate all materials.
2. Check duplicate invoices.
3. Create approved new Material Master records.
4. Create Material In transactions.
5. Update stock balances.
6. Save supplier mappings.
7. Store invoice document reference.
8. Record user and timestamp.
9. Generate receipt reference.

These operations must be committed atomically.

If any critical posting operation fails, no partial stock update should remain.

### SCREEN 6 – SUCCESS

Display:

MATERIAL RECEIVED SUCCESSFULLY.

- Supplier.
- Invoice Number.
- Receipt Reference.
- Number of Materials.
- Received Quantities.

Actions:

- View Receipt.
- Download Receipt.
- Receive Another.

## 10.3 Quick Receive

For material received without an invoice:

Fields:

- Material.
- Quantity.
- Unit.
- Supplier (optional).
- Reference Number (optional).
- Notes (optional).

Action: RECEIVE MATERIAL.

---

# 11. HANDWRITTEN INVOICE PROCESSING

## 11.1 Objective

Support handwritten documents without requiring a separate manual workflow.

## 11.2 Workflow

1. User scans or uploads document.
2. System checks image quality.
3. OCR/AI identifies printed and handwritten text.
4. AI extracts material details.
5. Matching engine compares extracted items with Material Master.
6. Confidence is assigned field by field.
7. Uncertain fields are highlighted.
8. Store Manager corrects only uncertain information.
9. Confirm & Receive.

## 11.3 Handwriting Limitations

Potential issues:

- Unclear handwriting.
- Similar-looking digits.
- Unusual abbreviations.
- Regional language variations.
- Overwritten quantities.
- Poor-quality photographs.

## 11.4 Recommended Interface

For uncertain fields, show:

- Original document crop.
- Extracted value.
- Confidence indicator.
- Editable value.

Example:

Original handwritten value: unclear.

AI suggested quantity: 500.

Status: REVIEW REQUIRED.

The user corrects the value and continues.

The system should support English and other required regional languages based on actual supplier document testing.

## 11.5 Partial Extraction

If an invoice contains 10 material lines and only 2 are unclear:

- Preserve all successfully extracted lines.
- Highlight only the 2 uncertain lines.
- Allow manual correction.
- Do not reject the entire invoice.

If an item cannot be understood, allow manual entry for that item.

---

# 12. UNIT CONVERSION ENGINE

## 12.1 Objective

Ensure that quantities are stored and calculated consistently.

AI extracts the original invoice quantity and unit.

Backend conversion rules handle valid conversions.

## 12.2 Unit Master

Initial units:

- Bags.
- Kg.
- Grams.
- Tons / MT.
- Nos.
- Pieces.
- Meters.
- Feet.
- Running Feet.
- Litres.
- Rolls.
- Boxes.
- Bundles.
- Cubic Feet.
- Cubic Meters.

Project Admin can configure supported units.

## 12.3 Unit Conversion Rules

Example:

Invoice:

500 Bags × 50 KG.

System stores:

- Transaction Quantity: 500 Bags.
- Pack Size: 50 KG.
- Equivalent Quantity: 25,000 KG.

The material's stock unit remains Bags if Bags is its configured inventory unit.

For steel:

Invoice: 2.5 MT.

Equivalent weight: 2,500 KG.

If the stock unit is Tons, the stock balance remains 2.5 Tons, with the equivalent weight stored for reporting if required.

## 12.4 Conversion Validation

- Only approved conversions are allowed.
- Material-specific pack sizes must be maintained.
- Incompatible units must trigger review.
- Variable-weight materials must not use assumed conversions.
- AI must never invent missing pack sizes.

---

# 13. DUPLICATE INVOICE PROTECTION

## 13.1 Objective

Prevent the same invoice from increasing stock more than once.

## 13.2 Duplicate Detection

Check:

- Project ID.
- Supplier ID.
- Invoice Number.
- Invoice Date.
- Document Fingerprint.

## 13.3 Duplicate Warning

Example:

POSSIBLE DUPLICATE INVOICE.

Invoice: INV-1045.

Supplier: ABC Traders.

Previously Processed: 10 November 2026.

The user should not be able to receive the same invoice again without authorised resolution.

The system must also support backend idempotency to prevent duplicate posting caused by retries, repeated clicks or network failures.

---

# 14. MATERIAL OUT MODULE

## 14.1 Objective

Record materials issued from the store to construction locations.

## 14.2 Workflow

1. Select Material.
2. Display Available Stock.
3. Enter Issue Quantity.
4. Select Destination.
5. Enter Issued To / Contractor.
6. Add Notes (optional).
7. Confirm Issue.

## 14.3 Destination Locations

Examples:

- Tower A.
- Tower B.
- Tower C.
- Basement.
- Club House.
- External Works.
- Site Office.

Project Admin manages locations.

## 14.4 Validation

- Quantity must be greater than zero.
- Issue quantity cannot exceed available stock.
- Material must be active.
- Destination must be valid.
- Unit must be compatible with Material Master.

## 14.5 Stock Calculation

Available Stock = Previous Stock - Issued Quantity.

---

# 15. MATERIAL RETURN MODULE

## 15.1 Objective

Record unused materials physically returned from construction locations.

## 15.2 Workflow

1. Select Material.
2. Enter Return Quantity.
3. Select Returned From.
4. Select Contractor / Person, if applicable.
5. Select Material Condition.
6. Confirm Return.

## 15.3 Material Condition

- Good / Reusable.
- Damaged.
- Scrap.

Only reusable materials should automatically increase available stock.

Damaged and scrap materials should be recorded separately and excluded from available stock until an authorised disposition.

---

# 16. CURRENT STOCK MODULE

## 16.1 Stock Listing

Display:

- Material ID.
- Material Name.
- Category.
- Specification.
- Unit.
- Available Quantity.
- Minimum Stock.
- Stock Status.

## 16.2 Stock Status

- Available.
- Low Stock.
- Out of Stock.
- Inactive.

## 16.3 Search and Filters

- Material Name.
- Material Category.
- Stock Status.
- Store Location.
- Supplier.
- Date Range, where relevant.

## 16.4 Material Details

Display:

- Material Information.
- Current Stock.
- Total Received.
- Total Issued.
- Total Reusable Returns.
- Total Adjustments.
- Recent Transactions.
- Supplier History.
- Stock Movement History.

---

# 17. STOCK VERIFICATION

## 17.1 Objective

Compare physical stock with the system stock.

## 17.2 Workflow

1. Select Material.
2. Display System Stock.
3. Enter Physical Quantity.
4. Calculate Difference.
5. Enter Reason.
6. Submit for Project Admin Approval.

Example:

System Stock: 500 Bags.

Physical Stock: 490 Bags.

Difference: -10 Bags.

## 17.3 Permissions

Store Manager:
- View stock.
- Enter physical count.
- Submit discrepancy.

Project Admin:
- Review discrepancy.
- Approve or reject.
- Create stock adjustment.

All approved adjustments must generate ledger entries.

---

# 18. TRANSACTION HISTORY AND AUDIT

## 18.1 Transaction Types

- Material In.
- Material Out.
- Material Return.
- Stock Adjustment.
- Transaction Reversal.

## 18.2 Transaction Fields

- Transaction ID.
- Project ID.
- Store ID.
- Material ID.
- Material Name.
- Transaction Type.
- Quantity.
- Unit.
- Reference Number.
- Supplier / Destination.
- User.
- Date and Time.
- Status.
- Notes.

## 18.3 Audit Requirements

- Posted transactions cannot be deleted.
- Corrections must use reversal transactions.
- Reversals must reference original transactions.
- Every stock change must be traceable.
- New materials created through AI must retain their creation source.
- AI extraction results and user corrections must be auditable.
- Every approval must capture the approving user and timestamp.

---

# 19. REPORTS

Initial reports:

1. Current Stock Report.
2. Material In Report.
3. Material Out Report.
4. Material Return Report.
5. Material Movement Report.
6. Supplier-wise Report.
7. Low Stock Report.
8. Physical Stock Discrepancy Report.
9. AI Processing Report.
10. New Material Creation Report.

All reports should support date filters and Excel/PDF export.

## 19.1 Material Movement Formula

Opening Stock + Material In + Reusable Returns - Material Out + Adjustments = Closing Stock.

Damaged and scrap materials must be tracked separately and must not be counted as available stock.

---

# 20. WEB APPLICATION DESIGN

## 20.1 General Layout

- Left-side navigation.
- Top navigation.
- Project selector.
- Notification area.
- User profile.
- Main workspace.

## 20.2 Project Admin Navigation

1. Dashboard.
2. Material Master.
3. Stock.
4. Transactions.
5. Reports.
6. User Management.
7. Locations.
8. Suppliers.
9. AI Processing.
10. Settings.

## 20.3 Store Manager Navigation

1. Dashboard.
2. Material In.
3. Material Out.
4. Return Material.
5. Current Stock.
6. Transactions.
7. Reports.

## 20.4 Material In Interface

The screen should contain:

**A. Invoice Upload Area**
- Drag and Drop.
- Browse Files.
- Scan Invoice.
- Supported formats information.

**B. AI Processing Status**
- Uploading.
- Document Checking.
- Reading.
- Material Identification.
- Matching.

**C. Invoice Information**
- Supplier.
- Invoice Number.
- Invoice Date.
- Challan Number.

**D. Material Review Table**
- Invoice Description.
- Standard Material.
- Category.
- Specification.
- Invoice Quantity.
- Received Quantity.
- Unit.
- Match Status.
- Confidence.
- Actions.

**E. Original Document Preview**

Show the original invoice alongside the extracted data.

**F. Final Confirmation**

CONFIRM & RECEIVE.

The user should be able to edit information inline without navigating away.

---

# 21. MOBILE APPLICATION

## 21.1 Store Manager Home

Four large actions:

- Material In.
- Material Out.
- Return.
- View Stock.

Below:
- Today's Activity.
- Low Stock.
- Recent Transactions.

## 21.2 Mobile Material In

1. Tap Material In.
2. Scan Invoice.
3. Capture multiple pages if necessary.
4. AI checks document quality.
5. AI processes invoice.
6. Material Master matching occurs.
7. Display extracted items.
8. Highlight uncertain fields.
9. Review actual received quantity.
10. Confirm & Receive.

## 21.3 Mobile Material Out

1. Search / Scan Material.
2. Select Material.
3. View Available Stock.
4. Enter Quantity.
5. Select Destination.
6. Confirm Issue.

## 21.4 Mobile Stock

- Search.
- Material List.
- Available Quantity.
- Stock Status.
- Material Details.

## 21.5 Mobile UX

- Large touch-friendly controls.
- Minimal typing.
- Camera support.
- Simple navigation.
- Responsive layout.
- Clear success/error messages.
- Slow network support.
- Safe retry mechanisms.

---

# 22. TECHNICAL ARCHITECTURE

## 22.1 Recommended Architecture

The system should separate AI processing from inventory operations.

**Application Layer**

Web Application / Mobile Application.

↓

**Backend API**

Authentication, permissions, validation and business rules.

↓

**Document Processing Layer**

Image processing, OCR and document understanding.

↓

**AI Intelligence Layer**

OpenAI API for:
- Invoice interpretation.
- Material extraction.
- Material classification.
- Matching suggestions.
- New material proposals.

↓

**Material Matching Engine**

- Supplier mapping.
- Database search.
- Normalisation.
- Specification comparison.
- Semantic search when required.

↓

**Human Review Layer**

Store Manager reviews and confirms.

↓

**Inventory Engine**

- Material Master creation.
- Material In posting.
- Stock balance updates.
- Transaction ledger.
- Audit records.

## 22.2 AI Integration

Recommended initial AI service: OpenAI API.

The backend should send invoice images or supported documents for structured extraction.

Use structured JSON output.

Example:

{
  "supplier": "ABC Traders",
  "invoice_no": "INV-1045",
  "invoice_date": "2026-11-09",
  "items": [
    {
      "invoice_description": "ULTRATECH OPC 53 50KG",
      "suggested_name": "OPC Cement 53 Grade",
      "category": "Cement",
      "quantity": 500,
      "unit": "Bags",
      "pack_size": "50 KG"
    }
  ]
}

This is an illustrative data structure. The actual API schema should include extraction confidence, specification attributes, page references and validation status.

## 22.3 Recommended Matching Strategy

Do not call AI for every matching operation.

Use this sequence:

1. Check confirmed supplier mapping.
2. Search exact material descriptions.
3. Search normalised descriptions.
4. Compare technical specifications.
5. Use semantic matching when needed.
6. Ask AI to resolve ambiguous candidates.
7. Suggest new material when no valid match exists.

## 22.4 AI Safety

AI must never directly write into the inventory database.

Backend must validate:
- Material identity.
- Specifications.
- Units.
- Quantities.
- Duplicate invoices.
- Permissions.
- Transaction status.

Only confirmed and validated operations should update stock.

---

# 23. DATABASE REQUIREMENTS

Recommended initial entities:

| Table | Purpose |
|---|---|
| users | User accounts |
| roles | Project Admin and Store Manager |
| permissions | Role permissions |
| projects | Project information |
| stores | Physical project stores |
| locations | Towers, blocks, floors and work areas |
| material_categories | Material classifications |
| units | Unit master |
| materials | Material Master |
| material_specifications | Structured material attributes |
| suppliers | Supplier records |
| supplier_aliases | Supplier name variations |
| supplier_material_mappings | Confirmed supplier mappings |
| invoices | Uploaded invoice documents |
| invoice_items | Extracted invoice line items |
| ai_processing_logs | AI extraction and matching logs |
| material_transactions | Stock movement ledger |
| stock_balances | Current stock balances |
| stock_verifications | Physical stock verification |
| stock_adjustments | Approved stock corrections |
| audit_logs | System activity |

## 23.1 Important Data Relationships

- A project can have multiple stores.
- A store can have multiple stock locations.
- A project can have multiple materials.
- A supplier can provide multiple materials.
- An invoice can contain multiple invoice items.
- An invoice item can map to one Material Master record.
- A material can have multiple transactions.
- A material can have multiple supplier mappings.
- A user can create multiple transactions.

## 23.2 Inventory Ledger

Material transactions must be the authoritative inventory record.

Current stock balances should be maintained consistently with the ledger.

Use database transactions, concurrency controls and idempotency to prevent:
- Duplicate stock posting.
- Negative stock.
- Race conditions.
- Partial inventory updates.

## 23.3 Multi-Store Inventory

The initial architecture should support multiple stores within a project.

Stock must be tracked at store level.

Project-wide stock should be the sum of individual store balances, not a separate manually maintained balance.

Store transfers should be treated as a future or separately scoped feature unless required for the initial deployment.

---

# 24. AI LIMITATIONS AND SOLUTIONS

| Challenge | Solution |
|---|---|
| Handwritten text | OCR + AI + field-level review |
| Blurry images | Image quality checks and recapture |
| Multi-page invoices | Page-wise extraction and consolidation |
| Different invoice formats | Document understanding |
| Different material descriptions | Supplier mapping and normalisation |
| Similar material names | Specification-based matching |
| Different brands | Brand attributes and matching rules |
| Unit conversion | Centralised conversion engine |
| Missing pack sizes | Manual verification |
| Incorrect quantities | Actual received quantity verification |
| Duplicate material records | Duplicate detection |
| Duplicate invoice uploads | Invoice deduplication |
| Partial extraction | Line-level correction |
| Poor regional language support | Multilingual OCR testing and fallback |
| Incorrect AI suggestions | Human confirmation |
| Network interruption | Asynchronous processing and idempotent retries |

## 24.1 Important Principle

AI proposes.

Backend validates.

Store Manager confirms.

Inventory Engine posts.

This separation is mandatory.

---

# 25. NON-FUNCTIONAL REQUIREMENTS

## 25.1 Performance

- Normal application pages should load quickly.
- Stock search should be responsive.
- AI processing should happen asynchronously.
- Processing status should be visible.
- Users should be able to navigate other modules during AI processing.

## 25.2 Security

- Secure authentication.
- Backend-enforced permissions.
- HTTPS.
- Secure document storage.
- API key protection.
- Audit logging.
- Input validation.
- Secure file upload handling.

## 25.3 Reliability

- Duplicate invoice protection.
- Idempotent transaction posting.
- Consistent stock balances.
- Safe retry mechanisms.
- Failed processing recovery.
- Document retention.

## 25.4 Usability

- Minimal data entry.
- Simple language.
- Large controls.
- Clear status indicators.
- Consistent layouts.
- Mobile-friendly interface.
- Minimal training requirement.

## 25.5 Scalability

Support multiple construction projects, stores, users and suppliers.

Project-level data separation must be built into the database and API architecture.

---

# 26. SECURITY AND BUSINESS RULES

1. Every material must have a unique ID.
2. Every posted transaction must reference a valid material.
3. AI-generated masters must be reviewed before creation.
4. Invoice quantity and actual received quantity must remain separate.
5. Negative stock is prohibited.
6. Material Out requires a destination.
7. Material Return requires a source location.
8. Damaged materials are excluded from available stock.
9. Posted transactions cannot be deleted.
10. Reversals must reference original transactions.
11. Stock adjustments require Project Admin authorisation.
12. Duplicate invoices must be detected.
13. Units must be validated against the Material Master.
14. AI must not silently modify technical specifications.
15. Every transaction must record its creator and timestamp.
16. All posted inventory movements must be auditable.
17. Supplier mappings must originate from verified user decisions.
18. A failed transaction must not partially update stock.
19. All stock operations must be project- and store-aware.
20. Supplier invoices must not be automatically treated as proof of actual physical receipt.

---

# 27. OUT OF SCOPE – INITIAL MVP

The following features are excluded from the first release:

- Purchase Order Management.
- Vendor Quotation Comparison.
- Procurement Management.
- Accounting Integration.
- GST Filing.
- Payment Processing.
- Vendor Payment Tracking.
- Complex Approval Workflows.
- Warehouse Bin Management.
- Advanced Batch Costing.
- AI Price Forecasting.
- Advanced Procurement Automation.

These can be considered in future releases.

---

# 28. DEVELOPMENT PHASES

## PHASE 1 – FOUNDATION

Develop:

- Authentication.
- Two roles.
- Project setup.
- Store setup.
- Dashboard.
- Material Categories.
- Unit Master.
- Material Master.
- Location Management.
- User Management.

Deliverable: Functional application foundation.

## PHASE 2 – INVENTORY ENGINE

Develop:

- Material In (manual).
- Material Out.
- Material Return.
- Current Stock.
- Transaction Ledger.
- Stock Validation.
- Low Stock Alerts.
- Duplicate transaction protection.
- Stock Verification.

Deliverable: Fully working inventory engine without AI.

## PHASE 3 – AI INVOICE PROCESSING

Develop:

- Invoice upload.
- Mobile camera scanning.
- Document quality checking.
- AI extraction.
- OCR/handwriting support.
- Structured JSON output.
- Material matching engine.
- New Material Master creation.
- Field-level confidence.
- Review and confirmation.
- Supplier mapping memory.
- Duplicate invoice detection.
- Partial extraction handling.

Deliverable: AI-powered Material In.

## PHASE 4 – MOBILE APPLICATION

Develop:

- Mobile dashboard.
- Material In.
- Material Out.
- Material Return.
- Current Stock.
- Camera integration.
- Transaction history.
- Responsive review screen.

Deliverable: Mobile-operable inventory system.

## PHASE 5 – REPORTS AND FINALISATION

Develop:

- Current Stock Report.
- Material In Report.
- Material Out Report.
- Material Movement Report.
- Supplier-wise Report.
- Low Stock Report.
- AI Processing Report.
- Audit Logs.
- Excel/PDF exports.
- Security testing.
- Performance testing.

Deliverable: Production-ready MVP.

---

# 29. TESTING AND ACCEPTANCE CRITERIA

## 29.1 AI Testing Dataset

Before production deployment, collect 50–100 actual supplier documents.

Suggested distribution:

- Printed invoices.
- Handwritten challans.
- Mixed printed and handwritten documents.
- Poor-quality photographs.
- Multiple-page invoices.
- Different supplier formats.
- Different languages.

Maintain manually verified expected results as ground truth.

## 29.2 Accuracy Testing

Measure separately:

1. Supplier extraction accuracy.
2. Invoice number accuracy.
3. Invoice date accuracy.
4. Material description accuracy.
5. Quantity accuracy.
6. Unit accuracy.
7. Specification accuracy.
8. Material matching accuracy.
9. New material classification accuracy.

Do not rely on one overall AI accuracy percentage.

## 29.3 Functional Acceptance

The system must successfully demonstrate:

- Uploading printed invoices.
- Uploading handwritten challans.
- Extracting multiple material lines.
- Matching existing materials.
- Detecting new materials.
- Highlighting uncertain fields.
- Correcting extracted quantities.
- Handling partial deliveries.
- Converting compatible units.
- Detecting duplicate invoices.
- Creating new Material Master records.
- Updating stock after confirmation.
- Preventing negative stock.
- Maintaining complete audit history.
- Operating from mobile devices.

---

# 30. FUTURE ENHANCEMENTS

1. Barcode and QR scanning.
2. WhatsApp invoice submission.
3. Voice-based material search.
4. AI purchase recommendations.
5. Multiple warehouse management.
6. Contractor-wise material consumption.
7. Project-wise inventory comparison.
8. Predictive stock requirements.
9. Accounting integration.
10. Advanced AI classification.
11. Offline transaction capture and synchronisation.
12. Advanced material analytics.

---

# 31. FINAL END-TO-END WORKFLOWS

## 31.1 Material In – AI Workflow

Store Manager opens Material In.

↓

Scans or uploads invoice / handwritten challan.

↓

System checks document quality.

↓

AI reads the document.

↓

AI extracts supplier and material information.

↓

Material Matching Engine searches Material Master.

↓

Three possible outcomes:

**MATCHED** – Existing material identified.

**NEW MATERIAL** – New material proposed.

**REVIEW REQUIRED** – User correction required.

↓

Store Manager reviews extracted information.

↓

Store Manager verifies actual received quantity and material condition.

↓

User clicks CONFIRM & RECEIVE.

↓

Backend validates the complete transaction.

↓

New Material Master records are created where applicable.

↓

Material In transactions are posted.

↓

Stock balances are updated.

↓

Supplier mappings are saved.

↓

Receipt is generated.

## 31.2 Material Out Workflow

Store Manager opens Material Out.

↓

Searches or selects material.

↓

System displays available stock.

↓

Enters issue quantity.

↓

Selects Tower / Block / Floor / Work Area.

↓

Enters contractor or issued-to details if required.

↓

Confirms Issue.

↓

Stock is reduced.

↓

Transaction is recorded.

## 31.3 Material Return Workflow

Store Manager opens Return.

↓

Selects material.

↓

Enters quantity.

↓

Selects returned-from location.

↓

Selects condition.

↓

Confirms Return.

↓

Reusable stock is increased.

↓

Damaged / Scrap quantities are recorded separately.

## 31.4 Stock Verification Workflow

Store Manager opens Stock Verification.

↓

Selects material.

↓

Views system quantity.

↓

Enters physical quantity.

↓

System calculates difference.

↓

Submits discrepancy.

↓

Project Admin reviews.

↓

Approves or rejects adjustment.

↓

Approved adjustment updates stock ledger.

---

# 32. FINAL PRODUCT EXPERIENCE

## Project Admin

Login → Dashboard → Manage Materials → Monitor Inventory → Review Transactions → Manage Users → Reports → Settings.

## Store Manager

Login → Dashboard → Material In / Material Out / Return / Current Stock.

## Signature AI Experience

**SCAN → UNDERSTAND → EXTRACT → MATCH → REVIEW → CONFIRM → UPDATE STOCK**

The Store Manager should never need to understand OCR, AI models, database matching, material codes or inventory calculations.

The software should handle those complexities internally.

---

# 33. FINAL PRODUCT PRINCIPLE

KAVACH should not feel like traditional ERP software.

It should feel like a simple assistant for construction store operations.

AI should remove repetitive work.

The backend should guarantee inventory correctness.

The Store Manager should handle only real-world decisions and physical verification.

The Project Admin should maintain control and visibility without getting involved in every daily transaction.

**KAVACH – AI-POWERED CONSTRUCTION INVENTORY MANAGEMENT**

**Less Manual Work. Smarter Inventory. Complete Control.**

**"Don't make the store manager manage software. Make the software manage the inventory for the store manager."**