import { GQLElement, ResolveFunction } from "../..";

export class Middleware extends GQLElement<ResolveFunction> {
  private _function;

  get function() {
    return this._function;
  }

  /**
   * Set the function of your middleware
   * @param fn The middleware function
   */
  setFunction(fn: ResolveFunction) {
    this._function = fn;
  }

  protected constructor(fn: ResolveFunction, name?: string) {
    super(name);
    this.setFunction(fn);
  }

  static create(fn: ResolveFunction, name?: string) {
    return new Middleware(fn, name);
  }
}