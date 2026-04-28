import {
  BarChart3,
  Eye,
  Target,
  Zap,
  MessageCircle,
  Brain,
  Building2,
  Smartphone,
  TrendingUp,
  DollarSign,
  Gift,
  AlertTriangle,
  CheckCircle,
  Dot,
  Rocket,
  Shield,
  Plane,
  Home,
  Umbrella,
  BookOpen,
  CreditCard,
  Bell,
  Car,
  Utensils,
  Heart,
  ShoppingBag,
  Briefcase,
  Mail,
  Pencil,
  PartyPopper,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'

/**
 * Maps icon names to Lucide React icon components
 * Used throughout the app instead of emoji characters
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // UI Navigation & Actions
  building: Building2,
  smartphone: Smartphone,
  target: Target,
  zap: Zap,
  messageCircle: MessageCircle,
  brain: Brain,
  bell: Bell,
  pencil: Pencil,
  mail: Mail,
  
  // Financial Icons
  dollarSign: DollarSign,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  barChart: BarChart3,
  eye: Eye,
  gift: Gift,
  creditCard: CreditCard,
  
  // Status Icons
  check: CheckCircle,
  alert: AlertTriangle,
  dot: Dot,
  
  // Brand/Marketing Icons
  rocket: Rocket,
  partyPopper: PartyPopper,
  
  // Goal/Planning Icons
  shield: Shield,
  plane: Plane,
  home: Home,
  umbrella: Umbrella,
  book: BookOpen,
  
  // Category Icons
  utensils: Utensils,
  car: Car,
  heart: Heart,
  shoppingBag: ShoppingBag,
  briefcase: Briefcase,
}

/**
 * Get an icon component by name
 * @param name - Icon name from ICON_MAP
 * @returns Lucide React icon component or null
 */
export function getIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null
  return ICON_MAP[name] || null
}
