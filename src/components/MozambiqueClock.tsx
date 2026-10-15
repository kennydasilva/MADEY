import { useEffect, useState } from 'react'
import { Logo } from './Logo'

/** Horas, minutos e segundos atuais em Moçambique (um só fuso, o de Maputo), seja qual for o fuso do visitante. */
function mozambiqueTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Maputo',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { h: get('hour') % 24, m: get('minute'), s: get('second') }
}

const TICKS = Array.from({ length: 60 }, (_, i) => i)

/** Mostrador desenhado em SVG com a hora real de Moçambique; o monograma da MADEY fica no lugar da marca. */
export function MozambiqueClock({ className = '' }: { className?: string }) {
  const [t, setT] = useState(mozambiqueTime)

  useEffect(() => {
    const id = window.setInterval(() => setT(mozambiqueTime()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const hour = (t.h % 12) * 30 + t.m * 0.5
  const minute = t.m * 6 + t.s * 0.1
  const second = t.s * 6
  const label = `${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}`

  return (
    <figure className={`flex flex-col items-center gap-5 ${className}`}>
      <div role="img" aria-label={`Hora atual em Moçambique: ${label}`} className="relative aspect-square w-full">
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="91" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.5" />
          {TICKS.map((i) => {
            const hourMark = i % 5 === 0
            return (
              <line
                key={i}
                x1="100"
                y1={hourMark ? 11 : 12}
                x2="100"
                y2={hourMark ? 22 : 16}
                stroke="currentColor"
                strokeWidth={hourMark ? 1.8 : 0.6}
                strokeOpacity={hourMark ? 1 : 0.6}
                transform={`rotate(${i * 6} 100 100)`}
              />
            )
          })}
          <g stroke="currentColor" strokeLinecap="round">
            <line x1="100" y1="108" x2="100" y2="54" strokeWidth="3.2" transform={`rotate(${hour} 100 100)`} />
            <line x1="100" y1="110" x2="100" y2="32" strokeWidth="2" transform={`rotate(${minute} 100 100)`} />
          </g>
          <line
            x1="100"
            y1="118"
            x2="100"
            y2="26"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeLinecap="round"
            transform={`rotate(${second} 100 100)`}
          />
          <circle cx="100" cy="100" r="3.2" fill="currentColor" />
          <circle cx="100" cy="100" r="1.2" fill="#ffffff" />
        </svg>
        <Logo variant="mark" decorative className="absolute top-[27%] left-1/2 h-[13%] -translate-x-1/2" />
      </div>
      <figcaption className="text-label font-bold tracking-[0.2em] text-line uppercase tabular-nums">
        Agora em Moçambique · {label}
      </figcaption>
    </figure>
  )
}
