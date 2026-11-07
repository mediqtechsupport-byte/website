# AI ASSISTANT / AGENT STRICT RULES & LOCKED SECTIONS

## 🔒 PERMANENT LOCKS — ABSOLUTE PROHIBITION OF DELETION OR MODIFICATION

The following sections in `index.html` are **STRICTLY LOCKED** and CANNOT be edited, altered, replaced, modified, or deleted under ANY circumstances without explicit, written confirmation from the USER:

### 1. Home Section (`#hero`)
* **Reference Visual**: Eye with luminous cyan/blue spiral optics, "Advanced Intraocular Lens for a Clearer Tomorrow", "Explore Our Lenses", "View Brochure", and complete top navigation bar.
* **Master Backup**: `components/hero-locked-backup.html`
* **Integrity Requirement**: Must match baseline **100% character-for-character**. Zero tolerance for diffs.

### 2. About Section (`#about`)
* **Reference Visuals**:
  - **Slide 0 (Our Purpose)**: "Connecting Global Healthcare Innovation with the Philippines", Dotted Philippines Map with regional flight routes (Luzon, Visayas, Mindanao).
  - **Slide 1 (Who We Are)**: Architectural Blueprint cards with Vision, Mission, and Philippine Healthcare landscape.
  - **Slide 2 (What We Do)**: Core Capabilities Bento Grid architecture with interactive spotlight glows, metrics, and animated pillar icons.
  - **Slide 3 (Our Established Foundation)**: Rayner UK Exclusive Partnership, clinical accreditation, and national supply network.
  - **Slide 4 (Core Values)**: Deep navy glass cards detailing integrity, clinical excellence, patient-first philosophy.
* **Master Backup**: `components/about-locked-backup.html`
* **Integrity Requirement**: Must match baseline **100% character-for-character**. Zero tolerance for diffs.

---

## 🛡️ MANDATORY VERIFICATION BEFORE COMPLETING TURNS
Whenever making changes to `index.html` or workspace files, the assistant **MUST** run:
```bash
node scratch/verify_all_locks.js
```
Both sections must report `100% PASS`. If any discrepancy is detected, the agent **MUST immediately revert** to the protected master baselines in `components/`.
