const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.data', 'iotogether.db.json');
if (!fs.existsSync(dbPath)) {
  console.error('Database file not found:', dbPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.bookings = [];
db.condition_reports = [];
db.incidents = [];
db.waitlist_entries = [];
db.audit_logs = [];
db.notifications = [];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully cleaned all history, bookings, and audit records.');
console.log('Resources retained:', db.resources.length);
console.log('Bookings:', db.bookings.length);
console.log('Audit logs:', db.audit_logs.length);
