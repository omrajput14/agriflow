# AgriFlow: Design System & Screen UX Specifications

This document defines the visual design system, dashboard metrics, and screen-by-screen user experience specifications.

---

## 1. Enterprise UI/UX Design System

AgriFlow's UI matches the high information density, structural layout, and high-readability patterns of systems like **Flexport**, **Stripe Admin**, and **Linear**. It is a utility-first, data-dense interface designed for rapid operations.

### Visual Identity (CSS Tokens)
```css
:root {
  /* Brand Palette */
  --color-primary: #1F5E3B;        /* Forest Green (Brand / Core Action) */
  --color-secondary: #7A5C3E;      /* Earth Brown (Natural Elements / Soil / Auxiliary) */
  --color-accent: #1E5EFF;         /* Export Blue (Logistics / Shipping / Digital Actions) */

  /* Neutral Slate Palette (High Readability) */
  --color-bg-base: #F8FAFC;        /* Light Grey Background */
  --color-bg-card: #FFFFFF;        /* Pure White Card Background */
  --color-border: #E2E8F0;         /* Slate Borders */
  --color-text-main: #0F172A;      /* Slate-900 Core Text */
  --color-text-muted: #64748B;     /* Slate-500 Muted Text */

  /* Semantic Alerts */
  --color-success-bg: #ECFDF5;     --color-success-text: #065F46; --color-success-border: #A7F3D0;
  --color-warning-bg: #FFFBEB;     --color-warning-text: #92400E; --color-warning-border: #FDE68A;
  --color-danger-bg: #FEF2F2;      --color-danger-text: #991B1B; --color-danger-border: #FCA5A5;
  --color-info-bg: #EFF6FF;        --color-info-text: #1E40AF;   --color-info-border: #BFDBFE;

  /* Spacing Grid (4px Base) */
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radii (Minimal and professional) */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}
```

### Typography Scale
* **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, sans-serif.
* **Heading 1**: `24px` | Line-height: `32px` | Weight: `600 (Semi-bold)` (Page Titles)
* **Heading 2**: `18px` | Line-height: `24px` | Weight: `600 (Semi-bold)` (Section Headers)
* **Heading 3**: `14px` | Line-height: `20px` | Weight: `600 (Semi-bold)` (Subsections, Table Headers)
* **Body Text**: `13px` | Line-height: `18px` | Weight: `400 (Regular)` (Default readable density)
* **Muted/Caption**: `11px` | Line-height: `14px` | Weight: `500 (Medium)` (Metas, Timestamps, Labels)

### Component Specifications

```
+--------------------------------------------------------------------------------------------+
|                                  TYPICAL TABLE ROWS DENSITY                                |
+--------------------------------------------------------------------------------------------+
| [ ] LOT-BAN-001  | Wade Banana Farm | 12.5 Tons | Graded: A | 17 Jun 2026 | [Edit] [View]  |
|--------------------------------------------------------------------------------------------|
| [ ] LOT-BAN-002  | Wade Banana Farm |  8.2 Tons | Graded: B | 16 Jun 2026 | [Edit] [View]  |
+--------------------------------------------------------------------------------------------+
```

* **Tables**: Fixed headers, horizontal borders only, hover states (`background-color: var(--color-bg-base)`), right-aligned numbers, monospaced ID tokens. Row padding: `8px` vertical, `12px` horizontal.
* **Buttons**:
  * *Primary*: Solid Forest Green (`#1F5E3B`), white text. Focus rings, active presses down 1px.
  * *Secondary*: Border Slate (`#E2E8F0`), bg White, text Slate-900.
  * *Destructive*: Solid Red (`#991B1B`), white text.
* **Form Inputs**: Slate-200 border, base font (13px), focus outline is Export Blue (`#1E5EFF`). Zero padding margin gaps, strict labels stacked vertically above inputs.
* **Badges**: Rounded (`--radius-sm`), text transform `uppercase`, font size `10px`, bold. Dynamic color mapping using semantic alert tokens (e.g., Grade A = Success, Grade C = Warning, Rejected = Danger).

---

## 2. Dashboard Design: Executive Command Center

The AgriFlow dashboard is designed as a modular 4-column cockpit.

