import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Swedish municipalities with coordinates
const municipalities = [
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { name: 'Göteborg', lat: 57.7089, lng: 11.9746 },
  { name: 'Malmö', lat: 55.6050, lng: 13.0038 },
  { name: 'Uppsala', lat: 59.8586, lng: 17.6389 },
  { name: 'Linköping', lat: 58.4108, lng: 15.6214 },
  { name: 'Västerås', lat: 59.6099, lng: 16.5448 },
  { name: 'Örebro', lat: 59.2753, lng: 15.2134 },
  { name: 'Norrköping', lat: 58.5877, lng: 16.1924 },
  { name: 'Helsingborg', lat: 56.0465, lng: 12.6945 },
  { name: 'Jönköping', lat: 57.7826, lng: 14.1618 },
  { name: 'Umeå', lat: 63.8258, lng: 20.2630 },
  { name: 'Lund', lat: 55.7047, lng: 13.1910 },
  { name: 'Borås', lat: 57.7210, lng: 12.9401 },
  { name: 'Eskilstuna', lat: 59.3717, lng: 16.5077 },
  { name: 'Gävle', lat: 60.6749, lng: 17.1413 }
];

// Swedish first names
const firstNames = [
  'Anna', 'Erik', 'Maria', 'Johan', 'Emma', 'Lars', 'Karin', 'Anders', 
  'Sofia', 'Per', 'Lena', 'Magnus', 'Eva', 'Mikael', 'Sara', 'Peter',
  'Linda', 'Karl', 'Helena', 'Björn', 'Kristina', 'Thomas', 'Ingrid', 'Sven',
  'Annika', 'Olof', 'Susanne', 'Fredrik', 'Åsa', 'Henrik'
];

// Swedish last names
const lastNames = [
  'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson',
  'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson',
  'Jansson', 'Hansson', 'Bengtsson', 'Jönsson', 'Lindberg', 'Jakobsson',
  'Magnusson', 'Olofsson', 'Lindström', 'Lindqvist', 'Lindgren', 'Berg',
  'Axelsson', 'Bergström', 'Lundberg', 'Lind', 'Lundgren', 'Lundqvist'
];

const languages = [
  ['Svenska', 'Engelska'],
  ['Svenska', 'Arabiska', 'Engelska'],
  ['Svenska', 'Spanska'],
  ['Svenska', 'Engelska', 'Tyska'],
  ['Svenska', 'Franska'],
  ['Svenska', 'Finska'],
  ['Svenska', 'Polska'],
  ['Svenska', 'Persiska', 'Engelska'],
  ['Svenska', 'Somaliska'],
  ['Svenska', 'Turkiska']
];

const interests = [
  ['Sport', 'Musik'],
  ['Matlagning', 'Natur'],
  ['Läsning', 'Film'],
  ['Konst', 'Teater'],
  ['Trädgård', 'Hantverk'],
  ['Resor', 'Fotografi'],
  ['Dans', 'Yoga'],
  ['Spel', 'Teknik'],
  ['Historia', 'Kultur'],
  ['Djur', 'Natur']
];

const availability = [
  ['Vardagar'],
  ['Helger'],
  ['Vardagar', 'Kvällar'],
  ['Vardagar', 'Helger'],
  ['Kvällar'],
  ['Flexibel']
];

const availableFor = [
  ['Barn'],
  ['Ungdomar'],
  ['Vuxna'],
  ['Äldre'],
  ['Barn', 'Ungdomar'],
  ['Alla åldrar']
];

const experienceLevels = ['beginner', 'experienced', 'expert'];
const statuses = ['approved', 'approved', 'approved', 'pending', 'under_review'];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomAge(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.se`;
}

function generatePhone(): string {
  const prefix = '070';
  const part1 = Math.floor(Math.random() * 900 + 100);
  const part2 = Math.floor(Math.random() * 90 + 10);
  const part3 = Math.floor(Math.random() * 90 + 10);
  return `${prefix}-${part1} ${part2} ${part3}`;
}

async function seedVolunteers() {
  console.log('🌱 Starting to seed volunteers...');

  // First, delete the existing demo volunteer
  console.log('🗑️  Deleting existing demo volunteer...');
  const { error: deleteError } = await supabase
    .from('volunteers')
    .delete()
    .eq('municipality', 'Eskilstuna');

  if (deleteError) {
    console.error('Error deleting demo volunteer:', deleteError);
  } else {
    console.log('✅ Demo volunteer deleted');
  }

  const volunteers = [];

  for (let i = 0; i < 30; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const municipality = randomItem(municipalities);
    const status = randomItem(statuses);
    
    // Add small random offset to coordinates for variety
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    const volunteer = {
      full_name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      age: randomAge(20, 65),
      municipality: municipality.name,
      address: `${randomItem(['Storgatan', 'Kungsgatan', 'Drottninggatan', 'Vasagatan'])} ${Math.floor(Math.random() * 100 + 1)}`,
      postal_code: `${Math.floor(Math.random() * 90000 + 10000)}`,
      languages: randomItem(languages),
      interests: randomItem(interests),
      has_drivers_license: Math.random() > 0.4,
      has_car: Math.random() > 0.6,
      status: status,
      accepts_terms: true,
      accepts_background_check: true
    };

    volunteers.push(volunteer);
  }

  console.log(`📝 Inserting ${volunteers.length} volunteers...`);

  const { data, error } = await supabase
    .from('volunteers')
    .insert(volunteers)
    .select();

  if (error) {
    console.error('❌ Error inserting volunteers:', error);
    throw error;
  }

  console.log(`✅ Successfully inserted ${data?.length || 0} volunteers!`);
  
  // Show distribution by municipality
  const distribution: Record<string, number> = {};
  volunteers.forEach(v => {
    distribution[v.municipality] = (distribution[v.municipality] || 0) + 1;
  });
  
  console.log('\n📊 Distribution by municipality:');
  Object.entries(distribution).forEach(([municipality, count]) => {
    console.log(`   ${municipality}: ${count} volunteers`);
  });

  console.log('\n🎉 Seeding completed successfully!');
}

seedVolunteers().catch(console.error);
