// SVG Guage (https://github.com/naikus/svg-gauge?tab=readme-ov-file)


import { useEffect, useRef } from 'react'
import SvgGauge, { GaugeOptions, GaugeInstance } from 'svg-gauge'

import { settings } from '../common/settings'

const colors = {"calories":"#93C0A4", "fat":"#FFED66", "carbs":"#83C9F4", "protein":"#FF9FB2"}

interface ComplexGuageProps {
    value: number,
    label: (v:number)=>string,
    color: (v:number)=>string,
    max?: number
}

interface SimpleGuageProps {
    value: number
}

const Gauge = ({ value, label, color, max=100 }: ComplexGuageProps) => {
  const gaugeEl = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<GaugeInstance | null>(null)

  useEffect(() => {
    if (!gaugeRef.current) {
      if (!gaugeEl.current) return
      const options: GaugeOptions = { color: color, max:max, label:label }
      gaugeRef.current = SvgGauge(gaugeEl.current, options)
      gaugeRef.current?.setValue(1)
    }
    gaugeRef.current?.setValueAnimated(value, 1)
  }, [value])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={gaugeEl} />
    </div>
  )
}

export const CaloriesGauge = ({ value }: SimpleGuageProps) => {
    return (
      <Gauge 
        value={value} 
        label={(v:number) => v.toString() + "/" + settings.daily_calories.toString()}
        color={(v:number) => colors["calories"]}
        max={settings.daily_calories} />
    )
}

export const FatGauge = ({ value }: SimpleGuageProps) => {
    return (
      <Gauge 
        value={value} 
        color={(v:number) => colors["fat"]}
        label={(v:number) => v.toString() + "/" + settings.daily_fat.toString()}
        max={settings.daily_fat} />
    )
}

export const CarbGauge = ({ value }: SimpleGuageProps) => {
    return (
        <Gauge 
        value={value} 
        label={(v:number) => v.toString() + "/" + settings.daily_carbs.toString()}
        color={(v:number) => colors["carbs"]}
        max={settings.daily_carbs} />
    )
}

export const ProteinGauge = ({ value }: SimpleGuageProps) => {
    return (
        <Gauge 
        value={value} 
        label={(v:number) => v.toString() + "/" + settings.daily_protein.toString()}
        color={(v:number) => colors["protein"]}
        max={settings.daily_protein} />
    )
}

export default Gauge;