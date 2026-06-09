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

function getPreviewMaterial(index = 0) {
  const colors = ['#f7b267', '#70c1b3', '#b2dbbf', '#f25f5c']
  const color = colors[index % colors.length]

  return `color: ${color}; opacity: 0.62; transparent: true; roughness: 0.55; metalness: 0.05`
}

function getPreviewDimensions({ radius, topRadius, bottomRadius, height }) {
  const unitScale = 0.08

  return {
    radius: radius * unitScale,
    topRadius: topRadius * unitScale,
    bottomRadius: bottomRadius * unitScale,
    height: height * unitScale,
  }
}

function renderGeneratedShape(shape, index, yPosition) {
  const dimensions = getPreviewDimensions(shape)
  const material = getPreviewMaterial(index)

  if (shape.type === 'frustum') {
    return `
      <a-cone
        radius-top="${dimensions.topRadius}"
        radius-bottom="${dimensions.bottomRadius}"
        height="${dimensions.height}"
        segments-radial="64"
        material="${material}"
        position="0 ${yPosition} 0"
        rotation="0 0 0">
      </a-cone>
    `
  }

  return `
    <a-cylinder
      radius="${dimensions.radius}"
      height="${dimensions.height}"
      segments-radial="64"
      material="${material}"
      position="0 ${yPosition} 0"
      rotation="0 0 0">
    </a-cylinder>
  `
}

function getStackLayout(shapes) {
  const dimensions = shapes.map(getPreviewDimensions)
  const totalHeight = dimensions.reduce((sum, shape) => sum + shape.height, 0)
  let cursor = -totalHeight / 2

  return dimensions.map((shapeDimensions) => {
    const yPosition = cursor + shapeDimensions.height / 2
    cursor += shapeDimensions.height

    return {
      dimensions: shapeDimensions,
      yPosition,
    }
  })
}

export function updateGeneratedModel(modelElement, shapes, transform) {
  const modelShapes = Array.isArray(shapes) ? shapes : [shapes]
  const layout = getStackLayout(modelShapes)
  const maxRadius = Math.max(
    ...layout.flatMap(({ dimensions }) => [
      dimensions.radius ?? 0,
      dimensions.topRadius ?? 0,
      dimensions.bottomRadius ?? 0,
    ]),
    0.48,
  )

  modelElement.setAttribute('visible', 'true')
  modelElement.setAttribute('rotation', `0 ${transform.rotationY} 0`)
  modelElement.setAttribute('scale', `${transform.scale} ${transform.scale} ${transform.scale}`)
  modelElement.innerHTML = `
    ${modelShapes
      .map((shape, index) => renderGeneratedShape(shape, index, layout[index].yPosition))
      .join('')}
    <a-ring
      radius-inner="${maxRadius * 1.08}"
      radius-outer="${maxRadius * 1.12}"
      color="#ffffff"
      opacity="0.55"
      rotation="-90 0 0"
      position="0 ${layout[0]?.yPosition - (layout[0]?.dimensions.height ?? 0) / 2} 0">
    </a-ring>
  `
}

export function setModelPreviewVisible(modelElement, isVisible) {
  modelElement.setAttribute('visible', isVisible ? 'true' : 'false')
}

export function setOverflowSceneVisible(cupElement, isVisible) {
  cupElement.setAttribute('visible', isVisible ? 'true' : 'false')
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
