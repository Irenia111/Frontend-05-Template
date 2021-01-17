import Listener from './listener.js';
import Recognizer from './recognizer.js';
import Dispatcher from './dispatcher.js';

// 元素监听手势
const enableGesture = (ele) => {
  new Listener(ele, new Recognizer(new Dispatcher(ele)));
};

export default enableGesture;
