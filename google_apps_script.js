/**
 * ============================================================================
 * YU PURE OXYGEN — GOOGLE APPS SCRIPT LEAD CAPTURE WEBHOOK (BULLETPROOF V2)
 * ============================================================================
 */
const SPREADSHEET_ID = '1Zue-Hmuj-VIRy3mupMD1SYyuRQxu-LVZIq4ipoQL_RI';
const SECRET = 'put-a-long-random-string-here';

// Helper to append a lead row into any target sheet tab
function appendLeadToSheet(sh, d) {
  if (!sh) return;
  if (!sh.getLastRow()) {
    sh.appendRow(['Time', 'Name', 'Email', 'Phone', 'Country', 'City', 'Cans', 'Moment', 'Persona', 'Consent', 'Page', 'UTM']);
    sh.setFrozenRows(1);
    try {
      sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#f1f5f9');
    } catch(e) {}
  }
  const c = v => {
    v = String(v || '').slice(0, 200);
    return /^[=+\-@]/.test(v) ? "'" + v : v; // Formula injection defense
  };
  sh.appendRow([
    new Date(),
    c(d.name || d['f-name']),
    c(d.email || d['f-email']),
    "'" + String(d.phone || d['f-phone'] || '').slice(0, 20),
    c(d.country || d['f-country'] || 'India'),
    c(d.city || d['f-city']),
    c(d.cans || d.quantity || d['f-quantity']),
    c(d.moment || d.mom),
    c(d.persona || 'general'),
    d.consent === false ? 'no' : 'yes',
    c(d.page || '/'),
    c(d.utm || '')
  ]);
}

// GET request: diagnostics and direct link to the Leads tab
function doGet(e) {
  try {
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    const shLeads = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    const data = shLeads.getDataRange().getValues();
    const gid = shLeads.getSheetId();
    return out({
      status: 'connected',
      spreadsheetName: ss.getName(),
      leadsTabGid: gid,
      directLeadsUrl: ss.getUrl() + '#gid=' + gid,
      totalLeads: Math.max(0, data.length - 1),
      recentRows: data.slice(-5)
    });
  } catch (err) {
    return out({ status: 'error', error: err.toString() });
  }
}

// POST request: receive lead from website form
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let d = {};
    // Support both JSON body and standard form urlencoded / multipart
    if (e && e.postData && e.postData.contents) {
      try {
        d = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        d = e.parameter || {};
      }
    } else if (e && e.parameter) {
      d = e.parameter;
    }

    // Verify secret if provided
    if (d.secret && d.secret !== SECRET) {
      return out({ ok: false, error: 'invalid secret' });
    }

    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    // 1. Write to "Leads" tab
    const shLeads = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    appendLeadToSheet(shLeads, d);

    // 2. ALSO write to the very first tab (e.g. Sheet1) so it is visible no matter which tab is active!
    const firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getName() !== shLeads.getName()) {
      appendLeadToSheet(firstSheet, d);
    }

    return out({ ok: true, saved: true });
  } catch(err) {
    return out({ ok: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
