const CONTEXT_MAP = new Map();

const ele = document.documentElement;

let isListeningMouse = false;

const dispatch = (type, properties) => {
  const event = new Event(type);
  for (let p in properties) {
    event[p] = properties[p];
  }
  ele.dispatchEvent(event);
};

const start = (point, context) => {
  context.startX = point.clientX;
  context.startY = point.clientY;
  // 存储多个时间点的坐标,用于计算速度
  context.points = [
    {
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    },
  ];
  context.isTap = true;
  context.isPress = false;
  context.isPan = false;
  context.timer = setTimeout(() => {
    context.isPress = true;
    context.isTap = false;
    context.isPan = false;
    console.log('press start');
  }, 500);
};

const move = (point, context) => {
  // 移动 10px
  const dx = context.startX - point.clientX;
  const dy = context.startY - point.clientY;
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isPan = true;
    context.isPress = false;
    context.isTap = false;
    clearTimeout(context.timer);
    context.isPan = true;
  }
  // 只保留最后半秒的移动数据
  context.points = context.points.filter(({ t }) => Date.now() - t < 500);
  context.points.push({
    t: Date.now(),
    x: point.clientX,
    y: point.clientY,
  });
  if (context.isPan) {
    console.log('pan');
  }
};

const end = (point, context) => {
  if (context.isTap) {
    dispatch('tap', {});
    clearTimeout(context.timer);
    console.log('tap end');
  } else if (context.isPan) {
    console.log('pan end');
  } else if (context.isPress) {
    console.log('press end');
  }
  // 只保留最后半秒的移动数据
  context.points = context.points.filter(({ t }) => Date.now() - t < 500);
  let v = 0;
  if (context.points.length) {
    const d = Math.sqrt(
      (point.clientX - context.points[0].x) ** 2 +
        (point.clientY - context.points[0].y) ** 2
    );

    v = d / (Date.now() - context.points[0].t);
  }
  if (v > 1.5) {
    context.isFlick = true;
  } else {
    context.isFlick = false;
  }
};

const cancel = (point, context) => {
  clearTimeout(context.timer);
};

// PC 端鼠标事件
ele.addEventListener('mousedown', (event) => {
  event.preventDefault();
  event.stopPropagation();
  const context = Object.create(null);
  // 鼠标按下时 event包含鼠标对应的按键值: button
  CONTEXT_MAP.set(`mouse-${1 << event.button}`, context);
  start(event, context);
  const mousemove = (event) => {
    // 鼠标move时,
    let button = 1;
    while (button <= event.buttons) {
      // 只有这个键按下去了才需要触发对应的move事件
      if (button & event.buttons) {
        // 中键与右键的顺序是反的
        let key;
        if (button === 2) {
          key = 4;
        } else if (button === 4) {
          key === 2;
        } else {
          key = button;
        }
        const context = CONTEXT_MAP.get(`mouse-${key}`);
        move(event, context);
      }
      button = 1 << button;
    }
  };

  const mouseup = (event) => {
    const context = CONTEXT_MAP.get(`mouse-${1 << event.button}`);
    end(event, context);
    CONTEXT_MAP.delete(`mouse-${1 << event.button}`);
    if (event.buttons === 0) {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    isListeningMouse = true;
  }
});

// 移动端触摸事件
ele.addEventListener('touchstart', (event) => {
  for (let touch of event.changedTouches) {
    const context = Object.create(null);
    CONTEXT_MAP.set(touch.identifier, context);
    start(touch, context);
  }
});

ele.addEventListener('touchmove', (event) => {
  for (let touch of event.changedTouches) {
    const context = CONTEXT_MAP.get(touch.identifier);
    move(touch, context);
  }
});

ele.addEventListener('touchend', (event) => {
  for (let touch of event.changedTouches) {
    const context = CONTEXT_MAP.get(touch.identifier);
    end(touch, context);
    CONTEXT_MAP.delete(touch.identifier);
  }
});

ele.addEventListener('touchcancel', (event) => {
  for (let touch of event.changedTouches) {
    const context = CONTEXT_MAP.get(touch.identifier);
    cancel(touch, context);
    CONTEXT_MAP.delete(touch.identifier);
  }
});
