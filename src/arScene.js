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

function getPreviewMaterial() {
  return 'color: #f7b267; opacity: 0.62; transparent: true; roughness: 0.55; metalness: 0.05'
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

function renderGeneratedShape(shape) {
  const dimensions = getPreviewDimensions(shape)
  const material = getPreviewMaterial()

  if (shape.type === 'frustum') {
    return `
      <a-cone
        radius-top="${dimensions.topRadius}"
        radius-bottom="${dimensions.bottomRadius}"
        height="${dimensions.height}"
        segments-radial="64"
        material="${material}"
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
      rotation="0 0 0">
    </a-cylinder>
  `
}

export function updateGeneratedModel(modelElement, shape, transform) {
  const dimensions = getPreviewDimensions(shape)

  modelElement.setAttribute('visible', 'true')
  modelElement.setAttribute('rotation', `0 ${transform.rotationY} 0`)
  modelElement.setAttribute('scale', `${transform.scale} ${transform.scale} ${transform.scale}`)
  modelElement.innerHTML = `
    ${renderGeneratedShape(shape)}
    <a-ring
      radius-inner="0.48"
      radius-outer="0.5"
      color="#ffffff"
      opacity="0.55"
      rotation="-90 0 0"
      position="0 ${-dimensions.height / 2} 0">
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
