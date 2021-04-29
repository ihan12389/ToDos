//초기화 객체
const initi = {
    //월 리스트
    monList: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    //요일 리스트
    dayList: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    //날짜 정보
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    //다음 달 정보
    nextMonth: function() {
        let d = new Date();
        d.setDate(1);
        d.setMonth(++this.monForChange);
        this.activeDate = d;
        return d;
    },
    //이전 달 정보
    prevMonth: function() {
        let d = new Date();
        d.setDate(1);
        d.setMonth(--this.monForChange);
        this.activeDate = d;
        return d;
    },
    //두자리 만들기
    addZero: (num) => (num < 10 ? "0" + num : num),
    //현재 활성화 된 날짜
    activeDTag: null,
    //인덱스 얻기
    getIndex: function(node) {
        let index = 0;
        while ((node = node.previousElementSibling)) {
            index++;
        }
        return index;
    },
};

//필요 객체 소환
const $calBody = document.querySelector(".cal-body");
const $btnNext = document.querySelector(".btn-cal.next");
const $btnPrev = document.querySelector(".btn-cal.prev");

//입력받은 일, 요일 출력
function loadDate(date, dayIn) {
    document.querySelector(".cal-date").textContent = date;
    document.querySelector(".cal-day").textContent = initi.dayList[dayIn];
}

//입력받은 날짜의 달력 출력
function loadYYMM(fullDate) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = initi.getFirstDay(yy, mm);
    let lastDay = initi.getLastDay(yy, mm);
    let markToday; // for marking today date

    if (mm === initi.today.getMonth() && yy === initi.today.getFullYear()) {
        markToday = initi.today.getDate();
    }

    document.querySelector(".cal-month").textContent = initi.monList[mm];
    document.querySelector(".cal-year").textContent = yy;

    let trtd = "";
    let startCount;
    let countDay = 0;
    for (let i = 0; i < 6; i++) {
        trtd += "<tr>";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && !startCount && j === firstDay.getDay()) {
                startCount = 1;
            }
            if (!startCount) {
                trtd += "<td>";
            } else {
                let fullDate =
                    yy + "." + initi.addZero(mm + 1) + "." + initi.addZero(countDay + 1);
                trtd += '<td class="day';
                trtd += markToday && markToday === countDay + 1 ? ' today" ' : '"';
                trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}">`;
            }
            trtd += startCount ? ++countDay : "";
            if (countDay === lastDay.getDate()) {
                startCount = 0;
            }
            trtd += "</td>";
        }
        trtd += "</tr>";
    }
    $calBody.innerHTML = trtd;
}

//쓰지도 않는 기능 왜 있지?
// function createNewList(val) {
//     let id = new Date().getTime() + "";
//     let yy = initi.activeDate.getFullYear();
//     let mm = initi.activeDate.getMonth() + 1;
//     let dd = initi.activeDate.getDate();
//     const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);

//     let date = yy + "." + initi.addZero(mm) + "." + initi.addZero(dd);

//     let eventData = {};
//     eventData["date"] = date;
//     eventData["memo"] = val;
//     eventData["complete"] = false;
//     eventData["id"] = id;
//     initi.event.push(eventData);
//     $todoList.appendChild(createLi(id, val, date));
// }

//오늘의 달력을 그리고
loadYYMM(initi.today);
//오늘의 날짜를 출력해!
loadDate(initi.today.getDate(), initi.today.getDay());

//다음 달의 달력을 그려!
$btnNext.addEventListener("click", () => loadYYMM(initi.nextMonth()));
//이전 달의 달력을 그려!
$btnPrev.addEventListener("click", () => loadYYMM(initi.prevMonth()));

//달력 안에도 이벤트 리스너!
$calBody.addEventListener("click", (e) => {
    //날짜를 클릭하면
    if (e.target.classList.contains("day")) {
        //현재 활성화되어 있는 날짜가 있다면 그걸 지워
        if (initi.activeDTag) {
            initi.activeDTag.classList.remove("day-active");
        }
        //현재 클릭한 날짜를 받고
        let day = Number(e.target.textContent);
        //클릭한 날짜로 일, 요일 출력
        loadDate(day, e.target.cellIndex);
        //그리고 지금 클릭한 걸 활성화 시켜!
        e.target.classList.add("day-active");
        initi.activeDTag = e.target;
        initi.activeDate.setDate(day);
        reloadTodo();
    }
});