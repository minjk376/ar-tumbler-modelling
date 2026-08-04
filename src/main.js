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
  setPreviewCameraActive,
  syncPreviewCameraAspect,
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
  markerVerificationRoot: document.getElementById('marker-verification-root'),
  modelPreview: document.getElementById('modelPreview'),
  partitionGuides: document.getElementById('partitionGuides'),
  previewCamera: document.getElementById('previewCamera'),
  arCamera: document.getElementById('arCamera'),
  modelingResultScreen: document.getElementById('modelingResultScreen'),
  showModelingResultButton: document.getElementById('showModelingResultButton'),
  backFromModelingResultButton: document.getElementById('backFromModelingResultButton'),
  printModelingResultButton: document.getElementById('printModelingResultButton'),
  modelingResultGoal: document.getElementById('modelingResultGoal'),
  modelingResultReason: document.getElementById('modelingResultReason'),
  modelingResultShapes: document.getElementById('modelingResultShapes'),
  modelingResultCalculations: document.getElementById('modelingResultCalculations'),
  modelingResultStudentTotal: document.getElementById('modelingResultStudentTotal'),
  modelingResultProgramTotal: document.getElementById('modelingResultProgramTotal'),
  thinkingSidebar: document.getElementById('thinkingSidebar'),
  thinkingSidebarToggle: document.getElementById('thinkingSidebarToggle'),
  thinkingGoalMenu: document.getElementById('thinkingGoalMenu'),
  thinkingModelMenu: document.getElementById('thinkingModelMenu'),
  thinkingGoalFlow: document.getElementById('thinkingGoalFlow'),
  goalProgress: document.getElementById('goalProgress'),
  goalDrinkPanel: document.getElementById('goalDrinkPanel'),
  goalVolumePanel: document.getElementById('goalVolumePanel'),
  goalConditionPanel: document.getElementById('goalConditionPanel'),
  goalTumblerPanel: document.getElementById('goalTumblerPanel'),
  customDrinkTypeLabel: document.getElementById('customDrinkTypeLabel'),
  customDrinkTypeInput: document.getElementById('customDrinkTypeInput'),
  customVolumeLabel: document.getElementById('customVolumeLabel'),
  customVolumeInput: document.getElementById('customVolumeInput'),
  customExtraConditionLabel: document.getElementById('customExtraConditionLabel'),
  customExtraConditionInput: document.getElementById('customExtraConditionInput'),
  goalPrevButton: document.getElementById('goalPrevButton'),
  goalNextButton: document.getElementById('goalNextButton'),
  thinkingModelFlow: document.getElementById('thinkingModelFlow'),
  thinkingProgress: document.getElementById('thinkingProgress'),
  thinkingQuestionPanel: document.getElementById('thinkingQuestionPanel'),
  thinkingNextStepMessage: document.getElementById('thinkingNextStepMessage'),
  thinkingCompletionPanel: document.getElementById('thinkingCompletionPanel'),
  thinkingDecisionSummary: document.getElementById('thinkingDecisionSummary'),
  createRealityModelButton: document.getElementById('createRealityModelButton'),
  realityModelCreatedMessage: document.getElementById('realityModelCreatedMessage'),
  basicShapeQuestionPanel: document.getElementById('basicShapeQuestionPanel'),
  basicShapeQuestionTitle: document.getElementById('basicShapeQuestionTitle'),
  basicShapeNoMessage: document.getElementById('basicShapeNoMessage'),
  backToPartitionButton: document.getElementById('backToPartitionButton'),
  sideViewQuestionPanel: document.getElementById('sideViewQuestionPanel'),
  sideViewQuestionTitle: document.getElementById('sideViewQuestionTitle'),
  baseShapeQuestionPanel: document.getElementById('baseShapeQuestionPanel'),
  baseShapeQuestionTitle: document.getElementById('baseShapeQuestionTitle'),
  solidShapeQuestionPanel: document.getElementById('solidShapeQuestionPanel'),
  solidShapeQuestionTitle: document.getElementById('solidShapeQuestionTitle'),
  solidShapeReasonMessage: document.getElementById('solidShapeReasonMessage'),
  observationReviewActions: document.getElementById('observationReviewActions'),
  reviewSideViewButton: document.getElementById('reviewSideViewButton'),
  reviewBaseShapeButton: document.getElementById('reviewBaseShapeButton'),
  thinkingPartitionPrompt: document.getElementById('thinkingPartitionPrompt'),
  thinkingPrevButton: document.getElementById('thinkingPrevButton'),
  thinkingNextButton: document.getElementById('thinkingNextButton'),
  partitionSliders: document.getElementById('partitionSliders'),
  goalDrinkTypeInputs: Array.from(document.querySelectorAll('input[name="goalDrinkType"]')),
  goalTargetVolumeInputs: Array.from(document.querySelectorAll('input[name="goalTargetVolume"]')),
  goalExtraConditionInputs: Array.from(document.querySelectorAll('input[name="goalExtraCondition"]')),
  goalTumblerTypeInputs: Array.from(document.querySelectorAll('input[name="goalTumblerType"]')),
  partCountInputs: Array.from(document.querySelectorAll('input[name="partCount"]')),
  basicShapeAnswerInputs: Array.from(document.querySelectorAll('input[name="basicShapeAnswer"]')),
  sideViewShapeInputs: Array.from(document.querySelectorAll('input[name="sideViewShape"]')),
  baseShapeFeatureInputs: Array.from(document.querySelectorAll('input[name="baseShapeFeature"]')),
  solidShapeChoiceInputs: Array.from(document.querySelectorAll('input[name="solidShapeChoice"]')),
}

const partitionGuide = {
  minPosition: 8,
  maxPosition: 92,
  minGap: 12,
  height: 1.15,
  width: 1.45,
  lineHeight: 0.055,
  depth: 0.035,
  zOffset: 0.08,
  red: '#ef4444',
  orange: '#f97316',
}

const modelTransform = {
  rotationY: 28,
  zoom: 1.15,
}

function syncPreviewCameraViewport() {
  const scene = document.querySelector('a-scene')

  if (!elements.overflowMode.checked) {
    scene?.resize?.()
    syncPreviewCameraAspect(elements.previewCamera, scene)
  }
}

function installPreviewCameraRenderGuard(scene) {
  const renderer = scene?.renderer

  if (!renderer || renderer.__previewCameraRenderGuardInstalled) return

  const originalRender = renderer.render

  renderer.render = function (renderedScene, renderedCamera) {
    const previewCamera = elements.previewCamera.components?.camera?.camera
    const isPreviewCameraRenderOutsideVerification = (
      !elements.overflowMode.checked &&
      renderedCamera === previewCamera &&
      scene.camera === previewCamera
    )

    if (isPreviewCameraRenderOutsideVerification) {
      syncPreviewCameraAspect(elements.previewCamera, scene)
    }

    return originalRender.call(this, renderedScene, renderedCamera)
  }

  renderer.__previewCameraRenderGuardInstalled = true
}

