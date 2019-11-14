'use strict';

const SCREEN_W = 1920;
const SCREEN_H = 1080;
const FENCE_H = SCREEN_H - 50;
const SCREEN_MARGIN = 128;
const PEOPLE_CLOSE_DISTANCE = 512;
const PEOPLE_OFF_SCREEN = 4000;

var g = hexi(SCREEN_W, SCREEN_H, setup, [
  'data/human1.png',
  'data/human2.png',
  'data/human3.png',
  'data/human4.png',
  'data/human5.png',
  'data/bg.png',
  'data/fence.png',
  'data/hat.png',
  'data/cat_0000_sit.png',
  'data/cat_0001_run1.png',
  'data/cat_0002_run2.png',
  'data/cat_0003_run3.png',
  'data/cat_0004_run4.png',
  'data/cat_0005_run5.png',
  'data/cat_0006_run6.png',
  'data/cat_0007_stand1.png',
  'data/cat_0008_stand2.png',
  'data/cat_0009_turn.png',
]);

g.start();
g.backgroundColor = 'white';
g.scaleToWindow();

var t = new Tink(PIXI, g.renderer.view, g.scale);

var pointer;
var rupert;
var carl;
var score_display1;
var score_display2;
var score = [0, 0];
var bkgd;
var fence;
var people = [];

function setup() {
  pointer = t.makePointer();

  createStage();

  rupert = new Cat(0);
  carl = new Cat(1)

  rupert.addControlKeys(87, 65, 68);
  carl.addControlKeys(73, 74, 76);

  createScore();

  g.state = play;
}

function play() {
  t.update();

  rupert.update();
  carl.update();

  updateScore();

  for (let i = 0; i < people.length; i++) {
    people[i].update();
  }

}

function createStage() {
  bkgd = g.sprite('data/bg.png', 1024, 512);
  fence = g.sprite('data/fence.png', 1920, 86);

  g.stage.addChild(bkgd);
  bkgd.x = 0;
  bkgd.y = 0;
  bkgd.scale.x = bkgd.scale.y = (1080 / 512);

  for (let k = 0; k < 20; k++) {
    people.push(new Human());
  }

  g.stage.addChild(fence);
  fence.x = 0;
  fence.y = SCREEN_H - 86;
}

function createScore() {
  score_display1 = g.text("score", "40px sans", "black", SCREEN_W / 2, 100);
  score_display2 = g.text("score", "40px sans", "black", SCREEN_W / 2, 200);
}

function updateScore() {
  score_display1.content = "rupert: " + score[0];
  score_display2.content = "carl: " + score[1];
}

let human_id = 0;

class Human {
  constructor() {
    // image
    this.id = human_id++;
    let human_int = 1 + this.id % 5; // change this number when more humans added
    this.sprite = g.sprite('data/human' + human_int + '.png', 256, 512);

    this.sprite.anchor.set(0.5, 0);
    g.stage.addChild(this.sprite);

    this.makeHat();
    this.hat_on_head = true;

    // location
    this.x = getRandomInt(-PEOPLE_OFF_SCREEN, SCREEN_W + PEOPLE_OFF_SCREEN);
    this.y = getRandomInt(SCREEN_H - 450, SCREEN_H - 350);
    this.base_y = this.y;
    this.y -= 10;

    this.speed_x = 2 + 3 * Math.random();
    this.speed_y = 0;
    // the cat currently on our head
    this.cat = undefined;

    // people walk left of right
    if (Math.random() > 0.5) {
      this.direction = 'left';
      this.sprite.scale.x = -1;
      this.hat_sprite.scale.x = -1;
    } else {
      this.direction = 'right';
    }
  }

  makeHat() {
    this.hat_sprite = g.sprite('data/hat.png', 512, 512);
    this.hat_sprite.anchor.set(0.5, 0.5);
    g.stage.addChild(this.hat_sprite);
  }

  dropHat(speed_x) {
    this.hat_on_head = false;
    this.hat_speed_x = 2 * speed_x;
  }

