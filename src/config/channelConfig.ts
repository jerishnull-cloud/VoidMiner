import { ChannelInfo, ChannelResponseData, YouTubeVideo } from '../types/youtube';

export const CHANNEL_CONFIG = {
  name: 'VOID miner',
  title: 'VOID miner — Official Gaming Channel',
  tagline: 'Official Gaming Channel',
  subheading: 'Gaming. Minecraft. Challenges. Survival. And more.',
  description: 'Welcome to VOID miner! The ultimate Minecraft gaming hub featuring insane Hardcore 100 Days survival, high-stakes PvP tournaments, modded adventures, crazy void challenges, and funny gaming moments. Dive into the deep end with obsidian armor, neon purple energy, and non-stop gaming excitement.',
  
  // Custom or channel ID placeholders
  defaultChannelId: 'UCBRpBq57QfcK5yY2dolgl4Q',
  customUrl: '@VoidMINER00',
  
  // Social links - customizable placeholders
  socials: {
    youtube: 'https://www.youtube.com/@VoidMINER00',
    discord: 'https://discord.gg/Zp2vpznmP',
    twitter: 'https://x.com/voidminer_yt',
    instagram: 'https://www.instagram.com/void.miner/',
    twitch: 'https://twitch.tv/voidminer',
  },

  // Focus topics
  focusTags: [
    'Minecraft Survival',
    'Hardcore 100 Days',
    'Void Dimension',
    'High Stakes PvP',
    'Custom Mods',
    'Speedruns & Challenges',
    'Funny Moments'
  ],

  // Gaming Specs & Creator Profile
  creatorSpecs: {
    game: 'Minecraft Java Edition 1.21+',
    ign: 'VOID_Miner',
    shaders: 'Complementary Reimagined (Purple Void Profile)',
    resolution: '4K 60FPS HDR',
    recording: 'OBS Studio High Bitrate',
    server: 'play.voidminer-smp.net (Coming Soon)'
  },

  // Auto-refresh interval (5 minutes)
  autoRefreshIntervalMs: 5 * 60 * 1000,
};

// High quality thumbnail images for the authentic gaming channel look
export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'vm-vid-01',
    title: 'I Survived 100 Days in The VOID in Minecraft Hardcore (Full Movie)',
    description: 'Starting with nothing in an endless empty void dimension with custom bedrock platforms. Every single step could be my last! Can I reach the End Dimension and defeat the Void Dragon?',
    publishedAt: '2026-09-28T18:00:00Z',
    publishedAtFormatted: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT42M18S',
    durationFormatted: '42:18',
    durationSeconds: 2538,
    viewCount: 142000,
    viewCountFormatted: '142K',
    likeCount: 18400,
    likeCountFormatted: '18.4K',
    commentCount: 1890,
    category: 'VIDEOS',
    subCategory: 'Hardcore Survival',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-vid-02',
    title: 'Can You Beat Minecraft In Pitch Black Total Darkness? (Void Challenge)',
    description: 'We installed custom darkness shaders and locked gamma to 0. Torches burn out after 30 seconds and glowing obsidian mobs stalk the shadows. This was terrifying!',
    publishedAt: '2026-09-22T19:30:00Z',
    publishedAtFormatted: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT28M45S',
    durationFormatted: '28:45',
    durationSeconds: 1725,
    viewCount: 98000,
    viewCountFormatted: '98K',
    likeCount: 12200,
    likeCountFormatted: '12.2K',
    commentCount: 940,
    category: 'VIDEOS',
    subCategory: 'Void Challenge',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-vid-03',
    title: 'The Most Illegal Automatic Netherite & Ancient Debris Farm in 1.21',
    description: 'Using custom flying machines, bed blast duplicators, and sonic warden mechanics to collect 100+ Ancient Debris per hour. Step-by-step tutorial + world download!',
    publishedAt: '2026-09-15T16:00:00Z',
    publishedAtFormatted: '2 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT19M12S',
    durationFormatted: '19:12',
    durationSeconds: 1152,
    viewCount: 215000,
    viewCountFormatted: '215K',
    likeCount: 26000,
    likeCountFormatted: '26K',
    commentCount: 2100,
    category: 'VIDEOS',
    subCategory: 'Tutorial / Redstone',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-vid-04',
    title: 'I Trapped 50 Players Inside An Indestructible Purple Obsidian Maze',
    description: 'We invited 50 subscribers to a custom obstacle chamber filled with purple void traps, hidden redstone puzzles, and parkour challenges. The last survivor wins $1,000!',
    publishedAt: '2026-09-08T17:15:00Z',
    publishedAtFormatted: '3 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT31M04S',
    durationFormatted: '31:04',
    durationSeconds: 1864,
    viewCount: 340000,
    viewCountFormatted: '340K',
    likeCount: 41000,
    likeCountFormatted: '41K',
    commentCount: 3820,
    category: 'VIDEOS',
    subCategory: 'PvP & Challenges',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-vid-05',
    title: 'Building The Ultimate Mega Void Citadel in Hardcore Minecraft (Mega Base)',
    description: 'Over 200,000 deepslate tiles, crying obsidian, neon amethyst clusters, and purple stained glass. This is the biggest base project we have ever conceived!',
    publishedAt: '2026-08-30T15:00:00Z',
    publishedAtFormatted: '1 month ago',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT36M50S',
    durationFormatted: '36:50',
    durationSeconds: 2210,
    viewCount: 185000,
    viewCountFormatted: '185K',
    likeCount: 22800,
    likeCountFormatted: '22.8K',
    commentCount: 1650,
    category: 'VIDEOS',
    subCategory: 'Mega Builds',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-vid-06',
    title: 'Beating The Ancient Warden With ONLY Wooden Swords and Speed 2',
    description: 'They said it was impossible in pure survival without cheating. 45 minutes of pure dodging, heart attacks, and sonic boom deflections.',
    publishedAt: '2026-08-20T18:30:00Z',
    publishedAtFormatted: '1 month ago',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT22M15S',
    durationFormatted: '22:15',
    durationSeconds: 1335,
    viewCount: 162000,
    viewCountFormatted: '162K',
    likeCount: 19500,
    likeCountFormatted: '19.5K',
    commentCount: 1420,
    category: 'VIDEOS',
    subCategory: 'Boss Fights',
    isShort: false,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  }
];

