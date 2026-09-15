import { pathToFileURL } from 'url'
import connectDB from '../config/db.js'
import Admin from '../models/Admin.js'
import Settings from '../models/Settings.js'
import Skill from '../models/Skill.js'
import Experience from '../models/Experience.js'
import Education from '../models/Education.js'
import Project from '../models/Project.js'

const defaultSkills = [
  { name: 'React', category: 'Frontend', level: 95, displayOrder: 1, visible: true },
  { name: 'Next.js', category: 'Frontend', level: 88, displayOrder: 2, visible: true },
  { name: 'JavaScript', category: 'Frontend', level: 96, displayOrder: 3, visible: true },
  { name: 'TypeScript', category: 'Frontend', level: 82, displayOrder: 4, visible: true },
  { name: 'Node.js', category: 'Backend', level: 92, displayOrder: 5, visible: true },
  { name: 'Express', category: 'Backend', level: 92, displayOrder: 6, visible: true },
  { name: 'MongoDB', category: 'Database', level: 90, displayOrder: 7, visible: true },
  { name: 'Mongoose', category: 'Database', level: 88, displayOrder: 8, visible: true },
  { name: 'REST API', category: 'Backend', level: 94, displayOrder: 9, visible: true },
  { name: 'JWT Auth', category: 'Backend', level: 86, displayOrder: 10, visible: true },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, displayOrder: 11, visible: true },
  { name: 'Bootstrap', category: 'Frontend', level: 84, displayOrder: 12, visible: true },
  { name: 'Framer Motion', category: 'Design', level: 82, displayOrder: 13, visible: true },
  { name: 'Git & GitHub', category: 'Tools', level: 89, displayOrder: 14, visible: true },
  { name: 'Vite', category: 'Tools', level: 86, displayOrder: 15, visible: true },
  { name: 'Cloudinary', category: 'Tools', level: 78, displayOrder: 16, visible: true },
  { name: 'SEO', category: 'Other', level: 80, displayOrder: 17, visible: true },
  { name: 'UI/UX', category: 'Design', level: 88, displayOrder: 18, visible: true },
]

const defaultEducation = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institute: 'University / Higher Education',
    year: '2020 — 2024',
    description: 'Focused on software engineering, web technologies, and user-centric digital product development.',
    displayOrder: 1,
    visible: true,
  },
  {
    degree: 'Intermediate / ICS',
    institute: 'Higher Secondary Education',
    year: '2018 — 2020',
    description: 'Built a strong foundation in mathematics, logic, and computer-based problem solving.',
    displayOrder: 2,
    visible: true,
  },
]

const defaultExperience = [
  {
    company: 'Freelance / Independent Projects',
    position: 'MERN Stack Developer',
    description: 'Designed and built premium, conversion-focused websites for beauty, salon, hospitality, tailoring, retail, and mobility brands.',
    startDate: '2022',
    endDate: 'Present',
    current: true,
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'UI/UX'],
    displayOrder: 1,
    visible: true,
  },
  {
    company: 'Portfolio Brand Projects',
    position: 'Frontend & Full-Stack Developer',
    description: 'Crafted luxury landing pages and client-facing experiences with responsive design systems, CMS support, and business-ready interfaces.',
    startDate: '2021',
    endDate: '2024',
    current: false,
    technologies: ['React', 'Vite', 'Framer Motion', 'MongoDB', 'REST APIs'],
    displayOrder: 2,
    visible: true,
  },
  {
    company: 'Product Design & Web Development',
    position: 'UI/UX & Frontend Engineer',
    description: 'Translated brand direction into polished user experiences, optimized conversion paths, and scalable design systems.',
    startDate: '2020',
    endDate: '2022',
    current: false,
    technologies: ['UI Design', 'JavaScript', 'CSS', 'Responsive Design'],
    displayOrder: 3,
    visible: true,
  },
]