### Dashboard Layout Wireframe
```
+-------------------------------------------------------------------------------------+
| SEARCH BAR & ORGANIZATION SELECTOR (Global Search across Shipments, Lots, Docs)     |
+-------------------------------------------------------------------------------------+
| [ KPI card: Active Farms ] [ KPI card: Storage Util ] [ KPI card: Revenue (Margin)] |
+----------------------+--------------------------------------------------------------+
| ACTIVE HARVEST LIST  | LOGISTICS MAP & TEMPERATURE GRAPH                            |
| LOT-BAN-WAD: 12 Tons | [Interactive Port/Truck positions, real-time lines]          |
| LOT-GRA-PUN:  8 Tons | Temp Sensor status: ALERT (1.8°C vs 1.2°C target)            |
+----------------------+--------------------------------------------------------------+
| SHIPMENTS PIPELINE   | FINANCIAL MARGIN PER CROP                                    |
| [Planned -> Loaded -> At Port -> Transit -> Delivered]                              |
+-------------------------------------------------------------------------------------+
```

### KPI Widget Catalog

| Widget Name | Purpose | Chart Type | Data Source | User Interaction |
| :--- | :--- | :--- | :--- | :--- |
| **Active Farms** | View ongoing crop cycles and areas under management. | Metric Badge | `farms` / `crop_cycles` count. | Click triggers redirect to Farm List with "Active" filter. |
| **Harvest Vol vs Forecast**| Track harvest outputs against targets to measure yield variance. | Grouped Bar Chart | `harvests` vs. `farms.expected_yield`. | Hover shows exact variances in tons; click reveals Lot details. |
| **Cold Storage Util** | Gauge available capacity across packhouses. | Radial Progress Bar | `cold_storage_records` sum capacity vs occupied spaces. | Click redirects to Cold Storage Facility Rack Map. |
| **Active Shipment Pipeline**| Monitor stages of all international shipments in transit. | Kanban Stage Pipeline | `shipments` status records. | Click container ID opens live vessel tracking modal. |
| **Financial Margin %** | Track net margins after operational costs. | Line Chart (Monthly) | `revenue_records` less packaging, freight, and harvest costs. | Toggle between Gross Revenue, Costs, and Net Margins. |
| **Quality Score Trends** | Track packing house sorting quality metrics. | Area Chart | `quality_reports` score trends over time. | Filter by Crop Type (Bananas, Mangoes, Grapes). |

---

## 3. Screen-by-Screen UX Specifications

Below are the UX specifications for all 18 major screens.

### Common Guidelines for All Screens
* **A11y**: Color contrast ratio minimum of `4.5:1` for body text. All forms are keyboard navigatable (`tabindex`). Every image asset has descriptive `alt` tags. Interactive rows contain ARIA role labels (`role="button"`).
* **Loading States**: Skeleton line grids mirroring the actual tables/forms. Avoid layout shifts.
* **Empty States**: Minimalist typography card. Icon, brief action sentence (e.g., *"No active shipments found"*), and a clear secondary button to create/add record.
* **Error States**: Inline banners using red semantic tokens (`--color-danger-bg`), explaining exactly what failed (e.g., *"Database connection timed out"* or *"Phytosanitary certificate expired"*).

---

### Module 1: Farm Management Screens

#### Screen 1.1: Farm List Page
* **Purpose**: Overview of all agricultural assets, crop types under cultivation, and active area coverage.
* **Layout**: Multi-column data grid. Left pane: list. Right pane: interactive GIS mini-map showing farm locations.
* **Components**: Filter dropdowns (Crop Type, Status, Region), Search Input, "New Farm" Action Button, Data Table, Map canvas.
* **User Actions**:
  * Filter list by crop type.
  * Click table row to open Farm Details.
  * Search by farm name or owner.
* **Validation**: None (Read-only list view).

#### Screen 1.2: Create Farm Screen
* **Purpose**: Add a new farm block to the platform.
* **Layout**: Standard 2-column input layout. Left: General attributes. Right: GeoJSON polygon drawer or map pin placement.
* **Components**: Name Input, Owner Selector, Crop Selector, Area Input (Acres), Expected Yield Input (Tons), Harvest Date Picker, Map Area boundary tool, Submit Button.
* **User Actions**:
  * Enter name, select crop, input acreage.
  * Click map to draw farm boundaries.
  * Submit details.
* **Validation**:
  * Name cannot be blank.
  * Expected yield must be > 0.
  * Expected harvest date must be in the future.
  * Area must be a positive integer.

