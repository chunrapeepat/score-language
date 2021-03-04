export class ScoreRuntimeContext {
  public handleError = (e: Error): void => {
    console.log("handleError", e.message);
  };
}
