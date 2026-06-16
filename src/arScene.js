const AR_MODEL_SCALE = 1.2
const AR_GROUND_Y_OFFSET = 0

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
      class="overflow-effect"
      radius="${puddleRadius}"
      color="skyblue"
      opacity="0.55"
      rotation="-90 0 0"
      position="0 0.006 0">
      animation="property: opacity; from: 0.55; to: 0; dur: 900; easing: easeOutQuad">
    </a-circle>

    <a-sphere
      class="overflow-effect"
      radius="${dropletRadius}"
      color="skyblue"
      opacity="0.85"
      position="${radius / 25} ${(height / 20) + 0.03} 0">
      animation="property: position; to: ${radius / 22} ${(height / 20) - 0.12} 0; dur: 700; easing: easeInQuad">
      animation__fade="property: opacity; from: 0.85; to: 0; dur: 800; easing: easeOutQuad">
    </a-sphere>

    <a-sphere
      class="overflow-effect"
      radius="${dropletRadius * 0.8}"
      color="skyblue"
      opacity="0.85"
      position="${-radius / 28} ${(height / 20) + 0.02} ${radius / 30}">
      animation="property: position; to: ${-radius / 25} ${(height / 20) - 0.1} ${radius / 27}; dur: 720; easing: easeInQuad">
      animation__fade="property: opacity; from: 0.85; to: 0; dur: 820; easing: easeOutQuad">
    </a-sphere>

    <a-sphere
      class="overflow-effect"
      radius="${dropletRadius * 0.7}"
      color="skyblue"
      opacity="0.85"
      position="${radius / 35} ${(height / 20) + 0.01} ${-radius / 28}">
      animation="property: position; to: ${radius / 31} ${(height / 20) - 0.09} ${-radius / 25}; dur: 690; easing: easeInQuad">
      animation__fade="property: opacity; from: 0.85; to: 0; dur: 790; easing: easeOutQuad">
    </a-sphere>
  `
}

function getPreviewMaterial(index = 0) {
  const colors = ['#f7b267', '#70c1b3', '#b2dbbf', '#f25f5c']
  const color = colors[index % colors.length]

  return `color: ${color}; opacity: 0.62; transparent: true; roughness: 0.55; metalness: 0.05`
}

function getPreviewDimensions({ radius = 0, topRadius = 0, bottomRadius = 0, height = 0 }) {
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

  if (shape.type === 'cone') {
    return `
      <a-cone
        radius-top="0"
        radius-bottom="${dimensions.radius}"
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

function renderMarkerShape(shape, index, yPosition) {
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

  if (shape.type === 'cone') {
    return `
      <a-cone
        radius-top="0"
        radius-bottom="${dimensions.radius}"
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

function getBottomAlignedStackLayout(shapes) {
  const dimensions = shapes.map(getPreviewDimensions)
  let cursor = 0

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

  if (modelShapes.length === 0) {
    modelElement.setAttribute('visible', 'false')
    modelElement.innerHTML = ''
    return
  }

  const layout = getStackLayout(modelShapes)

  modelElement.setAttribute('visible', 'true')
  modelElement.setAttribute('rotation', `0 ${transform.rotationY} 0`)
  modelElement.setAttribute('scale', `${transform.zoom} ${transform.zoom} ${transform.zoom}`)
  modelElement.innerHTML = `
    ${modelShapes
      .map((shape, index) => renderGeneratedShape(shape, index, layout[index].yPosition))
      .join('')}
  `
}

export function updateMarkerModel(modelElement, shapes, { overflowAmount = 0 } = {}) {
  const modelShapes = Array.isArray(shapes) ? shapes : [shapes]

  if (modelShapes.length === 0) {
    modelElement.setAttribute('visible', 'false')
    modelElement.setAttribute('position', '0 0 0')
    modelElement.setAttribute('rotation', '0 0 0')
    modelElement.setAttribute('scale', '1 1 1')
    modelElement.innerHTML = ''
    return
  }

  const layout = getBottomAlignedStackLayout(modelShapes)
  const dimensions = modelShapes.map(getPreviewDimensions)
  const maxRadius = dimensions.reduce((max, shape) => {
    const shapeRadius = Math.max(shape.radius ?? 0, shape.topRadius ?? 0, shape.bottomRadius ?? 0)
    return Math.max(max, shapeRadius)
  }, 0)
  const totalHeight = dimensions.reduce((sum, shape) => sum + shape.height, 0)

  modelElement.setAttribute('visible', 'true')
  modelElement.setAttribute('position', '0 0 0')
  modelElement.setAttribute('rotation', '0 0 0')
  modelElement.setAttribute('scale', '1 1 1')
  modelElement.innerHTML = `
    <a-entity
      class="marker-model-root"
      position="0 ${AR_GROUND_Y_OFFSET} 0"
      rotation="0 0 0"
      scale="${AR_MODEL_SCALE} ${AR_MODEL_SCALE} ${AR_MODEL_SCALE}">
      ${modelShapes
        .map((shape, index) => renderMarkerShape(shape, index, layout[index].yPosition))
        .join('')}
      ${renderOverflowEffects({
        radius: maxRadius * 20,
        height: totalHeight * 20,
        overflowAmount,
      })}
    </a-entity>
  `
}

export function updatePreviewCameraZoom(cameraElement, zoom) {
  cameraElement.setAttribute('camera', {
    active: true,
    type: 'orthographic',
    zoom,
  })

  const camera = cameraElement.components?.camera?.camera
  if (camera) {
    camera.zoom = zoom
    camera.updateProjectionMatrix()
  }
}

export function setPreviewCameraActive(cameraElement, isActive) {
  cameraElement.setAttribute('camera', {
    active: isActive,
    type: 'orthographic',
  })
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
