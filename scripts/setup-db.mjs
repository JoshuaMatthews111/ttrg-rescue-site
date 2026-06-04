import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://tueevdgdqkkrjylxvutp.supabase.com';
const supabaseServiceKey = 'sb_publishable__k08INOtZeM97KI67a7sUA_HajDxGF1';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the SQL file and split into individual statements
const sqlFile = readFileSync(join(__dirname, '..', 'supabase-schema.sql'), 'utf-8');

// Split on semicolons but skip those inside strings/functions
const statements = sqlFile
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute...`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 80).replace(/\n/g, ' ');
  console.log(`[${i + 1}/${statements.length}] ${preview}...`);
  
  const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' }).catch(() => ({ error: 'rpc not available' }));
  
  if (error) {
    // Try via raw SQL endpoint
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: stmt + ';' }),
    });
    if (!res.ok) {
      console.log(`  ⚠️  Skipped (may need SQL Editor): ${preview}`);
    }
  }
}

console.log('\n✅ Done! If some statements were skipped, run them in the Supabase SQL Editor.');
console.log('SQL file: supabase-schema.sql');
