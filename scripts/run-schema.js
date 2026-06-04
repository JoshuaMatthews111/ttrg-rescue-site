const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const client = new Client({
    host: 'db.tueevdgdqkkrjylxvutp.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'TTRG2026!!!!',
    ssl: { rejectUnauthorized: false },
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL');
    
    const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase-schema.sql'), 'utf-8');
    
    // Execute the entire SQL file as one transaction
    console.log('Executing schema...');
    await client.query(sql);
    console.log('✅ Schema executed successfully!');
    
    // Verify tables
    const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
    console.log('\nTables created:');
    res.rows.forEach(r => console.log(`  • ${r.tablename}`));
    
    // Verify dog count
    const dogs = await client.query("SELECT count(*) FROM dogs");
    console.log(`\nDogs seeded: ${dogs.rows[0].count}`);
    
    const users = await client.query("SELECT count(*) FROM admin_users");
    console.log(`Admin users seeded: ${users.rows[0].count}`);
    
  } catch (err) {
    console.error('Error:', err.message);
    if (err.message.includes('already exists')) {
      console.log('(Tables may already exist — this is fine)');
    }
  } finally {
    await client.end();
  }
}

run();
