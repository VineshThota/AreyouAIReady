/**
 * Are You AI Ready? — Google Sheets Apps Script
 *
 * Deploy as a Web App:
 *   Extensions → Apps Script → paste this code → Deploy → New deployment
 *   → Type: Web App → Execute as: Me → Who has access: Anyone → Deploy
 *   → Copy the Web App URL → paste into Vercel env: GOOGLE_SHEETS_WEBHOOK_URL
 *
 * Sheet columns (Row 1 = headers, data starts Row 2):
 *   A: Session ID
 *   B: Name
 *   C: Email
 *   D: Difficulty
 *   E: AI Profile
 *   F: Certificate ID
 *   G: Geography
 *   H: Started At
 *   I: Completed At
 *   J: LinkedIn Clicked
 *   K: Questions & Options
 *   L: Answers & Reveals
 */

var SHEET_NAME = 'Responses';

var COLUMNS = {
  sessionId:          1,   // A
  name:               2,   // B
  email:              3,   // C
  difficulty:         4,   // D
  aiProfile:          5,   // E
  certificateId:      6,   // F
  geography:          7,   // G
  startedAt:          8,   // H
  completedAt:        9,   // I
  linkedInClicked:    10,  // J
  questionsAndOptions:11,  // K
  answersAndReveals:  12,  // L
};

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Write header row
    sheet.getRange(1, 1, 1, 12).setValues([[
      'Session ID',
      'Name',
      'Email',
      'Difficulty',
      'AI Profile',
      'Certificate ID',
      'Geography',
      'Started At',
      'Completed At',
      'LinkedIn Clicked',
      'Questions & Options',
      'Answers & Reveals',
    ]]);
    // Style header row
    var headerRange = sheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    // Set column widths
    sheet.setColumnWidth(1, 180);  // Session ID
    sheet.setColumnWidth(2, 150);  // Name
    sheet.setColumnWidth(3, 200);  // Email
    sheet.setColumnWidth(4, 80);   // Difficulty
    sheet.setColumnWidth(5, 200);  // AI Profile
    sheet.setColumnWidth(6, 140);  // Certificate ID
    sheet.setColumnWidth(7, 150);  // Geography
    sheet.setColumnWidth(8, 180);  // Started At
    sheet.setColumnWidth(9, 180);  // Completed At
    sheet.setColumnWidth(10, 130); // LinkedIn Clicked
    sheet.setColumnWidth(11, 400); // Questions & Options
    sheet.setColumnWidth(12, 400); // Answers & Reveals
  }

  return sheet;
}

function findRowBySessionId(sheet, sessionId) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {  // start at 1 to skip header
    if (data[i][0] === sessionId) {
      return i + 1;  // return 1-based row number
    }
  }
  return -1;  // not found
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();
    var existingRow = findRowBySessionId(sheet, payload.sessionId);

    var rowData = [
      payload.sessionId        || '',
      payload.name             || '',
      payload.email            || '',
      payload.difficulty       || '',
      payload.aiProfile        || '',
      payload.certificateId    || '',
      payload.geography        || '',
      formatTimestamp(payload.startedAt),
      formatTimestamp(payload.completedAt),
      payload.linkedInClicked  || 'No',
      payload.questionsAndOptions || '',
      payload.answersAndReveals   || '',
    ];

    if (existingRow > 0) {
      // ── UPDATE existing row ──
      // Only overwrite non-empty incoming values so we don't blank out
      // fields that were set in a previous call (e.g. completedAt on first save)
      var currentRow = sheet.getRange(existingRow, 1, 1, 12).getValues()[0];
      var mergedRow = currentRow.map(function(currentVal, idx) {
        var incoming = rowData[idx];
        // Prefer incoming value if it's non-empty, otherwise keep existing
        return (incoming !== '' && incoming !== 'No') ? incoming : currentVal;
      });
      // Always honour LinkedIn Clicked if it flips to Yes
      if (payload.linkedInClicked === 'Yes') {
        mergedRow[COLUMNS.linkedInClicked - 1] = 'Yes';
      }
      sheet.getRange(existingRow, 1, 1, 12).setValues([mergedRow]);
    } else {
      // ── INSERT new row ──
      sheet.appendRow(rowData);

      // Zebra-stripe the new row
      var newRowIndex = sheet.getLastRow();
      if (newRowIndex % 2 === 0) {
        sheet.getRange(newRowIndex, 1, 1, 12).setBackground('#f8f9ff');
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatTimestamp(isoString) {
  if (!isoString) return '';
  try {
    var date = new Date(isoString);
    // Format: DD/MM/YYYY HH:MM:SS
    var pad = function(n) { return n < 10 ? '0' + n : n; };
    return pad(date.getDate()) + '/' +
           pad(date.getMonth() + 1) + '/' +
           date.getFullYear() + ' ' +
           pad(date.getHours()) + ':' +
           pad(date.getMinutes()) + ':' +
           pad(date.getSeconds());
  } catch (e) {
    return isoString;
  }
}

// For testing in the Apps Script editor — run this function manually
function testInsert() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        sessionId: 'TEST-001',
        name: 'Vinesh Thota',
        email: 'vineshthota1@gmail.com',
        difficulty: 'hard',
        aiProfile: 'Systems Thinker',
        certificateId: 'ASC-ABCD1234',
        geography: 'Hyderabad, India',
        startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        linkedInClicked: 'No',
        questionsAndOptions: 'Q1 [AI Tools]: Sample scenario...',
        answersAndReveals: 'Q1: Answer chosen — Reveal text here',
      })
    }
  };
  doPost(mockEvent);
}

function testLinkedInUpdate() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        sessionId: 'TEST-001',
        name: 'Vinesh Thota',
        email: 'vineshthota1@gmail.com',
        difficulty: 'hard',
        aiProfile: 'Systems Thinker',
        certificateId: 'ASC-ABCD1234',
        geography: 'Hyderabad, India',
        startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        linkedInClicked: 'Yes',
        questionsAndOptions: 'Q1 [AI Tools]: Sample scenario...',
        answersAndReveals: 'Q1: Answer chosen — Reveal text here',
      })
    }
  };
  doPost(mockEvent);
}
