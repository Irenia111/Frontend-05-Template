const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start time');
// 暂停一共花费的时间
const PAUSE_TIME = Symbol('pause time');
// 暂停开始的时间
const PAUSE_START = Symbol('pause start');

const STATES = {
  INITD: 'initd',
  STARTED: 'started',
  PAUSED: 'paused',
};

export class Timeline {
  constructor() {
    this.state = STATES.INITD;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  start() {
    if (this.state !== STATES.INITD) return;
    this.state = STATES.STARTED;
    const startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      // 用时(动画已经持续的时间)
      let passedTime = 0;
      const now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        if (this[START_TIME].get(animation) < startTime) {
          passedTime = now - startTime;
        } else {
          passedTime = now - this[START_TIME].get(animation);
        }
        passedTime -= this[PAUSE_TIME] - animation.delay;
        const duration = animation.duration - animation.delay;
        // 达到了duration,就不再循环此 animation
        if (passedTime > duration) {
          this[ANIMATIONS].delete(animation);
          passedTime = duration;
        }
        if (passedTime > 0) {
          animation.receive(passedTime);
        }
      }
      // if (!this[ANIMATIONS].size) return;
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  /**
   * 速率
   */
  // set rate() {}
  // get rate() {}
  /**
   * 暂停
   */
  pause() {
    if (this.state !== STATES.STARTED) return;
    this.state = STATES.PAUSED;
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  /**
   * 恢复
   */
  resume() {
    if (this.state !== STATES.PAUSED) return;
    this.state = STATES.STARTED;
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  reset() {
    this.pause();
    this.state = STATES.INITD;
    this.startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[PAUSE_START] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
  }

  add(animation, startTime) {
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime == null ? Date.now() : startTime);
  }
}

export class Animation {
  constructor(
    option,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.option = option;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || ((v) => v);
    this.template = template || ((v) => v);
  }

  receive(time) {
    const range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration);
    this.option[this.property] = this.template(
      this.startValue + range * progress
    );
  }
}
