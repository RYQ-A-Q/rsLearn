import { AttackCommand } from "./AttackCommand";
import { Command } from "./Command";
import { GameActor } from "./GameActor";
import { JumpCommand } from "./JumpCommand";

export class InputHandler {
    private commandHistory: Command[] = [];
    commandNames: string[] = [];

    constructor(private actor: GameActor) { }

    handleInput(key: string) {
        let command: Command | null = null;
        if (key === 'j') {
            command = new JumpCommand();
            this.commandNames.push('跳跃');
        } else if (key === 'a') {
            command = new AttackCommand();
            this.commandNames.push('攻击');
        }

        if (command) {
            command.execute(this.actor);
            this.commandHistory.push(command);
        }
    }

    undoLast() {
        const last = this.commandHistory.pop();
        if (last) {
            last.undo(this.actor);
            this.commandNames.pop()
        }
    }
}
