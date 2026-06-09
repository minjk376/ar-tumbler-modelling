export function calculateCylinderVolume(radius, height) {
  return Math.PI * radius * radius * height
}

export function calculateFrustumVolume(topRadius, bottomRadius, height) {
  return (
    (Math.PI * height * (
      bottomRadius * bottomRadius +
      bottomRadius * topRadius +
      topRadius * topRadius
    )) / 3
  )
}

export function calculateOverflowAmount(drinkVolume, cupVolume) {
  return Math.max(drinkVolume - cupVolume, 0)
}

export function calculateLiquidHeight(drinkVolume, cupVolume, cupHeight) {
  const liquidRatio = Math.min(drinkVolume / cupVolume, 1)
  return liquidRatio * cupHeight
}
