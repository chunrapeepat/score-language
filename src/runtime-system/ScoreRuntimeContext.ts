enum PrintType {
  INFO,
  ERROR,
}

export class ScoreRuntimeContext {
  private _functions: { [key: string]: { head: string; fn: Function } } = {
    random: {
      head: "random from $from to $to",
      fn: ({ from, to }: any) => {
        console.log("random", from, to);
        return Math.random();
      },
    },
  };

  // utility functions
  public functionCall = (functionName: string, args: any[]): any => {
    if (!this._functions[functionName]) {
      // TODO: handle error: function not found
    }

    const params = this._extractParams(
      this._functions[functionName].head,
      args
    );
    return this._functions[functionName].fn(params);
  };
  public handleError = (e: Error): void => {
    if (e instanceof ReferenceError) {
      this._print(
        `reference error: ${e.message.replace("_", "")}`,
        PrintType.ERROR
      );
    } else {
      this._print(e.message, PrintType.ERROR);
    }

    this.exitProgram();
  };

  // statements
  public playNote = async (note: number, duration: number): Promise<void> => {
    console.log("play note", note, duration);
  };
  public wait = async (seconds: number): Promise<void> => {
    console.log("wait for", seconds);
  };
  public say = (object: any): void => {
    console.log("say", object);
  };
  public exitProgram = (): void => {};
  public print = (message: string): void => {
    this._print(message);
  };

  // helper functions
  private _print(message: string, type: PrintType = PrintType.INFO): void {
    const elem = document.getElementById("score_runtime_output");
    if (!elem) return;

    const node = document.createElement("li");
    const textnode = document.createTextNode(message);
    node.appendChild(textnode);

    if (type === PrintType.ERROR) {
      node.setAttribute("style", "color: red");
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
