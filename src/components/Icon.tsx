/**
 * Icon — лёгкий SVG-набор в стиле Lucide / Phosphor.
 * Все иконки в одном файле для простоты, используют currentColor + stroke.
 */

export type IconName =
  | 'lotus' | 'sparkles' | 'calendar' | 'user' | 'shopping-bag'
  | 'chevron-right' | 'chevron-left' | 'arrow-right' | 'arrow-up-right' | 'arrow-back'
  | 'x' | 'check' | 'star' | 'heart' | 'heart-filled' | 'share' | 'settings' | 'pencil' | 'search'
  | 'lip' | 'droplet' | 'leaf' | 'wave' | 'bolt' | 'sun' | 'syringe' | 'bottle' | 'cream' | 'mask'
  | 'send' | 'mic' | 'message' | 'globe' | 'pin' | 'clock' | 'gift' | 'crown' | 'shield-check'
  | 'plus' | 'minus' | 'info' | 'warning' | 'flower'
  | 'stethoscope' | 'pulse' | 'microscope' | 'pill' | 'flask' | 'phone' | 'whatsapp' | 'telegram'
  | 'vk' | 'map' | 'file' | 'calendar-check' | 'filter' | 'logout' | 'bell' | 'home'
  | 'chevron-down' | 'award' | 'route' | 'sparkle-ai' | 'users';

interface Props {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: 'none' | 'current';
}

