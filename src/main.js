import './style.css'
import {
  calculateCylinderVolume,
  calculateFrustumVolume,
} from './geometry.js'
import {
  setModelPreviewVisible,
  setOverflowSceneVisible,
  updateGeneratedModel,
  updateMarkerModel,
  updatePreviewCameraZoom,
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
  addConeButton: document.getElementById('addConeButton'),
  shapeList: document.getElementById('shapeList'),
  entranceInfo: document.getElementById('entranceInfo'),
  deleteShapeButton: document.getElementById('deleteShapeButton'),
  moveShapeUpButton: document.getElementById('moveShapeUpButton'),
  moveShapeDownButton: document.getElementById('moveShapeDownButton'),
  rotateLeftButton: document.getElementById('rotateLeftButton'),
  rotateRightButton: document.getElementById('rotateRightButton'),
  zoomOutButton: document.getElementById('zoomOutButton'),
  zoomInButton: document.getElementById('zoomInButton'),
  modelVolumeInfo: document.getElementById('modelVolumeInfo'),
  drinkVolume: document.getElementById('drinkVolume'),
  updateCupButton: document.getElementById('updateCupButton'),
  result: document.getElementById('result'),
  volumeInfo: document.getElementById('volumeInfo'),
  overflowSound: document.getElementById('overflowSound'),
  cup: document.getElementById('cup'),
  modelPreview: document.getElementById('modelPreview'),
  previewCamera: document.getElementById('previewCamera'),
  thinkingSidebar: document.getElementById('thinkingSidebar'),
  thinkingSidebarToggle: document.getElementById('thinkingSidebarToggle'),
  thinkingModelMenu: document.getElementById('thinkingModelMenu'),
  thinkingProgress: document.getElementById('thinkingProgress'),
  thinkingQuestionPanel: document.getElementById('thinkingQuestionPanel'),
  thinkingNextStepMessage: document.getElementById('thinkingNextStepMessage'),
  thinkingPrevButton: document.getElementById('thinkingPrevButton'),
  thinkingNextButton: document.getElementById('thinkingNextButton'),
  partCountInputs: Array.from(document.querySelectorAll('input[name="partCount"]')),
}

const modelTransform = {
  rotationY: 28,
  zoom: 1.15,
}

