import './style.css'
import {
  calculateCylinderVolume,
  calculateFrustumVolume,
  calculateOverflowAmount,
  calculateLiquidHeight,
} from './geometry.js'
import {
  setModelPreviewVisible,
  setOverflowSceneVisible,
  updateCupScene,
  updateGeneratedModel,
} from './arScene.js'

const modes = {
  model: 'model',
  overflow: 'overflow',
}

const elements = {
  modelMode: document.getElementById('modelMode'),
  overflowMode: document.getElementById('overflowMode'),
  modelControls: document.getElementById('modelControls'),
  overflowControls: document.getElementById('overflowControls'),
  shapeType: document.getElementById('shapeType'),
  cylinderInputs: document.getElementById('cylinderInputs'),
  frustumInputs: document.getElementById('frustumInputs'),
  modelRadius: document.getElementById('modelRadius'),
  topRadius: document.getElementById('topRadius'),
  modelBottomRadius: document.getElementById('modelBottomRadius'),
  modelHeight: document.getElementById('modelHeight'),
  swapFrustumRadiiButton: document.getElementById('swapFrustumRadiiButton'),
  addCylinderButton: document.getElementById('addCylinderButton'),
  addFrustumButton: document.getElementById('addFrustumButton'),
  shapeList: document.getElementById('shapeList'),
  deleteShapeButton: document.getElementById('deleteShapeButton'),
  moveShapeUpButton: document.getElementById('moveShapeUpButton'),
  moveShapeDownButton: document.getElementById('moveShapeDownButton'),
  rotateLeftButton: document.getElementById('rotateLeftButton'),
  rotateRightButton: document.getElementById('rotateRightButton'),
  zoomOutButton: document.getElementById('zoomOutButton'),
  zoomInButton: document.getElementById('zoomInButton'),
  modelVolumeInfo: document.getElementById('modelVolumeInfo'),
  bottomRadius: document.getElementById('bottomRadius'),
  height: document.getElementById('height'),
  drinkVolume: document.getElementById('drinkVolume'),
  updateCupButton: document.getElementById('updateCupButton'),
  showVolumeButton: document.getElementById('showVolumeButton'),
  result: document.getElementById('result'),
  volumeInfo: document.getElementById('volumeInfo'),
  overflowSound: document.getElementById('overflowSound'),
  cup: document.getElementById('cup'),
  modelPreview: document.getElementById('modelPreview'),
}

const modelTransform = {
  rotationY: 0,
  scale: 1,
}

let nextShapeId = 1
let selectedShapeIndex = 0
let modelShapes = [createDefaultShape('cylinder')]

function createDefaultShape(type) {
  const id = nextShapeId
  nextShapeId += 1

  if (type === 'frustum') {
    return {
      id,
      type,
      topRadius: 3,
      bottomRadius: 5,
      height: 8,
    }
  }

  return {
    id,
    type: 'cylinder',
    radius: 4,
    height: 8,
  }
}

function readNumber(input, fallback = 0) {
  const value = parseFloat(input.value)
  return Number.isFinite(value) ? value : fallback
}

function readCupValues() {
  const radius = readNumber(elements.bottomRadius)
  const height = readNumber(elements.height)
  const drinkVolume = readNumber(elements.drinkVolume)
  const volume = calculateCylinderVolume(radius, height)

  return { radius, height, drinkVolume, volume }
}

function calculateShapeVolume(shape) {
  if (shape.type === 'frustum') {
    return calculateFrustumVolume(shape.topRadius, shape.bottomRadius, shape.height)
  }

  return calculateCylinderVolume(shape.radius, shape.height)
}

function getShapeName(shape) {
  return shape.type === 'frustum' ? '원뿔대' : '원기둥'
}

