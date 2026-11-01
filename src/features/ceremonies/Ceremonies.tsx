import { ceremonies } from '@/config/content'
import { CeremonyCard } from './CeremonyCard'
import { Families } from './Families'

export function Ceremonies() {
  return (
    <div className="space-y-8">
      {/* Tiêu đề & Dòng xướng tên */}
      <div className="text-center space-y-2">
        <h2 className="font-script text-4xl font-normal text-primary">
          Thông tin lễ cưới
        </h2>
        <p className="font-sans text-sm font-medium text-foreground/85">
          Trưởng nam Kiều Anh Quân &amp; Trưởng nữ Tôn Mai Hương
        </p>
        <div className="mx-auto h-px w-16 bg-accent/50 pt-1" />
      </div>

      {/* Hai thẻ lễ cưới */}
      <div className="space-y-6">
        {ceremonies.map((ceremony) => (
          <CeremonyCard key={ceremony.id} ceremony={ceremony} />
        ))}
      </div>

      {/* Thông tin phụ mẫu hai bên */}
      <Families />
    </div>
  )
}
