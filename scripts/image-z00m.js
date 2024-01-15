Hooks.on("getImagePopoutHeaderButtons", function (_, buttons) {
  const buttonId = `z00m${Date.now()}`;
  buttons.unshift({
    class: "z00m",
    icon: `fas fa-magnifying-glass ${buttonId}`,
    label: game.i18n.localize("Z00M.ButtonTitle"),
    onclick: () => z00mHandler(buttonId)
  });
});

const z00mButtonsTemplate = '<span class="z00m"><text>100%</text><i class="fas fa-magnifying-glass-plus"></i><i class="fas fa-magnifying-glass-minus"></i></span>';

function z00mHandler(buttonId){
  const buttonElem = $(`.${buttonId}`);
  buttonElem.toggleClass("fa-magnifying-glass");
  buttonElem.toggleClass("fa-magnifying-glass-location");

  const divElem = buttonElem.parent().parent().parent();
  const sectionElemn = divElem.children("section").first();
  const imgElem = sectionElemn.find("img").first();
  const resizeDiv = divElem.find(".window-resizable-handle").first();
  const z00mButtons = $(z00mButtonsTemplate);
  const zoomText = z00mButtons.find("text").first();

  sectionElemn.toggleClass("z00m");
  imgElem.toggleClass("z00m");
  resizeDiv.toggleClass("z00m");

  if (!buttonElem.hasClass("fa-magnifying-glass-location")) {
    resizeDiv.children(".z00m").first().remove();
    imgElem.css("width", "");
    sectionElemn.off('mousedown');
    return;
  }

  let zoomConfig = {
    currentZoom: 100,
    originalSize: imgElem.prop('naturalWidth'),
    imgElem: imgElem,
    textElem: zoomText
  };
  
  z00mButtons.find(".fa-magnifying-glass-plus").first().on("click", () => zoomIn(zoomConfig));
  z00mButtons.find(".fa-magnifying-glass-minus").first().on("click", () => zoomOut(zoomConfig));
  z00mButtons.insertBefore(resizeDiv.children("i").first());

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  sectionElemn.on("mousedown", (e) => mouseDownHandler(sectionElemn, e, pos));
}

const mouseUpHandler = function (ele) {
  ele.off('mousemove');
  ele.off('mouseup');
};

const mouseDownHandler = function (ele, e, pos) {
  pos = {
      left: ele.scrollLeft(),
      top: ele.scrollTop(),
      x: e.clientX,
      y: e.clientY,
  };

  ele.on('mousemove', (e) => mouseMoveHandler(ele, e, pos));
  ele.on('mouseup', () => mouseUpHandler(ele));
};

const mouseMoveHandler = function (ele, e, pos) {
  const dx = e.clientX - pos.x;
  const dy = e.clientY - pos.y;

  ele.scrollTop(pos.top - dy);
  ele.scrollLeft(pos.left - dx);
};

const zoomIn = function(zoomConfig) {
  if (zoomConfig.currentZoom == 100)
    return;
  applyZoom(10, zoomConfig);
}

const zoomOut = function(zoomConfig) {
  if (zoomConfig.currentZoom == 10)
    return;
  applyZoom(-10, zoomConfig);
}

const applyZoom = function(modifier, zoomConfig) {
  zoomConfig.currentZoom += modifier;
  const newWidth = zoomConfig.originalSize * zoomConfig.currentZoom / 100;

  zoomConfig.imgElem.css("width", `${newWidth}px`);
  zoomConfig.textElem.text(`${zoomConfig.currentZoom}%`);
}