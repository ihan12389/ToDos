const openCld = document.querySelector(".openCld");
const closeCld = document.querySelector(".closeCld");

const CALENDER = "CALENDAR";
let CALENDER_ARRAY = [];

//일치하는 날짜 있는지 확인
const findDay = function(day, month, year) {
    let idx;
    const returnObj = CALENDER_ARRAY.find(function(item) {
        return item.day === day && item.month === month && item.year === year;
    });
    idx = CALENDER_ARRAY.indexOf(returnObj);
    return idx;
};

//캘린더 저장
const saveTodayListWithDate = function(dayObj) {
    localStorage.setItem(CALENDER, JSON.stringify(dayObj));
};

//CALENDER 갱신 + 로컬에 저장
const saveTodayToDos = function() {
    let dayObj = { year, month, day, TODOS_ARRAY, FINISHED_ARRAY };
    let idx = findDay(day, month, year);

    if (idx !== -1) {
        CALENDER_ARRAY[idx] = dayObj;
    } else {
        CALENDER_ARRAY.push(dayObj);
    }

    saveTodayListWithDate(CALENDER_ARRAY);
};

//calender 불러오기
const loadedCalender = function() {
    const calender = localStorage.getItem(CALENDER);
    if (calender) {
        CALENDER_ARRAY = JSON.parse(calender);
    }
};

const openCalendar = function() {
    wrap.classList.add("dp_none");
    title.classList.add("dp_none");
    container.classList.remove("dp_none");
};
const closeCalendar = function() {
    container.classList.add("dp_none");
    wrap.classList.remove("dp_none");
    title.classList.remove("dp_none");
};

//처음 실행하는 함수
function init() {
    loadedCalender();
    openCld.addEventListener("click", openCalendar);
    closeCld.addEventListener("click", closeCalendar);
}

init();