export const FALLBACK_SHORTS: YouTubeVideo[] = [
  {
    id: 'vm-short-01',
    title: 'Top 3 Secret Minecraft 1.21 Bugs That ACTUALLY Work! 🤯 #shorts',
    description: 'Did you know you can do this with the new mace and wind charges? Try this before it gets patched!',
    publishedAt: '2026-09-29T20:00:00Z',
    publishedAtFormatted: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&h=1280&q=80',
    duration: 'PT0M45S',
    durationFormatted: '0:45',
    durationSeconds: 45,
    viewCount: 520000,
    viewCountFormatted: '520K',
    likeCount: 64000,
    likeCountFormatted: '64K',
    category: 'SHORTS',
    subCategory: 'Shorts',
    isShort: true,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-short-02',
    title: 'When You Drop Your Max Enchant Netherite Pickaxe In The Void... 💀 #shorts',
    description: 'Pain. Pure unfiltered Minecraft tragedy.',
    publishedAt: '2026-09-26T21:00:00Z',
    publishedAtFormatted: '4 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=720&h=1280&q=80',
    duration: 'PT0M28S',
    durationFormatted: '0:28',
    durationSeconds: 28,
    viewCount: 890000,
    viewCountFormatted: '890K',
    likeCount: 112000,
    likeCountFormatted: '112K',
    category: 'SHORTS',
    subCategory: 'Shorts',
    isShort: true,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-short-03',
    title: 'Insane 300-Block MLG Water Clutch from Sky Limit! #shorts',
    description: 'First attempt or 100 attempts? You decide in the comments 😂',
    publishedAt: '2026-09-23T19:00:00Z',
    publishedAtFormatted: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=720&h=1280&q=80',
    duration: 'PT0M32S',
    durationFormatted: '0:32',
    durationSeconds: 32,
    viewCount: 430000,
    viewCountFormatted: '430K',
    likeCount: 52000,
    likeCountFormatted: '52K',
    category: 'SHORTS',
    subCategory: 'Shorts',
    isShort: true,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-short-04',
    title: 'How To Make An Invisible Trap Using Ghost Blocks #shorts',
    description: 'Trolling my friends on the Void SMP server!',
    publishedAt: '2026-09-18T18:00:00Z',
    publishedAtFormatted: '12 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=720&h=1280&q=80',
    duration: 'PT0M52S',
    durationFormatted: '0:52',
    durationSeconds: 52,
    viewCount: 680000,
    viewCountFormatted: '680K',
    likeCount: 88000,
    likeCountFormatted: '88K',
    category: 'SHORTS',
    subCategory: 'Shorts',
    isShort: true,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-short-05',
    title: 'POV: You Hear Cave Noise 14 in Minecraft Hardcore at 3 AM 😱 #shorts',
    description: 'The real reason nobody goes mining alone anymore.',
    publishedAt: '2026-09-12T15:00:00Z',
    publishedAtFormatted: '2 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=720&h=1280&q=80',
    duration: 'PT0M19S',
    durationFormatted: '0:19',
    durationSeconds: 19,
    viewCount: 1100000,
    viewCountFormatted: '1.1M',
    likeCount: 145000,
    likeCountFormatted: '145K',
    category: 'SHORTS',
    subCategory: 'Shorts',
    isShort: true,
    isLive: false,
    youtubeUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  }
];

