# -*- coding: utf-8 -*-
{
    "name": "Collapse Expand Section Lines | Collapse Expand Section on One2many Fields ",
    "version": "18.0.1.0.0",
    "category": "Productivity",
    "summary": "Collapse or expand order lines under section lines in Sales Orders, Invoices, Bills and Purchase Orders, with item count per section.",
    "description": """
Collapse Expand Section Lines
=============================

By default, Odoo allows you to add section lines in the Sales Order,
Invoice, Bill, and Purchase Order modules.

With this app, you can collapse or expand the lines under a section line,
and display the number of items under it.

* Collapse or expand order lines under a section line with one click
* Shows the number of items under each section
* Remembers the collapsed/expanded state within the session
* Makes it easier to review long orders or move order lines between sections
* Works on Sales Orders, Invoices, Bills and Purchase Orders
    """,
    "author": "Steven Marp",
    "website": "https://apps.odoo.com/apps/modules/browse?author=Steven Marp",
    "license": "OPL-1",
    "images": [
        "static/description/banner.gif",
        "static/description/icon.png",
    ],
    "depends": ["account"],
    "assets": {
        "web.assets_backend": [
            "sm_section_collapse/static/src/**/*",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "price": 89.00,
    "currency": "USD",
}
