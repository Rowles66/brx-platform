import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface BRXAPIResponse {
  url: string;
  status: number;
  body: string;
}

interface BRXUserData {
  id: number;
  nickname: string;
  total_calories: number;
  current_frc_score: number;
  num_workouts: number;
  num_badges: number;
  level: number;
  points: number;
  first_name: string;
  last_name: string;
  profile_image: string;
  time_zone: string;
  created_at: number;
  about_me: string;
  favorite_exercises: number[];
  website: string;
  time_zone_mapping: string;
  cached_slug: string;
  phone_number: string;
  health_info_metrics: string[];
  default_health_metrics: string[];
  trainer_profile_fields: string[];
  measurements_order: string[];
  default_measurements: string[];
  tags: string[];
  badges: number[];
  roles?: string[];
}

interface BRXPlatformData {
  id: number;
  trainer_id: number;
  platform_tabs: any;
  custom_app_menu: any[];
  business_metrics: any[];
  payment_options: any[];
  theme: {
    primary: string;
    secondary: string;
    neutral: string;
  };
  feature_flags: string[];
  brand: string;
  subdomain: string;
  host: string;
  trainer_name: string;
  enable_fbm: boolean;
  ios_download_link: string;
  android_download_link: string;
  logo_url: string;
  icon_url: string;
  email_logo_url: string;
  client_tags: string[];
  exercise_tags: string[];
  video_tags: string[];
  service_tags: string[];
  package_tags: string[];
  stats_list: Array<{
    stat: string;
    label: string;
    hidden: boolean;
  }>;
  links: Record<string, string>;
}

async function importBRXData() {
  console.log('🚀 Starting BRX data import...')

  // Read API responses from collected data
  const apiResponsesPath = path.join(
    process.cwd(),
    'scraped_reference/auth_assets_from_auth_extract/api_calls/api_responses.json'
  )

  if (!fs.existsSync(apiResponsesPath)) {
    console.log('❌ BRX API responses file not found at:', apiResponsesPath)
    console.log('Please ensure the file exists in the scraped_reference directory')
    return
  }

  try {
    const apiResponses: BRXAPIResponse[] = JSON.parse(
      fs.readFileSync(apiResponsesPath, 'utf-8')
    )

    console.log(`📊 Found ${apiResponses.length} API responses to process`)

    // Process each API response
    for (const response of apiResponses) {
      if (response.status !== 200 || !response.body || response.body === 'null') {
        continue
      }

      try {
        const data = JSON.parse(response.body)
        
        if (response.url.includes('/api/v2/platforms/current')) {
          await importPlatformConfig(data as BRXPlatformData)
        } else if (response.url.includes('/api/v4/users/') && data.id) {
          await importUserData(data as BRXUserData)
        }
      } catch (parseError) {
        console.log(`⚠️  Failed to parse response from ${response.url}:`, parseError)
      }
    }

    console.log('✅ BRX data import completed successfully!')

  } catch (error) {
    console.error('❌ Error importing BRX data:', error)
    throw error
  }
}