const defaultProjects = [
  {
    title: 'Miti Beauty',
    slug: 'miti-beauty',
    description: 'Luxury beauty brand website with editorial styling, premium booking experience, and polished conversion-focused UX for a modern salon and spa business.',
    category: 'Frontend',
    year: '2025',
    technologies: ['React', 'Vite', 'CSS', 'Responsive UI'],
    thumbnail: '/previews/miti-beauty.png',
    gallery: ['/previews/miti-beauty.png'],
    githubUrl: '',
    liveUrl: 'https://miti-nine.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 1,
    views: 0,
    problem: 'The brand needed a high-end aesthetic that felt premium while remaining easy to navigate and book from mobile devices.',
    solution: 'Built a refined luxury experience with elegant typography, editorial storytelling, booking CTAs, and mobile-first conversion flows.',
    features: ['Luxury brand design', 'Booking funnel', 'Responsive layout'],
    results: 'Improved brand presentation and stronger customer trust for a premium beauty service business.',
    process: 'Brand-first design and conversion optimization across hero, navigation, and appointment flow.',
    client: 'Miti Beauty',
    projectType: 'Luxury Brand Website',
  },
  {
    title: 'Shiza Salon',
    slug: 'shiza-salon',
    description: 'Elegant salon and bridal website presenting premium beauty services with clean sections, service information, and a refined conversion journey.',
    category: 'Frontend',
    year: '2025',
    technologies: ['React', 'Framer Motion', 'CSS', 'Responsive Design'],
    thumbnail: '/previews/shiza-salon.png',
    gallery: ['/previews/shiza-salon.png'],
    githubUrl: '',
    liveUrl: 'https://shiza-salon.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 2,
    views: 0,
    problem: 'A beauty business needed a calm, premium online presence to increase appointment inquiries and reflect the quality of the brand.',
    solution: 'Created a refined salon identity with luxury minimal styling, clear service hierarchy, and direct action-oriented CTAs.',
    features: ['Premium visual language', 'Service presentation', 'Conversion pages'],
    results: 'Elevated the client experience and gave the salon a modern digital storefront.',
    process: 'Content architecture, brand styling, and high-conversion page flow.',
    client: 'Shiza Salon',
    projectType: 'Salon Website',
  },
  {
    title: 'Maestro Cafe',
    slug: 'maestro-cafe',
    description: 'Restaurant landing page with a cinematic dark premium aesthetic, brand storytelling, and a reservation-focused layout for hospitality marketing.',
    category: 'Full Stack',
    year: '2025',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'UI/UX'],
    thumbnail: '/previews/maestro-cafe.png',
    gallery: ['/previews/maestro-cafe.png'],
    githubUrl: '',
    liveUrl: 'https://maestro-cafe-gujranwala.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 3,
    views: 0,
    problem: 'The cafe needed a luxury hospitality identity that could communicate ambiance, cuisine, and reservations in one experience.',
    solution: 'Built a dark, cinematic homepage with strong typography, lifestyle imagery, and a landing flow designed to encourage bookings.',
    features: ['Luxury restaurant theme', 'Reservation messaging', 'Brand storytelling'],
    results: 'Created a premium digital first impression for an upscale culinary brand.',
    process: 'Visual direction, brand positioning, and responsive UI implementation.',
    client: 'Maestro Cafe',
    projectType: 'Hospitality Website',
  },
  {
    title: 'Him Tailors',
    slug: 'him-tailors',
    description: 'Tailoring brand showcase with premium menswear positioning, service clarity, and measurement-focused user journey for custom garment clients.',
    category: 'Frontend',
    year: '2025',
    technologies: ['React', 'Tailwind CSS', 'Responsive UI', 'Landing Page'],
    thumbnail: '/previews/him-tailors.png',
    gallery: ['/previews/him-tailors.png'],
    githubUrl: '',
    liveUrl: 'https://him-tailors.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 4,
    views: 0,
    problem: 'A tailored clothing brand needed a more elevated and trustworthy digital presence to attract premium clients.',
    solution: 'Designed a refined luxury identity with strong service storytelling, fabric messaging, and direct booking call-to-actions.',
    features: ['Premium tailoring branding', 'Service highlights', 'Measurement CTA'],
    results: 'Sharper brand positioning and a more premium customer perception.',
    process: 'Luxury positioning and conversion-focused landing page design.',
    client: 'Him Tailors',
    projectType: 'Tailoring Website',
  },
  {
    title: 'Bagswave',
    slug: 'bagswave',
    description: 'Premium retail storefront for accessories and luxury lifestyle products with a soft editorial palette and modern e-commerce styling.',
    category: 'E-commerce',
    year: '2025',
    technologies: ['React', 'CSS', 'Product UI', 'Responsive Storefront'],
    thumbnail: '/previews/bagswave.png',
    gallery: ['/previews/bagswave.png'],
    githubUrl: '',
    liveUrl: 'https://bagswave.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 5,
    views: 0,
    problem: 'The product offering needed to feel premium and designed, not generic, while still being easy to browse and discover.',
    solution: 'Built a modern luxury retail landing experience with clean catalog presentation, color collections, and product storytelling.',
    features: ['Luxury retail design', 'Collection presentation', 'Shop-first UX'],
    results: 'Created a stronger luxury product identity and product-led browsing experience.',
    process: 'Editorial layout system and product-focused design flow.',
    client: 'Bagswave',
    projectType: 'Luxury E-Commerce',
  },
  {
    title: 'Faisal Rent A Car',
    slug: 'faisal-rent-a-car',
    description: 'Luxury car rental landing page with a dark premium layout, clear fleet marketing, and strong booking intent for premium transport services.',
    category: 'Full Stack',
    year: '2025',
    technologies: ['React', 'Vite', 'Node.js', 'Responsive UI'],
    thumbnail: '/previews/faisal-rentacar.png',
    gallery: ['/previews/faisal-rentacar.png'],
    githubUrl: '',
    liveUrl: 'https://faisal-rentacar.vercel.app/',
    featured: true,
    published: true,
    displayOrder: 6,
    views: 0,
    problem: 'The rental business needed an upscale digital presence that felt premium and trustworthy for luxury car bookings.',
    solution: 'Created a sleek dark theme portfolio experience with fleet highlights, pricing emphasis, and booking-driven messaging.',
    features: ['Fleet showcase', 'Premium visuals', 'Booking-focused UX'],
    results: 'Improved the car rental brand’s presentation and booking appeal.',
    process: 'Luxury vehicle brand design, conversion flow, and responsive implementation.',
    client: 'Faisal Rent A Car',
    projectType: 'Vehicle Rental Website',
  },
]