#### Screen 1.3: Farm Details Screen
* **Purpose**: Complete historical view of a single farm block, including soil history, ongoing crop cycles, and past harvests.
* **Layout**: Tabbed card dashboard layout. Tabs: Overview, Crop Cycles, Harvest History, IoT Sensors.
* **Components**: Metadata fields grid, active crop status gauge, past harvest logs table, inline action to schedule harvest.
* **User Actions**:
  * Edit farm metadata details.
  * Toggle tab views.
  * Export historical harvests list to CSV.
* **Validation**: Standard input validation rules apply on edit mode.

---

### Module 2: Crop Inventory Screens

#### Screen 2.1: Inventory Dashboard
* **Purpose**: Real-time allocation grid tracking total crops harvested, volumes reserved for orders, and available export inventory.
* **Layout**: Standard inventory ledger table with key metric cards at the header.
* **Components**: Summary Cards (Total Available, Total Reserved, Total Exported), Inventory ledger grid, Search box.
* **User Actions**:
  * Search inventory by Lot ID or Crop.
  * Click allocation button to lock quantity to an order.
* **Validation**: Reserved quantity cannot exceed total available quantity for any lot.

#### Screen 2.2: Inventory Allocation Drawer
* **Purpose**: Bind an available harvest lot to a specific buyer's purchase order.
* **Layout**: Sliding side panel (drawer) over the inventory dashboard.
* **Components**: Order list selector, allocation weight input, remaining margin calculation preview, Save button.
* **User Actions**:
  * Select buyer order from dropdown.
  * Enter allocation weight.
  * Confirm booking.
* **Validation**: Weight input must be <= remaining unallocated weight of the selected lot.

---

### Module 3: Harvest Screens

#### Screen 3.1: Harvest List Page
* **Purpose**: Unified list of all logged harvest events, tracking lot numbers and yields.
* **Layout**: Flat data grid with crop-specific categorization tabs.
* **Components**: Harvest ledger table, CSV Export button, "Log Harvest" button, search bar.
* **User Actions**:
  * Select table row to view quality grading details.
  * Export records to Excel.
* **Validation**: Read-only.

#### Screen 3.2: Harvest Scheduling Page
* **Purpose**: Calendar-based tool for scheduling logistics and packhouse teams against anticipated crop harvest dates.
* **Layout**: Interactive Monthly/Weekly Calendar View.
* **Components**: Drag-and-drop calendar cards, scheduling modal drawer, labor team assignment list.
* **User Actions**:
  * Click calendar date to schedule harvest event.
  * Drag scheduled cards to alter date.
* **Validation**: Scheduled date cannot be in the past.

#### Screen 3.3: Harvest Tracking Screen
* **Purpose**: Live dashboard for operational managers monitoring weighing scales and lot generation at the packhouse gate.
* **Layout**: Progress bar grid displaying actual vs. predicted harvest weight dynamically.
* **Components**: Lot card grid, live weighing-scale indicator, lot status badges (Pending inspection, graded).
* **User Actions**:
  * Force close harvest session.
  * Assign lot numbers to incoming crates.
* **Validation**: Lot ID must follow schema rules: `LOT-{CROP}-{FARM_PREFIX}-{YEAR}-{INDEX}`.

---

### Module 4: Quality Screens

#### Screen 4.1: Quality Inspection Dashboard
* **Purpose**: Pipeline board showing lots awaiting quality validation, ongoing inspections, and grading trends.
* **Layout**: Kanban pipeline view columns: `Awaiting Inspection`, `Grading Progress`, `Approved (Grade A/B/C)`, `Rejected`.
* **Components**: Inspection cards, filter dashboard, "Inspect Lot" button.
* **User Actions**:
  * Drag and drop lots between inspection stages (requires permission credentials).
  * Double-click card to open inspection form.
* **Validation**: Standard RBAC restrictions.

#### Screen 4.2: Batch Grading Form
* **Purpose**: Input formal parameters of quality check to calculate final grade and generate report.
* **Layout**: split screen. Left: Grading fields inputs. Right: Reference image comparisons and compliance checklist.
* **Components**: Weight deviation form, size diameter slider, defect percentage input, color target selector, Grade assignment toggle, Inspector signature capture.
* **User Actions**:
  * Enter physical check parameters.
  * Confirm grade score calculation.
  * Attach phytosanitary status.
* **Validation**: All numeric parameters must be within logical bounds (Defects 0% to 100%).

---

### Module 5: Packaging Screens