  walk() {
    // check for people going the same way and adjust the speed
    let speed_x = this.speed_x;
    let slow_down = false;
    let speed_up = false;
    let smallest_distance = PEOPLE_CLOSE_DISTANCE;

    for (let index = 0; index < people.length; index++) {
      let distance = Math.abs(this.x - people[index].x);
      if (this != people[index] &&
        this.direction == people[index].direction &&
        distance < PEOPLE_CLOSE_DISTANCE) {
        if (this.speed_x < people[index].speed_x) {
          slow_down = true;
        } else if (this.speed_x > people[index].speed_x) {
          speed_up = true;
        }
        if (distance < smallest_distance) {
          smallest_distance = distance;
        }
      }
    }

    let factor = 1 - (smallest_distance / PEOPLE_CLOSE_DISTANCE);

    if (slow_down) {
      speed_x *= 1 - (factor * 0.5);
    } else if (speed_up) {
      speed_x *= (1.5 * factor) + 1;
    }

    // apply the speed modulated by presence of other PEOPLE_OFF_SCREEN
    if (this.direction == 'right') {
      this.x = this.x + speed_x;
    } else {
      this.x = this.x - speed_x;
    }

    // recycle people when they get far enough
    if (this.x > SCREEN_W + PEOPLE_OFF_SCREEN) {
      this.hat_on_head = true;
      this.x = -PEOPLE_OFF_SCREEN;
    } else if (this.x < -PEOPLE_OFF_SCREEN) {
      this.hat_on_head = true;
      this.x = SCREEN_W + PEOPLE_OFF_SCREEN;
    }
  }

  bob() {
    // create bobbing by a pendulum motion
    if (this.y < this.base_y) {
      this.speed_y += Math.floor(this.speed_x);
    } else {
      this.speed_y -= Math.floor(this.speed_x);
    }

    this.y += this.speed_y * 0.1;
  }

  update() {
    this.walk();
    this.bob();

    this.sprite.x = this.x;
    this.sprite.y = this.y;

    if (this.hat_on_head == true) {
      this.hat_sprite.x = this.x;
      this.hat_sprite.y = this.y;
    } else {
      this.hat_sprite.x += this.hat_speed_x;
      this.hat_speed_x *= 0.9;
      this.hat_sprite.y += 10;
    }
  }
}

const MAX_SPEED_X = 25;
const MAX_SPEED_HEAD_X = 5;
const ACC_X = 1;

const CAT_ANIM_SIT = 0;
const CAT_ANIM_RUN = 1;
const CAT_ANIM_STAND = 2;
const CAT_ANIM_TURN = 3;
const CAT_ANIM_END = 4;
const CAT_ANIM_RANGE = [ 0, 1, 7, 9, 10 ]

const ANIM_TURN_DURATION = 4;

class Cat {
  constructor(id) {
    this.id = id;
    // image
    if (id == 0) {
      this.x = 200;
    } else if (id == 1) {
      this.x = SCREEN_W - 200;
    }

    this.anim = g.sprite([
      'data/cat_0000_sit.png',
      'data/cat_0001_run1.png',
      'data/cat_0002_run2.png',
      'data/cat_0003_run3.png',
      'data/cat_0004_run4.png',
      'data/cat_0005_run5.png',
      'data/cat_0006_run6.png',
      'data/cat_0007_stand1.png',
      'data/cat_0008_stand2.png',
      'data/cat_0009_turn.png'
    ]);

    this.anim.anchor.set(0.5, 1);
    this.anim.show(CAT_ANIM_STAND);
    this.anim_set = CAT_ANIM_TURN;
    this.anim_time = 0;

    g.stage.addChild(this.anim);

    // location
    this.y = FENCE_H;
    this.speed_x = 0;
    this.speed_y = 0;
    this.state = 'ground';
    this.human = -1;
    this.direction = 0;
    this.scale = 1;
    this.heads = [];
    this.combo = 1;
  }

  addControlKeys(key_up, key_left, key_right) {
    this.key_jump = g.keyboard(key_up);
    this.key_left = g.keyboard(key_left);
    this.key_right = g.keyboard(key_right);
    let self = this;
    this.key_jump.press = function() {
      self.jump();
    }

    this.key_left.press = function() {
      self.setirection(-1);
    }

    this.key_left.release = function() {
      if (self.key_right.isDown == true) {
        self.setirection(1);
      } else {
        self.setirection(0);
      }
    }

    this.key_right.press = function() {
      self.setirection(1);
    }

    this.key_right.release = function() {
      if (self.key_left.isDown == true) {
        self.setirection(-1);
      } else {
        self.setirection(0);
      }
    }
  }

