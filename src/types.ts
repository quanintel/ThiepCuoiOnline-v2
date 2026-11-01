export type CeremonyId = 'vuquy' | 'thanhhon'

export interface Ceremony {
  id: CeremonyId
  title: string
  startsAt: string
  weekdayLabel: string
  dateLabel: string
  lunarLabel: string
  timeLabel: string
  placeLabel: string
  address: string
  oldAddress?: string
  mapUrl: string
}

export interface Family {
  side: 'groom' | 'bride'
  father: string
  mother: string
}

export interface Wish {
  id: string
  name: string
  message: string
  createdAt: string
}

export interface RsvpInput {
  name: string
  attendance: 'vuquy' | 'thanhhon' | 'both' | 'none'
  guests: number
  note?: string
  hp?: string
}

export interface WishInput {
  name: string
  message: string
  hp?: string
}

export interface AlbumPhoto {
  src: string
  alt: string
  width: number
  height: number
}

export interface GiftInfo {
  id: 'groom' | 'bride'
  side?: 'groom' | 'bride'
  label: string
  accountName: string
  bank: string
  qrSrc: string
}

