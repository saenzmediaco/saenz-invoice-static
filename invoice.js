/* ============================================================
   INVOICE APP
   ============================================================ */
function initApp() {
  const uid = () => Math.random().toString(36).slice(2, 10);
  const today = () => new Date().toISOString().slice(0, 10);
  const plus30 = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  };
  const money = (n) =>
    (isNaN(n) ? 0 : n).toLocaleString("en-US", { style: "currency", currency: "USD" });

  const blankItem = () => ({ id: uid(), desc: "", qty: 1, rate: 0 });

  function freshInvoice() {
    return {
      number: "0001",
      dateIssued: today(),
      dateDue: plus30(),
      status: "Unpaid",
      from: {
        name: "Saenz Media Co.",
        address: "Frederick, Maryland",
        email: "hello@saenzmedia.co",
        phone: "",
      },
      billTo: { name: "", address: "", email: "" },
      items: [blankItem()],
      taxPct: 0,
      notes:
        "Thank you for booking with Saenz Media Co. Payment due within 30 days. Final edited files delivered upon receipt of payment.",
    };
  }

  let invoice = freshInvoice();

  // ---- DOM refs ----
  const $ = (id) => document.getElementById(id);
  const el = {
    fromName: $("fromName"), fromAddress: $("fromAddress"), fromEmail: $("fromEmail"), fromPhone: $("fromPhone"),
    invNumber: $("invNumber"), invIssued: $("invIssued"), invDue: $("invDue"), invStatus: $("invStatus"),
    billName: $("billName"), billAddress: $("billAddress"), billEmail: $("billEmail"),
    itemsBody: $("itemsBody"), taxPct: $("taxPct"),
    subtotalOut: $("subtotalOut"), taxOut: $("taxOut"), totalOut: $("totalOut"),
    notes: $("notes"), status: $("status"),
  };

  // ---- Render ----
  function renderFields() {
    el.fromName.value = invoice.from.name;
    el.fromAddress.value = invoice.from.address;
    el.fromEmail.value = invoice.from.email;
    el.fromPhone.value = invoice.from.phone;
    el.invNumber.value = invoice.number;
    el.invIssued.value = invoice.dateIssued;
    el.invDue.value = invoice.dateDue;
    el.invStatus.value = invoice.status;
    applyStatusColor();
    el.billName.value = invoice.billTo.name;
    el.billAddress.value = invoice.billTo.address;
    el.billEmail.value = invoice.billTo.email;
    el.taxPct.value = invoice.taxPct;
    el.notes.value = invoice.notes;
    renderItems();
    renderTotals();
  }

  function applyStatusColor() {
    if (invoice.status === "Paid") {
      el.invStatus.style.background = "#F1FFD1";
      el.invStatus.style.color = "#082A18";
    } else {
      el.invStatus.style.background = "#EDE7D8";
      el.invStatus.style.color = "#082A18";
    }
  }

  function renderItems() {
    el.itemsBody.innerHTML = "";
    invoice.items.forEach((it, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="row-num" data-label="#">${String(i + 1).padStart(2, "0")}</td>
        <td data-label="Description"><input class="field field-desc" placeholder="Family session, headshots, wedding video…" value="${escapeAttr(it.desc)}" data-id="${it.id}" data-field="desc" /></td>
        <td data-label="Qty"><input type="number" class="field field-qty" value="${it.qty}" data-id="${it.id}" data-field="qty" /></td>
        <td data-label="Rate"><input type="number" class="field field-rate" value="${it.rate}" data-id="${it.id}" data-field="rate" /></td>
        <td class="row-amount" data-label="Amount">${money((it.qty || 0) * (it.rate || 0))}</td>
        <td class="no-print"><button class="del-btn" data-del="${it.id}">✕</button></td>
      `;
      el.itemsBody.appendChild(tr);
    });

    el.itemsBody.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const { id, field } = e.target.dataset;
        const item = invoice.items.find((it) => it.id === id);
        item[field] = field === "desc" ? e.target.value : Number(e.target.value);
        renderTotals();
        // re-render just the amount cell without losing focus
        const row = e.target.closest("tr");
        row.querySelector(".row-amount").textContent = money((item.qty || 0) * (item.rate || 0));
      });
    });
    el.itemsBody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        invoice.items = invoice.items.filter((it) => it.id !== btn.dataset.del);
        renderItems();
        renderTotals();
      });
    });
  }

  function renderTotals() {
    const subtotal = invoice.items.reduce((s, it) => s + (it.qty || 0) * (it.rate || 0), 0);
    const taxAmt = subtotal * ((invoice.taxPct || 0) / 100);
    const total = subtotal + taxAmt;
    el.subtotalOut.textContent = money(subtotal);
    el.taxOut.textContent = money(taxAmt);
    el.totalOut.textContent = money(total);
  }

  function escapeAttr(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  // ---- Field bindings ----
  el.fromName.addEventListener("input", (e) => (invoice.from.name = e.target.value));
  el.fromAddress.addEventListener("input", (e) => (invoice.from.address = e.target.value));
  el.fromEmail.addEventListener("input", (e) => (invoice.from.email = e.target.value));
  el.fromPhone.addEventListener("input", (e) => (invoice.from.phone = e.target.value));
  el.invNumber.addEventListener("input", (e) => (invoice.number = e.target.value));
  el.invIssued.addEventListener("input", (e) => (invoice.dateIssued = e.target.value));
  el.invDue.addEventListener("input", (e) => (invoice.dateDue = e.target.value));
  el.invStatus.addEventListener("change", (e) => {
    invoice.status = e.target.value;
    applyStatusColor();
  });
  el.billName.addEventListener("input", (e) => (invoice.billTo.name = e.target.value));
  el.billAddress.addEventListener("input", (e) => (invoice.billTo.address = e.target.value));
  el.billEmail.addEventListener("input", (e) => (invoice.billTo.email = e.target.value));
  el.taxPct.addEventListener("input", (e) => {
    invoice.taxPct = Number(e.target.value);
    renderTotals();
  });
  el.notes.addEventListener("input", (e) => (invoice.notes = e.target.value));

  $("btnAddItem").addEventListener("click", () => {
    invoice.items.push(blankItem());
    renderItems();
    renderTotals();
  });

  // ---- Save / Load (localStorage) ----
  function showStatus(msg) {
    el.status.textContent = msg;
    setTimeout(() => (el.status.textContent = ""), 2500);
  }

  $("btnSave").addEventListener("click", () => {
    try {
      localStorage.setItem(`invoice:${invoice.number}`, JSON.stringify(invoice));
      showStatus(`Saved invoice #${invoice.number}`);
    } catch {
      showStatus("Save failed — try again");
    }
  });

  $("btnNew").addEventListener("click", () => {
    const nextNum = String(Number(invoice.number) + 1 || 1).padStart(4, "0");
    const from = invoice.from;
    invoice = freshInvoice();
    invoice.number = nextNum;
    invoice.from = from;
    renderFields();
  });

  $("btnPrint").addEventListener("click", () => window.print());

  const loadPanel = $("loadPanel");
  $("btnOpen").addEventListener("click", () => {
    loadPanel.classList.remove("hidden");
    renderSavedList();
  });
  $("btnCloseLoad").addEventListener("click", () => loadPanel.classList.add("hidden"));

  function renderSavedList() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("invoice:"));
    const list = $("savedList");
    list.innerHTML = "";
    if (keys.length === 0) {
      list.innerHTML = `<li class="saved-empty">No saved invoices yet.</li>`;
      return;
    }
    keys.forEach((key) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="load-link" data-load="${key}">${key.replace("invoice:", "Invoice #")}</button>
        <button class="del-link" data-remove="${key}">✕</button>
      `;
      list.appendChild(li);
    });
    list.querySelectorAll("[data-load]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const raw = localStorage.getItem(btn.dataset.load);
        if (raw) {
          invoice = JSON.parse(raw);
          renderFields();
          showStatus(`Loaded ${btn.dataset.load.replace("invoice:", "#")}`);
        }
        loadPanel.classList.add("hidden");
      })
    );
    list.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        localStorage.removeItem(btn.dataset.remove);
        renderSavedList();
      })
    );
  }

  renderFields();
}

initApp();
