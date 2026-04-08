import { useEffect, useMemo, useState } from "react"
import { getTimeBinding } from "../helpers/timeBinding"

export function useTimeValue(appliedSpec: any, timeMax: number) {
  const [timeValue, setTimeValue] = useState<number>(0)

  const hasTimeSlider = useMemo(() => {
    return !!getTimeBinding(appliedSpec) && timeMax > 0
  }, [appliedSpec, timeMax])

  useEffect(() => {
    if (!appliedSpec) return
    const b = getTimeBinding(appliedSpec)
    if (!b) return
    setTimeValue(b.value)
  }, [appliedSpec])

  return { timeValue, setTimeValue, hasTimeSlider }
}