let nextShapeId = 1
let selectedShapeIndex = 0
let modelShapes = []
let overflowEffectTimer = null
let partitionFadeTimer = null
let activePartitionDrag = null
const TUMBLER_DATA = {
  basic: {
    id: 'basic',
    nameKo: 'Basic 베이직',
    actualCapacityMl: 381.65,
  },
  trail: {
    id: 'trail',
    nameKo: 'Trail 트레일',
    actualCapacityMl: 700,
  },
  flow: {
    id: 'flow',
    nameKo: 'Flow 플로우',
    actualCapacityMl: 500,
  },
}
const defaultGoalSelectionStatus = {
  drinkType: false,
  targetVolumeMl: false,
  extraCondition: false,
  tumblerType: false,
}
const defaultGoalSettings = {
  drinkType: '',
  customDrinkType: '',
  targetVolumeMl: 500,
  extraCondition: '',
  customExtraCondition: '',
  tumblerType: '',
  selectionStatus: { ...defaultGoalSelectionStatus },
  isCompleted: false,
}
const goalActivityId = getGoalActivityId()
let goalSettings = loadGoalSettings()
const thinkingState = {
  isOpen: false,
  selectedMenu: 'model',
  goalStep: 1,
  isGoalCompleted: false,
  isCustomGoalVolumeSelected: !['350', '500', '600'].includes(String(goalSettings.targetVolumeMl)),
  modelCreationStep: 1,
  modelCreationTotalSteps: 6,
  modelCreationCompleteStep: 7,
  partCount: null,
  explorationParts: [],
  currentPartIndex: 0,
  partDecisions: [],
  isRealityModelCreated: false,
  partitionPositions: [],
  firstPartBasicShapeAnswer: null,
  firstPartSideViewShape: null,
  firstPartBaseShapeFeature: null,
  firstPartSolidShapeChoice: null,
}

const solidShapeReasonDescriptions = {
  cylinder: '옆에서 본 모양이 직사각형이고, 두 밑면이 합동인 원인 입체도형으로 표현하는 것이 적절합니다.',
  frustum: '옆에서 본 모양이 사다리꼴이고, 두 밑면이 크기가 다른 원인 입체도형으로 표현하는 것이 적절합니다.',
  cone: '옆에서 본 모양이 삼각형이고, 밑면이 하나의 원인 입체도형으로 표현하는 것이 적절합니다.',
}

const sideViewShapeDescriptions = {
  rectangle: '직사각형',
  trapezoid: '사다리꼴',
  triangle: '삼각형',
}

const baseShapeFeatureDescriptions = {
  'congruent-circles': '두 밑면이 합동인 원',
  'different-circles': '두 밑면이 크기가 다른 원',
  'one-circle': '밑면이 하나의 원',
}

const expectedSolidShapeByObservation = {
  'rectangle|congruent-circles': 'cylinder',
  'trapezoid|different-circles': 'frustum',
  'triangle|one-circle': 'cone',
}

const DEFAULT_GENERATED_MODEL_HEIGHT = 24

const explorationPartsByCount = {
  1: ['전체'],
  2: ['아래쪽 부분', '위쪽 부분'],
  3: ['아래쪽 부분', '가운데 부분', '위쪽 부분'],
}

