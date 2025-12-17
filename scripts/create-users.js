const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create admin client (uses service role key for admin operations)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    email: 'bgurley@sanctumhealthpartners.com',
    password: 'Little.bo101',
    name: 'Branson Gurley'
  },
  {
    email: 'jackson@sanctumhealthpartners.com',
    password: 'AlecBaldman',
    name: 'Jackson'
  },
  {
    email: 'jacob@sanctumhealthpartners.com',
    password: 'Chili25/125',
    name: 'Jacob'
  },
  {
    email: 'alissa@sanctumhealthpartners.com',
    password: 'highcounciltherapist',
    name: 'Alissa'
  }
];

async function createUsers() {
  console.log('Creating users...\n');

  for (const user of users) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: user.name
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✓ ${user.email} - Already exists (skipped)`);
        } else {
          console.error(`✗ ${user.email} - Error: ${error.message}`);
        }
      } else {
        console.log(`✓ ${user.email} - Created successfully`);
      }
    } catch (err) {
      console.error(`✗ ${user.email} - Error: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

createUsers();

