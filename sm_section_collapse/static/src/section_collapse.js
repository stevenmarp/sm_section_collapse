odoo.define("sm_section_collapse.section_collapse", function (require) {
    "use strict";

    var SectionAndNoteListRenderer = require("account.section_and_note_backend");
    var translation = require("web.translation");
    var _t = translation._t;

    const STORAGE_PREFIX = "sm_section_collapse:";

    SectionAndNoteListRenderer.include({
        events: _.extend({}, SectionAndNoteListRenderer.prototype.events, {
            "click .o_sm_section_toggle": "_onSmToggleSection",
        }),

        init: function () {
            this._super.apply(this, arguments);
            this.smCollapsed = {};
            try {
                var stored = JSON.parse(
                    sessionStorage.getItem(STORAGE_PREFIX + this.state.model) || "{}"
                );
                this.smCollapsed = stored;
            } catch (e) {
                this.smCollapsed = {};
            }
        },

        _renderBodyCell: function (record, node, index, options) {
            var $cell = this._super.apply(this, arguments);
            var isSection = record.data.display_type === "line_section";
            if (isSection && node.attrs.name === "name") {
                var count = 0;
                var records = this.state.data;
                var idx = _.findIndex(records, function (r) {
                    return r.id === record.id;
                });
                if (idx !== -1) {
                    for (var i = idx + 1; i < records.length; i++) {
                        var displayType = records[i].data.display_type;
                        if (displayType === "line_section") {
                            break;
                        }
                        if (displayType !== "line_section" && displayType !== "line_note") {
                            count++;
                        }
                    }
                }
                var countLabel =
                    count === 1 ? _t("1 item") : _.str.sprintf(_t("%s items"), count);
                var isCollapsed = Boolean(this.smCollapsed[record.res_id || record.id]);
                var toggleLabel = isCollapsed ? _t("Expand") : _t("Collapse");

                var $toggle = $(
                    '<span class="o_sm_section_toggle float-right text-nowrap fw-normal" style="cursor: pointer; user-select: none;">' +
                        '<span class="text-muted mr-3">' +
                        countLabel +
                        "</span>" +
                        '<a href="#">' +
                        toggleLabel +
                        "</a>" +
                        "</span>"
                );

                $toggle.data("record-id", record.id);
                $cell.append($toggle);
            }
            return $cell;
        },

        _renderRow: function (record, index) {
            var $row = this._super.apply(this, arguments);
            var isSection = record.data.display_type === "line_section";
            if (!isSection) {
                var section = null;
                var records = this.state.data;
                var idx = _.findIndex(records, function (r) {
                    return r.id === record.id;
                });
                if (idx !== -1) {
                    for (var i = idx - 1; i >= 0; i--) {
                        if (records[i].data.display_type === "line_section") {
                            section = records[i];
                            break;
                        }
                    }
                }
                if (section && this.smCollapsed[section.res_id || section.id]) {
                    $row.addClass("d-none");
                }
            }
            return $row;
        },

        _onSmToggleSection: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var $toggle = $(ev.currentTarget);
            var recordId = $toggle.data("record-id");
            var records = this.state.data;
            var record = _.find(records, function (r) {
                return r.id === recordId;
            });
            if (record) {
                var key = record.res_id || record.id;
                var isCollapsed = !this.smCollapsed[key];
                if (isCollapsed) {
                    this.smCollapsed[key] = 1;
                } else {
                    delete this.smCollapsed[key];
                }
                try {
                    sessionStorage.setItem(
                        STORAGE_PREFIX + this.state.model,
                        JSON.stringify(this.smCollapsed)
                    );
                } catch (e) {}

                // Update UI
                $toggle.find("a").text(isCollapsed ? _t("Expand") : _t("Collapse"));

                // Toggle next rows in the DOM
                var $row = $toggle.closest("tr");
                var $next = $row.next();
                while ($next.length && !$next.hasClass("o_is_line_section")) {
                    $next.toggleClass("d-none", isCollapsed);
                    $next = $next.next();
                }
            }
        },
    });
});