function createEmptyPartDecision(partName) {
  return {
    partName,
    sideViewShape: null,
    baseShapeFeature: null,
    solidShapeChoice: null,
  }
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
    overflows: modelShapes.length > 0 && drinkVolume > totalVolume,
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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatResultNumber(value) {
  return String(Number(Number(value).toFixed(6)))
}

function getResultGoalText(value, customValue) {
  return value === '기타' ? customValue.trim() || '-' : value || '-'
}

function getCompletedGoalText(isSelected, value) {
  return isSelected && value && value !== '-' ? value : '선택하지 않음'
}

function getResultShapeDimensions(shape) {
  if (shape.type === 'frustum') {
    return [
      `윗면 반지름 ${formatResultNumber(shape.topRadius)} cm`,
      `아랫면 반지름 ${formatResultNumber(shape.bottomRadius)} cm`,
      `높이 ${formatResultNumber(shape.height)} cm`,
    ]
  }

  return [
    `반지름 ${formatResultNumber(shape.radius)} cm`,
    `높이 ${formatResultNumber(shape.height)} cm`,
  ]
}

function getResultShapeRadius(shape) {
  return shape.type === 'frustum'
    ? Math.max(shape.topRadius, shape.bottomRadius)
    : shape.radius
}

function getResultShapeVisualMetrics(shape, scale) {
  const maxRadius = getResultShapeRadius(shape)
  const width = maxRadius * 2 * scale
  const height = shape.height * scale
  const topRadius = shape.type === 'frustum'
    ? shape.topRadius
    : shape.type === 'cone' ? 0 : shape.radius
  const bottomRadius = shape.type === 'frustum'
    ? shape.bottomRadius
    : shape.radius
  const topRatio = maxRadius > 0 ? topRadius / maxRadius : 0
  const bottomRatio = maxRadius > 0 ? bottomRadius / maxRadius : 0
  const topInset = (1 - topRatio) * 50
  const bottomInset = (1 - bottomRatio) * 50

  return {
    container: `width:${width}px;height:${height}px`,
    body: `clip-path:polygon(${topInset}% 0, ${100 - topInset}% 0, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`,
    topCap: `width:${Math.max(topRadius * 2 * scale, 3)}px`,
  }
}

function renderModelingResult() {
  const activityState = window.getActivityResultState?.() ?? {
    studentCalculations: {},
    decisionReason: '',
  }
  const tumbler = TUMBLER_DATA[goalSettings.tumblerType]
  const goalSelection = goalSettings.selectionStatus
  const drinkType = getResultGoalText(goalSettings.drinkType, goalSettings.customDrinkType)
  const extraCondition = getResultGoalText(goalSettings.extraCondition, goalSettings.customExtraCondition)
  const goalRows = [
    ['주로 담을 음료', getCompletedGoalText(goalSelection.drinkType, drinkType)],
    [
      '목표 용량',
      getCompletedGoalText(
        goalSelection.targetVolumeMl && goalSettings.targetVolumeMl > 0,
        `${formatResultNumber(goalSettings.targetVolumeMl)} mL`,
      ),
    ],
    ['용량 외 추가 조건', getCompletedGoalText(goalSelection.extraCondition, extraCondition)],
    ['선택한 텀블러', getCompletedGoalText(goalSelection.tumblerType, tumbler?.nameKo)],
  ]

  elements.modelingResultGoal.innerHTML = goalRows.map(([label, value]) => `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join('')

  elements.modelingResultReason.textContent = String(activityState.decisionReason ?? '').trim()
    || '작성된 판단 근거가 없습니다.'

  const displayedShapes = [...modelShapes].reverse()
  const maxModelDiameter = Math.max(
    ...displayedShapes.map((shape) => getResultShapeRadius(shape) * 2),
    1,
  )
  const totalModelHeight = Math.max(
    displayedShapes.reduce((sum, shape) => sum + shape.height, 0),
    1,
  )
  const modelDiagramScale = Math.min(150 / maxModelDiameter, 220 / totalModelHeight)

  elements.modelingResultShapes.innerHTML = displayedShapes.length > 0
    ? displayedShapes.map((shape, index) => {
        const visual = getResultShapeVisualMetrics(shape, modelDiagramScale)
        const overlap = index === 0 ? 0 : Math.min(7, shape.height * modelDiagramScale * 0.16)

        return `
        <article
          class="result-model-part result-model-color-${index % 3}"
          style="height:${shape.height * modelDiagramScale}px;margin-top:-${overlap}px;z-index:${displayedShapes.length - index}">
          <div class="result-model-part-graphic">
            <div class="result-model-shape" style="${visual.container}">
              <div class="result-model-shape-body" style="${visual.body}"></div>
              <div
                class="result-model-cap result-model-cap-top ${index === 0 ? 'result-model-cap-surface' : 'result-model-cap-connection'}"
                style="${visual.topCap}">
              </div>
            </div>
          </div>
          <div class="result-model-part-label">
            <strong>${index + 1}. ${escapeHtml(getShapeName(shape))}</strong>
            <span>${getResultShapeDimensions(shape).map(escapeHtml).join(' · ')}</span>
          </div>
        </article>
      `
      }).join('')
    : '<p class="result-empty">생성한 도형이 없습니다.</p>'

  let studentTotal = 0
  elements.modelingResultCalculations.innerHTML = displayedShapes.length > 0
    ? displayedShapes.map((shape, index) => {
        const calculation = activityState.studentCalculations?.[String(shape.id)]
        const hasSavedVolume = Number.isFinite(calculation?.volume)

        if (hasSavedVolume) studentTotal += calculation.volume

        return `
          <article class="result-calculation-item">
            <div>
              <strong>${index + 1}. ${escapeHtml(getShapeName(shape))}</strong>
              <span>${calculation?.formula ? escapeHtml(calculation.formula) : '저장된 계산식 없음'}</span>
            </div>
            <b>${hasSavedVolume ? `${calculation.volume.toFixed(1)} mL` : '저장된 계산 결과 없음'}</b>
          </article>
        `
      }).join('')
    : '<p class="result-empty">표시할 부피 계산 결과가 없습니다.</p>'

  elements.modelingResultStudentTotal.textContent = `${studentTotal.toFixed(1)} mL`
  elements.modelingResultProgramTotal.textContent = `${calculateModelVolume().toFixed(1)} mL`
}

function showModelingResult() {
  renderModelingResult()
  elements.modelingResultScreen.hidden = false
  document.body.classList.add('showing-modeling-result')
  elements.modelingResultScreen.scrollTop = 0
}

function hideModelingResult() {
  elements.modelingResultScreen.hidden = true
  document.body.classList.remove('showing-modeling-result')
}

async function saveModelingResultPdf() {
  const resultSheet = elements.modelingResultScreen.querySelector('.modeling-result-sheet')
  const button = elements.printModelingResultButton
  const originalButtonText = button.textContent

  button.disabled = true
  button.textContent = 'PDF 만드는 중...'
  elements.modelingResultScreen.classList.add('is-exporting-pdf')

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])
    await document.fonts?.ready
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const canvas = await html2canvas(resultSheet, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      ignoreElements: (element) => element.classList?.contains('modeling-result-actions'),
    })
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 7
    const availableWidth = pageWidth - margin * 2
    const availableHeight = pageHeight - margin * 2
    const scale = Math.min(availableWidth / canvas.width, availableHeight / canvas.height)
    const imageWidth = canvas.width * scale
    const imageHeight = canvas.height * scale
    const imageX = (pageWidth - imageWidth) / 2
    const imageY = (pageHeight - imageHeight) / 2

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.96),
      'JPEG',
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      undefined,
      'FAST',
    )
    pdf.save('AR-모델링-결과.pdf')
  } catch (error) {
    console.error('모델링 결과 PDF 저장 실패', error)
    window.alert('PDF를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  } finally {
    elements.modelingResultScreen.classList.remove('is-exporting-pdf')
    button.disabled = false
    button.textContent = originalButtonText
  }
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
            data-shape-index="${shapeIndex}"
            data-shape-id="${shape.id}">
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
  if (modelShapes.length === 0) {
    elements.modelVolumeInfo.innerHTML = `
      <b>도형별 부피</b><br>
      -<br>
      <hr>
      <b>전체 부피: 0 mL</b>
    `
    return
  }

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
  const studentSavedVolumeTotal = window.getStudentSavedVolumeTotal?.() ?? 0
  const studentSavedVolumeText = (
    Number.isFinite(studentSavedVolumeTotal) && studentSavedVolumeTotal > 0
      ? `${studentSavedVolumeTotal.toFixed(1)} mL`
      : '아직 저장한 부피 계산 결과가 없습니다.'
  )

  if (!verification.entrance) {
    elements.result.innerHTML = '<div class="safe">모델 없음</div>'
    elements.volumeInfo.hidden = false
    elements.volumeInfo.innerHTML = `
      <b>내가 계산한 전체 부피</b>: ${studentSavedVolumeText}<br>
      <b>음료량</b>: ${verification.drinkVolume.toFixed(1)} mL<br>
      모델을 먼저 생성해 주세요.
    `
    return
  }

  const resultClass = verification.overflows ? 'overflow' : 'safe'
  const resultText = verification.overflows
    ? '내가 만든 모델에서는 넘침'
    : '내가 만든 모델에 담을 수 있음'

  elements.result.innerHTML = `<div class="${resultClass}">${resultText}</div>`
  elements.volumeInfo.hidden = false
  elements.volumeInfo.innerHTML = `
    <b>내가 계산한 전체 부피</b>: ${studentSavedVolumeText}<br>
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

  updateMarkerModel(elements.markerVerificationRoot, verification.shapes, {
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
    updateMarkerModel(elements.markerVerificationRoot, verification.shapes)
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
  elements.deleteShapeButton.disabled = modelShapes.length === 0
  elements.moveShapeUpButton.disabled = modelShapes.length === 0 || selectedShapeIndex >= modelShapes.length - 1
  elements.moveShapeDownButton.disabled = modelShapes.length === 0 || selectedShapeIndex <= 0
  renderShapeList()
  renderEntranceInfo()
  renderModelVolume()
  updateGeneratedModel(elements.modelPreview, modelShapes, modelTransform)
  updatePreviewCameraZoom(elements.previewCamera, modelTransform.zoom)
  if (elements.modelMode.checked) {
    syncPreviewCameraAspect(
      elements.previewCamera,
      document.querySelector('a-scene'),
    )
  }
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
  if (modelShapes.length === 0) {
    return
  }

  modelShapes.splice(selectedShapeIndex, 1)
  selectedShapeIndex = Math.max(Math.min(selectedShapeIndex, modelShapes.length - 1), 0)
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
  setOverflowSceneVisible(elements.markerVerificationRoot, !isModelMode)
  setPreviewCameraActive(elements.previewCamera, isModelMode)
  setPreviewCameraActive(elements.arCamera, !isModelMode)
  renderPartitionStep()

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

function getGoalActivityId() {
  const sessionKey = 'arTumblerGoalActivityId'
  let activityId = sessionStorage.getItem(sessionKey)

  if (!activityId) {
    activityId = globalThis.crypto?.randomUUID?.()
      ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(sessionKey, activityId)
  }

  return activityId
}

function loadGoalSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('goalSettings') || '{}')

    if (savedSettings.activityId !== goalActivityId) {
      return {
        ...defaultGoalSettings,
        selectionStatus: { ...defaultGoalSelectionStatus },
      }
    }

    const targetVolumeMl = Number(savedSettings.targetVolumeMl)

    return {
      ...defaultGoalSettings,
      ...savedSettings,
      selectionStatus: {
        ...defaultGoalSelectionStatus,
        ...savedSettings.selectionStatus,
      },
      targetVolumeMl: Number.isFinite(targetVolumeMl) && targetVolumeMl > 0
        ? targetVolumeMl
        : defaultGoalSettings.targetVolumeMl,
    }
  } catch {
    return {
      ...defaultGoalSettings,
      selectionStatus: { ...defaultGoalSelectionStatus },
    }
  }
}

function saveGoalSettings() {
  localStorage.setItem('goalSettings', JSON.stringify({
    ...goalSettings,
    activityId: goalActivityId,
  }))
}

function isCustomGoalVolume() {
  return (
    thinkingState.isCustomGoalVolumeSelected ||
    !['350', '500', '600'].includes(String(goalSettings.targetVolumeMl))
  )
}

function isGoalStepReady() {
  if (thinkingState.goalStep === 1) {
    return (
      goalSettings.selectionStatus.drinkType &&
      Boolean(goalSettings.drinkType) &&
      (goalSettings.drinkType !== '기타' || Boolean(goalSettings.customDrinkType.trim()))
    )
  }

  if (thinkingState.goalStep === 2) {
    return goalSettings.selectionStatus.targetVolumeMl && goalSettings.targetVolumeMl > 0
  }

  if (thinkingState.goalStep === 3) {
    return (
      goalSettings.selectionStatus.extraCondition &&
      Boolean(goalSettings.extraCondition) &&
      (
        goalSettings.extraCondition !== '기타' ||
        Boolean(goalSettings.customExtraCondition.trim())
      )
    )
  }

  return (
    goalSettings.selectionStatus.tumblerType &&
    Boolean(TUMBLER_DATA[goalSettings.tumblerType])
  )
}

function renderThinkingMenu() {
  const isGoalMenu = thinkingState.selectedMenu === 'goal'

  elements.thinkingGoalMenu.classList.toggle('active', isGoalMenu)
  elements.thinkingModelMenu.classList.toggle('active', !isGoalMenu)
  elements.thinkingGoalFlow.hidden = !isGoalMenu
  elements.thinkingModelFlow.hidden = isGoalMenu
}

function renderThinkingGoalFlow() {
  renderThinkingMenu()

  elements.goalProgress.textContent = `목표 설정 ${thinkingState.goalStep}/4`
  elements.goalDrinkPanel.hidden = thinkingState.goalStep !== 1
  elements.goalVolumePanel.hidden = thinkingState.goalStep !== 2
  elements.goalConditionPanel.hidden = thinkingState.goalStep !== 3
  elements.goalTumblerPanel.hidden = thinkingState.goalStep !== 4
  elements.customDrinkTypeLabel.hidden = goalSettings.drinkType !== '기타'
  elements.customVolumeLabel.hidden = !isCustomGoalVolume()
  elements.customExtraConditionLabel.hidden = goalSettings.extraCondition !== '기타'
  elements.customDrinkTypeInput.value = goalSettings.customDrinkType
  elements.customVolumeInput.value = (
    isCustomGoalVolume() && goalSettings.targetVolumeMl > 0
      ? goalSettings.targetVolumeMl
      : ''
  )
  elements.customExtraConditionInput.value = goalSettings.customExtraCondition
  elements.goalPrevButton.disabled = thinkingState.goalStep === 1
  elements.goalNextButton.disabled = thinkingState.isGoalCompleted || !isGoalStepReady()
  elements.goalNextButton.textContent = thinkingState.isGoalCompleted
    ? '완료됨'
    : thinkingState.goalStep === 4 ? '완료' : '다음'

  elements.goalDrinkTypeInputs.forEach((input) => {
    input.checked = (
      goalSettings.selectionStatus.drinkType &&
      input.value === goalSettings.drinkType
    )
  })
  elements.goalTargetVolumeInputs.forEach((input) => {
    input.checked = (
      goalSettings.selectionStatus.targetVolumeMl &&
      input.value === (isCustomGoalVolume() ? 'custom' : String(goalSettings.targetVolumeMl))
    )
  })
  elements.goalExtraConditionInputs.forEach((input) => {
    input.checked = (
      goalSettings.selectionStatus.extraCondition &&
      input.value === goalSettings.extraCondition
    )
  })
  elements.goalTumblerTypeInputs.forEach((input) => {
    input.checked = (
      goalSettings.selectionStatus.tumblerType &&
      input.value === goalSettings.tumblerType
    )
  })
}

function getPartitionLineY(position) {
  return ((position - 50) / 100) * partitionGuide.height
}

function getPartitionDefaults(partCount) {
  if (partCount === '3') {
    return [38, 62]
  }

  if (partCount === '2') {
    return [50]
  }

  return []
}

function getExplorationParts(partCount) {
  return explorationPartsByCount[partCount] || []
}

function resetExplorationParts(partCount) {
  thinkingState.explorationParts = getExplorationParts(partCount)
  thinkingState.currentPartIndex = 0
  thinkingState.partDecisions = thinkingState.explorationParts.map(createEmptyPartDecision)
  thinkingState.isRealityModelCreated = false
}

function getCurrentPartName() {
  return thinkingState.explorationParts[thinkingState.currentPartIndex] || '이 부분'
}

function getCurrentPartDecision() {
  const partName = getCurrentPartName()

  if (!thinkingState.partDecisions[thinkingState.currentPartIndex]) {
    thinkingState.partDecisions[thinkingState.currentPartIndex] = createEmptyPartDecision(partName)
  }

  return thinkingState.partDecisions[thinkingState.currentPartIndex]
}

function resetCurrentPartAnswers() {
  thinkingState.firstPartBasicShapeAnswer = null
  thinkingState.firstPartSideViewShape = null
  thinkingState.firstPartBaseShapeFeature = null
  thinkingState.firstPartSolidShapeChoice = null
}

function loadCurrentPartAnswers() {
  const decision = getCurrentPartDecision()

  thinkingState.firstPartBasicShapeAnswer = decision.solidShapeChoice ? 'yes' : null
  thinkingState.firstPartSideViewShape = decision.sideViewShape
  thinkingState.firstPartBaseShapeFeature = decision.baseShapeFeature
  thinkingState.firstPartSolidShapeChoice = decision.solidShapeChoice
}

function saveCurrentPartDecision() {
  thinkingState.partDecisions[thinkingState.currentPartIndex] = {
    partName: getCurrentPartName(),
    sideViewShape: thinkingState.firstPartSideViewShape,
    baseShapeFeature: thinkingState.firstPartBaseShapeFeature,
    solidShapeChoice: thinkingState.firstPartSolidShapeChoice,
  }
  thinkingState.isRealityModelCreated = false
}

function hasNextExplorationPart() {
  return thinkingState.currentPartIndex < thinkingState.explorationParts.length - 1
}

function isThinkingCompleteStep() {
  return thinkingState.modelCreationStep === thinkingState.modelCreationCompleteStep
}

function hasFinalConsonant(text) {
  const lastCharCode = text.charCodeAt(text.length - 1)
  const firstHangulCode = '가'.charCodeAt(0)
  const lastHangulCode = '힣'.charCodeAt(0)

  if (lastCharCode < firstHangulCode || lastCharCode > lastHangulCode) {
    return false
  }

  return (lastCharCode - firstHangulCode) % 28 !== 0
}

function getObjectParticle(text) {
  return hasFinalConsonant(text) ? '을' : '를'
}

function getTopicParticle(text) {
  return hasFinalConsonant(text) ? '은' : '는'
}

function getSolidShapeReason(shapeChoice) {
  if (!isObservationCombinationConsistent()) {
    return [
      '다시 관찰해 볼까요?',
      '앞에서 선택한 옆모양과 밑면의 특징이 서로 잘 맞지 않습니다.',
      '실제 부분을 다시 살펴보고, 옆에서 본 모양이나 밑면의 특징을 다시 선택해 보세요.',
    ].join('\n')
  }

  const description = solidShapeReasonDescriptions[shapeChoice]

  if (!description) {
    return ''
  }

  const partName = getCurrentPartName()
  const expectedShape = getExpectedSolidShape()

  if (!expectedShape || shapeChoice === expectedShape) {
    return `선택한 이유\n\n${partName}${getTopicParticle(partName)} ${description}`
  }

  const sideViewShape = sideViewShapeDescriptions[thinkingState.firstPartSideViewShape]
  const baseShapeFeature = baseShapeFeatureDescriptions[thinkingState.firstPartBaseShapeFeature]

  return [
    '다시 생각해 볼까요?',
    '',
    '앞에서 선택한 특징을 다시 확인해 보세요.',
    '',
    `옆에서 본 모양이 ${sideViewShape}이고,`,
    `${baseShapeFeature}이라면`,
    '어떤 기본 입체도형으로 표현하는 것이 가장 적절할까요?',
  ].join('\n')
}

function getExpectedSolidShape() {
  return expectedSolidShapeByObservation[getObservationKey()] || null
}

function getObservationKey() {
  return [
    thinkingState.firstPartSideViewShape,
    thinkingState.firstPartBaseShapeFeature,
  ].join('|')
}

function isObservationCombinationConsistent() {
  return Boolean(getExpectedSolidShape())
}

function getPartitionColor(index) {
  if (thinkingState.partitionPositions.length === 2 && index === 0) {
    return partitionGuide.orange
  }

  return partitionGuide.red
}

function getPartitionPercent(position) {
  const range = partitionGuide.maxPosition - partitionGuide.minPosition

  return ((position - partitionGuide.minPosition) / range) * 100
}

function getPartitionSliderItems() {
  if (thinkingState.partitionPositions.length === 2) {
    return [
      { index: 1, label: '🔴 위쪽 선' },
      { index: 0, label: '🟠 아래쪽 선' },
    ]
  }

  return thinkingState.partitionPositions.map((_, index) => ({
    index,
    label: '🔴 분할선',
  }))
}

function normalizePartitionPositions(changedIndex = 0) {
  const positions = thinkingState.partitionPositions

  if (positions.length !== 2) {
    thinkingState.partitionPositions = positions.map((position) => (
      Math.min(Math.max(position, partitionGuide.minPosition), partitionGuide.maxPosition)
    ))
    return
  }

  let [lower, upper] = positions
  lower = Math.min(Math.max(lower, partitionGuide.minPosition), partitionGuide.maxPosition)
  upper = Math.min(Math.max(upper, partitionGuide.minPosition), partitionGuide.maxPosition)

  if (upper - lower < partitionGuide.minGap) {
    if (changedIndex === 0) {
      lower = Math.min(lower, partitionGuide.maxPosition - partitionGuide.minGap)
      upper = lower + partitionGuide.minGap
    } else {
      upper = Math.max(upper, partitionGuide.minPosition + partitionGuide.minGap)
      lower = upper - partitionGuide.minGap
    }
  }

  thinkingState.partitionPositions = [lower, upper]
}

function setPartitionPosition(index, position) {
  thinkingState.partitionPositions[index] = position
  normalizePartitionPositions(index)
  renderPartitionGuides()
  renderPartitionSliders()
}

function getPointerPartitionPosition(clientY, rect) {
  const ratio = Math.min(Math.max((rect.bottom - clientY) / rect.height, 0), 1)
  const range = partitionGuide.maxPosition - partitionGuide.minPosition

  return Math.round(partitionGuide.minPosition + ratio * range)
}

function isPartitionAdjustmentStep() {
  return thinkingState.modelCreationStep === 2
}

function shouldShowPartitionGuides() {
  return elements.modelMode.checked &&
    !thinkingState.isRealityModelCreated &&
    thinkingState.modelCreationStep >= 2 &&
    (
      thinkingState.modelCreationStep <= thinkingState.modelCreationTotalSteps ||
      isThinkingCompleteStep()
    ) &&
    thinkingState.partitionPositions.length > 0
}

function renderPartitionGuides() {
  const isVisible = shouldShowPartitionGuides()

  if (!isVisible) {
    if (partitionFadeTimer) {
      clearTimeout(partitionFadeTimer)
      partitionFadeTimer = null
    }

    if (thinkingState.isRealityModelCreated && elements.partitionGuides.children.length > 0) {
      Array.from(elements.partitionGuides.children).forEach((guide) => {
        guide.setAttribute('animation__fade', {
          property: 'material.opacity',
          to: 0,
          dur: 250,
          easing: 'easeOutQuad',
        })
      })
      partitionFadeTimer = window.setTimeout(() => {
        if (!shouldShowPartitionGuides()) {
          elements.partitionGuides.setAttribute('visible', 'false')
          elements.partitionGuides.innerHTML = ''
        }
        partitionFadeTimer = null
      }, 260)
      return
    }

    elements.partitionGuides.setAttribute('visible', 'false')
    elements.partitionGuides.innerHTML = ''
    return
  }

  if (partitionFadeTimer) {
    clearTimeout(partitionFadeTimer)
    partitionFadeTimer = null
  }

  elements.partitionGuides.setAttribute('visible', 'true')

  while (elements.partitionGuides.children.length > thinkingState.partitionPositions.length) {
    elements.partitionGuides.lastElementChild.remove()
  }

  thinkingState.partitionPositions.forEach((position, index) => {
    let guide = elements.partitionGuides.children[index]
    const nextPosition = `0 ${getPartitionLineY(position)} ${partitionGuide.zOffset}`
    const guideColor = getPartitionColor(index)

    if (!guide) {
      guide = document.createElement('a-box')
      elements.partitionGuides.appendChild(guide)
    } else {
      guide.removeAttribute('animation__fade')
      guide.setAttribute('animation__move', {
        property: 'position',
        to: nextPosition,
        dur: 100,
        easing: 'easeOutQuad',
      })
    }

    guide.setAttribute('visible', 'true')
    guide.setAttribute('depth', partitionGuide.depth)
    guide.setAttribute('height', partitionGuide.lineHeight)
    guide.setAttribute('width', partitionGuide.width)
    guide.setAttribute('position', nextPosition)
    guide.setAttribute('color', guideColor)
    guide.setAttribute('material', {
      color: guideColor,
      opacity: 1,
      transparent: true,
      shader: 'flat',
    })
  })
}

function renderPartitionSliders() {
  if (!isPartitionAdjustmentStep()) {
    elements.partitionSliders.innerHTML = ''
    return
  }

  elements.partitionSliders.innerHTML = getPartitionSliderItems()
    .map(({ index, label }) => `
      <label
        class="partition-slider-label"
        style="--partition-color: ${getPartitionColor(index)}">
        <span>${label}</span>
        <div
          class="partition-slider-control"
          role="slider"
          tabindex="0"
          aria-label="${label} 위치"
          aria-valuemin="${partitionGuide.minPosition}"
          aria-valuemax="${partitionGuide.maxPosition}"
          aria-valuenow="${thinkingState.partitionPositions[index]}"
          data-partition-index="${index}"
          style="--partition-percent: ${getPartitionPercent(thinkingState.partitionPositions[index])}">
          <span class="partition-slider-track"></span>
          <span class="partition-slider-thumb"></span>
        </div>
      </label>
    `)
    .join('')
}

function renderPartitionStep() {
  const isPartitionStep = isPartitionAdjustmentStep()

  elements.thinkingPartitionPrompt.hidden = !isPartitionStep
  renderPartitionGuides()
  renderPartitionSliders()
}

function renderBasicShapeQuestion() {
  const isQuestionStep = thinkingState.modelCreationStep === 3
  const isNoSelected = thinkingState.firstPartBasicShapeAnswer === 'no'
  const partName = getCurrentPartName()
  const objectParticle = getObjectParticle(partName)

  elements.basicShapeQuestionPanel.hidden = !isQuestionStep
  elements.basicShapeQuestionTitle.textContent = `${partName}${objectParticle} 하나의 기본 입체도형으로 표현할 수 있을까요?`
  elements.basicShapeNoMessage.hidden = !isQuestionStep || !isNoSelected
  elements.backToPartitionButton.hidden = !isQuestionStep || !isNoSelected

  elements.basicShapeAnswerInputs.forEach((input) => {
    input.checked = input.value === thinkingState.firstPartBasicShapeAnswer
  })
}

function renderSideViewQuestion() {
  const isQuestionStep = thinkingState.modelCreationStep === 4
  const partName = getCurrentPartName()
  const objectParticle = getObjectParticle(partName)

  elements.sideViewQuestionPanel.hidden = !isQuestionStep
  elements.sideViewQuestionTitle.textContent = `${partName}${objectParticle} 옆에서 보면 어떤 모양에 가장 가까울까요?`
  elements.sideViewShapeInputs.forEach((input) => {
    input.checked = input.value === thinkingState.firstPartSideViewShape
  })
}

function renderBaseShapeQuestion() {
  const isQuestionStep = thinkingState.modelCreationStep === 5
  const partName = getCurrentPartName()

  elements.baseShapeQuestionPanel.hidden = !isQuestionStep
  elements.baseShapeQuestionTitle.textContent = `${partName}의 위쪽 밑면과 아래쪽 밑면은 어떠한가요?`
  elements.baseShapeFeatureInputs.forEach((input) => {
    input.checked = input.value === thinkingState.firstPartBaseShapeFeature
  })
}

function renderSolidShapeQuestion() {
  const isQuestionStep = thinkingState.modelCreationStep === 6
  const reason = getSolidShapeReason(thinkingState.firstPartSolidShapeChoice)
  const shouldReviewObservation = isQuestionStep && !isObservationCombinationConsistent()
  const partName = getCurrentPartName()
  const objectParticle = getObjectParticle(partName)

  elements.solidShapeQuestionPanel.hidden = !isQuestionStep
  elements.solidShapeQuestionTitle.textContent = `${partName}${objectParticle} 어떤 기본 입체도형으로 표현하는 것이 가장 적절할까요?`
  elements.solidShapeReasonMessage.hidden = !isQuestionStep || !reason
  elements.solidShapeReasonMessage.textContent = reason
  elements.observationReviewActions.hidden = !shouldReviewObservation
  elements.solidShapeChoiceInputs.forEach((input) => {
    input.checked = input.value === thinkingState.firstPartSolidShapeChoice
  })
}

function getSolidShapeName(shapeChoice) {
  if (shapeChoice === 'frustum') {
    return '원뿔대'
  }

  if (shapeChoice === 'cone') {
    return '원뿔'
  }

  if (shapeChoice === 'cylinder') {
    return '원기둥'
  }

  return '미선택'
}

function renderThinkingCompletion() {
  const isComplete = isThinkingCompleteStep()

  elements.thinkingCompletionPanel.hidden = !isComplete
  elements.realityModelCreatedMessage.hidden = !isComplete || !thinkingState.isRealityModelCreated

  if (!isComplete) {
    elements.thinkingDecisionSummary.innerHTML = ''
    return
  }

  elements.thinkingDecisionSummary.innerHTML = thinkingState.partDecisions
    .map((decision) => `
      <li>${decision.partName}: ${getSolidShapeName(decision.solidShapeChoice)}</li>
    `)
    .join('')
}

function getRealityModelHeightEstimates() {
  const partCount = thinkingState.explorationParts.length || 1

  if (partCount === 1) {
    return [DEFAULT_GENERATED_MODEL_HEIGHT]
  }

  const fallbackPositions = getPartitionDefaults(String(partCount))
  const guidePositions = thinkingState.partitionPositions.length === partCount - 1
    ? thinkingState.partitionPositions
    : fallbackPositions
  const boundaries = [0, ...guidePositions].sort((a, b) => a - b)

  boundaries.push(100)

  return boundaries.slice(1).map((boundary, index) => {
    const previousBoundary = boundaries[index]
    const height = ((boundary - previousBoundary) / 100) * DEFAULT_GENERATED_MODEL_HEIGHT

    return Number(height.toFixed(1))
  })
}

function createRealityModelShape(decision, height) {
  return {
    ...createDefaultShape(decision.solidShapeChoice),
    height,
  }
}

function createRealityModelFromDecisions() {
  if (!isThinkingCompleteStep()) {
    return
  }

  const heights = getRealityModelHeightEstimates()

  modelShapes = thinkingState.partDecisions.map((decision, index) => (
    createRealityModelShape(decision, heights[index] ?? DEFAULT_GENERATED_MODEL_HEIGHT)
  ))
  selectedShapeIndex = Math.max(modelShapes.length - 1, 0)
  loadSelectedShapeToInputs()
  updateModelPreview({ syncInputs: false })
  thinkingState.isRealityModelCreated = true
  renderPartitionGuides()
  renderThinkingModelFlow()
}

function renderThinkingModelFlow() {
  renderThinkingMenu()

  const isComplete = isThinkingCompleteStep()

  elements.thinkingProgress.textContent = isComplete
    ? '모델 생성 완료'
    : `모델 생성 ${thinkingState.modelCreationStep}/${thinkingState.modelCreationTotalSteps}`
  elements.thinkingQuestionPanel.hidden = thinkingState.modelCreationStep !== 1
  elements.thinkingNextStepMessage.hidden = true
  elements.thinkingPrevButton.disabled = thinkingState.modelCreationStep === 1
  elements.thinkingNextButton.hidden = isComplete
  elements.thinkingNextButton.disabled = (
    (thinkingState.modelCreationStep === 1 && !thinkingState.partCount) ||
    (thinkingState.modelCreationStep === 3 && thinkingState.firstPartBasicShapeAnswer !== 'yes') ||
    (thinkingState.modelCreationStep === 4 && !thinkingState.firstPartSideViewShape) ||
    (thinkingState.modelCreationStep === 5 && !thinkingState.firstPartBaseShapeFeature) ||
    (thinkingState.modelCreationStep === 6 && !thinkingState.firstPartSolidShapeChoice)
  )
  elements.thinkingNextButton.textContent = '다음'

  elements.partCountInputs.forEach((input) => {
    input.checked = input.value === thinkingState.partCount
  })

  renderPartitionStep()
  renderBasicShapeQuestion()
  renderSideViewQuestion()
  renderBaseShapeQuestion()
  renderSolidShapeQuestion()
  renderThinkingCompletion()
}

function toggleThinkingSidebar() {
  thinkingState.isOpen = !thinkingState.isOpen
  renderThinkingSidebar()
}

function selectThinkingModelMenu() {
  thinkingState.selectedMenu = 'model'
  renderThinkingModelFlow()
}

function selectThinkingGoalMenu() {
  thinkingState.selectedMenu = 'goal'
  renderThinkingGoalFlow()
}

function selectGoalDrinkType(event) {
  thinkingState.isGoalCompleted = false
  goalSettings = {
    ...goalSettings,
    drinkType: event.target.value,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      drinkType: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function updateCustomDrinkType(event) {
  thinkingState.isGoalCompleted = false
  goalSettings = {
    ...goalSettings,
    customDrinkType: event.target.value,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      drinkType: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function selectGoalTargetVolume(event) {
  thinkingState.isGoalCompleted = false
  const selectedValue = event.target.value
  thinkingState.isCustomGoalVolumeSelected = selectedValue === 'custom'
  const targetVolumeMl = thinkingState.isCustomGoalVolumeSelected
    ? Number(elements.customVolumeInput.value) || 0
    : Number(selectedValue)

  goalSettings = {
    ...goalSettings,
    targetVolumeMl,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      targetVolumeMl: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function updateCustomGoalVolume(event) {
  thinkingState.isGoalCompleted = false
  thinkingState.isCustomGoalVolumeSelected = true
  const targetVolumeMl = Number(event.target.value)

  goalSettings = {
    ...goalSettings,
    targetVolumeMl: Number.isFinite(targetVolumeMl) ? targetVolumeMl : 0,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      targetVolumeMl: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function selectGoalExtraCondition(event) {
  thinkingState.isGoalCompleted = false
  goalSettings = {
    ...goalSettings,
    extraCondition: event.target.value,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      extraCondition: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function updateCustomExtraCondition(event) {
  thinkingState.isGoalCompleted = false
  goalSettings = {
    ...goalSettings,
    customExtraCondition: event.target.value,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      extraCondition: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function selectGoalTumblerType(event) {
  thinkingState.isGoalCompleted = false
  goalSettings = {
    ...goalSettings,
    tumblerType: event.target.value,
    isCompleted: false,
    selectionStatus: {
      ...goalSettings.selectionStatus,
      tumblerType: true,
    },
  }
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function goToGoalNextStep() {
  if (!isGoalStepReady()) {
    return
  }

  if (thinkingState.goalStep === 4) {
    thinkingState.isGoalCompleted = true
    goalSettings = {
      ...goalSettings,
      isCompleted: true,
    }
    saveGoalSettings()
    renderThinkingGoalFlow()
    return
  }

  thinkingState.goalStep = Math.min(thinkingState.goalStep + 1, 4)
  saveGoalSettings()
  renderThinkingGoalFlow()
}

function goToGoalPreviousStep() {
  thinkingState.isGoalCompleted = false
  if (goalSettings.isCompleted) {
    goalSettings = {
      ...goalSettings,
      isCompleted: false,
    }
    saveGoalSettings()
  }
  thinkingState.goalStep = Math.max(thinkingState.goalStep - 1, 1)
  renderThinkingGoalFlow()
}

function selectPartCount(event) {
  thinkingState.partCount = event.target.value
  resetExplorationParts(thinkingState.partCount)
  thinkingState.partitionPositions = getPartitionDefaults(thinkingState.partCount)
  resetCurrentPartAnswers()
  renderThinkingModelFlow()
}

function selectBasicShapeAnswer(event) {
  thinkingState.firstPartBasicShapeAnswer = event.target.value
  thinkingState.firstPartSideViewShape = null
  thinkingState.firstPartBaseShapeFeature = null
  thinkingState.firstPartSolidShapeChoice = null
  renderThinkingModelFlow()
}

function selectSideViewShape(event) {
  thinkingState.firstPartSideViewShape = event.target.value
  thinkingState.firstPartBaseShapeFeature = null
  thinkingState.firstPartSolidShapeChoice = null
  renderThinkingModelFlow()
}

function selectBaseShapeFeature(event) {
  thinkingState.firstPartBaseShapeFeature = event.target.value
  thinkingState.firstPartSolidShapeChoice = null
  renderThinkingModelFlow()
}

function selectSolidShapeChoice(event) {
  thinkingState.firstPartSolidShapeChoice = event.target.value
  renderThinkingModelFlow()
}

function goToThinkingNextStep() {
  if (!thinkingState.partCount) {
    return
  }

  if (thinkingState.modelCreationStep === 1) {
    thinkingState.modelCreationStep = thinkingState.partCount === '1' ? 3 : 2
  } else if (thinkingState.modelCreationStep === 2) {
    thinkingState.modelCreationStep = 3
  } else if (
    thinkingState.modelCreationStep === 3 &&
    thinkingState.firstPartBasicShapeAnswer === 'yes'
  ) {
    thinkingState.modelCreationStep = 4
  } else if (
    thinkingState.modelCreationStep === 4 &&
    thinkingState.firstPartSideViewShape
  ) {
    thinkingState.modelCreationStep = 5
  } else if (
    thinkingState.modelCreationStep === 5 &&
    thinkingState.firstPartBaseShapeFeature
  ) {
    thinkingState.modelCreationStep = 6
  } else if (
    thinkingState.modelCreationStep === 6 &&
    thinkingState.firstPartSolidShapeChoice
  ) {
    saveCurrentPartDecision()

    if (hasNextExplorationPart()) {
      thinkingState.currentPartIndex += 1
      resetCurrentPartAnswers()
      thinkingState.modelCreationStep = 3
    } else {
      thinkingState.modelCreationStep = thinkingState.modelCreationCompleteStep
    }
  }

  renderThinkingModelFlow()
}

function goToThinkingPreviousStep() {
  if (isThinkingCompleteStep()) {
    thinkingState.currentPartIndex = Math.max(thinkingState.explorationParts.length - 1, 0)
    loadCurrentPartAnswers()
    thinkingState.modelCreationStep = 6
  } else if (thinkingState.modelCreationStep === 6) {
    thinkingState.modelCreationStep = 5
  } else if (thinkingState.modelCreationStep === 5) {
    thinkingState.modelCreationStep = 4
  } else if (thinkingState.modelCreationStep === 4) {
    thinkingState.modelCreationStep = 3
  } else if (thinkingState.modelCreationStep === 3 && thinkingState.currentPartIndex > 0) {
    thinkingState.currentPartIndex -= 1
    loadCurrentPartAnswers()
    thinkingState.modelCreationStep = 6
  } else if (thinkingState.modelCreationStep === 3 && thinkingState.partCount !== '1') {
    thinkingState.modelCreationStep = 2
  } else {
    thinkingState.modelCreationStep = 1
  }

  renderThinkingModelFlow()
}

function goBackToPartitionStep() {
  thinkingState.modelCreationStep = 2
  renderThinkingModelFlow()
}

function reviewSideViewShape() {
  thinkingState.modelCreationStep = 4
  renderThinkingModelFlow()
}

function reviewBaseShapeFeature() {
  thinkingState.modelCreationStep = 5
  renderThinkingModelFlow()
}

function updatePartitionPositionFromPointer(event) {
  if (!activePartitionDrag) {
    return
  }

  event.preventDefault()
  setPartitionPosition(
    activePartitionDrag.index,
    getPointerPartitionPosition(event.clientY, activePartitionDrag.rect),
  )
}

function startPartitionDrag(event) {
  const slider = event.target.closest('.partition-slider-control')

  if (!slider) {
    return
  }

  event.preventDefault()
  activePartitionDrag = {
    index: parseInt(slider.dataset.partitionIndex, 10),
    rect: slider.getBoundingClientRect(),
  }
  slider.setPointerCapture?.(event.pointerId)
  updatePartitionPositionFromPointer(event)
}

function stopPartitionDrag() {
  activePartitionDrag = null
}

function adjustPartitionWithKeyboard(event) {
  const slider = event.target.closest('.partition-slider-control')

  if (!slider) {
    return
  }

  const index = parseInt(slider.dataset.partitionIndex, 10)
  const currentPosition = thinkingState.partitionPositions[index]
  const keySteps = {
    ArrowUp: 1,
    ArrowRight: 1,
    ArrowDown: -1,
    ArrowLeft: -1,
    PageUp: 5,
    PageDown: -5,
  }

  if (event.key === 'Home') {
    event.preventDefault()
    setPartitionPosition(index, partitionGuide.minPosition)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    setPartitionPosition(index, partitionGuide.maxPosition)
    return
  }

  if (!keySteps[event.key]) {
    return
  }

  event.preventDefault()
  setPartitionPosition(index, currentPosition + keySteps[event.key])
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
elements.rotateLeftButton?.addEventListener('click', () => rotateModel(-15))
elements.rotateRightButton?.addEventListener('click', () => rotateModel(15))
elements.zoomOutButton.addEventListener('click', () => zoomModel(-0.1))
elements.zoomInButton.addEventListener('click', () => zoomModel(0.1))
elements.updateCupButton.addEventListener('click', () => updateOverflowVerification({ playEffects: true }))
elements.drinkVolume.addEventListener('input', updateOverflowVerification)
elements.thinkingSidebarToggle.addEventListener('click', toggleThinkingSidebar)
elements.thinkingGoalMenu.addEventListener('click', selectThinkingGoalMenu)
elements.thinkingModelMenu.addEventListener('click', selectThinkingModelMenu)
elements.createRealityModelButton.addEventListener('click', createRealityModelFromDecisions)
elements.goalDrinkTypeInputs.forEach((input) => {
  input.addEventListener('change', selectGoalDrinkType)
})
elements.goalTargetVolumeInputs.forEach((input) => {
  input.addEventListener('change', selectGoalTargetVolume)
})
elements.goalExtraConditionInputs.forEach((input) => {
  input.addEventListener('change', selectGoalExtraCondition)
})
elements.goalTumblerTypeInputs.forEach((input) => {
  input.addEventListener('change', selectGoalTumblerType)
})
elements.customDrinkTypeInput.addEventListener('input', updateCustomDrinkType)
elements.customVolumeInput.addEventListener('input', updateCustomGoalVolume)
elements.customExtraConditionInput.addEventListener('input', updateCustomExtraCondition)
elements.goalNextButton.addEventListener('click', goToGoalNextStep)
elements.goalPrevButton.addEventListener('click', goToGoalPreviousStep)
elements.partCountInputs.forEach((input) => {
  input.addEventListener('change', selectPartCount)
})
elements.basicShapeAnswerInputs.forEach((input) => {
  input.addEventListener('change', selectBasicShapeAnswer)
})
elements.sideViewShapeInputs.forEach((input) => {
  input.addEventListener('change', selectSideViewShape)
})
elements.baseShapeFeatureInputs.forEach((input) => {
  input.addEventListener('change', selectBaseShapeFeature)
})
elements.solidShapeChoiceInputs.forEach((input) => {
  input.addEventListener('change', selectSolidShapeChoice)
})
elements.backToPartitionButton.addEventListener('click', goBackToPartitionStep)
elements.reviewSideViewButton.addEventListener('click', reviewSideViewShape)
elements.reviewBaseShapeButton.addEventListener('click', reviewBaseShapeFeature)
elements.partitionSliders.addEventListener('pointerdown', startPartitionDrag)
elements.partitionSliders.addEventListener('keydown', adjustPartitionWithKeyboard)
window.addEventListener('pointermove', updatePartitionPositionFromPointer)
window.addEventListener('pointerup', stopPartitionDrag)
window.addEventListener('pointercancel', stopPartitionDrag)
window.addEventListener('resize', () => {
  window.requestAnimationFrame(syncPreviewCameraViewport)
})
window.addEventListener('orientationchange', () => {
  window.requestAnimationFrame(syncPreviewCameraViewport)
})
elements.thinkingNextButton.addEventListener('click', goToThinkingNextStep)
elements.thinkingPrevButton.addEventListener('click', goToThinkingPreviousStep)
elements.showModelingResultButton?.addEventListener('click', showModelingResult)
elements.backFromModelingResultButton?.addEventListener('click', hideModelingResult)
elements.printModelingResultButton?.addEventListener('click', saveModelingResultPdf)
window.addEventListener('load', () => {
  setMode(modes.model)
  renderThinkingSidebar()
  renderThinkingGoalFlow()
  renderThinkingModelFlow()
  const scene = document.querySelector('a-scene')
  const syncAfterSceneReady = () => {
    installPreviewCameraRenderGuard(scene)
    window.requestAnimationFrame(syncPreviewCameraViewport)
  }

  if (scene?.hasLoaded) {
    syncAfterSceneReady()
  } else {
    scene?.addEventListener('loaded', syncAfterSceneReady, { once: true })
  }

})