let nextShapeId = 1
let selectedShapeIndex = 0
let modelShapes = [createDefaultShape('cylinder')]
let overflowEffectTimer = null
const thinkingState = {
  isOpen: false,
  selectedMenu: 'model',
  modelCreationStep: 1,
  modelCreationTotalSteps: 6,
  partCount: null,
  isIntroComplete: false,
}

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

  if (type === 'cone') {
    return {
      id,
      type,
      radius: 4,
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

export function calculateShapeVolume(shape) {
  if (shape.type === 'frustum') {
    return calculateFrustumVolume(shape.topRadius, shape.bottomRadius, shape.height)
  }

  if (shape.type === 'cone') {
    return (Math.PI * shape.radius * shape.radius * shape.height) / 3
  }

  return calculateCylinderVolume(shape.radius, shape.height)
}

export function calculateModelVolume(shapes = modelShapes) {
  return shapes.reduce((sum, shape) => sum + calculateShapeVolume(shape), 0)
}

function getEntranceRadius(shape) {
  if (shape.type === 'cone') {
    return 0
  }

  return shape.type === 'frustum' ? shape.topRadius : shape.radius
}

export function getCurrentEntranceInfo() {
  const index = modelShapes.length - 1
  const shape = modelShapes[index]

  if (!shape) {
    return null
  }

  return {
    index,
    displayNumber: 1,
    type: shape.type,
    shape,
    radius: getEntranceRadius(shape),
  }
}

export function getOverflowVerificationInfo() {
  const drinkVolume = readNumber(elements.drinkVolume)
  const totalVolume = calculateModelVolume()
  const entrance = getCurrentEntranceInfo()

  return {
    shapes: modelShapes,
    drinkVolume,
    totalVolume,
    entrance,
    overflows: drinkVolume > totalVolume,
  }
}

function getShapeName(shape) {
  if (shape.type === 'frustum') {
    return '원뿔대'
  }

  if (shape.type === 'cone') {
    return '원뿔'
  }

  return '원기둥'
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

  if (elements.shapeType.value === 'cone') {
    const volume = (Math.PI * radius * radius * height) / 3

    return {
      id: modelShapes[selectedShapeIndex]?.id,
      type: 'cone',
      radius,
      height,
      volume,
    }
  }

  const volume = calculateCylinderVolume(radius, height)

  return {
    id: modelShapes[selectedShapeIndex]?.id,
    type: 'cylinder',
    radius,
    height,
    volume,
  }
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
  const entrance = getCurrentEntranceInfo()

  elements.shapeList.innerHTML = modelShapes
    .map((_, displayIndex) => {
      const shapeIndex = modelShapes.length - 1 - displayIndex
      const shape = modelShapes[shapeIndex]
      const selectedClass = shapeIndex === selectedShapeIndex ? ' selected' : ''
      const entranceClass = shapeIndex === entrance?.index ? ' entrance' : ''
      const entranceLabel = shapeIndex === entrance?.index ? '<span>입구</span>' : ''

      return `
        <li>
          <button
            class="shape-list-item${selectedClass}${entranceClass}"
            type="button"
            data-shape-index="${shapeIndex}">
            <span>${displayIndex + 1}. ${getShapeName(shape)}</span>
            ${entranceLabel}
          </button>
        </li>
      `
    })
    .join('')
}

function renderEntranceInfo() {
  const entrance = getCurrentEntranceInfo()

  if (!entrance) {
    elements.entranceInfo.textContent = ''
    return
  }

  elements.entranceInfo.innerHTML = `
    입구: ${entrance.displayNumber}번 ${getShapeName(entrance.shape)}의 윗면
    <small>반지름 ${entrance.radius} cm</small>
  `
}

function renderModelVolume() {
  const volumeRows = modelShapes
    .map((shape, index) => {
      const volume = calculateShapeVolume(shape)

      return `${index + 1}. ${getShapeName(shape)}: ${volume.toFixed(1)} mL`
    })
    .join('<br>')
  const totalVolume = calculateModelVolume()

  elements.modelVolumeInfo.innerHTML = `
    <b>도형별 부피</b><br>
    ${volumeRows}<br>
    <hr>
    <b>전체 부피: ${totalVolume.toFixed(1)} mL</b>
  `
}

function renderOverflowVerification() {
  const verification = getOverflowVerificationInfo()
  const resultClass = verification.overflows ? 'overflow' : 'safe'
  const resultText = verification.overflows ? '넘침' : '담을 수 있음'

  elements.result.innerHTML = `<div class="${resultClass}">${resultText}</div>`
  elements.volumeInfo.hidden = false
  elements.volumeInfo.innerHTML = `
    <b>총 부피</b>: ${verification.totalVolume.toFixed(1)} mL<br>
    <b>음료량</b>: ${verification.drinkVolume.toFixed(1)} mL<br>
    <b>입구</b>: ${verification.entrance.displayNumber}번 ${getShapeName(verification.entrance.shape)}의 윗면
    <small>입구 반지름 ${verification.entrance.radius} cm</small>
  `
}

function playOverflowSound() {
  elements.overflowSound.currentTime = 0
  elements.overflowSound.play().catch(() => {})
}

function updateOverflowVerification({ playEffects = false } = {}) {
  const verification = getOverflowVerificationInfo()
  const overflowAmount = Math.max(verification.drinkVolume - verification.totalVolume, 0)
  const shouldPlayEffects = playEffects && verification.overflows

  updateMarkerModel(elements.cup, verification.shapes, {
    overflowAmount: shouldPlayEffects ? overflowAmount : 0,
  })
  renderOverflowVerification()

  if (overflowEffectTimer) {
    clearTimeout(overflowEffectTimer)
    overflowEffectTimer = null
  }

  if (!shouldPlayEffects) {
    return
  }

  playOverflowSound()
  overflowEffectTimer = window.setTimeout(() => {
    updateMarkerModel(elements.cup, verification.shapes)
    overflowEffectTimer = null
  }, 1000)
}

function updateModelPreview({ syncInputs = true } = {}) {
  if (syncInputs) {
    syncSelectedShapeFromInputs()
  }

  const selectedShape = modelShapes[selectedShapeIndex]

  elements.cylinderInputs.hidden = !['cylinder', 'cone'].includes(selectedShape?.type)
  elements.frustumInputs.hidden = selectedShape?.type !== 'frustum'
  elements.swapFrustumRadiiButton.disabled = selectedShape?.type !== 'frustum'
  elements.deleteShapeButton.disabled = modelShapes.length <= 1
  elements.moveShapeUpButton.disabled = selectedShapeIndex >= modelShapes.length - 1
  elements.moveShapeDownButton.disabled = selectedShapeIndex <= 0
  renderShapeList()
  renderEntranceInfo()
  renderModelVolume()
  updateGeneratedModel(elements.modelPreview, modelShapes, modelTransform)
  updatePreviewCameraZoom(elements.previewCamera, modelTransform.zoom)
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

  syncSelectedShapeFromInputs()
  updateOverflowVerification()
}

function rotateModel(degrees) {
  modelTransform.rotationY = (modelTransform.rotationY + degrees) % 360
  updateModelPreview()
}

function zoomModel(delta) {
  modelTransform.zoom = Math.min(Math.max(modelTransform.zoom + delta, 0.65), 2.2)
  updateModelPreview()
}

function renderThinkingSidebar() {
  elements.thinkingSidebar.classList.toggle('collapsed', !thinkingState.isOpen)
  elements.thinkingSidebarToggle.setAttribute('aria-expanded', String(thinkingState.isOpen))
}

function renderThinkingModelFlow() {
  elements.thinkingProgress.textContent = `모델 생성 ${thinkingState.modelCreationStep}/${thinkingState.modelCreationTotalSteps}`
  elements.thinkingQuestionPanel.hidden = thinkingState.isIntroComplete
  elements.thinkingNextStepMessage.hidden = !thinkingState.isIntroComplete
  elements.thinkingPrevButton.disabled = !thinkingState.isIntroComplete
  elements.thinkingNextButton.disabled = !thinkingState.partCount
  elements.thinkingNextButton.textContent = thinkingState.isIntroComplete ? '다음' : '다음'

  elements.partCountInputs.forEach((input) => {
    input.checked = input.value === thinkingState.partCount
  })
}

function toggleThinkingSidebar() {
  thinkingState.isOpen = !thinkingState.isOpen
  renderThinkingSidebar()
}

function selectThinkingModelMenu() {
  thinkingState.selectedMenu = 'model'
  elements.thinkingModelMenu.classList.add('active')
  renderThinkingModelFlow()
}

function selectPartCount(event) {
  thinkingState.partCount = event.target.value
  renderThinkingModelFlow()
}

function goToThinkingNextStep() {
  if (!thinkingState.partCount) {
    return
  }

  thinkingState.isIntroComplete = true
  renderThinkingModelFlow()
}

function goToThinkingPreviousStep() {
  thinkingState.isIntroComplete = false
  renderThinkingModelFlow()
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
elements.addConeButton.addEventListener('click', () => addShape('cone'))
elements.deleteShapeButton.addEventListener('click', deleteSelectedShape)
elements.moveShapeUpButton.addEventListener('click', () => moveSelectedShape(1))
elements.moveShapeDownButton.addEventListener('click', () => moveSelectedShape(-1))
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
elements.updateCupButton.addEventListener('click', () => updateOverflowVerification({ playEffects: true }))
elements.drinkVolume.addEventListener('input', updateOverflowVerification)
elements.thinkingSidebarToggle.addEventListener('click', toggleThinkingSidebar)
elements.thinkingModelMenu.addEventListener('click', selectThinkingModelMenu)
elements.partCountInputs.forEach((input) => {
  input.addEventListener('change', selectPartCount)
})
elements.thinkingNextButton.addEventListener('click', goToThinkingNextStep)
elements.thinkingPrevButton.addEventListener('click', goToThinkingPreviousStep)
window.addEventListener('load', () => {
  setMode(modes.model)
  renderThinkingSidebar()
  renderThinkingModelFlow()
})
