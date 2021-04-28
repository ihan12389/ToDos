const pending = document.querySelector(".pending");
const finished = document.querySelector(".finished");
const modal = document.querySelector(".modal");
const modal_form = modal.querySelector(".modal_form");
const player1 = document.querySelector("#player1");
const movieViewerH2 = document.querySelector(".movieViewer h2");
const movieViewer_default = document.querySelector(".movieViewer_default");
const movieViewer_video = document.querySelector(".movieViewer_video");
const modalCloseBtn = modal.querySelector(".close");
const writeBtn = document.querySelector(".write");
const modalVideo = modal.querySelector(".modalViewer_video");
let modal_input = modal.querySelector(".modal_input");

const TODOS = "TODOS";
const FINISHED = "FINISHED";

let TODOS_ARRAY = [];
let FINISHED_ARRAY = [];

let toDosFlag = false;
let finishedFlag = false;

let pendingCount = 1;
let finishedCount = 1;

const VIDEO_SRC_ARRAY = [
    "https://www.youtube.com/embed/rEaU6IwH3fw?autoplay=1&loop=1&playlist=rEaU6IwH3fw",
    "https://www.youtube.com/embed/sXFfd9OL5Ao?autoplay=1&loop=1&enablejsapi=1&playlist=sXFfd9OL5Ao",
    "https://www.youtube.com/embed/sXFfd9OL5Ao?mute=1&loop=1&enablejsapi=1&playlist=sXFfd9OL5Ao",
];

//리스트 뭐 있으면 할 일 띄움
const HandlerMovieViewerH2 = function() {
    setTimeout(function() {
        const pendingLi = document.querySelectorAll(".pending li");
        const finishedLi = document.querySelectorAll(".finished li");
        const pendingLi_Leng = pendingLi.length;
        const finishedLi_Leng = finishedLi.length;

        //할 일 한 일 중 하나라도 존재하면
        if (pendingLi_Leng || finishedLi_Leng) {
            const tempSrc = player1.getAttribute("src");
            if (tempSrc !== VIDEO_SRC_ARRAY[1]) {
                player1.setAttribute("src", VIDEO_SRC_ARRAY[1]);
            }
            movieViewerH2.innerText = `You have ${pendingLi_Leng} list and ${finishedLi_Leng} finished list.`;
            movieViewer_video.classList.add("dp_block");
            movieViewer_default.classList.remove("dp_block");
        } else {
            //둘 다 없으면
            player1.setAttribute("src", VIDEO_SRC_ARRAY[2]);
            movieViewerH2.innerText = "Add Do it list.";
            movieViewer_default.classList.add("dp_block");
            movieViewer_video.classList.remove("dp_block");
        }
    }, 0);
};

//동영상 모달 닫으면
const handlerModalClose = function() {
    setTimeout(function() {
        HandlerMovieViewerH2();
        modalVideo.setAttribute("src", "");
        modal.className = "dp_none";
        movieViewer_video.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
        );
    }, 0);
};

//글쓰기 버튼 누르면
const handlerWriteBtn = function() {
    modalVideo.setAttribute("src", VIDEO_SRC_ARRAY[0]);
    modal.className = "modal";
    movieViewer_video.contentWindow.postMessage(
        '{"event":"command","func":"stopVideo","args":""}',
        "*"
    );
};

//할 일 로컬저장소에 저장
const saveToDos = function() {
    localStorage.setItem(TODOS, JSON.stringify(TODOS_ARRAY));
};

//한 일 로컬저장소에 저장
const saveFinished = function() {
    localStorage.setItem(FINISHED, JSON.stringify(FINISHED_ARRAY));
};

//할 일 리스트 창 초기화
const resetPendingLi = function() {
    while (pending.childElementCount) {
        pending.removeChild(pending.lastChild);
    }
    pendingCount = 1;
};

//한 일 리스트 창 초기화
const resetFinishedLi = function() {
    while (finished.childElementCount) {
        finished.removeChild(finished.lastChild);
    }
    finishedCount = 1;
};

//toDo 지우기
const deletePending = function(event) {
    const btn = event.target;
    const li = btn.parentNode;

    const clenToDos = TODOS_ARRAY.filter(function(item) {
        return item.id !== parseInt(li.id, 10);
    });

    TODOS_ARRAY = clenToDos;
    saveToDos();
    resetPendingLi();
    TODOS_ARRAY.forEach(function(item) {
        paintToDo(item);
    });

    HandlerMovieViewerH2();
};

//finished 지우기
const deleteFinished = function(event) {
    const btn = event.target;
    const li = btn.parentNode;

    const clenFinished = FINISHED_ARRAY.filter(function(item) {
        return item.id !== parseInt(li.id, 10);
    });

    FINISHED_ARRAY = clenFinished;
    saveFinished();
    resetFinishedLi();
    FINISHED_ARRAY.forEach(function(item) {
        finishedFlag = true;
        paintFinished(item);
    });

    HandlerMovieViewerH2();
};

//로컬저장소에 toDos 꺼내기
const getLocalStorage = function() {
    const resultObj = localStorage.getItem(TODOS);
    if (resultObj) {
        return JSON.parse(resultObj);
    } else {
        return null;
    }
};

