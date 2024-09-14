export class Game {
  constructor(
    private _id: number | undefined,
    private _statedAt: Date,
  ) {}

  get id() {
    return this._id;
  }

  get statedAt() {
    return this._statedAt;
  }
}
