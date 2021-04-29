function init() {
    let num = Math.ceil((Math.random().toFixed(2) * 100) % 20) + 1;
    document.body.style.backgroundImage = `url("src/img/${num}.jpg")`;
}

init();