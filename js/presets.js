/**
 * ALBUM STUDIO PRO - EXTENDED PRESET LIBRARY (100+ STYLES)
 * Contains 110+ expertly curated themes covering all music genres, cultural styles, retro aesthetics and modern visuals.
 */

const PRESET_CATEGORIES = [
  { id: 'all', name: 'ទាំងអស់ (All 110+)', nameEn: 'All Styles (110+)' },
  { id: 'khmer', name: '🇰🇭 មរតកខ្មែរ (Khmer Heritage)', nameEn: 'Khmer Heritage' },
  { id: 'synthwave', name: '🌆 Synthwave & Cyber', nameEn: 'Synthwave & Cyber' },
  { id: 'edm', name: '⚡ EDM & Club Festival', nameEn: 'EDM & Bass Club' },
  { id: 'chill', name: '☕ Lo-Fi & Acoustic Chill', nameEn: 'Lo-Fi & Acoustic' },
  { id: 'luxury', name: '👑 Luxury Gold & Royal', nameEn: 'Luxury & Gold' },
  { id: 'romantic', name: '🌸 Romantic & Pastel', nameEn: 'Romantic & Pastel' },
  { id: 'retro', name: '📼 Retro 80s/90s Vintage', nameEn: 'Retro & Vintage' },
  { id: 'scifi', name: '🌌 Space & Sci-Fi Galaxy', nameEn: 'Space & Sci-Fi' },
  { id: 'dark', name: '🔥 Dark Rock & Techno', nameEn: 'Dark & Techno' },
  { id: 'nature', name: '🌿 Nature & Ambient Zen', nameEn: 'Nature & Zen' },
  { id: 'anime', name: '✨ Anime & Vaporwave', nameEn: 'Anime & Vaporwave' }
];

