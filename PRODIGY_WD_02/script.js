let intervalID;
let totalElapsedTime = 0;
let timerActive = false;

const hourElement = document.getElementById("hours");
const minuteElement = document.getElementById("minutes");
const secondElement = document.getElementById("seconds");
const millisecondElement = document.getElementById("milliseconds");
const lapListContainer = document.getElementById("laps-list");

function convertMilliseconds(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const remainingMilliseconds = ms % 1000;
  const hourCount = Math.floor(totalSeconds / 3600);
  const minuteCount = Math.floor((totalSeconds % 3600) / 60);
  const secondCount = totalSeconds % 60;
  return {
    hours: String(hourCount).padStart(2, "0"),
    minutes: String(minuteCount).padStart(2, "0"),
    seconds: String(secondCount).padStart(2, "0"),
    milliseconds: String(remainingMilliseconds).padStart(3, "0"),
  };
}

function refreshTimerDisplay() {
  const formattedTime = convertMilliseconds(totalElapsedTime);
  hourElement.textContent = formattedTime.hours;
  minuteElement.textContent = formattedTime.minutes;
  secondElement.textContent = formattedTime.seconds;
  millisecondElement.textContent = formattedTime.milliseconds;
}

function initiateTimer() {
  if (!timerActive) {
    timerActive = true;
    const startTimestamp = Date.now() - totalElapsedTime;
    intervalID = setInterval(() => {
      totalElapsedTime = Date.now() - startTimestamp;
      refreshTimerDisplay();
    }, 25);
  }
}

function haltTimer() {
  timerActive = false;
  clearInterval(intervalID);
}

function clearTimer() {
  timerActive = false;
  clearInterval(intervalID);
  totalElapsedTime = 0;
  refreshTimerDisplay();
  lapListContainer.innerHTML = "";
}

function logLap() {
  if (timerActive) {
    const formattedTime = convertMilliseconds(totalElapsedTime);
    const lapTimestamp = `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}:${formattedTime.milliseconds}`;
    const newLapItem = document.createElement("li");
    newLapItem.textContent = `🔥 Lap ${lapListContainer.children.length + 1}: ${lapTimestamp}`;
    lapListContainer.appendChild(newLapItem);
  }
}

document.getElementById("start").addEventListener("click", initiateTimer);
document.getElementById("pause").addEventListener("click", haltTimer);
document.getElementById("reset").addEventListener("click", clearTimer);
document.getElementById("lap").addEventListener("click", logLap);