#### Screen 5.1: Packaging Orders Grid
* **Purpose**: Manage packing operations, converting raw graded crops into consumer-ready export boxes.
* **Layout**: Two-column layout: Left pane for packaging queue; right pane displays box materials stock levels.
* **Components**: Queue list cards, carton inventories, material alert warnings (e.g., low stock for 5kg crates).
* **User Actions**:
  * Create Packaging Batch from Quality Graded Lot.
  * Select carton material type (Corrugated, Wooden crate, mesh bags).
* **Validation**: Raw lot weight must exceed target packaged weight + allowed box packing waste margin.

#### Screen 5.2: Batch Management Details
* **Purpose**: Complete tracking details of a single packaged batch, listing serial numbers for boxes and label records.
* **Layout**: Vertical timeline style displaying packaging inputs, target container allocation, and export readiness.
* **Components**: Batch barcode preview, carton count indicators, packing team logs list, status update toggle.
* **User Actions**:
  * Print batch barcode sheets.
  * Mark batch as "Export Ready".
* **Validation**: Batch status cannot change to "Export Ready" without linked approved quality report ID.

---

### Module 6: Storage Screens

#### Screen 6.1: Storage Overview Page
* **Purpose**: Layout layout mapping cold storage rooms, temperature logs, and capacity thresholds.
* **Layout**: 2D Grid map showing floor layouts of Cold Storage rooms, overlaying live temperature/humidity readouts.
* **Components**: Color-coded storage layout grid (Red/Green by occupancy), live temperature readout labels, threshold configuration drawer.
* **User Actions**:
  * Click cold room sector to view stored batches.
  * Adjust room temperature target parameters.
* **Validation**: Target temperature ranges must match the crop type storage guidelines (e.g., Bananas: 13-14°C, Grapes: 0-1°C).

#### Screen 6.2: Storage Facility Details
* **Purpose**: Time-series log dashboard for a single storage unit, monitoring humidity, telemetry, and expiry risks.
* **Layout**: Split pane. Top: Real-time telemetry charts. Bottom: Ledger table listing currently stored batches.
* **Components**: Live temperature/humidity line graphs, batch shelf life table, alert log feed.
* **User Actions**:
  * Export historical temperature logs to Excel.
  * Relocate batch to different rack number.
* **Validation**: Rack reallocation must not exceed target rack load capacity.

---

### Module 7: Logistics Screens

#### Screen 7.1: Route Planning Dashboard
* **Purpose**: Assign vehicles and drivers to move packaged goods from storage facilities to port terminals.
* **Layout**: Live Map pane showing optimal logistics routes vs active driver GPS paths.
* **Components**: Route map canvas, active vehicles list, dispatch form.
* **User Actions**:
  * Input vehicle details, driver phone, load weight.
  * Generate digital gate pass.
* **Validation**: Assigned container weight must not exceed legal vehicle payload capacity limit.

#### Screen 7.2: Vehicle Tracking Screen
* **Purpose**: Live track a dispatched logistics run, monitoring ETA and linked transit sensors.
* **Layout**: Split screen. Left: telemetry dashboard (temperature inside truck container). Right: tracking map.
* **Components**: GPS coordinate lines tracker, speed graph, container temp log feed.
* **User Actions**:
  * Ping driver.
  * Trigger emergency reroute or cold chain break alert.
* **Validation**: Live alerts are triggered automatically via backend background scripts.

---

### Module 8: Shipment Screens

#### Screen 8.1: Shipment Pipeline Board
* **Purpose**: Unified overview tracking containers from loading to ocean transit and final buyer arrival.
* **Layout**: Progress tracker timeline columns: `Planned`, `Ready to Load`, `At Port`, `Ocean Transit`, `Delivered`.
* **Components**: Kanban cards containing shipping details (Vessel name, container ID, ETA, buyer country), filter parameters.
* **User Actions**:
  * Drag shipment card to advance status.
  * Filter by country of destination.
* **Validation**: Cannot drag card to "Ocean Transit" unless Bill of Lading (BL) document has been uploaded.

#### Screen 8.2: Shipment Details Screen
* **Purpose**: Single source of truth containing logs, documents, transit temperature lines, customs approvals, and container milestones.
* **Layout**: Left pane: shipment summary, timestamps, and tracking timeline. Right pane: digital Document Vault.
* **Components**: Milestone checklist grid, live port tracker map, file upload dropzone, export margin preview panel.
* **User Actions**:
  * Upload Phytosanitary certificate or BL.
  * Trigger manual status override.
* **Validation**: Document uploads are validated for file format (PDF only) and maximum file size (15MB).

---

### Module 9: Export Document Screens

