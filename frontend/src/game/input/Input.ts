export type InputState = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    drift: boolean;
    boost: boolean;
};

export class Input {
    private state: InputState = {
        up: false,
        down: false,
        left: false,
        right: false,
        drift: false,
        boost: false,
    };

    constructor() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            this.state.up = true; break;
        case "s":
        case "arrowdown":
            this.state.down = true; break;
        case "a":
        case "arrowleft":
            this.state.left = true; break;
        case "d":
        case "arrowright":
            this.state.right = true; break;
        case " ":
            this.state.drift = true; break;
        case "shift":
            this.state.boost = true; break;
        }
    };

    private onKeyUp = (e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            this.state.up = false; break;
        case "s":
        case "arrowdown":
            this.state.down = false; break;
        case "a":
        case "arrowleft":
            this.state.left = false; break;
        case "d":
        case "arrowright":
            this.state.right = false; break;
        case " ":
            this.state.drift = false; break;
        case "shift":
            this.state.boost = false; break;
        }
    };

    get(): InputState {
        return { ...this.state };
    }
}