function readModelShape() {
  const height = readNumber(elements.modelHeight)

  if (elements.shapeType.value === 'frustum') {
    const topRadius = readNumber(elements.topRadius)
    const bottomRadius = readNumber(elements.modelBottomRadius)
    const volume = calculateFrustumVolume(topRadius, bottomRadius, height)

    return {
      id: modelShapes[selectedShapeIndex]?.id,
      type: 'frustum',
      topRadius,
      bottomRadius,
      height,
      volume,
    }
  }

  const radius = readNumber(elements.modelRadius)
  const volume = calculateCylinderVolume(radius, height)

  return {
    id: modelShapes[selectedShapeIndex]?.id,
    type: 'cylinder',
    radius,
    height,
    volume,
  }
}

function resetVolumeInfo() {
  elements.volumeInfo.hidden = true
  elements.volumeInfo.innerHTML = ''
}

function playOverflowSound() {
  elements.overflowSound.currentTime = 0
  elements.overflowSound.play()
}

function renderResult({ drinkVolume, volume, overflowAmount }) {
  if (drinkVolume > volume) {
    playOverflowSound()

    elements.result.innerHTML = `
      <div class="overflow">OVERFLOW</div>
      <div>초과량: ${overflowAmount.toFixed(1)} mL</div>
    `
    return
  }

  elements.result.innerHTML = `
    <div class="safe">아직 넘치지 않음</div>
  `
}

function updateCup() {
  const values = readCupValues()
  const overflowAmount = calculateOverflowAmount(values.drinkVolume, values.volume)
  const liquidHeight = calculateLiquidHeight(
    values.drinkVolume,
    values.volume,
    values.height,
  )

  resetVolumeInfo()
  renderResult({ ...values, overflowAmount })
  updateCupScene(elements.cup, { ...values, overflowAmount, liquidHeight })
}

function showVolume() {
  const { radius, height, volume } = readCupValues()

  elements.volumeInfo.hidden = false
  elements.volumeInfo.innerHTML = `
    <hr>
    <b>계산 과정</b><br>
    원기둥 부피 = π × r² × h<br>
    = π × ${radius}² × ${height}<br>
    = ${volume.toFixed(1)} mL
  `
}

function syncSelectedShapeFromInputs() {
  if (!modelShapes[selectedShapeIndex]) {
    return
  }

  modelShapes[selectedShapeIndex] = readModelShape()
}

function loadSelectedShapeToInputs() {
  const shape = modelShapes[selectedShapeIndex]

  if (!shape) {
    return
  }

  elements.shapeType.value = shape.type
  elements.modelHeight.value = shape.height

  if (shape.type === 'frustum') {
    elements.topRadius.value = shape.topRadius
    elements.modelBottomRadius.value = shape.bottomRadius
    return
  }

  elements.modelRadius.value = shape.radius
}

function renderShapeList() {
  elements.shapeList.innerHTML = modelShapes
    .map((shape, index) => {
      const selectedClass = index === selectedShapeIndex ? ' selected' : ''

      return `
        <li>
          <button
            class="shape-list-item${selectedClass}"
            type="button"
            data-shape-index="${index}">
            ${index + 1}. ${getShapeName(shape)}
          </button>
        </li>
      `
    })
    .join('')
}

function renderModelVolume() {
  const volumeRows = modelShapes
    .map((shape, index) => {
      const volume = calculateShapeVolume(shape)

      return `${index + 1}. ${getShapeName(shape)}: ${volume.toFixed(1)} mL`
    })
    .join('<br>')
  const totalVolume = modelShapes.reduce(
    (sum, shape) => sum + calculateShapeVolume(shape),
    0,
  )

  elements.modelVolumeInfo.innerHTML = `
    <b>도형별 부피</b><br>
    ${volumeRows}<br>
    <hr>
    <b>전체 부피: ${totalVolume.toFixed(1)} mL</b>
  `
}

function updateModelPreview({ syncInputs = true } = {}) {
  if (syncInputs) {
    syncSelectedShapeFromInputs()
  }

  const selectedShape = modelShapes[selectedShapeIndex]

  elements.cylinderInputs.hidden = selectedShape?.type !== 'cylinder'
  elements.frustumInputs.hidden = selectedShape?.type !== 'frustum'
  elements.swapFrustumRadiiButton.disabled = selectedShape?.type !== 'frustum'
  elements.deleteShapeButton.disabled = modelShapes.length <= 1
  elements.moveShapeUpButton.disabled = selectedShapeIndex <= 0
  elements.moveShapeDownButton.disabled = selectedShapeIndex >= modelShapes.length - 1
  renderShapeList()
  renderModelVolume()
  updateGeneratedModel(elements.modelPreview, modelShapes, modelTransform)
}

