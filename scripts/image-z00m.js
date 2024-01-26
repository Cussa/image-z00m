Hooks.on("getImagePopoutHeaderButtons", function (_, buttons) {
  const buttonId = `z00m${Date.now()}`;
  buttons.unshift({
    class: "z00m",
    icon: `fas fa-magnifying-glass ${buttonId}`,
    label: game.i18n.localize("Z00M.ButtonTitle"),
    onclick: () => z00mHandler(buttonId)
  });
});

Hooks.on("ready", function () {
  game.settings.register("image-z00m", "maxZoom", {
    name: game.i18n.localize("Z00M.MaxZoom"),
    hint: game.i18n.localize("Z00M.MaxZoomHint"),
    scope: 'world',     // "world" = sync to db, "client" = local storage
    config: true,       // false if you dont want it to show in module config
    type: Number,       // Number, Boolean, String, Object
    default: 100
  });
});

const z00mButtonsTemplate = '<span class="z00m"><text>100%</text><i class="fas fa-magnifying-glass-plus"></i><i class="fas fa-magnifying-glass-minus"></i></span>';

function z00mHandler(buttonId) {
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
    maxZoom: game.settings.get("image-z00m", "maxZoom"),
    originalSize: imgElem.prop('naturalWidth'),
    imgElem: imgElem,
    textElem: zoomText
  };

  z00mButtons.find(".fa-magnifying-glass-plus").first().on("click", () => zoomIn(zoomConfig));
  z00mButtons.find(".fa-magnifying-glass-minus").first().on("click", () => zoomOut(zoomConfig));
  resizeDiv.get(0).insertAdjacentElement("afterbegin", z00mButtons.get(0));

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

const zoomIn = function (zoomConfig) {
  if (zoomConfig.currentZoom == zoomConfig.maxZoom)
    return;
  applyZoom(10, zoomConfig);
}

const zoomOut = function (zoomConfig) {
  if (zoomConfig.currentZoom == 10)
    return;
  applyZoom(-10, zoomConfig);
}

const applyZoom = function (modifier, zoomConfig) {
  zoomConfig.currentZoom += modifier;
  const newWidth = zoomConfig.originalSize * zoomConfig.currentZoom / 100;

  zoomConfig.imgElem.css("width", `${newWidth}px`);
  zoomConfig.textElem.text(`${zoomConfig.currentZoom}%`);
}