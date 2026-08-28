const supabase = require('./config/database');

(async () => {
  try {
    console.log('Checking memories table...');
    const { data: memories, error } = await supabase
      .from('memories')
      .select('*');
    
    if (error) {
      console.error('Error fetching memories:', error);
    } else {
      console.log(`Found ${memories?.length || 0} memories in database`);
      if (memories && memories.length > 0) {
        memories.forEach(m => {
          console.log(`- ID: ${m.id}, Caption: "${m.caption}", Photo: ${m.photo_url ? 'Yes' : 'No'}, Music: ${m.music_url ? 'Yes' : 'No'}`);
        });
      }
    }

    console.log('\nChecking music table...');
    const { data: music, error: musicError } = await supabase
      .from('music')
      .select('*')
      .maybeSingle();
    
    if (musicError) {
      console.error('Error fetching music:', musicError);
    } else {
      console.log(music ? `Music found: "${music.title}" by ${music.artist}` : 'No music in database');
    }

    console.log('\nChecking site_config table...');
    const { data: config, error: configError } = await supabase
      .from('site_config')
      .select('*')
      .maybeSingle();
    
    if (configError) {
      console.error('Error fetching config:', configError);
    } else {
      console.log(config ? 'Site config found' : 'No site config in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