// Helper to generate presets systematically while giving each unique personality
function generate100PlusPresets() {
  const presets = [];

  // 1. KHMER HERITAGE STYLES (15 Presets)
  const khmerStyles = [
    { id: 'khmer_classic_gold', name: 'Khmer Golden Era (សម័យមាស)', nameKh: 'សម័យមាសបុរាណខ្មែរ', tag: 'Royal Gold & Navy', bg1: '#0b1120', bg2: '#1e1b4b', c1: '#fbbf24', c2: '#f59e0b', font: 'Moul', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'khmer_angkor_wat', name: 'Angkor Wat Sunrise', nameKh: 'រស្មីប្រាសាទអង្គរវត្ត', tag: 'Angkor Stone & Sun', bg1: '#1c1917', bg2: '#78350f', c1: '#fde047', c2: '#d97706', font: 'Bayon', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'khmer_starry_night', name: 'រាត្រីផ្កាយរះ (Starry Night)', nameKh: 'រាត្រីផ្កាយរះ មនោសញ្ចេតនា', tag: 'Deep Indigo & Stars', bg1: '#030712', bg2: '#1e1b4b', c1: '#818cf8', c2: '#c084fc', font: 'Kantumruy Pro', art: 'vinyl', viz: 'bars', bgType: 'nebula_stars', style: 'neon' },
    { id: 'khmer_battambang_sunset', name: 'រំដួលបាត់ដំបង (Battambang Sunset)', nameKh: 'រំដួលបាត់ដំបង ពេលល្ងាច', tag: 'Warm Sunset Orange', bg1: '#451a03', bg2: '#c2410c', c1: '#fed7aa', c2: '#fb923c', font: 'Battambang', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'khmer_champa_battambang', name: 'ផ្កាចំប៉ាបាត់ដំបង', nameKh: 'ផ្កាចំប៉ាបាត់ដំបង ក្លិនក្រអូប', tag: 'Emerald & Gold', bg1: '#064e3b', bg2: '#047857', c1: '#fef08a', c2: '#10b981', font: 'Siemreap', art: 'circle_cover', viz: 'circular', bgType: 'blurred_cover', style: 'gold' },
    { id: 'khmer_preah_vihear', name: 'Preah Vihear Majesty', nameKh: 'មហិទ្ធិឫទ្ធិ ព្រះវិហារ', tag: 'Sky Blue & Mountain Mist', bg1: '#0c4a6e', bg2: '#0369a1', c1: '#e0f2fe', c2: '#38bdf8', font: 'Preahvihear', art: 'square_glass', viz: 'waves', bgType: 'radial_glow', style: 'chrome' },
    { id: 'khmer_bayon_smiles', name: 'Bayon Mysterious Smiles', nameKh: 'ស្នាមញញឹម ព្រហ្មបាយ័ន', tag: 'Ancient Bronze', bg1: '#292524', bg2: '#44403c', c1: '#facc15', c2: '#ca8a04', font: 'Bayon', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'khmer_bokor_mist', name: 'Bokor Mountain Cloud', nameKh: 'អ័ព្ទភ្នំបូកគោ រ៉ូមែនទិក', tag: 'Fog & Lavender Navy', bg1: '#1e1b4b', bg2: '#4338ca', c1: '#ddd6fe', c2: '#a78bfa', font: 'Bokor', art: 'vinyl', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'khmer_pleng_kar', name: 'Traditional Wedding (ភ្លេងការ)', nameKh: 'ភ្លេងការមង្គលបុរាណ', tag: 'Silk Red & Gold', bg1: '#450a0a', bg2: '#991b1b', c1: '#fde047', c2: '#fbbf24', font: 'Moul', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'khmer_chapei_dongveng', name: 'Chapei Dong Veng Soul', nameKh: 'ចាប៉ីដងវែង បេតិកភណ្ឌ', tag: 'Teak Wood & Amber', bg1: '#292524', bg2: '#78350f', c1: '#fed7aa', c2: '#f59e0b', font: 'Koh Santepheap', art: 'cassette', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'khmer_kantaum_roy', name: 'Kantaum Roy Rhythm', nameKh: 'កន្ទុំរុយ ហើររេរាំ', tag: 'Cyan & Violet Breeze', bg1: '#111827', bg2: '#3730a3', c1: '#67e8f9', c2: '#c084fc', font: 'Kantumruy Pro', art: 'circle_cover', viz: 'double_mirror_bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'khmer_chenla_ancient', name: 'Chenla Kingdom Era', nameKh: 'សម័យអាណាចក្រចេនឡា', tag: 'Antique Sandstone', bg1: '#1c1917', bg2: '#57534e', c1: '#fef08a', c2: '#eab308', font: 'Chenla', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'khmer_dangrek_wind', name: 'Dangrek Mountain Breeze', nameKh: 'ខ្យល់បក់ភ្នំដងរែក', tag: 'Forest Pine & Mist', bg1: '#064e3b', bg2: '#065f46', c1: '#a7f3d0', c2: '#34d399', font: 'Dangrek', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'khmer_metal_rock', name: 'Khmer Metal Hard Rock', nameKh: 'ភ្លេងរ៉ុកខ្មែរ កក្រើកដី', tag: 'Steel & Crimson', bg1: '#09090b', bg2: '#450a0a', c1: '#ef4444', c2: '#f87171', font: 'Metal', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'khmer_romantic_fasthand', name: 'Acoustic Handwrite', nameKh: 'កំណាព្យស្នេហ៍ អក្សរដៃ', tag: 'Soft Peach & Rose', bg1: '#4a044e', bg2: '#831843', c1: '#fce7f3', c2: '#f472b6', font: 'Fasthand', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'floating_glass' }
  ];

  khmerStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'khmer', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 2. SYNTHWAVE & CYBERPUNK (15 Presets)
  const synthStyles = [
    { id: 'synthwave_80s', name: 'Synthwave 80s Retro Grid', nameKh: 'Synthwave 80s ផ្លូវនីអុង', tag: 'Neon Grid & Sun', bg1: '#0f051d', bg2: '#ec4899', c1: '#ec4899', c2: '#06b6d4', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'synthwave_grid', style: 'neon' },
    { id: 'cyberpunk_2077', name: 'Cyberpunk 2077 Night', nameKh: 'ទីក្រុងរាត្រី Cyberpunk', tag: 'HUD & Yellow Neon', bg1: '#050505', bg2: '#18181b', c1: '#facc15', c2: '#06b6d4', font: 'Orbitron', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'outrun_highway', name: 'Outrun Sunset Highway', nameKh: 'ផ្លូវហាយវេ Outrun ពេលថ្ងៃលិច', tag: 'Purple & Tangerine Sun', bg1: '#180033', bg2: '#f97316', c1: '#fb923c', c2: '#ec4899', font: 'Righteous', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'synthwave_grid', style: 'neon' },
    { id: 'matrix_code_rain', name: 'Matrix Digital Rain', nameKh: 'ភ្លៀងកូដម៉ាទ្រីស បៃតង', tag: 'Terminal Hacker Green', bg1: '#022c22', bg2: '#052e16', c1: '#22c55e', c2: '#86efac', font: 'Orbitron', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'matrix_rain', style: 'neon' },
    { id: 'neon_tokyo_drift', name: 'Tokyo Neon Drift', nameKh: 'តូក្យូ នីអុង រាត្រី', tag: 'Magenta & Electric Blue', bg1: '#0f172a', bg2: '#831843', c1: '#f43f5e', c2: '#38bdf8', font: 'Outfit', art: 'cd_jewel_case', viz: 'bars', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'miami_vice_84', name: 'Miami Vice 1984', nameKh: 'ឆ្នេរសមុទ្រ ម៉ៃអាមី 1984', tag: 'Pastel Aqua & Pink', bg1: '#164e63', bg2: '#831843', c1: '#38bdf8', c2: '#f472b6', font: 'Righteous', art: 'cassette', viz: 'waves', bgType: 'radial_glow', style: 'neon' },
    { id: 'synth_blade_runner', name: 'Blade Runner 2049', nameKh: 'អនាគត Blade Runner', tag: 'Smoky Orange Fog', bg1: '#1c1917', bg2: '#7c2d12', c1: '#fdba74', c2: '#ea580c', font: 'Orbitron', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: '3d_shadow' },
    { id: 'cyber_hud_tactical', name: 'Tactical HUD Military', nameKh: 'ផ្ទាំងបញ្ជា យោធាអនាគត', tag: 'Amber Radar Scan', bg1: '#09090b', bg2: '#18181b', c1: '#f59e0b', c2: '#fbbf24', font: 'Space Grotesk', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'cyber_hud', style: 'neon' },
    { id: 'neon_grid_arcade', name: 'Arcade 1980s Game', nameKh: 'ហ្គេម Arcade សម័យ 80s', tag: 'Pixel Arcade Glow', bg1: '#111827', bg2: '#312e81', c1: '#a855f7', c2: '#06b6d4', font: 'Righteous', art: 'cassette', viz: 'cyber_equalizer', bgType: 'synthwave_grid', style: 'neon' },
    { id: 'synth_vortex_tunnel', name: 'Cyber Vortex Tunnel', nameKh: 'រូងផ្លូវពន្លឺ Cyber', tag: 'Violet Vortex Wave', bg1: '#0a0017', bg2: '#3b0764', c1: '#d8b4fe', c2: '#c084fc', font: 'Orbitron', art: 'circle_cover', viz: 'circular', bgType: 'geometric_tunnel', style: 'neon' },
    { id: 'synth_laser_grid', name: 'Laser Beam Symphony', nameKh: 'កាំរស្មីឡាស៊ែរ ចាំងពន្លឺ', tag: 'Cyan Laser Scan', bg1: '#030712', bg2: '#083344', c1: '#22d3ee', c2: '#38bdf8', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'disco_lasers', style: 'neon' },
    { id: 'synth_holo_wave', name: 'Holographic Prism Wave', nameKh: 'រលកពន្លឺ Hologram', tag: 'Rainbow Chrome Glow', bg1: '#0f172a', bg2: '#1e1b4b', c1: '#e0e7ff', c2: '#818cf8', font: 'Syne', art: 'cd_jewel_case', viz: 'waves', bgType: 'radial_glow', style: 'chrome' },
    { id: 'synth_dark_wave', name: 'Darkwave Gothic Synth', nameKh: 'Darkwave ស្រមោលរាត្រី', tag: 'Charcoal & Violet Blood', bg1: '#09090b', bg2: '#2e1065', c1: '#c084fc', c2: '#a855f7', font: 'Cinzel', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'radial_glow', style: '3d_shadow' },
    { id: 'synth_glitch_core', name: 'Glitch Core Aesthetic', nameKh: 'Glitch Core បែកផ្សែង', tag: 'RGB Split Glitch', bg1: '#000000', bg2: '#18181b', c1: '#ef4444', c2: '#06b6d4', font: 'Orbitron', art: 'square_glass', viz: 'bars', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'synth_retrowave_sunset', name: 'Retrowave Palm Sunset', nameKh: 'ដើមដូងពេលថ្ងៃលិច Retrowave', tag: 'Sunset Palms & Road', bg1: '#1e0533', bg2: '#831843', c1: '#fb7185', c2: '#f43f5e', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'synthwave_grid', style: 'neon' }
  ];

  synthStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'synthwave', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 3. EDM & CLUB FESTIVAL (12 Presets)
  const edmStyles = [
    { id: 'edm_bass_festival', name: 'EDM Bass Explosion', nameKh: 'ចង្វាក់ EDM កក្រើកបាស', tag: 'Ultra Reactive Bass', bg1: '#020617', bg2: '#0f172a', c1: '#10b981', c2: '#06b6d4', font: 'Bebas Neue', art: 'vinyl', viz: 'bars', bgType: 'particles_burst', style: 'neon' },
    { id: 'edm_tomorrowland', name: 'Festival Mainstage 2026', nameKh: 'ឆាកតន្ត្រីពិភពលោក', tag: 'Laser Lights & Pyro', bg1: '#0f051d', bg2: '#4a044e', c1: '#f43f5e', c2: '#a855f7', font: 'Outfit', art: 'cd_jewel_case', viz: 'double_mirror_bars', bgType: 'disco_lasers', style: 'neon' },
    { id: 'edm_dubstep_drop', name: 'Heavy Dubstep Bass Drop', nameKh: 'ចង្វាក់ Dubstep កក្រើកដី', tag: 'Toxic Lime & Purple', bg1: '#052e16', bg2: '#2e1065', c1: '#84cc16', c2: '#c084fc', font: 'Orbitron', art: 'retro_boombox', viz: 'cyber_equalizer', bgType: 'radial_glow', style: 'neon' },
    { id: 'edm_trap_nation', name: 'Trap Nation Visualizer', nameKh: 'Trap Nation យោលបាស', tag: 'Circle Pulse & Dust', bg1: '#020617', bg2: '#1e293b', c1: '#38bdf8', c2: '#818cf8', font: 'Bebas Neue', art: 'circle_cover', viz: 'circular', bgType: 'particles_burst', style: 'floating_glass' },
    { id: 'edm_hardstyle_kick', name: 'Hardstyle Euphoric Kick', nameKh: 'Hardstyle ស្គរខ្លាំង', tag: 'Fiery Orange & Red', bg1: '#180000', bg2: '#7f1d1d', c1: '#f97316', c2: '#ef4444', font: 'Bebas Neue', art: 'vinyl', viz: 'bars', bgType: 'fire_magma', style: 'neon' },
    { id: 'edm_future_house', name: 'Future House Bounce', nameKh: 'Future House រាំកម្សាន្ត', tag: 'Aqua Blue & White', bg1: '#082f49', bg2: '#0369a1', c1: '#38bdf8', c2: '#e0f2fe', font: 'Outfit', art: 'cd_jewel_case', viz: 'waves', bgType: 'radial_glow', style: 'chrome' },
    { id: 'edm_trance_uplifting', name: 'Trance Euphoria Sky', nameKh: 'Trance ហោះលើអាកាស', tag: 'Celestial Indigo Light', bg1: '#030712', bg2: '#1e1b4b', c1: '#818cf8', c2: '#38bdf8', font: 'Outfit', art: 'circle_cover', viz: 'circular', bgType: 'nebula_stars', style: 'neon' },
    { id: 'edm_techno_warehouse', name: 'Berlin Warehouse Techno', nameKh: 'Techno រូងក្រោមដី ប៊ែរឡាំង', tag: 'Minimal Strobe & Steel', bg1: '#09090b', bg2: '#18181b', c1: '#fafafa', c2: '#71717a', font: 'Inter', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'outline' },
    { id: 'edm_dnb_liquid', name: 'Liquid Drum & Bass', nameKh: 'Drum & Bass រលកទឹក', tag: 'Purple Violet Speed', bg1: '#1e1b4b', bg2: '#3b0764', c1: '#c084fc', c2: '#e879f9', font: 'Space Grotesk', art: 'cd_jewel_case', viz: 'waves', bgType: 'radial_glow', style: 'neon' },
    { id: 'edm_slap_house', name: 'Slap House Deep Bass', nameKh: 'Slap House បាសរណ្តំ', tag: 'Deep Gold & Crimson', bg1: '#171717', bg2: '#450a0a', c1: '#fbbf24', c2: '#dc2626', font: 'Outfit', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'radial_glow', style: 'gold' },
    { id: 'edm_psy_trance', name: 'Psytrance Fractal Mind', nameKh: 'Psytrance កាឡាក់ស៊ីវិល', tag: 'Neon Fractal Rainbow', bg1: '#090014', bg2: '#3b0764', c1: '#22d3ee', c2: '#f43f5e', font: 'Orbitron', art: 'circle_cover', viz: 'circular', bgType: 'geometric_tunnel', style: 'neon' },
    { id: 'edm_club_lasers', name: 'VIP Club Laser Night', nameKh: 'ក្លឹបរាត្រី VIP ឡាស៊ែរ', tag: 'Emerald & Fuchsia Glow', bg1: '#022c22', bg2: '#4a044e', c1: '#10b981', c2: '#ec4899', font: 'Outfit', art: 'retro_boombox', viz: 'bars', bgType: 'disco_lasers', style: 'neon' }
  ];

  edmStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'edm', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 4. LO-FI & ACOUSTIC CHILL (12 Presets)
  const chillStyles = [
    { id: 'lofi_cozy_sunset', name: 'Lo-Fi Cozy Sunset', nameKh: 'ភ្លេងស្ងប់ស្ងាត់ Lo-Fi ពេលល្ងាច', tag: 'Warm Amber & Rain', bg1: '#451a03', bg2: '#9a3412', c1: '#fdba74', c2: '#f472b6', font: 'Kantumruy Pro', art: 'cassette', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'lofi_rainy_window', name: 'Rainy Cafe Window', nameKh: 'ដំណក់ទឹកភ្លៀង ហាងកាហ្វេ', tag: 'Raindrops & Muted Slate', bg1: '#0f172a', bg2: '#334155', c1: '#94a3b8', c2: '#cbd5e1', font: 'Inter', art: 'cassette', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'lofi_midnight_study', name: 'Midnight Study Session', nameKh: 'រៀនពេលយប់ជ្រៅ Lo-Fi', tag: 'Deep Navy & Desk Lamp', bg1: '#020617', bg2: '#1e1b4b', c1: '#fde047', c2: '#818cf8', font: 'Kantumruy Pro', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'lofi_coffee_morning', name: 'Morning Espresso Chill', nameKh: 'កាហ្វេពេលព្រឹក ស្រស់ស្រាយ', tag: 'Mocha Brown & Cream', bg1: '#292524', bg2: '#57534e', c1: '#fef3c7', c2: '#d97706', font: 'Poppins', art: 'square_glass', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'lofi_acoustic_guitar', name: 'Acoustic Campfire Notes', nameKh: 'ហ្គីតាឈើ ក្បែរភ្នក់ភ្លើង', tag: 'Wood Amber & Fire', bg1: '#1c1917', bg2: '#451a03', c1: '#fed7aa', c2: '#fb923c', font: 'Battambang', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'lofi_piano_rain', name: 'Melancholy Piano Rain', nameKh: 'ព្យាណូក្រោមដំណក់ទឹកភ្លៀង', tag: 'Moody Charcoal Blue', bg1: '#0b0f19', bg2: '#1e293b', c1: '#e2e8f0', c2: '#94a3b8', font: 'Cinzel', art: 'square_glass', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'lofi_chillhop_beats', name: 'Chillhop Vinyl Grooves', nameKh: 'Chillhop ចាក់តាមថាស', tag: 'Vintage Sepia Yellow', bg1: '#1c1917', bg2: '#44403c', c1: '#fef08a', c2: '#eab308', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'lofi_bedroom_dream', name: 'Bedroom Pop Dreams', nameKh: 'សុបិនបន្ទប់គេង Lo-Fi', tag: 'Pastel Lilac & Peach', bg1: '#2e1065', bg2: '#581c87', c1: '#fbcfe8', c2: '#c084fc', font: 'Kantumruy Pro', art: 'cassette', viz: 'waves', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'lofi_tokyo_night_walk', name: 'Tokyo Night Walk Chill', nameKh: 'ដើរលេងរាត្រី តូក្យូ', tag: 'Subtle Indigo Neon', bg1: '#030712', bg2: '#1e1b4b', c1: '#38bdf8', c2: '#c084fc', font: 'Outfit', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'lofi_autumn_leaves', name: 'Autumn Leaves Drift', nameKh: 'ស្លឹកឈើជ្រុះ រដូវស្លឹកឈើលាស់', tag: 'Golden Rust & Maple', bg1: '#431407', bg2: '#7c2d12', c1: '#fdba74', c2: '#ea580c', font: 'Battambang', art: 'circle_cover', viz: 'circular', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'lofi_starry_balcony', name: 'Balcony Star Gazing', nameKh: 'មើលផ្កាយលើយ៉រផ្ទះ', tag: 'Night Sky & Breeze', bg1: '#020617', bg2: '#0f172a', c1: '#c7d2fe', c2: '#818cf8', font: 'Siemreap', art: 'vinyl', viz: 'bars', bgType: 'nebula_stars', style: 'soft_shadow' },
    { id: 'lofi_vintage_radio', name: 'Vintage Radio Broadcast', nameKh: 'វិទ្យុផ្សាយសម្លេងបុរាណ', tag: 'Warm Brass & Static', bg1: '#292524', bg2: '#44403c', c1: '#fde68a', c2: '#d97706', font: 'Outfit', art: 'retro_boombox', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' }
  ];

  chillStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'chill', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 5. LUXURY & ROYAL GOLD (10 Presets)
  const luxuryStyles = [
    { id: 'luxury_chrome_silver', name: 'Luxury Silver & Diamond', nameKh: 'ប្រណិតភាព ពេជ្រ & ប្រាក់', tag: 'Minimal Metallic Elegance', bg1: '#09090b', bg2: '#27272a', c1: '#ffffff', c2: '#94a3b8', font: 'Cinzel', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'chrome' },
    { id: 'luxury_royal_crown', name: 'Royal Crown Heritage', nameKh: 'រាជវាំង មហាក្សត្រ', tag: 'Royal Crimson & Pure Gold', bg1: '#450a0a', bg2: '#1c1917', c1: '#fef08a', c2: '#f59e0b', font: 'Cinzel', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'luxury_black_gold', name: 'Matte Black & Pure Gold', nameKh: 'ខ្មៅរលោង & មាសសុទ្ធ', tag: 'Obsidian & Gold Leaf', bg1: '#000000', bg2: '#171717', c1: '#fde047', c2: '#ca8a04', font: 'Cinzel', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'luxury_emerald_palace', name: 'Emerald Jewel Palace', nameKh: 'រតនៈសម្បត្តិ ត្បូងមរកត', tag: 'Deep Emerald & Gold', bg1: '#022c22', bg2: '#064e3b', c1: '#fef08a', c2: '#10b981', font: 'Cinzel', art: 'square_glass', viz: 'waves', bgType: 'radial_glow', style: 'gold' },
    { id: 'luxury_sapphire_night', name: 'Royal Sapphire Velvet', nameKh: 'ត្បូងកណ្តៀង ខៀវចាស់', tag: 'Sapphire & Silver Trim', bg1: '#082f49', bg2: '#0c4a6e', c1: '#e0f2fe', c2: '#38bdf8', font: 'Cinzel', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'chrome' },
    { id: 'luxury_rose_gold', name: 'Rose Gold Champagne', nameKh: 'មាសផ្កាឈូក សំប៉ាញ', tag: 'Rose Gold & Shimmer', bg1: '#4c0519', bg2: '#881337', c1: '#fecdd3', c2: '#fb7185', font: 'Great Vibes', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'gold' },
    { id: 'luxury_white_marble', name: 'White Marble & Gold Veins', nameKh: 'ថ្មម៉ាបស & ឆ្នូតមាស', tag: 'Clean Marble Elegance', bg1: '#18181b', bg2: '#27272a', c1: '#ffffff', c2: '#facc15', font: 'Cinzel', art: 'square_glass', viz: 'waves', bgType: 'radial_glow', style: 'gold' },
    { id: 'luxury_grand_opera', name: 'Grand Opera House', nameKh: 'រោងមហោស្រព អូប៉េរ៉ា', tag: 'Velvet Curtain Red', bg1: '#3b0764', bg2: '#450a0a', c1: '#fef08a', c2: '#f59e0b', font: 'Cinzel', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'luxury_platinum_vip', name: 'Platinum Elite Card', nameKh: 'ប្លាទីនីម វីអាយភី', tag: 'Brushed Titanium Finish', bg1: '#09090b', bg2: '#18181b', c1: '#f8fafc', c2: '#94a3b8', font: 'Outfit', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'radial_glow', style: 'chrome' },
    { id: 'luxury_versailles', name: 'Versailles Baroque Mirror', nameKh: 'កញ្ចក់ឆ្លុះ បារាំងបុរាណ', tag: 'Antique Gold Filigree', bg1: '#1e1b4b', bg2: '#312e81', c1: '#fef08a', c2: '#fbbf24', font: 'Cinzel', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' }
  ];

  luxuryStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'luxury', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 6. ROMANTIC & PASTEL (10 Presets)
  const romanticStyles = [
    { id: 'sakura_pastel_dream', name: 'Sakura Pastel Romance', nameKh: 'មនោសញ្ចេតនា ផ្កាសាគូរ៉ា', tag: 'Soft Pink & Lavender', bg1: '#500724', bg2: '#831843', c1: '#fbcfe8', c2: '#f472b6', font: 'Great Vibes', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'romantic_candlelight', name: 'Candlelight Dinner Serenade', nameKh: 'ពន្លឺទៀន រ៉ូមែនទិក', tag: 'Warm Flame & Burgundy', bg1: '#450a0a', bg2: '#7f1d1d', c1: '#fef08a', c2: '#f97316', font: 'Great Vibes', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'romantic_lavender_field', name: 'Lavender Mist Sunset', nameKh: 'វាលផ្កាឡាវេនឌ័រ ពេលល្ងាច', tag: 'Soft Violet Bloom', bg1: '#2e1065', bg2: '#581c87', c1: '#e9d5ff', c2: '#c084fc', font: 'Kantumruy Pro', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'romantic_first_love', name: 'First Love Melody', nameKh: 'ស្នេហាគ្រាដំបូង ផ្អែមល្ហែម', tag: 'Blush Pink & White', bg1: '#701a75', bg2: '#a21caf', c1: '#fdf4ff', c2: '#f472b6', font: 'Fasthand', art: 'circle_cover', viz: 'waves', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'romantic_starry_kiss', name: 'Under the Starlit Sky', nameKh: 'ក្រោមមេឃផ្កាយរះ ចងចាំ', tag: 'Cosmic Blue Romance', bg1: '#0f172a', bg2: '#312e81', c1: '#bae6fd', c2: '#a78bfa', font: 'Great Vibes', art: 'vinyl', viz: 'circular', bgType: 'nebula_stars', style: 'neon' },
    { id: 'romantic_wedding_vows', name: 'Eternal Wedding Vows', nameKh: 'សម្បថស្នេហ៍ អាពាហ៍ពិពាហ៍', tag: 'Ivory White & Gold', bg1: '#18181b', bg2: '#27272a', c1: '#ffffff', c2: '#fde047', font: 'Cinzel', art: 'golden_mandala', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'romantic_sunset_beach', name: 'Sunset Beach Hand in Hand', nameKh: 'កាន់ដៃគ្នាក្បែរឆ្នេរខ្សាច់', tag: 'Peach Tangerine Wave', bg1: '#431407', bg2: '#9a3412', c1: '#fed7aa', c2: '#fb923c', font: 'Outfit', art: 'square_glass', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'romantic_acoustic_duet', name: 'Acoustic Love Duet', nameKh: 'ចម្រៀងស្នេហាឆ្លងឆ្លើយ', tag: 'Warm Honey Wood', bg1: '#292524', bg2: '#78350f', c1: '#fef3c7', c2: '#f59e0b', font: 'Battambang', art: 'cassette', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'romantic_cotton_candy', name: 'Cotton Candy Sky', nameKh: 'ពពកស្ករគ្រាប់ ផ្កាឈូកខៀវ', tag: 'Pastel Aqua & Pink', bg1: '#083344', bg2: '#701a75', c1: '#67e8f9', c2: '#f472b6', font: 'Outfit', art: 'cd_jewel_case', viz: 'waves', bgType: 'radial_glow', style: 'neon' },
    { id: 'romantic_moonlight_sonata', name: 'Moonlight Sonata Classic', nameKh: 'ពន្លឺព្រះចន្ទ រាត្រីស្ងប់ស្ងាត់', tag: 'Silver Moon Glow', bg1: '#030712', bg2: '#1e293b', c1: '#f8fafc', c2: '#94a3b8', font: 'Cinzel', art: 'vinyl', viz: 'circular', bgType: 'radial_glow', style: 'chrome' }
  ];

  romanticStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'romantic', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 7. SPACE & SCI-FI GALAXY (10 Presets)
  const scifiStyles = [
    { id: 'deep_galaxy_space', name: 'Deep Galaxy Cosmos', nameKh: 'ទីអវកាសកាឡាក់ស៊ី', tag: 'Cosmic Nebula & Stars', bg1: '#030712', bg2: '#1e1b4b', c1: '#818cf8', c2: '#c084fc', font: 'Space Grotesk', art: 'circle_cover', viz: 'circular', bgType: 'nebula_stars', style: 'neon' },
    { id: 'scifi_interstellar', name: 'Interstellar Black Hole', nameKh: 'ប្រហោងខ្មៅ អវកាស', tag: 'Accretion Disc Gold', bg1: '#000000', bg2: '#18181b', c1: '#fde047', c2: '#ea580c', font: 'Orbitron', art: 'circle_cover', viz: 'circular', bgType: 'nebula_stars', style: 'gold' },
    { id: 'scifi_supernova', name: 'Supernova Star Explosion', nameKh: 'ផ្កាយផ្ទុះ Supernova', tag: 'Cosmic Cyan & Magenta', bg1: '#0a0017', bg2: '#3b0764', c1: '#22d3ee', c2: '#ec4899', font: 'Orbitron', art: 'circle_cover', viz: 'circular', bgType: 'particles_burst', style: 'neon' },
    { id: 'scifi_andromeda', name: 'Andromeda Spiral Galaxy', nameKh: 'កាឡាក់ស៊ី អង់ដ្រូមេដា', tag: 'Spiral Violet Dust', bg1: '#020617', bg2: '#2e1065', c1: '#c084fc', c2: '#38bdf8', font: 'Space Grotesk', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'nebula_stars', style: 'neon' },
    { id: 'scifi_mars_rover', name: 'Mars Colony 2050', nameKh: 'ភពអង្គារ អាណានិគម 2050', tag: 'Red Dust & HUD Grid', bg1: '#180000', bg2: '#7f1d1d', c1: '#f97316', c2: '#ef4444', font: 'Orbitron', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'scifi_quantum_core', name: 'Quantum Core Reactor', nameKh: 'ម៉ាស៊ីនថាមពល Quantum', tag: 'Reactor Cyan Glow', bg1: '#022c22', bg2: '#083344', c1: '#06b6d4', c2: '#10b981', font: 'Space Grotesk', art: 'circle_cover', viz: 'circular', bgType: 'geometric_tunnel', style: 'neon' },
    { id: 'scifi_stargate_portal', name: 'Stargate Wormhole Portal', nameKh: 'ទ្វារឆ្លងពិភព Stargate', tag: 'Wormhole Tunnel Pulse', bg1: '#050505', bg2: '#1e1b4b', c1: '#60a5fa', c2: '#a855f7', font: 'Orbitron', art: 'circle_cover', viz: 'circular', bgType: 'geometric_tunnel', style: 'neon' },
    { id: 'scifi_neon_nebula', name: 'Orion Nebula Cloud', nameKh: 'ពពកផ្កាយ Orion Nebula', tag: 'Lush Magenta Nebula', bg1: '#1f073a', bg2: '#4a044e', c1: '#f472b6', c2: '#c084fc', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'nebula_stars', style: 'neon' },
    { id: 'scifi_solar_flare', name: 'Solar Flare Corona', nameKh: 'រលកកម្តៅព្រះអាទិត្យ', tag: 'Blazing Sun Corona', bg1: '#1c1917', bg2: '#7c2d12', c1: '#fde047', c2: '#ea580c', font: 'Bebas Neue', art: 'circle_cover', viz: 'circular', bgType: 'fire_magma', style: 'gold' },
    { id: 'scifi_aurora_polar', name: 'Aurora Borealis Sky', nameKh: 'ពន្លឺប៉ូលខាងជើង Aurora', tag: 'Green Ribbon Glow', bg1: '#022c22', bg2: '#064e3b', c1: '#86efac', c2: '#22d3ee', font: 'Outfit', art: 'square_glass', viz: 'waves', bgType: 'radial_glow', style: 'neon' }
  ];

  scifiStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'scifi', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 8. RETRO & VINTAGE (10 Presets)
  const retroStyles = [
    { id: 'retro_cassette_tape', name: 'Retro 90s Cassette Deck', nameKh: 'កាសែតចាក់ចម្រៀងទសវត្សរ៍ ៩០', tag: 'Tape Reels & Vibe', bg1: '#292524', bg2: '#44403c', c1: '#f97316', c2: '#fbbf24', font: 'Battambang', art: 'cassette', viz: 'bars', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'retro_vinyl_gramophone', name: 'Gramophone 1950s Classic', nameKh: 'ម៉ាស៊ីនក្រាម៉ូហ្វូន សម័យ 50s', tag: 'Vintage Brass & Wood', bg1: '#1c1917', bg2: '#451a03', c1: '#fef08a', c2: '#d97706', font: 'Moul', art: 'vinyl', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'retro_boombox_street', name: 'Street Hip-Hop Boombox 80s', nameKh: 'Boombox តាមផ្លូវ ញូវយ៉ក 80s', tag: 'Dual Speaker Boom', bg1: '#18181b', bg2: '#27272a', c1: '#facc15', c2: '#ef4444', font: 'Bebas Neue', art: 'retro_boombox', viz: 'bars', bgType: 'radial_glow', style: '3d_shadow' },
    { id: 'retro_walkman_cd', name: 'Sony Walkman 1990s', nameKh: 'ម៉ាស៊ីន Walkman CD ឆ្នាំ 90', tag: 'Translucent Cyan Case', bg1: '#083344', bg2: '#164e63', c1: '#38bdf8', c2: '#e0f2fe', font: 'Outfit', art: 'cd_jewel_case', viz: 'bars', bgType: 'radial_glow', style: 'chrome' },
    { id: 'retro_disco_fever_77', name: 'Saturday Night Disco 1977', nameKh: 'រាត្រីឌីស្កូ Disco Fever 1977', tag: 'Mirrorball & Gold Pants', bg1: '#1e0533', bg2: '#4a044e', c1: '#fde047', c2: '#ec4899', font: 'Righteous', art: 'vinyl', viz: 'double_mirror_bars', bgType: 'disco_lasers', style: 'neon' },
    { id: 'retro_8track_tape', name: '8-Track Cartridge Classic', nameKh: 'កាសែត 8-Track សម័យ 70s', tag: 'Woodgrain & Mustard', bg1: '#292524', bg2: '#78350f', c1: '#fed7aa', c2: '#ea580c', font: 'Battambang', art: 'cassette', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'retro_vhs_glitch_88', name: 'VHS Tape Glitch 1988', nameKh: 'ខ្សែវីដេអូ VHS ឆ្នាំ 1988', tag: 'Scanlines & Static', bg1: '#09090b', bg2: '#18181b', c1: '#38bdf8', c2: '#ef4444', font: 'Orbitron', art: 'cassette', viz: 'cyber_equalizer', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'retro_drive_in_cinema', name: 'Drive-in Movie Cinema', nameKh: 'រោងកុនមើលតាមឡាន', tag: 'Neon Signboard Glow', bg1: '#111827', bg2: '#1f2937', c1: '#f87171', c2: '#60a5fa', font: 'Righteous', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'retro_radio_station', name: 'Vintage FM Radio Station', nameKh: 'ស្ថានីយ៍វិទ្យុ FM បុរាណ', tag: 'AM/FM Frequency Dial', bg1: '#1c1917', bg2: '#44403c', c1: '#fde68a', c2: '#ca8a04', font: 'Koh Santepheap', art: 'retro_boombox', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'retro_jukebox_diner', name: '50s American Diner Jukebox', nameKh: 'ម៉ាស៊ីន Jukebox បុរាណ', tag: 'Curved Chrome Tubes', bg1: '#180000', bg2: '#450a0a', c1: '#38bdf8', c2: '#ef4444', font: 'Righteous', art: 'vinyl', viz: 'circular', bgType: 'radial_glow', style: 'neon' }
  ];

  retroStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'retro', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 9. DARK, ROCK & TECHNO (10 Presets)
  const darkStyles = [
    { id: 'dark_techno_crimson', name: 'Dark Crimson Techno', nameKh: 'ភ្លេងតិចណូ ក្រហមឆេះ', tag: 'Heavy Bass & Red Glow', bg1: '#180000', bg2: '#450a0a', c1: '#ef4444', c2: '#b91c1c', font: 'Metal', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'dark_heavy_metal', name: 'Heavy Metal Thunder', nameKh: 'រ៉ុកធ្ងន់ Heavy Metal ផ្គរលាន់', tag: 'Lightning & Spikes', bg1: '#09090b', bg2: '#18181b', c1: '#f8fafc', c2: '#ef4444', font: 'Metal', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'outline' },
    { id: 'dark_gothic_cathedral', name: 'Gothic Cathedral Shadow', nameKh: 'វិហារហ្គោធិក ស្រមោលអន្ធការ', tag: 'Blood Ruby & Stone', bg1: '#050505', bg2: '#450a0a', c1: '#f87171', c2: '#991b1b', font: 'Cinzel', art: 'square_glass', viz: 'circular', bgType: 'radial_glow', style: '3d_shadow' },
    { id: 'dark_cyber_industrial', name: 'Industrial Cyber Noise', nameKh: 'រោងចក្រឧស្សាហកម្ម Industrial', tag: 'Rusted Iron & Sparks', bg1: '#1c1917', bg2: '#292524', c1: '#f97316', c2: '#78716c', font: 'Orbitron', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'radial_glow', style: 'glitch' },
    { id: 'dark_midnight_raver', name: 'Midnight Underground Rave', nameKh: 'រាត្រីរាំក្រោមដី Rave', tag: 'Strobe Flash & Bass', bg1: '#020617', bg2: '#0f172a', c1: '#f43f5e', c2: '#22d3ee', font: 'Bebas Neue', art: 'cd_jewel_case', viz: 'bars', bgType: 'disco_lasers', style: 'neon' },
    { id: 'dark_hellfire_magma', name: 'Hellfire Magma Volcano', nameKh: 'ភ្នំភ្លើងកម្អែរ Hellfire', tag: 'Boiling Lava Embers', bg1: '#180000', bg2: '#450a0a', c1: '#fbbf24', c2: '#dc2626', font: 'Metal', art: 'circle_cover', viz: 'circular', bgType: 'fire_magma', style: 'gold' },
    { id: 'dark_vampire_blood', name: 'Vampire Bloodline Vibe', nameKh: 'បិសាចជញ្ជក់ឈាម រាត្រី', tag: 'Deep Wine & Silver', bg1: '#1a0006', bg2: '#4c0519', c1: '#fecdd3', c2: '#be123c', font: 'Cinzel', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'chrome' },
    { id: 'dark_abyss_ocean', name: 'Abyssal Deep Trench', nameKh: 'បាតសមុទ្រជ្រៅ អន្ធការ', tag: 'Midnight Navy Ocean', bg1: '#020617', bg2: '#082f49', c1: '#38bdf8', c2: '#0369a1', font: 'Outfit', art: 'circle_cover', viz: 'circular', bgType: 'radial_glow', style: 'neon' },
    { id: 'dark_shadow_assassin', name: 'Shadow Shinobi Blade', nameKh: 'ឃាតករស្រមោល នីនចា', tag: 'Steel Katana Shine', bg1: '#09090b', bg2: '#18181b', c1: '#e4e4e7', c2: '#71717a', font: 'Orbitron', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'chrome' },
    { id: 'dark_acid_techno', name: 'Acid Techno 303 TB', nameKh: 'Acid 303 Techno លឿងបៃតង', tag: 'Toxic Fluorescent Glow', bg1: '#052e16', bg2: '#14532d', c1: '#a3e635', c2: '#22c55e', font: 'Orbitron', art: 'vinyl', viz: 'cyber_equalizer', bgType: 'radial_glow', style: 'neon' }
  ];

  darkStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'dark', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 10. NATURE & AMBIENT ZEN (10 Presets)
  const natureStyles = [
    { id: 'nature_ocean_breeze', name: 'Ocean Cyan Breeze', nameKh: 'រលកសមុទ្រខៀវស្រស់', tag: 'Liquid Aqua Waves', bg1: '#083344', bg2: '#155e75', c1: '#22d3ee', c2: '#38bdf8', font: 'Siemreap', art: 'circle_cover', viz: 'waves', bgType: 'radial_glow', style: 'neon' },
    { id: 'nature_tropical_rainforest', name: 'Tropical Rainforest Mist', nameKh: 'ព្រៃព្រឹក្សាត្រូពិច ទឹកសន្សើម', tag: 'Emerald Leaves & Birds', bg1: '#022c22', bg2: '#064e3b', c1: '#6ee7b7', c2: '#10b981', font: 'Koh Santepheap', art: 'circle_cover', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'nature_mountain_waterfall', name: 'Mountain Crystal Waterfall', nameKh: 'ទឹកជ្រោះភ្នំ ថ្លាឆ្វង់', tag: 'Fresh Blue Cascades', bg1: '#082f49', bg2: '#0369a1', c1: '#bae6fd', c2: '#38bdf8', font: 'Preahvihear', art: 'square_glass', viz: 'waves', bgType: 'radial_glow', style: 'chrome' },
    { id: 'nature_zen_bamboo', name: 'Zen Bamboo Garden', nameKh: 'សួនឫស្សី Zen ស្ងប់ចិត្ត', tag: 'Fresh Olive & Matcha', bg1: '#14532d', bg2: '#166534', c1: '#d9f99d', c2: '#84cc16', font: 'Kantumruy Pro', art: 'square_glass', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'nature_desert_dunes', name: 'Sahara Golden Dunes', nameKh: 'វាលខ្សាច់សាហារ៉ា ពណ៍មាស', tag: 'Warm Sand Waves', bg1: '#451a03', bg2: '#78350f', c1: '#fef08a', c2: '#f59e0b', font: 'Battambang', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'gold' },
    { id: 'nature_pine_forest', name: 'Nordic Pine Forest Winter', nameKh: 'ព្រៃស្រល់រដូវរងា ទឹកកក', tag: 'Frost Teal & Pine', bg1: '#064e3b', bg2: '#134e4a', c1: '#ccfbf1', c2: '#2dd4bf', font: 'Outfit', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'chrome' },
    { id: 'nature_spring_meadow', name: 'Spring Meadow Wildflowers', nameKh: 'វាលស្មៅផ្ការីក និទាឃរដូវ', tag: 'Pastel Yellow & Green', bg1: '#14532d', bg2: '#15803d', c1: '#fef08a', c2: '#4ade80', font: 'Kantumruy Pro', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'nature_sunset_horizon', name: 'Golden Hour Horizon', nameKh: 'ជើងមេឃ ម៉ោងមាស', tag: 'Horizon Amber Glow', bg1: '#431407', bg2: '#9a3412', c1: '#fef08a', c2: '#f97316', font: 'Battambang', art: 'vinyl', viz: 'waves', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'nature_deep_monsoon', name: 'Monsoon Thunder Rain', nameKh: 'ភ្លៀងរដូវវស្សា ផ្គរលាន់', tag: 'Deep Indigo Rain', bg1: '#030712', bg2: '#1e293b', c1: '#93c5fd', c2: '#60a5fa', font: 'Siemreap', art: 'vinyl', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'nature_coral_reef', name: 'Coral Reef Aquamarine', nameKh: 'ថ្មប៉ប្រះទឹកផ្កាថ្ម សមុទ្រ', tag: 'Turquoise & Coral Pink', bg1: '#083344', bg2: '#0e7490', c1: '#f472b6', c2: '#22d3ee', font: 'Outfit', art: 'cd_jewel_case', viz: 'waves', bgType: 'radial_glow', style: 'neon' }
  ];

  natureStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'nature', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  // 11. ANIME & VAPORWAVE (10 Presets)
  const animeStyles = [
    { id: 'anime_vaporwave_statue', name: 'Vaporwave 1995 Aesthetic', nameKh: 'Vaporwave រូបសំណាក 1995', tag: 'Marble Statue & Palms', bg1: '#1e0533', bg2: '#581c87', c1: '#67e8f9', c2: '#f472b6', font: 'Outfit', art: 'cd_jewel_case', viz: 'double_mirror_bars', bgType: 'synthwave_grid', style: 'neon' },
    { id: 'anime_shibuya_cross', name: 'Shibuya Crossing Anime', nameKh: 'ផ្លូវប្រសព្វ ស៊ីប៊ូយ៉ា ជប៉ុន', tag: 'Vibrant Tokyo Anime Glow', bg1: '#0f172a', bg2: '#831843', c1: '#38bdf8', c2: '#fb7185', font: 'Poppins', art: 'square_glass', viz: 'bars', bgType: 'radial_glow', style: 'neon' },
    { id: 'anime_lofi_girl', name: 'Anime Lofi Chill Beats', nameKh: 'ក្មេងស្រីរៀន Lo-Fi Beats', tag: 'Sunset Warmth & Cat', bg1: '#451a03', bg2: '#9a3412', c1: '#fed7aa', c2: '#f472b6', font: 'Kantumruy Pro', art: 'cassette', viz: 'waves', bgType: 'blurred_cover', style: 'soft_shadow' },
    { id: 'anime_magical_girl', name: 'Magical Girl Sparkle', nameKh: 'វេទមន្តក្មេងស្រី ផ្កាយចាំង', tag: 'Star Wand & Pastel Pink', bg1: '#701a75', bg2: '#a21caf', c1: '#fdf4ff', c2: '#f472b6', font: 'Great Vibes', art: 'circle_cover', viz: 'circular', bgType: 'sakura_petals', style: 'floating_glass' },
    { id: 'anime_mecha_pilot', name: 'Gundam Mecha Cockpit', nameKh: 'មនុស្សយន្ត Mecha ប្រយុទ្ធ', tag: 'Cockpit Green & Amber', bg1: '#052e16', bg2: '#064e3b', c1: '#4ade80', c2: '#facc15', font: 'Orbitron', art: 'square_glass', viz: 'cyber_equalizer', bgType: 'cyber_hud', style: 'glitch' },
    { id: 'anime_cyber_city_pop', name: 'Japanese City Pop 80s', nameKh: 'City Pop ជប៉ុន សម័យ 80s', tag: 'Summer Night Breeze', bg1: '#172554', bg2: '#1d4ed8', c1: '#93c5fd', c2: '#f43f5e', font: 'Righteous', art: 'vinyl', viz: 'bars', bgType: 'synthwave_grid', style: 'neon' },
    { id: 'anime_future_funk', name: 'Future Funk Disco Dance', nameKh: 'Future Funk រាំសប្បាយ', tag: 'Groovy Pastel Glitter', bg1: '#3b0764', bg2: '#701a75', c1: '#fbcfe8', c2: '#38bdf8', font: 'Outfit', art: 'cd_jewel_case', viz: 'double_mirror_bars', bgType: 'disco_lasers', style: 'neon' },
    { id: 'anime_night_drive', name: 'Midnight Highway Drive', nameKh: 'បើកឡានរាត្រី តន្ត្រីស្ងប់ស្ងាត់', tag: 'Distant City Lights', bg1: '#030712', bg2: '#1e1b4b', c1: '#38bdf8', c2: '#a855f7', font: 'Outfit', art: 'vinyl', viz: 'bars', bgType: 'radial_glow', style: 'soft_shadow' },
    { id: 'anime_spirited_spirit', name: 'Spirited Dreamland', nameKh: 'ទឹកដីវេទមន្ត ពិភពសុបិន', tag: 'Mystical Teal & Gold', bg1: '#042f2e', bg2: '#115e59', c1: '#99f6e4', c2: '#fde047', font: 'Siemreap', art: 'circle_cover', viz: 'circular', bgType: 'radial_glow', style: 'gold' },
    { id: 'anime_neon_arcade_hero', name: 'Pixel Hero Arcade Quest', nameKh: 'ដំណើរផ្សងព្រេង ហ្គេមភីកសែល', tag: '8-Bit Retro Rainbow', bg1: '#0a0017', bg2: '#312e81', c1: '#facc15', c2: '#06b6d4', font: 'Righteous', art: 'retro_boombox', viz: 'cyber_equalizer', bgType: 'synthwave_grid', style: 'neon' }
  ];

  animeStyles.forEach(s => {
    presets.push(createPreset(s.id, s.name, s.nameKh, 'anime', s.tag, s.bg1, s.bg2, s.c1, s.c2, s.font, s.art, s.viz, s.bgType, s.style));
  });

  return presets;
}

/**
 * Standard preset builder
 */
function createPreset(id, name, nameKh, category, tag, bg1, bg2, c1, c2, font, art, viz, bgType, textStyle) {
  return {
    id,
    name,
    nameKh,
    category,
    tag,
    background: {
      type: bgType || 'radial_glow',
      primaryColor: bg1,
      secondaryColor: bg2,
      accentColor: c1,
      blur: bgType === 'blurred_cover' ? 30 : 0,
      opacity: 1
    },
    visualizer: {
      type: viz || 'bars',
      barCount: viz === 'circular' ? 72 : 64,
      barWidth: 6,
      barGap: 3,
      glow: 24,
      colorMode: 'gradient',
      color1: c1,
      color2: c2,
      sensitivity: 1.3,
      position: viz === 'circular' ? 'center' : 'bottom'
    },
    typography: {
      titleFont: font || 'Outfit',
      artistFont: font === 'Moul' || font === 'Bayon' ? 'Kantumruy Pro' : font,
      titleSize: font === 'Moul' || font === 'Bayon' ? 46 : 52,
      artistSize: 24,
      titleColor: textStyle === 'gold' ? '#fef08a' : (textStyle === 'chrome' ? '#ffffff' : '#f8fafc'),
      artistColor: c1,
      textStyle: textStyle || 'neon',
      glowColor: c1,
      strokeWidth: textStyle === 'gold' ? 2 : (textStyle === 'outline' ? 3 : 0),
      strokeColor: '#000000',
      alignment: 'center',
      titleY: 0.22,
      artistY: 0.30,
      lyricsY: 0.78,
      showTrackNumber: true,
      showDuration: true
    },
    artwork: {
      type: art || 'vinyl',
      size: 260,
      position: 'center',
      rotationSpeed: 0.5,
      showVinylArm: art === 'vinyl'
    }
  };
}

// Generate the complete 110+ Presets collection
const STUDIO_PRESETS = generate100PlusPresets();

window.PRESET_CATEGORIES = PRESET_CATEGORIES;
window.STUDIO_PRESETS = STUDIO_PRESETS;

window.getStudioPresetById = function(id) {
  return STUDIO_PRESETS.find(p => p.id === id) || STUDIO_PRESETS[0];
};

/**
 * Procedurally generates a completely new random aesthetic theme
 */
window.generateRandomPreset = function() {
  const fonts = ['Outfit', 'Kantumruy Pro', 'Battambang', 'Moul', 'Siemreap', 'Orbitron', 'Cinzel', 'Space Grotesk', 'Bebas Neue', 'Great Vibes', 'Righteous', 'Bayon', 'Metal'];
  const styles = ['neon', 'gold', 'chrome', 'glitch', '3d_shadow', 'floating_glass', 'soft_shadow', 'outline'];
  const vizTypes = ['bars', 'circular', 'waves', 'cyber_equalizer', 'double_mirror_bars'];
  const artTypes = ['vinyl', 'cassette', 'square_glass', 'circle_cover', 'cd_jewel_case', 'golden_mandala', 'retro_boombox'];
  const bgTypes = ['synthwave_grid', 'radial_glow', 'blurred_cover', 'nebula_stars', 'particles_burst', 'disco_lasers', 'cyber_hud', 'sakura_petals'];

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

  const c1 = randomColor();
  const c2 = randomColor();
  const bg1 = randomColor();
  const bg2 = randomColor();
  const font = randomPick(fonts);
  const viz = randomPick(vizTypes);
  const art = randomPick(artTypes);
  const bg = randomPick(bgTypes);
  const style = randomPick(styles);

  return createPreset(
    `random_${Date.now()}`,
    '🎲 Random Style ' + Math.floor(Math.random() * 999),
    '🎲 ស្តាយចៃដន្យ ' + Math.floor(Math.random() * 999),
    'all',
    'Custom Generated',
    bg1, bg2, c1, c2, font, art, viz, bg, style
  );
};