  setirection(distance) {
    if (distance < 0) {
      this.scale = -1;
    } else if (distance > 0) {
      this.scale = 1;
    }
    this.direction = distance;
  }

  jump() {
    if (this.state == 'head') {
      people[this.human].cat = undefined;
    }

    if (this.state == 'head' || this.state == 'ground') {
      this.state = 'jump';
      this.speed_y -= 50;
    }
  }

  gravity() {
    if (this.state == 'jump' || this.state == 'fall') {
      this.speed_y += 2;

      if (this.y > FENCE_H) {
        this.speed_y = 0;
        this.y = FENCE_H;
        this.state = 'ground';
        this.combo = 1;
      }
    }

    this.y += this.speed_y;
  }

  move() {
    // adjust speed based on direction
    let max_speed = MAX_SPEED_X;

    if (this.state == 'head') {
      max_speed = MAX_SPEED_HEAD_X;
    }

    if (this.direction > 0) {
      this.speed_x += ACC_X;
      if (this.speed_x > max_speed) {
        this.speed_x = max_speed;
      }
    } else if (this.direction < 0) {
      this.speed_x -= ACC_X;
      if (this.speed_x < -max_speed) {
        this.speed_x = -max_speed;
      }
    } else {
      if (this.speed_x < 0) {
        this.speed_x += ACC_X;
      } else if (this.speed_x > 0) {
        this.speed_x -= ACC_X;
      }
    }

    // check bounds
    if ((this.x < SCREEN_MARGIN && this.speed_x < 0) || (this.x > SCREEN_W - SCREEN_MARGIN && this.speed_x > 0)) {
      this.speed_x = 0;
    }

    // add speed to position unless on head
    if (this.state != 'head') {
      this.x += this.speed_x;
    } else {
      // copy human position
      this.x = people[this.human].x;
      this.y = people[this.human].y;
      // if human going offscreen fall
      if (this.x < SCREEN_MARGIN || this.x > SCREEN_W - SCREEN_MARGIN) {
        this.state = 'fall';
      }
    }
  }

  update() {
    this.checkHeads();
    this.gravity();
    this.move();

    this.anim.x = this.x;
    this.anim.y = this.y + 20;

    if (this.anim.scale.x != this.scale) {
      this.anim.scale.x = this.scale;
      this.anim_time = ANIM_TURN_DURATION;
      this.anim.playAnimation([CAT_ANIM_RANGE[CAT_ANIM_TURN], CAT_ANIM_RANGE[CAT_ANIM_TURN]]);
      this.anim_set = CAT_ANIM_TURN;
    }

    if (this.anim_time > 0) {
      this.anim_time--;
      return;
    }

    let new_set;
    if (this.state == 'jump' || this.state == 'fall') {
      new_set = CAT_ANIM_RUN;
    } else if (this.state == 'head') {
      new_set = CAT_ANIM_SIT;
    } else {
      if (this.direction) {
        new_set = CAT_ANIM_RUN;
      } else {
        new_set = CAT_ANIM_STAND;
      }
    }

    if (this.anim_set != new_set) {
      this.anim_set = new_set;
      this.anim.playAnimation([CAT_ANIM_RANGE[new_set], CAT_ANIM_RANGE[new_set + 1] - 1]);
    }
  }

  checkHeads() {
    if (this.state == 'jump' && this.speed_y > 0) {
      for (let i = 0; i < people.length; i++) {
        if (this.x > people[i].x - 100 && this.x < people[i].x + 100) {
          if (this.y > people[i].y && this.y < people[i].y + 100) {
            if (this.x >= SCREEN_MARGIN && this.x <= SCREEN_W - SCREEN_MARGIN) {
              this.human = i;

              if (people[i].cat) {
                if (people[i].cat.state == 'head') {
                  people[i].cat.state = 'fall';
                }
              }

              if (!people[this.human].hat_on_head) {
                this.combo = 1;
              } else {
                people[this.human].dropHat(this.speed_x);
                score[this.id] += this.combo;
                if (this.combo < 3) {
                  this.combo += 1;
                }
              }

              people[i].cat = this;

              this.speed_y = 0;
              this.state = 'head';
              this.y = people[i].y;
              this.x = people[i].x;

              return;
            }
          }
        }
      }
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
