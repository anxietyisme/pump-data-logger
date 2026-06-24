const { google } = require('googleapis');
const { getAuth, SPREADSHEET_ID, SHEETS } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth: getAuth() });
    const ranges = Object.keys(SHEETS).map(k => `${k}!B${SHEETS[k].start}:B${SHEETS[k].end}`);
    const response = await sheetsAPI.spreadsheets.values.batchGet({ spreadsheetId: SPREADSHEET_ID, ranges });
    const valueRanges = response.data.valueRanges || [];
    let list = [];
    let i = 0;
    for (let key in SHEETS) {
      const count = (valueRanges[i]?.values || []).filter(r => r && r[0] != null && r[0] !== '').length;
      list.push({ sheetName: key, displayName: SHEETS[key].name, entriesCount: count, maxEntries: SHEETS[key].end - SHEETS[key].start + 1 });
      i++;
    }
    res.json({ locations: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
