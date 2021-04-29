const saveTodayBtn = document.querySelector(".saveTodayBtn");

const CALENDER = "CALENDAR";
let CALENDER_ARRAY = [];

//일치하는 날짜 있는지 확인
const findDay = function(day, month, year) {
    let idx;
    const returnObj = CALENDER_ARRAY.find(function(item) {
        return item.day === day && item.month === month && item.year === year;
    });
    idx = CALENDER_ARRAY.indexOf(returnObj);
    console.log(idx);
    return idx;
};

//캘린더 저장
const saveTodayListWithDate = function(dayObj) {
    localStorage.setItem(CALENDER, JSON.stringify(dayObj));
};

//CALENDER 갱신 + 로컬에 저장
const saveTodayToDos = function() {
    console.log(TODOS_ARRAY);

    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    console.log(`${day} | ${month} | ${year}`);

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

//처음 실행하는 함수
function init() {
    loadedCalender();
    saveTodayBtn.addEventListener("click", saveTodayToDos);
}

init();