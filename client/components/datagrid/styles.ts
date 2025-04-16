import type { Theme } from '@glideapps/glide-data-grid'

// Define keys for base properties
type BaseThemeKeys =
  | 'cellHorizontalPadding'
  | 'cellVerticalPadding'
  | 'headerIconSize'
  | 'roundingRadius'
  | 'headerFontStyle'
  | 'baseFontStyle'
  | 'markerFontStyle'
  | 'fontFamily'
  | 'editorFontSize'
  | 'lineHeight'

// Create type for base theme props
type BaseThemeProps = Pick<Theme, BaseThemeKeys>

// Create type for theme colors
type ThemeColors = Omit<Theme, BaseThemeKeys>

// Base theme properties
const baseThemeProps: BaseThemeProps = {
  // Dimensions & Spacing
  cellHorizontalPadding: 8,
  cellVerticalPadding: 3,
  headerIconSize: 18,
  roundingRadius: 4,

  // Typography
  headerFontStyle: '500 13px',
  baseFontStyle: '12px',
  markerFontStyle: '11px',
  fontFamily: "'JetBrains Mono Variable', ui-monospace, Menlo, monospace",
  editorFontSize: '12px',
  lineHeight: 1.3,
}

// Light theme
export const lightTheme: ThemeColors = {
  ...baseThemeProps,
  // Accent & Selection
  accentColor: 'hsl(45, 100%, 60%)', // Primary accent color
  accentFg: 'hsl(0, 0%, 14.5%)', // Text on accent backgrounds
  accentLight: 'hsl(45, 100%, 60%, 0.1)', // Subtle accent for highlights

  // Text colors
  textDark: 'hsl(225 12% 12%)', // Primary text color
  textMedium: 'hsl(215 16% 46.1%)', // Secondary text color
  textLight: 'hsl(215 16% 46.1% / 0.8)', // Tertiary text color
  textBubble: 'hsl(225 12% 12%)', // Text in bubble elements

  // Header colors
  bgIconHeader: 'hsl(215 16% 46.1%)', // Header icon background
  fgIconHeader: 'hsl(0 0% 100%)', // Header icon color
  textHeader: 'hsl(215 16% 46.1%)', // Header text color
  textGroupHeader: 'hsl(215 16% 46.1% / 0.7)', // Group header text
  textHeaderSelected: 'hsl(225 12% 12%)', // Selected header text

  // Cell backgrounds
  bgCell: 'hsl(0 0% 100%)', // Default cell background
  bgCellMedium: 'hsl(210 40% 96.1%)', // Alternative cell background
  bgHeader: 'hsl(210 40% 98%)', // Header background
  bgHeaderHasFocus: 'hsl(210 40% 94%)', // Focused header background
  bgHeaderHovered: 'hsl(210 40% 96.1%)', // Hovered header background

  // Selection & Search
  bgBubble: 'hsl(210 40% 96.1%)', // Bubble element background
  bgBubbleSelected: 'hsl(210 40% 98%)', // Selected bubble background
  bgSearchResult: 'hsl(48 100% 50% / 0.1)', // Search highlight background

  // Borders
  borderColor: 'hsl(214.3 31.8% 91.4%)', // Standard border color
  drilldownBorder: 'hsl(0 0% 0% / 0)', // Drilldown element border
  horizontalBorderColor: 'hsl(214.3 31.8% 91.4%)', // Horizontal grid lines

  // Links
  linkColor: 'hsl(45, 100%, 60%)', // Hyperlink color

  // Optional properties
  resizeIndicatorColor: 'hsl(45, 100%, 60%)', // Column resize indicator
  headerBottomBorderColor: 'hsl(214.3 31.8% 91.4%)', // Bottom border of headers
}

// Dark theme
export const darkTheme: ThemeColors = {
  ...baseThemeProps,
  // Accent & Selection
  accentColor: 'hsl(45, 100%, 55%)', // Primary accent color
  accentFg: 'hsl(0, 0%, 14.5%)', // Text on accent backgrounds
  accentLight: 'hsl(45, 100%, 55%, 0.1)', // Subtle accent for highlights

  // Text colors
  textDark: 'hsl(210 6% 98%)', // Primary text color
  textMedium: 'hsl(215 6% 72%)', // Secondary text color
  textLight: 'hsl(215 6% 72% / 0.8)', // Tertiary text color
  textBubble: 'hsl(210 6% 98%)', // Text in bubble elements

  // Header colors
  bgIconHeader: 'hsl(215 6% 72%)', // Header icon background
  fgIconHeader: 'hsl(225 12% 12%)', // Header icon color
  textHeader: 'hsl(215 6% 72%)', // Header text color
  textGroupHeader: 'hsl(215 6% 72% / 0.7)', // Group header text
  textHeaderSelected: 'hsl(210 6% 98%)', // Selected header text

  // Cell backgrounds
  bgCell: 'hsl(225 12% 8.5%)', // Default cell background
  bgCellMedium: 'hsl(225 12% 16%)', // Alternative cell background
  bgHeader: 'hsl(225 12% 12%)', // Header background
  bgHeaderHasFocus: 'hsl(225 12% 20%)', // Focused header background
  bgHeaderHovered: 'hsl(225 12% 16%)', // Hovered header background

  // Selection & Search
  bgBubble: 'hsl(225 12% 16%)', // Bubble element background
  bgBubbleSelected: 'hsl(225 12% 12%)', // Selected bubble background
  bgSearchResult: 'hsl(48 100% 50% / 0.1)', // Search highlight background

  // Borders
  borderColor: 'hsl(225 12% 18%)', // Standard border color
  drilldownBorder: 'hsl(0 0% 100% / 0)', // Drilldown element border
  horizontalBorderColor: 'hsl(225 12% 18%)', // Horizontal grid lines

  // Links
  linkColor: 'hsl(45, 100%, 55%)', // Hyperlink color

  // Optional properties
  resizeIndicatorColor: 'hsl(45, 100%, 55%)', // Column resize indicator
  headerBottomBorderColor: 'hsl(225 12% 18%)', // Bottom border of headers
}