function selectShape(index) {
  selectedShapeIndex = index
  loadSelectedShapeToInputs()
  updateModelPreview({ syncInputs: false })
}

function addShape(type) {
  modelShapes.push(createDefaultShape(type))
  selectShape(modelShapes.length - 1)
}

function deleteSelectedShape() {
  if (modelShapes.length <= 1) {
    return
  }

  modelShapes.splice(selectedShapeIndex, 1)
  selectedShapeIndex = Math.min(selectedShapeIndex, modelShapes.length - 1)
  loadSelectedShapeToInputs()
  updateModelPreview({ syncInputs: false })
}

function moveSelectedShape(direction) {
  const nextIndex = selectedShapeIndex + direction

  if (nextIndex < 0 || nextIndex >= modelShapes.length) {
    return
  }

  const selectedShape = modelShapes[selectedShapeIndex]
  modelShapes[selectedShapeIndex] = modelShapes[nextIndex]
  modelShapes[nextIndex] = selectedShape
  selectedShapeIndex = nextIndex
  updateModelPreview({ syncInputs: false })
}

function swapFrustumRadii() {
  const topRadius = elements.topRadius.value

  elements.topRadius.value = elements.modelBottomRadius.value
  elements.modelBottomRadius.value = topRadius
  updateModelPreview()
}

function setMode(mode) {
  const isModelMode = mode === modes.model

  elements.modelControls.hidden = !isModelMode
  elements.overflowControls.hidden = isModelMode
  setModelPreviewVisible(elements.modelPreview, isModelMode)
  setOverflowSceneVisible(elements.cup, !isModelMode)

  if (isModelMode) {
    updateModelPreview()
    return
  }

  updateCup()
}

function rotateModel(degrees) {
  modelTransform.rotationY = (modelTransform.rotationY + degrees) % 360
  updateModelPreview()
}

function zoomModel(delta) {
  modelTransform.scale = Math.min(Math.max(modelTransform.scale + delta, 0.5), 2)
  updateModelPreview()
}

elements.modelMode.addEventListener('change', () => setMode(modes.model))
elements.overflowMode.addEventListener('change', () => setMode(modes.overflow))
elements.shapeType.addEventListener('change', updateModelPreview)
elements.modelRadius.addEventListener('input', updateModelPreview)
elements.topRadius.addEventListener('input', updateModelPreview)
elements.modelBottomRadius.addEventListener('input', updateModelPreview)
elements.modelHeight.addEventListener('input', updateModelPreview)
elements.swapFrustumRadiiButton.addEventListener('click', swapFrustumRadii)
elements.addCylinderButton.addEventListener('click', () => addShape('cylinder'))
elements.addFrustumButton.addEventListener('click', () => addShape('frustum'))
elements.deleteShapeButton.addEventListener('click', deleteSelectedShape)
elements.moveShapeUpButton.addEventListener('click', () => moveSelectedShape(-1))
elements.moveShapeDownButton.addEventListener('click', () => moveSelectedShape(1))
elements.shapeList.addEventListener('click', (event) => {
  const shapeButton = event.target.closest('[data-shape-index]')

  if (!shapeButton) {
    return
  }

  selectShape(parseInt(shapeButton.dataset.shapeIndex, 10))
})
elements.rotateLeftButton.addEventListener('click', () => rotateModel(-15))
elements.rotateRightButton.addEventListener('click', () => rotateModel(15))
elements.zoomOutButton.addEventListener('click', () => zoomModel(-0.1))
elements.zoomInButton.addEventListener('click', () => zoomModel(0.1))
elements.updateCupButton.addEventListener('click', updateCup)
elements.showVolumeButton.addEventListener('click', showVolume)
window.addEventListener('load', () => setMode(modes.model))
