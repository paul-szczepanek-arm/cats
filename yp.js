'use strict';

const SCREEN_W = 1920;
const SCREEN_H = 1080;
const FENCE_H = SCREEN_H - 65;
const SCREEN_MARGIN = 128;
const PEOPLE_CLOSE_DISTANCE = 512;
const PEOPLE_OFF_SCREEN = 5000;

var g = hexi(SCREEN_W, SCREEN_H, setup, [
  'data/human1.png',
  'data/human2.png',
  'data/human3.png',
  'data/human4.png',
  'data/human5.png',
  'data/human6.png',
  'data/human7.png',
  'data/ear.png',
  'data/human8.png',
  'data/human1on.png',
  'data/human2on.png',
  'data/human3on.png',
  'data/human4on.png',
  'data/human5on.png',
  'data/human6on.png',
  'data/human7on.png',
  'data/human8on.png',
  'data/bg.png',
  'data/bg0.png',
  'data/fence.png',
  'data/hat1.png',
  'data/hat2.png',
  'data/hat3.png',
  'data/hat4.png',
  'data/cat_0000_sit.png',
  'data/cat_0001_run1.png',
  'data/cat_0002_run2.png',
  'data/cat_0003_run3.png',
  'data/cat_0004_run4.png',
  'data/cat_0005_run5.png',
  'data/cat_0006_run6.png',
  'data/cat_0007_stand1.png',
  'data/cat_0008_stand2.png',
  'data/cat_0009_stand3.png',
  'data/cat_0010_stand4.png',
  'data/cat_0011_turn.png',
  'data/cat_0012_stop1.png',
  'data/cat_0013_stop2.png',
  'data/cat_0014_prep.png',
  'data/splash.png',
  'data/score.png',
  'data/rank.png',
  'data/rank1.png',
  'data/title.png',
  'data/time_bar1.png',
  'data/time_bar2.png',
  'data/p1.png',
  'data/p2.png',
  'data/p3.png',
  'data/point1.png',
  'data/point2.png',
  'data/point3.png',
  'data/point4.png',
  'data/combo.png',
  'data/dither.png',
  'data/count1.png',
  'data/count2.png',
  'data/count3.png',
]);

g.start();
g.backgroundColor = "#c5a8aa";
g.scaleToWindow();

var t = new Tink(PIXI, g.renderer.view, g.scale);

var pointer;
var rupert;
var carl;
var score_display1;
var score_display2;
var score_display1_label;
var score_display2_label;
var score = [0, 0];
var bkgd;
var fence;
var people = [];
var splash_screen;
var title_screen;
var bkgd0;
var lights;
var catsit;
var catjump;

function setup() {
  pointer = t.makePointer();
  mouse_down = false;
  mouse_below_line = false;

  createStage();

  rupert = new Cat(0);
  carl = new Cat(1)

  rupert.addControlKeys(87, 65, 68);
  carl.addControlKeys(73, 74, 76);

  splash_screen = g.sprite('data/splash.png');
  title_screen = g.sprite('data/title.png');

  splash_screen.x = title_screen.x = SCREEN_W / 2;
  splash_screen.y = 1100;
  title_screen.y = 510;
  splash_screen.anchor.set(0.5, 0.5);
  title_screen.anchor.set(0.5, 0.5);
  splash_screen.alpha = 0;

  lights = g.sprite('data/rank1.png');
  lights.x = 0;
  lights.y = 0;

  catsit = g.sprite('data/cat_0000_sit.png');
  catjump = g.sprite('data/cat_0002_run2.png');
  catjump.y = catsit.y = 167;
  catsit.x = 1380;
  catjump.x = 1480;
  catjump.visible = false;

  g.state = splash;

  /*document.documentElement.onclick = function(e){
    openFullscreen();
  }*/
}

