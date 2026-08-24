# Saenz Media Co. — Invoice Page (plain HTML/CSS/JS)

Drop-in invoice page for your existing site. No build step — just
copy these files into your site and link to it.

## Files

- `invoice.html` — the page
- `invoice.css` — styling
- `invoice.js` — all the logic (fields, totals, save/load)
- `assets/saenz-logo.png` — your logo

## How to add it to your site

1. Copy the whole folder into your site's project, e.g. as an
   `invoices/` subfolder so it lives at `yoursite.com/invoices/`.
2. Make sure the `assets/saenz-logo.png` path still points to your
   logo (adjust the `src` in `invoice.html` if your site's file
   structure is different).
3. Push/upload like you would any other page. That's it — no npm,
   no build.

The page is set to `noindex, nofollow`, so it won't show up in
search results — but it's not password-protected, so anyone with
the direct link can open it. If that's a concern later, the fix is
server-side authentication (e.g. a host with built-in password
protection, or a small backend) — worth revisiting if it becomes
one.

## Filling out and sending an invoice

1. Open `invoice.html`, fill in the client info and line items —
   totals calculate automatically.
2. Click **Print / Save PDF**. In the print dialog, choose
   "Save as PDF" (or "Microsoft Print to PDF" on Windows) as the
   destination instead of a physical printer.
3. Save the PDF, then attach it to an email or message to send to
   the client.

## Saved invoices

Saved invoices live in the browser's local storage — tied to
whichever device/browser you use to open the page. There's no cloud
backup, and clearing browser data clears them too.

## Customizing

- Colors and fonts: edit the top of `invoice.css`.
- Default "from" info, notes text: edit `freshInvoice()` near the
  top of `invoice.js`.
- Logo: swap `assets/saenz-logo.png`.

