import * as Tone from "tone";
import { TypeError, InvalidArgumentError } from "./Error";
import * as nativeFunctions from "./native-functions";

enum PrintType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
}

export class ScoreRuntimeContext {
  private _functions: { [key: string]: { head: string; fn: Function } } = {
    random: {
      head: "random from $from to $to",
      fn: nativeFunctions.random,
    },
    ask: {
      head: "ask $object as $type",
      fn: nativeFunctions.ask,
    },
  };

  // utility functions
  public functionCall = (functionName: string, args: any[]): any => {
    if (!this._functions[functionName]) {
      throw new ReferenceError(`function ${functionName} is not defined`);
    }

    const params = this._extractParams(
      this._functions[functionName].head,
      args
    );
    return this._functions[functionName].fn(params);
  };
  public handleError = (e: Error): void => {
    if (e.message === "score_runtime_exit") {
      return;
    }

    if (e instanceof ReferenceError) {
      this._print(
        `Reference error: ${e.message.replace("_", "")}`,
        PrintType.ERROR
      );
    } else if (e instanceof TypeError) {
      this._print(`Type error: ${e.message}`, PrintType.ERROR);
    } else if (e instanceof InvalidArgumentError) {
      this._print(`Invalid argument error: ${e.message}`, PrintType.ERROR);
    } else {
      this._print(`${e.name}: ${e.message}`, PrintType.ERROR);
    }
  };

  // statements
  public playNote = (note: number, duration: number = 0.5): Promise<void> => {
    if (typeof note !== "number" || typeof duration !== "number") {
      throw new TypeError("play note statement arguments must be number");
    }
    if (note < 0) {
      throw new InvalidArgumentError(
        "note in play statement must be positive number"
      );
    }

    const notes = ["C#", "D", "D#", "E", "F", "G", "G#", "A", "A#", "B", "C"];
    const synth = new Tone.Synth().toDestination();
    const delay = 150;
    return new Promise((resolve, _) => {
      synth.triggerAttackRelease(
        `${notes[(note - 1) % notes.length]}${
          4 + Math.floor(note / notes.length)
        }`,
        duration
      );
      setTimeout(resolve, duration * 1000 + delay);
    });
  };

  public wait = async (seconds: number): Promise<void> => {
    return new Promise((resolve, _) => {
      setTimeout(resolve, seconds * 1000);
    });
  };
  public say = (object: any, duration: number = 1): Promise<void> => {
    // TODO: Change duration to speed or rate instead
    if (typeof duration !== "number" || duration < 0) {
      throw new InvalidArgumentError(
        "say statement's duration must be positive number"
      );
    }
    if (!("speechSynthesis" in window)) {
      this._print(
        "Warning: your browser doesn't support text to speech!",
        PrintType.WARNING
      );
    }

    return new Promise((resolve, _) => {
      const msg = new SpeechSynthesisUtterance();
      msg.text = String(object);
      msg.rate = 1;
      if (this._isAnyThaiChar(String(object))) {
        msg.lang = "th-TH";
      }
      speechSynthesis.speak(msg);

      msg.onend = (_) => {
        resolve();
      };
    });
  };
  public exitProgram = (): void => {
    throw new Error("score_runtime_exit");
  };
  public print = (object: any): void => {
    this._print(String(object));
  };

  // helper functions
  private _isAnyThaiChar(message: string): boolean {
    const thaiCharRegex = /([\u0E00-\u0E7F]+)/gmu;
    return thaiCharRegex.exec(message) !== null;
  }
  private _print(message: string, type: PrintType = PrintType.INFO): void {
    const elem = document.getElementById("score_runtime_output");
    if (!elem) return;

    const node = document.createElement("li");
    const textnode = document.createTextNode(message);
    node.appendChild(textnode);

    if (type === PrintType.ERROR) {
      node.setAttribute("style", "color: red");
    }
    if (type === PrintType.WARNING) {
      node.setAttribute("style", "color: orange");
    }

    elem.appendChild(node);
  }
  private _extractParams(functionHead: string, args: any[]): any {
    const items: { index: number; name: string }[] = [];
    functionHead.split(" ").forEach((item, i) => {
      if (item.startsWith("$")) {
        items.push({ index: i - 1, name: item.substring(1) });
      }
    });
    const result: { [key: string]: any } = {};
    items.forEach(({ index, name }) => {
      result[name] = args[index];
    });
    return result;
  }
}
