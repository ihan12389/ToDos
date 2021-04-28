function init() {
    let num = ((Math.random().toFixed(1) * 10) % 6) + 1;
    document.body.style.backgroundImage = `url("src/img/${num}.jpg")`;
}

init();