#### Screen 9.1: Document Vault Repository
* **Purpose**: Store, view, and organize legal certificates, custom clearing drafts, and commercial paperwork.
* **Layout**: Dense list layout with status flags and filtering dropdowns by Document Type.
* **Components**: Flat file list table, filters (Status: Draft/Approved/Expired, Type), upload button.
* **User Actions**:
  * Download documents.
  * Search documents by Shipment Number or Buyer.
* **Validation**: Read-only listing dashboard.

#### Screen 9.2: Approval Workflow Screen
* **Purpose**: Document lifecycle verification panel for exporters to approve generated drafts.
* **Layout**: Split comparison pane. Left: PDF preview window. Right: Approval actions panel and reviewer chat logs.
* **Components**: Interactive PDF renderer, "Approve" button, "Reject & Redraft" action, comments feed.
* **User Actions**:
  * Review invoice/packing list side-by-side.
  * Add approval signatures or return to draft.
* **Validation**: Rejections require comments field to be populated before submission.

---

### Module 10: Buyer Screens

#### Screen 10.1: Buyer Directory
* **Purpose**: Directory of global buying houses, contacts, and outstanding payment amounts.
* **Layout**: Table layout listing accounts.
* **Components**: Contact card profiles, filters, revenue ranking columns, new buyer button.
* **User Actions**:
  * Add buyer company details and payment terms (e.g., Net 30, Letter of Credit).
* **Validation**: Buyer email must be formatted correctly.

#### Screen 10.2: Buyer Profile Dashboard
* **Purpose**: Profile view summarizing buyer purchases, preference matrices, and credit line usage.
* **Layout**: Card grid layout showing lifetime value (LTV), active shipments, preferred crops, and historical payments.
* **Components**: Metric displays, active order pipeline, outstanding invoice charts.
* **User Actions**:
  * Edit payment terms.
  * Issue credit line limits adjustment.
* **Validation**: Credit lines cannot exceed $500,000 without admin override approvals.

---

### Module 11: Revenue Analytics Screen

#### Screen 11.1: Financial Dashboard
* **Purpose**: Track export costs against order revenues to monitor profitability.
* **Layout**: Financial balance sheet reporting layout.
* **Components**: Profit & Loss ledger table, Crop margin breakdown chart, logistics cost ratio analysis.
* **User Actions**:
  * Filter reports by Date Range, Crop Type, and Destination Country.
  * Export financial logs to Excel.
* **Validation**: Date filters must specify start dates prior to end dates.

---

### Module 12: Notification Screens

#### Screen 12.1: Notification Center Page
* **Purpose**: Centralized dashboard of operational warnings, critical temperature breaks, and workflow approvals.
* **Layout**: Split page. Left: Priority logs categorization tabs. Right: Detailed alert notification view with actions.
* **Components**: Message ledger list, "Mark all as read" button, action redirect buttons (e.g., Click alert opens Shipment detail).
* **User Actions**:
  * Categorize alert list (System warnings, Document expiries, IoT alerts).
* **Validation**: None.

---

### Module 13: Settings Screens

#### Screen 13.1: User Management Panel
* **Purpose**: Administrator portal to add users, change roles, and assign farms.
* **Layout**: Simple master-detail split list page.
* **Components**: User list table, edit user form overlay, invite user button.
* **User Actions**:
  * Invite user via email.
  * Adjust user role assignments (Farmer, Ops, Exporter).
* **Validation**: Email must be unique.

#### Screen 13.2: Permissions Matrix Panel
* **Purpose**: Interface for administrators to customize granular feature accesses.
* **Layout**: Grid matrix displaying roles as columns and application features as rows with permission checkboxes.
* **Components**: Active grid checkboxes table, save settings button.
* **User Actions**:
  * Adjust privileges parameters.
* **Validation**: Admin role privileges cannot be downgraded.

#### Screen 13.3: Organization Settings Panel
* **Purpose**: Organization portal to upload company logos, select currency defaults, and configure API integrations.
* **Layout**: Form card layout tabs.
* **Components**: Logo upload block, currency dropdown selector, API keys input form, integrations checklist.
* **User Actions**:
  * Upload company assets.
  * Setup Razorpay/Stripe details.
* **Validation**: File size for logo must not exceed 2MB.

---

Proceed to the technical architecture definitions: **[04. Technical Architecture & Database Design](file:///Users/0mrajput/Desktop/hoilday projects /AgriFlow/04_technical_architecture.md)**.