async function importPlatformConfig(platformData: BRXPlatformData) {
  console.log('📋 Importing platform configuration...')

  try {
    // Import platform configuration
    await prisma.platformConfig.upsert({
      where: { brxPlatformId: platformData.id },
      update: {
        brand: platformData.brand,
        subdomain: platformData.subdomain,
        host: platformData.host,
        trainerName: platformData.trainer_name,
        platformTabs: platformData.platform_tabs,
        customAppMenu: platformData.custom_app_menu,
        businessMetrics: platformData.business_metrics,
        paymentOptions: platformData.payment_options,
        theme: platformData.theme,
        featureFlags: platformData.feature_flags,
        enableFbm: platformData.enable_fbm,
        iosDownloadLink: platformData.ios_download_link,
        androidDownloadLink: platformData.android_download_link,
        logoUrl: platformData.logo_url,
        iconUrl: platformData.icon_url,
        apiLinks: platformData.links,
      },
      create: {
        brxPlatformId: platformData.id,
        brand: platformData.brand,
        subdomain: platformData.subdomain,
        host: platformData.host,
        trainerName: platformData.trainer_name,
        platformTabs: platformData.platform_tabs,
        customAppMenu: platformData.custom_app_menu,
        businessMetrics: platformData.business_metrics,
        paymentOptions: platformData.payment_options,
        theme: platformData.theme,
        featureFlags: platformData.feature_flags,
        enableFbm: platformData.enable_fbm,
        iosDownloadLink: platformData.ios_download_link,
        androidDownloadLink: platformData.android_download_link,
        logoUrl: platformData.logo_url,
        iconUrl: platformData.icon_url,
        apiLinks: platformData.links,
      },
    })

    // Import measurement types from stats_list
    if (platformData.stats_list) {
      console.log(`📊 Importing ${platformData.stats_list.length} measurement types...`)
      
      for (const stat of platformData.stats_list) {
        await prisma.measurementType.upsert({
          where: { name: stat.label },
          update: {
            brxStatKey: stat.stat,
            hidden: stat.hidden,
          },
          create: {
            name: stat.label,
            category: categorizeMeasurement(stat.stat),
            brxStatKey: stat.stat,
            hidden: stat.hidden,
            isDefault: false,
          },
        })
      }
    }

    // Import tags
    const allTags = [
      ...(platformData.client_tags || []).map(tag => ({ name: tag, category: 'CLIENT' as const })),
      ...(platformData.exercise_tags || []).map(tag => ({ name: tag, category: 'EXERCISE' as const })),
      ...(platformData.video_tags || []).map(tag => ({ name: tag, category: 'VIDEO' as const })),
      ...(platformData.service_tags || []).map(tag => ({ name: tag, category: 'SERVICE' as const })),
      ...(platformData.package_tags || []).map(tag => ({ name: tag, category: 'PACKAGE' as const })),
    ]

    console.log(`🏷️  Importing ${allTags.length} tags...`)
    
    for (const tag of allTags) {
      await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: {
          name: tag.name,
          category: tag.category,
          isDefault: false,
        },
      })
    }

    console.log('✅ Platform configuration imported successfully')

  } catch (error) {
    console.error('❌ Error importing platform config:', error)
    throw error
  }
}

async function importUserData(userData: BRXUserData) {
  console.log(`👤 Importing user data for: ${userData.first_name} ${userData.last_name}`)

  try {
    // Create user with BRX data
    await prisma.user.upsert({
      where: { 
        brxUserId: userData.id 
      },
      update: {
        firstName: userData.first_name,
        lastName: userData.last_name,
        nickname: userData.nickname,
        phoneNumber: userData.phone_number,
        timeZone: userData.time_zone_mapping,
        website: userData.website,
        aboutMe: userData.about_me,
        profileImage: userData.profile_image,
        totalCalories: userData.total_calories,
        currentFrcScore: userData.current_frc_score,
        numWorkouts: userData.num_workouts,
        numBadges: userData.num_badges,
        level: userData.level,
        points: userData.points,
        tags: userData.tags || [],
        roles: userData.roles || ['user'],
        favoriteExercises: userData.favorite_exercises || [],
      },
      create: {
        email: `user${userData.id}@brxperformance.com`, // Placeholder email
        password: 'placeholder', // Will be updated during authentication migration
        brxUserId: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        nickname: userData.nickname,
        phoneNumber: userData.phone_number,
        timeZone: userData.time_zone_mapping,
        website: userData.website,
        aboutMe: userData.about_me,
        profileImage: userData.profile_image,
        totalCalories: userData.total_calories,
        currentFrcScore: userData.current_frc_score,
        numWorkouts: userData.num_workouts,
        numBadges: userData.num_badges,
        level: userData.level,
        points: userData.points,
        tags: userData.tags || [],
        roles: userData.roles || ['user'],
        favoriteExercises: userData.favorite_exercises || [],
      },
    })

    console.log(`✅ User data imported for: ${userData.first_name} ${userData.last_name}`)

  } catch (error) {
    console.error('❌ Error importing user data:', error)
    throw error
  }
}

function categorizeMeasurement(statKey: string): string {
  if (statKey.includes('dash') || statKey.includes('sprint')) return 'SPEED'
  if (statKey.includes('jump') || statKey.includes('velocity') || statKey.includes('velo')) return 'POWER'
  if (statKey.includes('deadlift') || statKey.includes('squat') || statKey.includes('1rm')) return 'STRENGTH'
  if (statKey.includes('sleep') || statKey.includes('satisfaction') || statKey.includes('recovery')) return 'RECOVERY'
  if (statKey.includes('calories') || statKey.includes('protein')) return 'NUTRITION'
  if (statKey.includes('throw') || statKey.includes('pitch')) return 'THROWING'
  if (statKey.includes('bat') || statKey.includes('exit')) return 'HITTING'
  if (statKey.includes('weight') || statKey.includes('body_fat') || statKey.includes('bmi')) return 'BODY_COMPOSITION'
  
  return 'CUSTOM'
}

async function main() {
  try {
    await importBRXData()
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()