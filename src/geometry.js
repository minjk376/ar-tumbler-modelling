export function calculateCylinderVolume(radius, height) {
  return Math.PI * radius * radius * height
}

export function calculateOverflowAmount(drinkVolume, cupVolume) {
  return Math.max(drinkVolume - cupVolume, 0)
}

export function calculateLiquidHeight(drinkVolume, cupVolume, cupHeight) {
  const liquidRatio = Math.min(drinkVolume / cupVolume, 1)
  return liquidRatio * cupHeight
}
