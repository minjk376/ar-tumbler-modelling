function getOverflowEffectSizes(overflowAmount) {
  return {
    puddleRadius: 0.25 + Math.min(overflowAmount / 500, 0.9),
    dropletRadius: 0.04 + Math.min(overflowAmount / 3000, 0.08),
  }
}

function renderOverflowEffects({ radius, height, overflowAmount }) {
  if (overflowAmount <= 0) {
    return ''
  }

  const { puddleRadius, dropletRadius } = getOverflowEffectSizes(overflowAmount)

  return `
    <a-circle
      radius="${puddleRadius}"
      color="skyblue"
      opacity="0.55"
      rotation="-90 0 0"
      position="0 0.005 0">
    </a-circle>

    <a-sphere
      radius="${dropletRadius}"
      color="skyblue"
      opacity="0.85"
      position="${radius / 25} ${(height / 20) + 0.03} 0">
    </a-sphere>

    <a-sphere
      radius="${dropletRadius * 0.8}"
      color="skyblue"
      opacity="0.85"
      position="${-radius / 28} ${(height / 20) + 0.02} ${radius / 30}">
    </a-sphere>

    <a-sphere
      radius="${dropletRadius * 0.7}"
      color="skyblue"
      opacity="0.85"
      position="${radius / 35} ${(height / 20) + 0.01} ${-radius / 28}">
    </a-sphere>
  `
}

export function updateCupScene(cupElement, {
  radius,
  height,
  liquidHeight,
  overflowAmount,
}) {
  cupElement.innerHTML = `
    <a-cylinder
      radius="${radius / 20}"
      height="${height / 20}"
      color="#9e9e9e"
      opacity="0.35"
      open-ended="true"
      position="0 ${height / 40} 0">
    </a-cylinder>

    <a-cylinder
      radius="${radius / 22}"
      height="${liquidHeight / 20}"
      color="skyblue"
      opacity="0.75"
      open-ended="false"
      position="0 ${liquidHeight / 40} 0">
    </a-cylinder>

    ${renderOverflowEffects({ radius, height, overflowAmount })}
  `
}
