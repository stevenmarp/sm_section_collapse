/** @odoo-module **/

import { useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { SectionAndNoteListRenderer } from "@account/components/section_and_note_fields_backend/section_and_note_fields_backend";

const STORAGE_PREFIX = "sm_section_collapse:";

patch(SectionAndNoteListRenderer.prototype, {
    setup() {
        super.setup();
        let stored = {};
        try {
            stored = JSON.parse(
                sessionStorage.getItem(STORAGE_PREFIX + this.props.list.resModel)
            ) || {};
        } catch {
            stored = {};
        }
        this.smCollapsed = useState(stored);
    },

    smIsSection(record) {
        return record.data.display_type === "line_section";
    },

    smSectionKey(record) {
        return String(record.resId || record.id);
    },

    // ponytail: O(n) walk per row, fine for order-line sized lists
    smParentSection(record) {
        let section = null;
        for (const rec of this.props.list.records) {
            if (rec === record) {
                return section;
            }
            if (this.smIsSection(rec)) {
                section = rec;
            }
        }
        return null;
    },

    smShowToggle(record, column) {
        return this.smIsSection(record) && column.name === this.titleField;
    },

    smIsCollapsed(record) {
        return Boolean(this.smCollapsed[this.smSectionKey(record)]);
    },

    smItemCountLabel(record) {
        const records = this.props.list.records;
        let count = 0;
        for (let i = records.indexOf(record) + 1; i < records.length; i++) {
            const displayType = records[i].data.display_type;
            if (displayType === "line_section") {
                break;
            }
            if (displayType !== "line_section" && displayType !== "line_note") {
                count++;
            }
        }
        return count === 1 ? _t("1 item") : _t("%s items", count);
    },

    smToggleLabel(record) {
        return this.smIsCollapsed(record) ? _t("Expand") : _t("Collapse");
    },

    smToggleSection(record) {
        const key = this.smSectionKey(record);
        if (this.smCollapsed[key]) {
            delete this.smCollapsed[key];
        } else {
            this.smCollapsed[key] = 1;
        }
        try {
            sessionStorage.setItem(
                STORAGE_PREFIX + this.props.list.resModel,
                JSON.stringify({ ...this.smCollapsed })
            );
        } catch {
            // storage unavailable: state still works for the current view
        }
    },

    getRowClass(record) {
        let classes = super.getRowClass(record);
        if (!this.smIsSection(record) && record !== this.editedRecord) {
            const section = this.smParentSection(record);
            if (section && this.smIsCollapsed(section)) {
                classes += " d-none";
            }
        }
        return classes;
    },
});
