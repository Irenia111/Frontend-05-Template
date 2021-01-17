import Bezier from 'bezier-easing';

export const linear = (v) => v;
export const ease = Bezier(0.25, 0.1, 0.25, 1);
export const easeIn = Bezier(0.42, 0, 1, 1);
export const easeOut = Bezier(0, 0, 0.58, 1);
export const easeInOut = Bezier(0.42, 0, 0.58, 1);