export function Icon({ name, size = 22, strokeWidth = 1.8, className, style, fill = 'none' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill === 'current' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

const PATHS: Record<IconName, React.ReactNode> = {
  // Navigation
  'lotus': (
    <>
      <path d="M12 22c0-4-2-7-5-7 0-3 2-5 5-5s5 2 5 5c-3 0-5 3-5 7z" />
      <path d="M12 10c-3-2-5-5-5-7 3 0 5 2 5 4 0-2 2-4 5-4 0 2-2 5-5 7z" />
    </>
  ),
  'sparkles': (
    <>
      <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" />
      <path d="M19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
      <path d="M5 17l.7 1.4 1.3.6-1.3.6L5 21l-.7-1.4L3 19l1.3-.6L5 17z" />
    </>
  ),
  'calendar': (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8" cy="14" r="0.5" fill="currentColor" />
      <circle cx="12" cy="14" r="0.5" fill="currentColor" />
      <circle cx="16" cy="14" r="0.5" fill="currentColor" />
    </>
  ),
  'user': (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </>
  ),
  'shopping-bag': (
    <>
      <path d="M5 9h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 9z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </>
  ),
  // Arrows
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17L17 7M9 7h8v8" />,
  'arrow-back': <path d="M19 12H5M11 6l-6 6 6 6" />,
  // Actions
  'x': <path d="M6 6l12 12M6 18L18 6" />,
  'check': <path d="M5 12l5 5L19 7" />,
  'star': <path d="M12 3l2.6 6 6.4.6-4.8 4.4 1.4 6.4L12 17.3 6.4 20.4l1.4-6.4L3 9.6l6.4-.6L12 3z" />,
  'heart': <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 7-3.5A4.5 4.5 0 0 1 19 11c0 5.5-7 10-7 10z" />,
  'heart-filled': <path d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 7-3.5A4.5 4.5 0 0 1 19 11c0 5.5-7 10-7 10z" fill="currentColor" />,
  'share': (
    <>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="5" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" />
    </>
  ),
  'settings': (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12c0 .6-.05 1.2-.14 1.78l2.05 1.6-2 3.46-2.45-.86c-.95.78-2.05 1.38-3.25 1.74L13 22h-4l-.21-2.28a8.13 8.13 0 0 1-3.25-1.74l-2.45.86-2-3.46 2.05-1.6A8.13 8.13 0 0 1 3 12c0-.6.05-1.2.14-1.78l-2.05-1.6 2-3.46 2.45.86c.95-.78 2.05-1.38 3.25-1.74L9 2h4l.21 2.28c1.2.36 2.3.96 3.25 1.74l2.45-.86 2 3.46-2.05 1.6c.09.58.14 1.18.14 1.78z" />
    </>
  ),
  'pencil': (
    <>
      <path d="M14 4l6 6L8 22H2v-6L14 4z" />
      <path d="M13 5l6 6" />
    </>
  ),
  'search': (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </>
  ),
  // Beauty / procedures
  'lip': (
    <>
      <path d="M3 12c1-3 4-5 9-5s8 2 9 5c-2 2-5 4-9 4s-7-2-9-4z" />
      <path d="M3 12c1.5 1.2 4 2 6 2s4.5-.8 6-2" />
      <path d="M8 9c1.5-1 3-1.5 4-1.5s2.5.5 4 1.5" />
    </>
  ),
  'droplet': <path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z" />,
  'leaf': (
    <>
      <path d="M21 3c0 9-6 16-13 16-3 0-5-2-5-5 0-7 7-13 16-13l2 2z" />
      <path d="M3 19c4-4 9-7 14-9" />
    </>
  ),
  'wave': (
    <>
      <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </>
  ),
  'bolt': <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  'sun': (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  'syringe': (
    <>
      <path d="M18 2l4 4M16 4l4 4M14 6l-9 9-2 5 5-2 9-9" />
      <path d="M13 11l-3-3" />
    </>
  ),
  'bottle': (
    <>
      <path d="M9 3h6v3l1.5 2c.3.5.5 1 .5 1.5V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.5c0-.5.2-1 .5-1.5L9 6V3z" />
      <path d="M9 13h6" />
    </>
  ),
  'cream': (
    <>
      <rect x="5" y="8" width="14" height="13" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M8 13h8" />
    </>
  ),
  'mask': (
    <>
      <path d="M4 9c0-3 3-5 8-5s8 2 8 5v3c0 4-3 7-8 7s-8-3-8-7V9z" />
      <circle cx="9" cy="11" r="0.8" fill="currentColor" />
      <circle cx="15" cy="11" r="0.8" fill="currentColor" />
    </>
  ),
  // Chat / actions
  'send': <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  'mic': (
    <>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  'message': (
    <>
      <path d="M21 12c0 4.5-4 8-9 8-1.5 0-2.9-.3-4.2-.9L3 21l1.4-3.6A8.1 8.1 0 0 1 3 12c0-4.5 4-8 9-8s9 3.5 9 8z" />
    </>
  ),
  'globe': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  'pin': (
    <>
      <path d="M12 22s7-8 7-13a7 7 0 0 0-14 0c0 5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  'clock': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'gift': (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12h18M12 8v13M8 8a2 2 0 0 1 0-4c2 0 4 4 4 4s-2 0-4 0zM16 8a2 2 0 0 0 0-4c-2 0-4 4-4 4s2 0 4 0z" />
    </>
  ),
  'crown': <path d="M3 18l2-10 5 5 2-8 2 8 5-5 2 10H3z" />,
  'shield-check': (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
      <path d="M8 12l3 3 5-5" />
    </>
  ),
  'plus': <path d="M12 5v14M5 12h14" />,
  'minus': <path d="M5 12h14" />,
  'info': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 8v0.5" />
    </>
  ),
  'warning': (
    <>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v4M12 17v0.5" />
    </>
  ),
  'flower': (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5c-1-3-1-5 0-7 1 2 1 4 0 7zM12 14.5c-1 3-1 5 0 7 1-2 1-4 0-7zM9.5 12c-3-1-5-1-7 0 2 1 4 1 7 0zM14.5 12c3-1 5-1 7 0-2 1-4 1-7 0z" />
      <path d="M10.2 10.2c-2-2-3-3.5-3.5-5 1.5.5 3 1.5 5 3.5zM13.8 13.8c2 2 3 3.5 3.5 5-1.5-.5-3-1.5-5-3.5zM13.8 10.2c2-2 3.5-3 5-3.5-.5 1.5-1.5 3-3.5 5zM10.2 13.8c-2 2-3.5 3-5 3.5.5-1.5 1.5-3 3.5-5z" />
    </>
  ),
  // Medical
  'stethoscope': (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <path d="M6 3H4M14 3h2" />
      <path d="M10 17v1a4 4 0 0 0 8 0v-2" />
      <circle cx="18" cy="15" r="2.2" />
    </>
  ),
  'pulse': <path d="M2 12h4l2-6 4 12 2.5-8 1.5 2H22" />,
  'microscope': (
    <>
      <path d="M6 20h11M8 20l1-3M9 4l4 4-3.5 3.5-4-4L9 4z" />
      <path d="M11 10c3 0 5 2.5 5 5H8" />
    </>
  ),
  'pill': (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  'flask': (
    <>
      <path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  'phone': <path d="M4 5c0 8 7 15 15 15l1.5-3.5-4-2-1.7 1.7a12 12 0 0 1-4.9-4.9l1.7-1.7-2-4L6.5 4A2 2 0 0 0 4 5z" />,
  'whatsapp': (
    <>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />
      <path d="M8.5 8c-.3 0-.7.1-.9.5-.3.5-.8 1.4-.3 2.7.6 1.6 2.4 3.6 4.6 4.3 1.3.4 2-.1 2.4-.6.3-.4.3-1 .2-1.1l-1.4-.7c-.2 0-.4 0-.6.2l-.5.6c-.1.2-.3.2-.5.1a5 5 0 0 1-2.3-2.3c-.1-.2 0-.4.1-.5l.5-.5.1-.6-.7-1.4c-.1-.3-.6-.2-1-.2z" fill="currentColor" stroke="none" />
    </>
  ),
  'telegram': <path d="M21 4L3 11l5 2 2 6 3-4 5 4 3-15z" />,
  'vk': <path d="M4 7c1 6 4 10 9 10h1v-3c1 0 2 1 3 2l1 1h3c-1-2-2-3-4-4 1-1 3-3 3-5h-3c-1 2-2 3-3 4V7h-4v4c-2 0-3-2-4-4H4z" fill="currentColor" stroke="none" />,
  'map': (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  'file': (
    <>
      <path d="M6 2h8l4 4v16H6V2z" />
      <path d="M14 2v4h4M9 13h6M9 17h6" />
    </>
  ),
  'calendar-check': (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
    </>
  ),
  'filter': <path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" />,
  'logout': <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 12h10M17 9l3 3-3 3" />,
  'bell': (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 6-3 8-3 8h18s-3-2-3-8z" />
      <path d="M10.5 21a2 2 0 0 0 3 0" />
    </>
  ),
  'home': (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'award': (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5L7.5 22l4.5-2.5L16.5 22 15 13.5" />
    </>
  ),
  'route': (
    <>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M6 16.5V11a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4" opacity="0" />
      <path d="M8.5 19H14a4 4 0 0 0 4-4V7.5" />
    </>
  ),
  'sparkle-ai': (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" fill="currentColor" stroke="none" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="currentColor" stroke="none" />
    </>
  ),
  'users': (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6.5M17 14c3 .5 5 2.7 5 6" />
    </>
  ),
};
