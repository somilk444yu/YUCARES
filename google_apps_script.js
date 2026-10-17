/**
 * ============================================================================
 * YU PURE OXYGEN — GOOGLE APPS SCRIPT LEAD CAPTURE WEBHOOK
 * ============================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open Google Sheets (create a new spreadsheet or open your existing leads sheet).
 * 2. In top menu, click: Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs and paste this entire file.
 * 4. Verify that SECRET matches GOOGLE_SHEET_SECRET in index.html ('yu-o2-leads-secure-7f89b2c4e1a0').
 * 5. Click the blue 'Deploy' button at top right -> 'New deployment'.
 * 6. Under 'Select type', choose: 'Web app'.
 * 7. Set configuration:
 *      - Description: YU Leads Webhook
 *      - Execute as: Me (your email)
 *      - Who has access: Anyone (IMPORTANT: must be Anyone so visitors can submit)
 * 8. Click 'Deploy', authorize permissions with your Google account.
 * 9. Copy the generated 'Web app URL' (looks like https://script.google.com/macros/s/.../exec).
 * 10. Paste this URL into GOOGLE_SHEET_ENDPOINT in index.html (and preview.html).
 * ============================================================================
 */

const SPREADSHEET_ID = '1Zue-Hmuj-VIRy3mupMD1SYyuRQxu-LVZIq4ipoQL_RI';
const SECRET = 'put-a-long-random-string-here';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET || d.website) return out({ ok: false }); // wrong key or bot honeypot tripped
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    const sh = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    if (!sh.getLastRow()) {
      sh.appendRow(['Time', 'Name', 'Email', 'Phone', 'Country', 'City', 'Cans', 'Moment', 'Persona', 'Consent', 'Page', 'UTM']);
      // Freeze header row and make bold
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#f1f5f9');
    }
    const c = v => {
      v = String(v || '').slice(0, 200);
      return /^[=+\-@]/.test(v) ? "'" + v : v; // Formula injection defense
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
