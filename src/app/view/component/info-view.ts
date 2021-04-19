import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {parse, stringify} from 'flatted';

import {View} from "../../../framework/view";
import {GameModel} from "../../model/game-model";
import {
  BOARD_COLUMN,
  BOARD_ROW,
  EVENT_CLICK_BOARD,
  EVENT_RENDER_BOARD, EVENT_RENDER_SCORE,
  EVENT_RENDER_TIMER,
  FRUIT_ID_1
} from "../../util/env";
import Bottle from '../../../framework/bottle';
import Event from "../../../framework/event";
import titleStyle from "../style/title-style";

export class InfoView extends View {
  private _gameModel: GameModel;

  private _scoreTitle: PIXI.Text;
  private _scoreValue: PIXI.Text;
  private _timeTitle: PIXI.Text;
  private _timeValue: PIXI.Text;
  private _pow: PIXI.Text;

  private _scoreTimeline: gsap.core.Timeline;

  constructor() {
    super();

    this._gameModel = Bottle.get('gameModel');

    Event.on(EVENT_RENDER_TIMER, () => {
      this.renderTimer()
    });

    Event.on(EVENT_RENDER_SCORE, () => {
      this.renderScore();
    });
  }

  public init() {
    this._scoreTitle = new PIXI.Text('SCORE', titleStyle);
    this._scoreTitle.position = new PIXI.Point(30, 10)
    this.addChild(this._scoreTitle);

    this._scoreValue = new PIXI.Text('00000000', titleStyle);
    this._scoreValue.position = new PIXI.Point(30, 30)
    this.addChild(this._scoreValue);

    this._timeTitle = new PIXI.Text('TIME', titleStyle);
    this._timeTitle.position = new PIXI.Point(370, 10)
    this.addChild(this._timeTitle);

    this._timeValue = new PIXI.Text('60', titleStyle);
    this._timeValue.position = new PIXI.Point(388, 30)
    this.addChild(this._timeValue);

    this._pow = new PIXI.Text('0.00%', titleStyle);
    this._pow.position = new PIXI.Point((this.size.width - this._pow.width) / 2, 150)
    this.addChild(this._pow);

    this._scoreTimeline = gsap.timeline();
  }

  public renderScore() {
    const score = this._gameModel.score;
    const scorePlus = this._gameModel.scorePlus;

    this._scoreTimeline
      .clear()
      .to({
          score: score - scorePlus,
        },
        {
          score: score,
          duration: 0.5,
          onUpdate: function(text: PIXI.Text) {
            const { score } = this.targets()[0];

            text.text = `${Math.floor(score)}`.padStart(8, '0');
          },
          onUpdateParams:[this._scoreValue],
        });
  }

  public renderTimer() {
    this._timeValue.text = `${this._gameModel.time}`;
  }

  public renderPow() {

  }
}
