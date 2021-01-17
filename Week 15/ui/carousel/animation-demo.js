import { Timeline, Animation } from './animation';
import {ease, easeIn} from './ease';

let tl = new Timeline();

// 对比
tl.add(
  new Animation(
    document.querySelector('#box1').style,
    'transform',
    0,
    1000,
    5000,
    0,
    easeIn,
    (v) => `translateX(${v}px)`
  )
);

tl.add(
  new Animation(
    document.querySelector('#box2').style,
    'transform',
    0,
    1000,
    5000,
    0,
    ease,
    (v) => `translateX(${v}px)`
  )
);

tl.start();

const pauseBtn = document.querySelector('#pause');
const resumeBtn = document.querySelector('#resume');

pauseBtn.addEventListener('click', () =>{
  tl.pause();
});
resumeBtn.addEventListener('click', () =>{
  tl.resume();
});