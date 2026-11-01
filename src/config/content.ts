import type { AlbumPhoto, Ceremony, Family, GiftInfo } from '@/types'

export const ceremonies: Ceremony[] = [
  {
    id: 'vuquy',
    title: 'Lễ Vu Quy',
    startsAt: '2026-11-24T13:00:00+07:00',
    weekdayLabel: 'THỨ 3',
    dateLabel: '24.11.2026',
    lunarLabel: 'Tức ngày 16.10 năm Bính Ngọ',
    timeLabel: '13:00',
    placeLabel: 'Tại Tư Gia',
    address: 'Thôn Phú Cường, Ngọc Thiện, Bắc Ninh',
    oldAddress: 'Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang',
    mapUrl: 'https://maps.app.goo.gl/YBAr7qdV3bzqdfwz7',
  },
  {
    id: 'thanhhon',
    title: 'Lễ Thành Hôn',
    startsAt: '2026-11-24T17:00:00+07:00',
    weekdayLabel: 'THỨ 3',
    dateLabel: '24.11.2026',
    lunarLabel: 'Tức ngày 16.10 năm Bính Ngọ',
    timeLabel: '17:00',
    placeLabel: 'Minh Dương Palace',
    address: 'Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội',
    mapUrl: 'https://maps.app.goo.gl/fyWEn4suXaZ3xnsd7',
  },
]

export const families: Family[] = [
  { side: 'groom', father: 'Kiều Văn Nghĩa', mother: 'Nguyễn Thị Phương Lan' },
  { side: 'bride', father: 'Đào Duy Hồng', mother: 'Dương Thị Hải' },
]

export const albumPhotos: AlbumPhoto[] = [
  { src: '/images/album/album-01.webp', alt: 'Anh Quân và Mai Hương trong phòng chụp tông kem, cô dâu cầm hoa trắng', width: 900, height: 1350 },
  { src: '/images/album/album-02.webp', alt: 'Cặp đôi trên nền tối lấp lánh, voan cô dâu bay trong gió', width: 900, height: 1350 },
  { src: '/images/album/album-03.webp', alt: 'Anh Quân và Mai Hương trong áo dài truyền thống, cô dâu cầm hoa sen', width: 900, height: 1350 },
  { src: '/images/album/album-04.webp', alt: 'Cặp đôi cười cùng nhau dưới tấm voan trên sân thượng', width: 900, height: 1350 },
  { src: '/images/album/album-05.webp', alt: 'Cô dâu chú rể sánh bước giữa hoa và bầu trời xanh', width: 900, height: 1350 },
  { src: '/images/album/album-06.webp', alt: 'Cô dâu và chú rể nhìn nhau, váy cưới dài trải trên sân thượng', width: 900, height: 1350 },
  { src: '/images/album/album-07.webp', alt: 'Cặp đôi bên những bó hoa hồng phấn trong phòng chụp sáng', width: 900, height: 1350 },
  { src: '/images/album/album-08.webp', alt: 'Cặp đôi bên hồ lúc hoàng hôn, voan bay theo gió', width: 900, height: 1350 },
  { src: '/images/album/album-09.webp', alt: 'Chú rể và cô dâu bên cột đèn, thành phố lên đèn phía sau', width: 900, height: 1350 },
  { src: '/images/album/album-10.webp', alt: 'Khoảnh khắc ôm nhau gần gũi của cặp đôi buổi tối', width: 900, height: 1350 },
]

export const defaultGifts: GiftInfo[] = [
  {
    id: 'groom',
    side: 'groom',
    label: 'Mừng cưới chú rể',
    accountName: 'KIEU ANH QUAN',
    bank: 'MB (Ngân hàng TMCP Quân đội)',
    qrSrc: '/qr/qr-groom.png',
  },
  {
    id: 'bride',
    side: 'bride',
    label: 'Mừng cưới cô dâu',
    accountName: 'TON MAI HUONG',
    bank: 'Co-opBank (Ngân hàng Hợp tác xã Việt Nam)',
    qrSrc: '/qr/qr-bride.png',
  },
]

export const content = {
  cover: { names: 'Anh Quân & Mai Hương', date: '24.11.2026', openLabel: 'Mở thiệp' },
  hero: 'sắp về chung một nhà',
  heroImage: '/images/hero.webp',
  couple: [
    { name: 'Kiều Anh Quân', role: 'Trưởng nam', image: '/images/groom.webp' },
    { name: 'Tôn Mai Hương', role: 'Trưởng nữ', image: '/images/bride.webp' },
  ],
  ceremonies,
  families,
  album: albumPhotos,
  gifts: defaultGifts,
  music: '/mp3/music.mp3',
  closing: 'Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi!',
  sections: [
    { id: 'couple', title: 'Cô dâu & chú rể' },
    { id: 'ceremonies', title: 'Thông tin lễ cưới' },
    { id: 'album', title: 'Album ảnh' },
    { id: 'countdown', title: 'Đếm ngược ngày chung đôi' },
    { id: 'directions', title: 'Chỉ đường' },
    { id: 'rsvp', title: 'Xác nhận tham dự' },
    { id: 'guestbook', title: 'Sổ lưu bút' },
    { id: 'gift', title: 'Hộp quà mừng' },
  ],
  placeholder: 'Nội dung đang được chuẩn bị.',
  footer: 'Anh Quân & Mai Hương · 24.11.2026',
}
