const { SPREADSHEET_ID } = require('./_lib');
module.exports = (req, res) => {
  res.redirect(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`);
};
