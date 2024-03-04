use admin;

db.auth(
  "cashflow",
  "cashflow",
  "SCRAM-SHA-1",
  false
);

db.createUser({
  user: 'cashflow',
  pwd: 'cashflow',
  roles: [
    {
      role: 'readWrite',
      db: 'cashflow',
    },
  ],
});
