import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 20, strokeWidth = 1.6, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const WhatsAppIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} strokeLinejoin="round" {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Icon>
)
export const SearchIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} strokeLinecap="round" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Icon>
)
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
)
export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const CheckIcon = (p: IconProps) => (
  <Icon strokeWidth={4} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
)
export const ShareIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </Icon>
)
export const CopyIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <rect x="9" y="9" width="12" height="12" />
    <path d="M5 15H3V3h12v2" />
  </Icon>
)
export const ImageIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <rect x="3" y="3" width="18" height="18" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </Icon>
)
export const BagIcon = (p: IconProps) => (
  <Icon strokeWidth={1.7} strokeLinejoin="round" {...p}>
    <path d="M5 8h14l-1 13H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
)
export const PlusIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const MinusIcon = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}>
    <path d="M5 12h14" />
  </Icon>
)
export const TrashIcon = (p: IconProps) => (
  <Icon strokeWidth={1.7} strokeLinejoin="round" {...p}>
    <path d="M4 7h16M10 7V4h4v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
  </Icon>
)
