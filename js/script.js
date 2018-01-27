/**
 * Pomodoro Clock
 * Author: Antonis Triantafullopoylos <antonistri96@gmail.com>
 * Date: 27/01/2018
 */

var breakDisplay = document.getElementById("break-display");
var sessionDisplay = document.getElementById("session-display");
var timerTitle = document.getElementById("timer-title");
var timeLeftDisplay = document.getElementById("timer-left");
var fillEl = document.getElementsByClassName("fill")[0];

var breakTime = 5;
var workTime = 25;
var longBreak = 15;

var timeLeft = workTime;
var currentTime = workTime;
var secs = 60 * workTime;
var timerRun = false;
var previousState = "Start";
var title = "Start";
var timerColor = "";
var breaks = 0;


/**
 * Initial function
 */
function init() {
    setInnerHtml(breakDisplay, breakTime);
    setInnerHtml(sessionDisplay, workTime);
    setInnerHtml(timeLeftDisplay, secToTime(secs));
    setInnerHtml(timerTitle, title);
    fillEl.style.height = fillEl;
}

/**
 * Set InnerHtml to element
 * @param {el} el 
 * @param {string} str 
 */
function setInnerHtml(el, str) {
    el.innerHTML = str;
}

/**
 * Get InnerHtml of an element
 * @param {el} el 
 * @param {string} str 
 */
function getInnerHtml(el, str) {
    return el.innerHTML;
}

/**
 * Change break length 
 * @param {integer} min 
 */
function changeBreakTime(min) {
    if (!timerRun) {
        if (breakTime > 1) {
            breakTime += min;
        } else if (min === 1) {
            breakTime += min;
        }
        setInnerHtml(breakDisplay, breakTime);
    }
}

/**
 * Change session length 
 * @param {integer} min 
 */
function changeWorkTime(min) {
    if (!timerRun) {
        if (workTime > 1) {
            workTime += min;
        } else if (min === 1) {
            workTime += min;
        }
        secs = 60 * workTime;
        if (title === "Pause") {
            title = "Start";
            previousState = "Start";
        }
        setInnerHtml(timerTitle, title);
        setInnerHtml(sessionDisplay, workTime);
        setInnerHtml(timeLeftDisplay, secToTime(secs));
    }
}

/**
 * Convert sec to Hours, minutes, seconds
 * @param {number} t 
 * @returns {string}
 */
function secToTime(t) {
    t = Number(t);

    var h = Math.floor(t / 3600);
    var m = Math.floor(t % 3600 / 60);
    var s = Math.floor(t % 3600 % 60);

    return (
        (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
    );
}

/**
 * Toggle timer on and off
 */
function toggleTimer() {
    if (!timerRun) {
        if (title === "Start") {
            // Start
            title = "Work";
            previousState = "Work";
            breaks = 0;
            updateTimer();
            timerRun = setInterval(updateTimer, 1000);
        } else if (title === "Pause") {
            // Unpause
            title = previousState;
            previousState = getInnerHtml(timerTitle);
            updateTimer();
            timerRun = setInterval(updateTimer, 1000);
        }
    } else {
        // Pause
        title = "Pause";
        previousState = getInnerHtml(timerTitle);
        clearInterval(timerRun);
        timerRun = false;
    }
    setInnerHtml(timerTitle, title);
}

/**
 * Update the timer
 */
function updateTimer() {
    secs -= 1;
    if (secs < 0) {
        var clip = 'https://raw.githubusercontent.com/kamenos96/fcc-pomodoro-clock/master/audio/buzzer.mp3';
        var audio = new Audio(clip);
        audio.play();
        if (title === "Work") {
            // Break Time
            title = "Break";
            previousState = "Break";
            breaks += 1;
            if (breaks < 4 || breaks % 4 != 0) {
                currentTime = breakTime;
                secs = 60 * breakTime;
            } else {
                currentTime = longBreak;
                secs = 60 * longBreak;
            }
            timerColor = "#4CD4B0";
        } else {
            // Work Time
            title = "Work";
            previousState = "Work";
            currentTime = workTime;
            secs = 60 * workTime;
            timerColor = "#7D1424";
        }
        fillEl.style.height = "0%";
        timeLeft = secToTime(secs);
        setInnerHtml(timerTitle, title);
        setInnerHtml(timeLeftDisplay, timeLeft);
    } else {
        var percent = 0;
        var y = 0;
        if (title === "Work") {
            y = 60 * workTime;
            timerColor = "#7D1424";
        } else {
            if (breaks < 4 || breaks % 4 != 0) {
                y = 60 * breakTime;                
            } else {
                y = 60 * longBreak;
            }
            timerColor = "#4CD4B0";
        }
        percent = Math.abs((secs / y) * 100 - 100);
        fillEl.style.height = percent + "%";
        fillEl.style.background = timerColor;
        timeLeft = secToTime(secs);
        setInnerHtml(timeLeftDisplay, timeLeft);
    }
}