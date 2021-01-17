import { Component } from './framework';

export default class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let img of this.attributes.images) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url(${img})`;
      this.root.appendChild(child);
    }
    this.root.addEventListener('mousedown', (event) => {});
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        next.style.transition = '';
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 3000);

    let position = 0;
    this.root.addEventListener('mousedown', (event) => {
      let startX = event.clientX;
      let children = this.root.children;
      let move = (event) => {
        let x = event.clientX - startX;
        // 当前在屏幕的中心元素
        let current = position - (x - (x % 500)) / 500;
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translate(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`;
        }
      };
      let up = (event) => {
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);
        for (let offset of [0, Math.sign(x - 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = '';
          children[pos].style.transform = `translate(${
            -pos * 500 + offset * 500
          }px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        console.log('mouseup');
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    return this.root;
  }
  
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