export const FALLBACK_COMPLETED_LIVES: YouTubeVideo[] = [
  {
    id: 'vm-live-01',
    title: 'VOID SMP SEASON 3 LAUNCH! 12-Hour Nonstop Survival Stream [VOD]',
    description: 'We started fresh on the official Void SMP with 15 creators. Setting up starter bases, finding the first diamonds, and raiding the Nether fortress!',
    publishedAt: '2026-09-25T14:00:00Z',
    publishedAtFormatted: '5 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT8H24M10S',
    durationFormatted: '8:24:10',
    durationSeconds: 30250,
    viewCount: 125000,
    viewCountFormatted: '125K',
    likeCount: 16500,
    likeCountFormatted: '16.5K',
    category: 'LIVE',
    subCategory: 'Live Stream VOD',
    isShort: false,
    isLive: false,
    isCompletedLive: true,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'vm-live-02',
    title: 'Subscribers vs Pro: 1v1 Netherite Crystal PvP Arena Tournament [VOD]',
    description: 'Taking on all challengers from Discord in the purple obsidian cage! Winner takes custom VIP rank.',
    publishedAt: '2026-09-17T20:00:00Z',
    publishedAtFormatted: '13 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1280&q=80',
    duration: 'PT4H15M30S',
    durationFormatted: '4:15:30',
    durationSeconds: 15330,
    viewCount: 78000,
    viewCountFormatted: '78K',
    likeCount: 10400,
    likeCountFormatted: '10.4K',
    category: 'LIVE',
    subCategory: 'Live Stream VOD',
    isShort: false,
    isLive: false,
    isCompletedLive: true,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  }
];

export const FALLBACK_CHANNEL: ChannelInfo = {
  id: 'UC_voidminer_official',
  title: 'VOID miner',
  description: 'Official YouTube channel for VOID miner. Epic Minecraft Survival, Hardcore 100 Days, Custom Challenges, and High Octane PvP with a signature neon purple and black aesthetic.',
  customUrl: '@VOIDminer',
  publishedAt: '2023-04-12T00:00:00Z',
  avatarUrl: '/images/void-miner-logo.png',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  subscriberCount: 124800,
  viewCount: 14850000,
  videoCount: 142,
  shortsCount: 48,
  hiddenSubscriberCount: false,
};

export function formatCompactNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

export function formatISODuration(isoDuration?: string): string {
  if (!isoDuration) return '0:00';
  if (!isoDuration.startsWith('PT')) return isoDuration;

  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '0:00';

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
}

export function parseISODurationSeconds(isoDuration?: string): number {
  if (!isoDuration) return 0;
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  } catch {
    return 'Recently';
  }
}

export function getInitialChannelData(): ChannelResponseData {
  return {
    channel: FALLBACK_CHANNEL,
    stats: {
      subscribers: FALLBACK_CHANNEL.subscriberCount,
      subscribersFormatted: formatCompactNumber(FALLBACK_CHANNEL.subscriberCount),
      totalViews: FALLBACK_CHANNEL.viewCount,
      totalViewsFormatted: formatCompactNumber(FALLBACK_CHANNEL.viewCount),
      videoCount: FALLBACK_CHANNEL.videoCount,
      shortsCount: FALLBACK_CHANNEL.shortsCount,
      liveCount: FALLBACK_COMPLETED_LIVES.length,
      lastUpdated: new Date().toISOString(),
    },
    featuredVideo: FALLBACK_VIDEOS[0],
    videos: FALLBACK_VIDEOS,
    shorts: FALLBACK_SHORTS,
    liveStatus: {
      isCurrentlyLive: false,
      recentLiveVideos: FALLBACK_COMPLETED_LIVES,
    },
    isLiveApi: false,
    lastSynced: new Date().toISOString(),
  };
}
