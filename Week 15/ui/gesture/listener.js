/**
 * 监听事件
 * 兼容移动与PC端
 * 1. 鼠标事件
 * 2. touch事件
 */
class Listener {
  constructor(ele, recognizer) {
    this.ele = ele;
    this.recognizer = recognizer;
    this.CONTEXT_MAP = new Map();
    this.isListeningMouse = false;
    this.init();
  }

  init() {
    this.listenMouse();
    this.listenTouch();
  }

  // PC 端鼠标事件
  listenMouse() {
    this.ele.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const context = Object.create(null);
      // 鼠标按下时 event包含鼠标对应的按键值: button
      this.CONTEXT_MAP.set(`mouse-${1 << event.button}`, context);
      this.recognizer.start(event, context);
      const mousemove = (event) => {
        // 鼠标move时
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
            const context = this.CONTEXT_MAP.get(`mouse-${key}`);
            this.recognizer.move(event, context);
          }
          button = 1 << button;
        }
      };

      const mouseup = (event) => {
        const context = this.CONTEXT_MAP.get(`mouse-${1 << event.button}`);
        this.recognizer.end(event, context);
        this.CONTEXT_MAP.delete(`mouse-${1 << event.button}`);
        // 没有鼠标按键按下时,清除监听
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          this.isListeningMouse = false;
        }
      };
    
      // 如果还未开始监听mouse事件,才需要添加监听,否则会导致重复添加
      if (!this.isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        this.isListeningMouse = true;
      }
    });
  }

  // 移动端触摸事件
  listenTouch() {
    this.ele.addEventListener('touchstart', (event) => {
      for (let touch of event.changedTouches) {
        const context = Object.create(null);
        this.CONTEXT_MAP.set(touch.identifier, context);
        this.recognizer.start(touch, context);
      }
    });

    this.ele.addEventListener('touchmove', (event) => {
      for (let touch of event.changedTouches) {
        const context = this.CONTEXT_MAP.get(touch.identifier);
        this.recognizer.move(touch, context);
      }
    });

    this.ele.addEventListener('touchend', (event) => {
      for (let touch of event.changedTouches) {
        const context = this.CONTEXT_MAP.get(touch.identifier);
        this.recognizer.end(touch, context);
        this.CONTEXT_MAP.delete(touch.identifier);
      }
    });

    this.ele.addEventListener('touchcancel', (event) => {
      for (let touch of event.changedTouches) {
        const context = this.CONTEXT_MAP.get(touch.identifier);
        this.recognizer.cancel(touch, context);
        this.CONTEXT_MAP.delete(touch.identifier);
      }
    });
  }
}

export default Listener;
