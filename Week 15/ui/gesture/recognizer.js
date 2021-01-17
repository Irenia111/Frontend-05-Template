/**
 * 识别动作
 */

class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  start(point, context) {
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
      this.dispatcher.dispatch('press', {
        clientX: point.clientX,
        clientY: point.clientY,
      });
    }, 500);
  }

  move(point, context) {
    // 移动 10px
    const dx = context.startX - point.clientX;
    const dy = context.startY - point.clientY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true;
      context.isPress = false;
      context.isTap = false;
      clearTimeout(context.timer);
      context.isPan = true;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch('panStart', {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }
    // 只保留最后半秒的移动数据
    context.points = context.points.filter(({ t }) => Date.now() - t < 500);
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {
        clientX: point.clientX,
        clientY: point.clientY,
      });
      clearTimeout(context.timer);
    } else if (context.isPress) {
    }
    // 只保留最后半秒的移动数据
    context.points = context.points.filter(({ t }) => Date.now() - t < 500);
    let v = 0; // 速度
    if (context.points.length) {
      const d = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2
      );
      v = d / (Date.now() - context.points[0].t);
    }
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch('flick', {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }
    if (context.isPan) {
      this.dispatcher.dispatch('panEnd', {
        startX: context.clientX,
        startY: context.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      });
    }
  }

  cancel(point, context) {
    clearTimeout(context.timer);
    this.dispatcher.dispatch('cancel', {
      clientX: point.clientX,
      clientY: point.clientY,
    });
  }
}

export default Recognizer;
