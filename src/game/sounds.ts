import { Howl } from 'howler';
const sounds = {
  shoot: new Howl({ src: ['/sounds/shoot.wav'], volume: 0.5 }),
  pellet: new Howl({ src: ['/sounds/pellet.wav'], volume: 0.3 }),
  powerPellet: new Howl({ src: ['/sounds/power_pellet.wav'], volume: 0.7 }),
  death: new Howl({ src: ['/sounds/death.wav'], volume: 0.8 }),
  ghostEat: new Howl({ src: ['/sounds/ghost_eat.wav'], volume: 0.8 }),
  gameStart: new Howl({ src: ['/sounds/game_start.wav'], volume: 0.7 }),
};
export type SoundName = keyof typeof sounds;
export const playSound = (name: SoundName) => {
  if (sounds[name]) {
    sounds[name].play();
  }
};