//로컬저장소에 toDo 하나 넣기
const setLocalStorage = function(text) {
    const listID = new Date().valueOf();
    let getObj = getLocalStorage();

    getObj ? (TODOS_ARRAY = [...getObj]) : TODOS_ARRAY;
    TODOS_ARRAY.push({ id: listID, text: text });
    localStorage.setItem(TODOS, JSON.stringify(TODOS_ARRAY));
};

//toDo 입력 및 제출
function handlerModal_form(event) {
    event.preventDefault();

    const todo = modal_input.value;
    const TODOS_OBJ = getLocalStorage();

    if (TODOS_OBJ) {
        const TODOS_OBJ_LEN = TODOS_OBJ.length;
    }

    if (todo) {
        setLocalStorage(todo);
        let lastObj = getLocalStorage();
        lastObj = lastObj[lastObj.length - 1];
        toDosFlag = true;
        paintToDo(lastObj);

        handlerModalClose();
    } else {
        alert("네? 아무 것도 입력 안했어요..😥");
    }
}

//한 일 -> 할 일
const movePending = function(event) {
    const btn = event.target;
    const li = btn.parentNode;

    const addFinished = TODOS_ARRAY.filter(function(fini) {
        return fini.id === parseInt(li.id, 10);
    });
    FINISHED_ARRAY = FINISHED_ARRAY.concat(addFinished);
    saveFinished();
    resetFinishedLi();
    FINISHED_ARRAY.forEach(function(item) {
        finishedFlag = true;
        paintFinished(item);
    });

    const clenPending = TODOS_ARRAY.filter(function(todo) {
        return todo.id !== parseInt(li.id, 10);
    });
    TODOS_ARRAY = clenPending;
    saveToDos();
    resetPendingLi();
    TODOS_ARRAY.forEach(function(item) {
        toDosFlag = true;
        paintToDo(item);
    });
};

const moveFinished = function(event) {
    const btn = event.target;
    const li = btn.parentNode;

    const addPending = FINISHED_ARRAY.filter(function(item) {
        return item.id === parseInt(li.id, 10);
    });
    TODOS_ARRAY = TODOS_ARRAY.concat(addPending);
    saveToDos();
    resetPendingLi();
    TODOS_ARRAY.forEach(function(todo) {
        toDosFlag = true;
        paintToDo(todo);
    });

    const clenFinished = FINISHED_ARRAY.filter(function(item) {
        return item.id !== parseInt(li.id, 10);
    });
    FINISHED_ARRAY = clenFinished;
    saveFinished();
    resetFinishedLi();
    FINISHED_ARRAY.forEach(function(finish) {
        finishedFlag = true;
        paintFinished(finish);
    });
};

//toDo 그리기
const paintToDo = function(toDos) {
    const li = document.createElement("li");
    const xBtn = document.createElement("span");
    const fBtn = document.createElement("span");
    const { text, id } = toDos;

    if (toDosFlag) {} else {
        TODOS_ARRAY.concat(toDos);
        toDosFlag = false;
    }

    li.id = id;
    li.className = "pending_li";
    xBtn.className = "cursor x_btn";
    xBtn.innerText = "❌";
    fBtn.className = "cursor f_btn";
    fBtn.innerText = "✔";
    li.innerText = `${pendingCount}. ${text}`;
    li.appendChild(xBtn);
    li.appendChild(fBtn);
    pending.appendChild(li);

    pendingCount++;

    modal_input.value = "";

    xBtn.addEventListener("click", deletePending);
    fBtn.addEventListener("click", movePending);
};

//finished 그리기
const paintFinished = function(item) {
    const li = document.createElement("li");
    const xBtn = document.createElement("btn");
    const fBtn = document.createElement("btn");
    const { id, text } = item;

    if (finishedFlag) {} else {
        FINISHED_ARRAY.push(item);
        finishedFlag = false;
    }

    li.id = id;
    li.className = "finished_li";
    xBtn.className = "cursor x_btn";
    xBtn.innerText = "❌";
    fBtn.className = "cursor f_btn";
    fBtn.innerText = "⏏";
    li.innerText = `${finishedCount}. ${text}`;
    li.appendChild(xBtn);
    li.appendChild(fBtn);
    finished.appendChild(li);

    finishedCount++;

    xBtn.addEventListener("click", deleteFinished);
    fBtn.addEventListener("click", moveFinished);
};

//처음 로드
const loadedToDos = function() {
    const toDos = localStorage.getItem(TODOS);
    const finished = localStorage.getItem(FINISHED);

    if (toDos) {
        const parseToDos = JSON.parse(toDos);
        parseToDos.forEach(function(item) {
            paintToDo(item);
        });
    }

    if (finished) {
        const parseFinished = JSON.parse(finished);
        parseFinished.forEach(function(item) {
            paintFinished(item);
        });
    }
};

function checkIsToDo() {
    const pendingLi = document.querySelectorAll(".pending li");
    const finishedLi = document.querySelectorAll(".finished li");

    const pendingLi_Leng = pendingLi.length;
    const finishedLi_Leng = finishedLi.length;

    if (pendingLi_Leng || finishedLi_Leng) {
        HandlerMovieViewerH2();
        modalVideo.setAttribute("src", "");
        modal.className = "dp_none";
        movieViewer_video.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
        );
    }
}

//초기화 함수
function init() {
    loadedToDos();
    // checkIsToDo();
    modalCloseBtn.addEventListener("click", handlerModalClose);
    writeBtn.addEventListener("click", handlerWriteBtn);
    modal_form.addEventListener("submit", handlerModal_form);
}

init();