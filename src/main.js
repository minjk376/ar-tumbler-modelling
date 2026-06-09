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

function readModelShape() {
  const height = readNumber(elements.modelHeight)

  if (elements.shapeType.value === 'frustum') {
    const topRadius = readNumber(elements.topRadius)
    const bottomRadius = readNumber(elements.modelBottomRadius)
    const volume = calculateFrustumVolume(topRadius, bottomRadius, height)

    return {
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

function renderModelVolume(shape) {
  const formula =
    shape.type === 'frustum'
      ? `원뿔대 부피 = π × h × (R² + Rr + r²) ÷ 3`
      : `원기둥 부피 = π × r² × h`

  elements.modelVolumeInfo.innerHTML = `
    <b>${shape.type === 'frustum' ? '원뿔대' : '원기둥'}</b><br>
    ${formula}<br>
    부피: ${shape.volume.toFixed(1)} mL
  `
}

function updateModelPreview() {
  const shape = readModelShape()

  elements.cylinderInputs.hidden = shape.type !== 'cylinder'
  elements.frustumInputs.hidden = shape.type !== 'frustum'
  elements.swapFrustumRadiiButton.disabled = shape.type !== 'frustum'
  renderModelVolume(shape)
  updateGeneratedModel(elements.modelPreview, shape, modelTransform)
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
elements.rotateLeftButton.addEventListener('click', () => rotateModel(-15))
elements.rotateRightButton.addEventListener('click', () => rotateModel(15))
elements.zoomOutButton.addEventListener('click', () => zoomModel(-0.1))
elements.zoomInButton.addEventListener('click', () => zoomModel(0.1))
elements.updateCupButton.addEventListener('click', updateCup)
elements.showVolumeButton.addEventListener('click', showVolume)
window.addEventListener('load', () => setMode(modes.model))