var full = false;
function openFullscreen() {
  if (full) return;
  full = true;
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

var popup = false;

function retry() {
  window.location.reload(false);
}

function highScore() {
  var mapForm = document.createElement("form");
  mapForm.target = "_top";
  mapForm.method = "POST";
  mapForm.action = "highscore.php";

  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "score";
  mapInput.value = score[0] + score[1];

  mapForm.appendChild(mapInput);
  document.body.appendChild(mapForm);
  mapForm.submit();
}

function buttonClickHandler(event) {
  console.log(input.value);
}

var mouse_down;
const MOUSE_JUMP_LINE = SCREEN_H - 250;
var mouse_below_line;
var splash_timer = 0;
const SPLASH_TIMER_MIN = 160;

function splash() {
  if (pointer.isDown && splash_timer > SPLASH_TIMER_MIN) {
    mouse_down = true;
  }

  if (rupert_playing || carl_playing || pointer.isUp && mouse_down) {
    splash_screen.visible = false;
    title_screen.visible = false;
    createScore();
    lights.visible = false;
    catsit.visible = false;
    catjump.visible = false;
    g.state = play;
  }

  splash_timer += 1;

  if (splash_timer > 60) {
    if (splash_screen.alpha < 1) {
      splash_screen.alpha += 0.01;
      splash_screen.y -= 4.5;
      title_screen.y -= 3.5;
      if (bkgd0.y > 0) {
        bkgd0.y = bkgd.y = 0.98 * bkgd0.y;
        if (bkgd0.y < 1) {
          bkgd0.y = bkgd.y = 0;
        }
      }

      if (fence.y > SCREEN_H - 85) {
        fence.y -= 1;
      }
      lights.y -= 4
      catsit.y -= 3.5;
      catjump.y -= 3.5;
    } else {
      if (catsit.y > -400) {
        catsit.visible = false;
        catjump.visible = true;
        catjump.y -= 12;
      }
    }
  }

}

var rupert_playing = false;
var carl_playing = false;

function play() {
  if (bkgd0.alpha > 0) {
    bkgd0.alpha -= 0.025;
  }

  if (bkgd0.y > 0) {
    bkgd0.y = bkgd.y = 0.9 * bkgd0.y;
    if (bkgd0.y < 1) {
      bkgd0.y = bkgd.y = 0;
    }
  }

  if (fence.y > SCREEN_H - 85) {
    fence.y -= 5;
  }

  t.update();

  if (pointer.isUp && mouse_down) {
    mouse_down = false;
    rupert.jump();
    rupert.setDirection(0);
  }

  if (pointer.isDown) {

    if (!rupert_playing) {
      rupert_playing = true;
    }

    mouse_down = true;
    let delta_p = rupert.x - pointer.x;
    let abs_delta_p = Math.abs(delta_p);
    if (abs_delta_p > 15) {
      abs_delta_p = Math.min(400, abs_delta_p);
      abs_delta_p = Math.max(40, abs_delta_p);
      rupert.setDirection(-Math.sign(delta_p) * (abs_delta_p / 400));
    }

    if (pointer.y > MOUSE_JUMP_LINE) {
      mouse_below_line = true;
    } else if (mouse_below_line) {
      mouse_below_line = false;
      rupert.jump();
    }
  }

  if (rupert_playing) {
    rupert.update();
  }

  if (carl_playing) {
    carl.update();
  }

  updateScore();
  updateTime();

  for (let i = 0; i < people.length; i++) {
    people[i].update();
  }
}

var mouse_down_game_over = false;
var dither;
var game_over;
var hats_dropped = 0;
var end_score1;
var end_score1b;
var end_score2;
var end_score3;
var end_score4;

function gameover() {
  updateScore();
  t.update();

  if (!game_over) {
    dither = g.sprite('data/dither.png', 0, 0, true, 1920, 1080, 1920, 1800);
    dither.alpha = 0;

    game_over = g.sprite('data/rank.png');
    game_over.x = SCREEN_W / 2;
    game_over.y = SCREEN_H / 2;
    game_over.anchor.set(0.5, 0.5);

    rupert.anim.stopAnimation();
    carl.anim.stopAnimation();
    let score_string1 = "You dehatted " + (hats_dropped ? hats_dropped : "no") + " people" + (hats_dropped ? "" : " - you lazy cat!");
    if (carl_playing && rupert_playing && (score[0] != score[1])) {
      let winner = score[0] > score[1] ? "Rupert":"Carl";
      let loser = score[0] < score[1] ? "Rupert":"Carl";
      let score_string1b = "\n" + winner + " beat " + loser + " by " + Math.abs(score[0] - score[1]) + " points";
      end_score1b = g.text(score_string1b, "50px sans", "white", SCREEN_W / 2, SCREEN_H / 2 - 130);
      end_score1b.anchor.set(0.5, 0.5);
    }
    end_score1 = g.text(score_string1, "50px sans", "white", SCREEN_W / 2, SCREEN_H / 2 - 180);
    end_score2 = g.text("YOU SCORED", "bold 60px sans", "white", SCREEN_W / 2, SCREEN_H / 2 + -10);
    end_score3 = g.text((score[0] + score[1]), "bold 80px sans", "white", SCREEN_W / 2, SCREEN_H / 2 + 70);
    end_score4 = g.text("POINTS", "bold 60px sans", "white", SCREEN_W / 2, SCREEN_H / 2 + 150);
    end_score1.anchor.set(0.5, 0.5);
    end_score2.anchor.set(0.5, 0.5);
    end_score3.anchor.set(0.5, 0.5);
    end_score4.anchor.set(0.5, 0.5);
  }

  if (pointer.isDown && !mouse_down) {
    mouse_down_game_over = true;
  }

  if (pointer.y > SCREEN_H / 2) {
    if (pointer.isUp) {
      mouse_down = false;
      if (mouse_down_game_over && !popup) {
        popup = true;
        if (pointer.x < SCREEN_W / 2) {
          highScore();
        } else {
          retry();
        }
      }
    }
  }

  if (dither.alpha < 1) {
    dither.alpha += 0.05;
  } else {
    dither.alpha = 1;
  }
}

function createStage() {
  bkgd = g.sprite('data/bg.png');
  bkgd0 = g.sprite('data/bg0.png');

  bkgd.x = bkgd0.x = 0;
  bkgd.y = bkgd0.y = 400;
  bkgd0.scale.x = bkgd0.scale.y = bkgd.scale.x = bkgd.scale.y = (1080 / 512);

  for (let k = 0; k < 30; k++) {
    people.push(new Human());
  }

  fence = g.sprite('data/fence.png');


  fence.x = 0;
  fence.y = SCREEN_H;

  for (let i = 0; i < people.length; i++) {
    people[i].update();
    people[i].update();
  }
}

var score_bg1;
var score_bg2;
var time_bar_bg;
var time_bar;
const MAX_TIME = 60;
var timer = MAX_TIME;

var points = [];
var combos = [];
var combo_labels = [];

const COMBO_Y = SCREEN_H - 80;
const SCORE_Y = 40;

var counts = [];

function createScore() {
  time_bar_bg = g.sprite('data/time_bar1.png');
  time_bar = g.sprite('data/time_bar2.png', 0, 0, true, 900, 60, 900, 60);
  time_bar_bg.x = SCREEN_W / 2 - 450;
  time_bar_bg.y = 80;
  time_bar.x = SCREEN_W / 2 - 450;
  time_bar.y = 80;
  time_bar_bg.anchor.set(0, 0.5);
  time_bar.anchor.set(0, 0.5);

  score_bg1 = g.sprite('data/score.png');
  score_bg2 = g.sprite('data/score.png');
  score_bg1.visible = false;
  score_bg2.visible = false;

  combo_labels[0] = g.sprite('data/combo.png');
  combo_labels[1] = g.sprite('data/combo.png');
  points[0] = g.sprite('data/point1.png');
  points[1] = g.sprite('data/point2.png');
  points[2] = g.sprite('data/point3.png');
  points[3] = g.sprite('data/point4.png');
  points[4 + 0] = g.sprite('data/point1.png');
  points[4 + 1] = g.sprite('data/point2.png');
  points[4 + 2] = g.sprite('data/point3.png');
  points[4 + 3] = g.sprite('data/point4.png');
  combos[0] = g.sprite('data/p1.png');
  combos[1] = g.sprite('data/p2.png');
  combos[2] = g.sprite('data/p3.png');
  combos[0 + 3] = g.sprite('data/p1.png');
  combos[1 + 3] = g.sprite('data/p2.png');
  combos[2 + 3] = g.sprite('data/p3.png');
  resetCombo(0);
  resetCombo(1);
  for (let index = 0; index < 6; ++index) {
    combos[index].y = COMBO_Y;
  }
  for (let index = 0; index < 3; ++index) {
    combos[index].x = 450;
  }
  for (let index = 0; index < 3; ++index) {
    combos[index + 3].x = SCREEN_W - 450 - 92;
  }
  for (let index = 0; index < 8; ++index) {
    points[index].y = SCORE_Y;
    points[index].alpha = 0;
    points[index].visible = false;
    points[index].anchor.set(0.5, 0.5);
  }
  for (let index = 0; index < 4; ++index) {
    points[index].x = 360;
  }
  for (let index = 0; index < 4; ++index) {
    points[index + 4].x = SCREEN_W - 360 - 92;
  }
  combo_labels[0].x = 10;
  combo_labels[0].y = COMBO_Y;
  combo_labels[1].x = SCREEN_W - 450;
  combo_labels[1].y = COMBO_Y;

  counts[0] = g.sprite('data/count1.png');
  counts[1] = g.sprite('data/count2.png');
  counts[2] = g.sprite('data/count3.png');
  for (let index = 0; index < 3; ++index) {
    counts[index].x = SCREEN_W / 2;
    counts[index].y = SCREEN_H / 2 - 200;
    counts[index].anchor.set(0.5, 0.5);
    counts[index].visible = false;
  }
}

function updateTime() {
  timer -= (1 / 60);
  time_bar.width = 900 * (timer / MAX_TIME);
  if (timer <= 0) {
    g.state = gameover;
  }

  if (timer < 5){
    for (let index = 0; index < 3; ++index) {
      if (timer < index + 2 && timer > index + 1) {
        counts[index].scale.x = counts[index].scale.y = (timer - index) * (timer - index);
        counts[index].alpha = 2 - (timer - index);
        counts[index].visible = true;
      } else if (timer < index + 1 && timer > index) {
        counts[index].scale.x = counts[index].scale.y = (timer - index) / 4 + 0.75;
        counts[index].alpha *= 0.97;
      } else {
        counts[index].visible = false;
      }
    }
  }
}

function updateScore() {
  if (rupert_playing) {
    if (!score_display1) {
      score_bg1.visible = true;
      score_bg1.anchor.set(0.5, 0.5);
      score_bg1.x = 260;
      score_bg1.y = 80;
      score_display1 = g.text("0", "bold 42px arial", "white", SCREEN_W / 2, 100);
      score_display1_label = g.text("RUPERT", "bold 42px arial", "#946366", SCREEN_W / 2, 100);
      score_display1.x = 340;
      score_display1_label.x = 120;
      score_display1_label.y = score_display1.y = 56;
    }
    score_display1.content = score[0];
  }

  if (carl_playing) {
    if (!score_display2) {
      score_bg2.visible = true;
      score_bg2.anchor.set(0.5, 0.5);
      score_bg2.x = SCREEN_W - 260;
      score_bg2.y = 80;
      score_display2 = g.text("score", "bold 42px arial", "white", SCREEN_W / 2, 200);
      score_display2_label = g.text("CARL", "bold 42px arial", "#946366", SCREEN_W / 2, 100);
      score_display2.x = SCREEN_W - 180;
      score_display2_label.x = SCREEN_W - 390;
      score_display2_label.y = score_display2.y = 56;
    }
    score_display2.content = score[1];
  }

  for (let index = 0; index < points.length; ++index) {
    if (points[index].alpha > 0) {
      if (points[index].alpha < 0.95) {
        points[index].alpha -= 0.05;
      } else {
        points[index].alpha -= 0.002;
      }
      points[index].scale.x = points[index].scale.y += 0.005;
      points[index].y -= 2;
    }
  }
}

var combo_values = [1, 1];

function addScore(id) {
  let x = 0;
  if (id == 0) {
    x = rupert.x;
  } else {
    x = carl.x;
  }
  points[combo_values[id] + id * 4 - 1].alpha = 1;
  points[combo_values[id] + id * 4 - 1].visible = true;
  points[combo_values[id] + id * 4 - 1].y = 500;
  points[combo_values[id] + id * 4 - 1].x = x;
  points[combo_values[id] + id * 4 - 1].scale.x = 1;
  points[combo_values[id] + id * 4 - 1].scale.y = 1;
  score[id] += combo_values[id];
  if (combo_values[id] < 4) {
    combo_values[id] += 1;
    combo_labels[id].visible = true;
    combos[id * 3 + 0].visible = (combo_values[id] == 2);
    combos[id * 3 + 1].visible = (combo_values[id] == 3);
    combos[id * 3 + 2].visible = (combo_values[id] == 4);
  }
}

function resetCombo(id) {
  combo_labels[id].visible = false;
  combos[id * 3 + 0].visible = false;
  combos[id * 3 + 1].visible = false;
  combos[id * 3 + 2].visible = false;
  combo_values[id] = 1;
}

let human_id = 0;

var guaranteed_human_left = 2;
var guaranteed_human_right = 2;

const FRENCH_ID = 7;

class Human {
  constructor() {
    // image
    this.id = human_id++;
    this.id = 1 + (this.id % 8); // change this number when more humans added
    this.sprite = g.sprite('data/human' + this.id + '.png');
    this.sprite_on = g.sprite('data/human' + this.id + 'on.png');
    this.sprite_on.visible = false;

    this.sprite.anchor.set(0.5, 0);
    this.sprite_on.anchor.set(0.5, 0);
    g.stage.addChild(this.sprite);

    this.makeHat();

    if (this.id == FRENCH_ID) {
      this.sprite_ear = g.sprite('data/ear.png');
      this.sprite_ear.anchor.set(0.5, 0);
    }

    this.hat_on_head = true;

    // location
    let x;
    if (guaranteed_human_left) {
      guaranteed_human_left--;
      x = getRandomInt(0 - SCREEN_W - 700, -200);
    } else if (guaranteed_human_right) {
      guaranteed_human_right--;
      x = getRandomInt(SCREEN_W + 200, SCREEN_W + 700);
    } else {
      x = getRandomInt(-PEOPLE_OFF_SCREEN, SCREEN_W + PEOPLE_OFF_SCREEN);
      while (-200 < x && x < SCREEN_W + 200) {
        x = getRandomInt(-PEOPLE_OFF_SCREEN, SCREEN_W + PEOPLE_OFF_SCREEN);
      }
    }

    this.x = x;
    this.y = getRandomInt(SCREEN_H - 500, SCREEN_H - 400);
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
      this.sprite_on.scale.x = -1;
      this.hat_sprite.scale.x = -1;
      if (this.sprite_ear) this.sprite_ear.scale.x = -1;
    } else {
      this.direction = 'right';
    }
  }

  makeHat() {
    if (this.id == FRENCH_ID) {
      this.hat_sprite = g.sprite('data/hat3.png', 512, 512);
    } else {
      if (Math.random() > 0.666) {
        this.hat_sprite = g.sprite('data/hat1.png', 512, 512);
      } else if (Math.random() > 0.333) {
        this.hat_sprite = g.sprite('data/hat2.png', 512, 512);
      } else {
        this.hat_sprite = g.sprite('data/hat4.png', 512, 512);
      }
    }
    this.hat_sprite.anchor.set(0.5, 0.5);
    g.stage.addChild(this.hat_sprite);
  }

  dropHat(speed_x) {
    hats_dropped++;
    this.hat_on_head = false;
    this.hat_speed_x = 2 * speed_x + Math.random() * 20 - 10;
    if (this.sprite_ear) {
      this.sprite_ear.visible = false;
    }
  }

  setCat(cat) {
    this.cat = cat;

    this.sprite_on.visible = (null != this.cat);
    this.sprite.visible = (null == this.cat);
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

    if (this.hat_on_head == true) {
      this.hat_sprite.rotation = (this.hat_sprite.y - this.sprite.y) / 200;
      this.hat_sprite.x = this.sprite.x;
      this.hat_sprite.y = this.sprite.y;
    } else {
      this.hat_sprite.x += this.hat_speed_x;
      this.hat_speed_x *= 0.9;
      this.hat_sprite.y += 10;
      this.hat_sprite.rotation += this.hat_speed_x / 100;
    }
    const HEAD_OFFSET_Y = -10;
    this.sprite.x = this.x;
    this.sprite.y = this.y + HEAD_OFFSET_Y;
    this.sprite_on.x = this.x;
    this.sprite_on.y = this.y + HEAD_OFFSET_Y;
    if (this.sprite_ear) {
      this.sprite_ear.x = this.x;
      this.sprite_ear.y = this.y + HEAD_OFFSET_Y;
    }
  }
}

