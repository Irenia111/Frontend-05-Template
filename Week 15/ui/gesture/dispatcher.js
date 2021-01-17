class Dispatcher {
  constructor(ele) {
    this.ele = ele;
  }
  dispatch(type, properties) {
    const event = new Event(type);
    for (let p in properties) {
      event[p] = properties[p];
    }
    this.ele.dispatchEvent(event);
  };
}

export default Dispatcher;