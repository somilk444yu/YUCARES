/**
 * ============================================================================
 * YU PURE OXYGEN — GOOGLE APPS SCRIPT LEAD CAPTURE WEBHOOK
 * ============================================================================
 */
const SPREADSHEET_ID = '1Zue-Hmuj-VIRy3mupMD1SYyuRQxu-LVZIq4ipoQL_RI';
const SECRET = 'put-a-long-random-string-here';

// GET request: verify sheet connection in any browser
function doGet(e) {
  try {
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    const sh = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    const data = sh.getDataRange().getValues();
    return out({
      status: 'connected',
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      tabName: sh.getName(),
      totalLeads: Math.max(0, data.length - 1),
      rows: data
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
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out({ ok: false }); // wrong key
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    const sh = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    if (!sh.getLastRow()) {
      sh.appendRow(['Time', 'Name', 'Email', 'Phone', 'Country', 'City', 'Cans', 'Moment', 'Persona', 'Consent', 'Page', 'UTM']);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#f1f5f9');
    }
    const c = v => {
      v = String(v || '').slice(0, 200);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    sh.appendRow([
      new Date(),
      c(d.name),
      c(d.email),
      "'" + String(d.phone || '').slice(0, 20),
      c(d.country),
      c(d.city),
      c(d.cans),
      c(d.moment),
      c(d.persona),
      d.consent ? 'yes' : 'no',
      c(d.page),
      c(d.utm)
    ]);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
