import './style.css'
import {
  calculateCylinderVolume,
  calculateOverflowAmount,
  calculateLiquidHeight,
} from './geometry.js'
import { updateCupScene } from './arScene.js'

const elements = {
  bottomRadius: document.getElementById('bottomRadius'),
  height: document.getElementById('height'),
  drinkVolume: document.getElementById('drinkVolume'),
  updateCupButton: document.getElementById('updateCupButton'),
  showVolumeButton: document.getElementById('showVolumeButton'),
  result: document.getElementById('result'),
  volumeInfo: document.getElementById('volumeInfo'),
  overflowSound: document.getElementById('overflowSound'),
  cup: document.getElementById('cup'),
}

function readCupValues() {
  const radius = parseFloat(elements.bottomRadius.value)
  const height = parseFloat(elements.height.value)
  const drinkVolume = parseFloat(elements.drinkVolume.value)
  const volume = calculateCylinderVolume(radius, height)

  return { radius, height, drinkVolume, volume }
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

elements.updateCupButton.addEventListener('click', updateCup)
elements.showVolumeButton.addEventListener('click', showVolume)
window.addEventListener('load', updateCup)