const runSeed = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hassannoor.dev'
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123456'
    const exists = await Admin.findOne({ email: adminEmail })

    if (!exists) {
      await Admin.create({ name: 'Hassan Noor', email: adminEmail, password: adminPass, role: 'admin' })
      console.log(`Admin created: ${adminEmail}`)
    } else {
      exists.password = adminPass
      await exists.save()
      console.log('Admin already exists. Password synced.')
    }

    const settingsExists = await Settings.findOne({ singleton: true })
    if (!settingsExists) {
      await Settings.create({
        siteName: 'Hassan Noor',
        headline: 'MERN Stack Developer',
        bio: 'I build high-performance, scalable web applications with a focus on clean design, premium UX, and business growth.',
        email: 'hassannoor2309@gmail.com',
        location: 'Pakistan',
        availability: 'Open to Work',
        socials: {
          github: 'https://github.com/hassannoor230',
          linkedin: 'https://www.linkedin.com/in/hassan-noor-509794325/',
          instagram: 'https://instagram.com/rana_hassannoor',
          twitter: '',
          other: '',
        },
        seo: {
          title: 'Hassan Noor — MERN Stack Developer',
          description: 'Portfolio of Hassan Noor, a MERN Stack Developer building premium web applications and brand experiences.',
          keywords: 'MERN Stack Developer, React Developer, Full Stack Developer, Node.js, MongoDB, Portfolio',
        },
        contact: {
          phone: '+92 324 2481606',
          whatsapp: 'https://wa.me/923242481606',
        },
      })
      console.log('Default settings created.')
    }

    const [skillCount, educationCount, experienceCount, projectCount] = await Promise.all([
      Skill.countDocuments(),
      Education.countDocuments(),
      Experience.countDocuments(),
      Project.countDocuments(),
    ])

    if (skillCount === 0) {
      await Skill.insertMany(defaultSkills)
      console.log(`Seeded ${defaultSkills.length} skills.`)
    }

    if (educationCount === 0) {
      await Education.insertMany(defaultEducation)
      console.log(`Seeded ${defaultEducation.length} education entries.`)
    }

    if (experienceCount === 0) {
      await Experience.insertMany(defaultExperience)
      console.log(`Seeded ${defaultExperience.length} experience entries.`)
    }

    if (projectCount === 0) {
      await Project.insertMany(defaultProjects)
      console.log(`Seeded ${defaultProjects.length} projects.`)
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  connectDB()
    .then(() => runSeed())
    .catch((err) => {
      console.error('Seed bootstrap failed:', err.message)
      process.exit(1)
    })
}

export default runSeed