const MAX_SPEED_X = 25;
const MAX_SPEED_HEAD_X = 10;
const ACC_X = 1;

const CAT_ANIM_SIT = 0;
const CAT_ANIM_RUN = 1;
const CAT_ANIM_STAND = 2;
const CAT_ANIM_TURN = 3;
const CAT_ANIM_STOP = 4;
const CAT_ANIM_PREP = 5;
const CAT_ANIM_END = 6;
const CAT_ANIM_RANGE = [0, 1, 7, 11, 12, 14, 15]

const ANIM_TURN_DURATION = 8;

class Cat {
  constructor(id) {
    this.id = id;
    // image
    if (id == 0) {
      this.x = SCREEN_W / 2 - 200;
    } else if (id == 1) {
      this.x = SCREEN_W / 2 + 200;
    }

    if (this.id == 0) {
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
        'data/cat_0009_stand3.png',
        'data/cat_0010_stand4.png',
        'data/cat_0011_turn.png',
        'data/cat_0012_stop1.png',
        'data/cat_0013_stop2.png',
        'data/cat_0014_prep.png',
      ]);
    } else {
      this.anim = g.sprite([
        'data/cat2_0000_sit.png',
        'data/cat2_0001_run1.png',
        'data/cat2_0002_run2.png',
        'data/cat2_0003_run3.png',
        'data/cat2_0004_run4.png',
        'data/cat2_0005_run5.png',
        'data/cat2_0006_run6.png',
        'data/cat2_0007_stand1.png',
        'data/cat2_0008_stand2.png',
        'data/cat2_0009_stand3.png',
        'data/cat2_0010_stand4.png',
        'data/cat2_0011_turn.png',
        'data/cat2_0012_stop1.png',
        'data/cat2_0013_stop2.png',
        'data/cat2_0014_prep.png',
      ]);
    }

    this.anim.anchor.set(0.5, 1);
    this.anim.show(CAT_ANIM_STAND);
    this.anim_set = CAT_ANIM_TURN;
    this.anim_time = 0;

    g.stage.addChild(this.anim);

    // location
    this.y = -256;
    this.speed_x = 0;
    this.speed_y = 0;
    this.state = 'fall';
    this.human = -1;
    this.direction = 0;
    this.scale = 1;
    this.heads = [];
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
      self.setDirection(-1);
    }

    this.key_left.release = function() {
      if (self.key_right.isDown == true) {
        self.setDirection(1);
      } else {
        self.setDirection(0);
      }
    }

    this.key_right.press = function() {
      self.setDirection(1);
    }

    this.key_right.release = function() {
      if (self.key_left.isDown == true) {
        self.setDirection(-1);
      } else {
        self.setDirection(0);
      }
    }
  }

  spawn() {
    if (this.id == 0 && !rupert_playing) {
      rupert_playing = true;
    } else if (this.id == 1 && !carl_playing) {
      carl_playing = true;
    }
  }

  setDirection(distance) {
    if (distance < 0) {
      this.scale = -1;
    } else if (distance > 0) {
      this.scale = 1;
    }
    this.direction = distance;
    this.spawn();
  }

  jump() {
    if (this.state == 'head') {
      people[this.human].setCat(null);
    }

    if (this.state == 'head' || this.state == 'ground') {
      this.state = 'jump';
      this.speed_y -= 45;
    }
    this.spawn();
  }

  gravity() {
    if (this.state == 'jump' || this.state == 'fall') {
      this.speed_y += 2;

      if (this.y > FENCE_H) {
        this.speed_y = 0;
        this.y = FENCE_H;
        this.state = 'ground';
        resetCombo(this.id);
      }
    }

    this.y += this.speed_y;
  }

  move() {
    // adjust speed based on direction
    let max_speed = MAX_SPEED_X;

    if (this.state == 'head') {
      max_speed = MAX_SPEED_HEAD_X * Math.abs(this.direction);
    }

    if (Math.abs(this.direction) > 0) {
      if (this.direction > 0 && this.speed_x < 0) {
        this.speed_x += ACC_X * Math.sign(this.direction);
      } else {
        this.speed_x += ACC_X * this.direction;
      }

      if (this.speed_x > max_speed) {
        this.speed_x = max_speed;
      } else if (this.speed_x < -max_speed) {
        this.speed_x = -max_speed;
      }
    } else {
      if (this.speed_x < 0) {
        this.speed_x += ACC_X;
      } else if (this.speed_x > 0) {
        this.speed_x -= ACC_X;
      }
      if (Math.abs(this.speed_x) < 1) {
        this.speed_x = 0;
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
      this.y = people[this.human].y + 5;
      // if human going offscreen fall
      if (this.x < SCREEN_MARGIN || this.x > SCREEN_W - SCREEN_MARGIN) {
        this.state = 'fall';
        people[this.human].setCat(null);
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
      this.anim.fps = 6;
    } else if (this.state == 'head') {
      this.anim.fps = 4;
      if (Math.abs(this.speed_x) > 7) {
        new_set = CAT_ANIM_PREP;
      } else {
        new_set = CAT_ANIM_SIT;
      }
    } else {
      if (this.direction) {
        this.anim.fps = 12;
        new_set = CAT_ANIM_RUN;
      } else if (Math.abs(this.speed_x) > 5) {
        new_set = CAT_ANIM_STOP;
        this.anim.fps = 8;
      } else {
        new_set = CAT_ANIM_STAND;
        this.anim.fps = 4;
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
                resetCombo(this.id);
              } else {
                people[this.human].dropHat(this.speed_x);
                addScore(this.id);
              }

              people[i].setCat(this);

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