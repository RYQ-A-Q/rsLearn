import { Command } from "./Command";
import { GameActor } from "./GameActor";

export class JumpCommand implements Command {
    execute(actor: GameActor): void {
        actor.jump();
    }
    undo(actor: GameActor): void {
        actor.undoJump();
    }
}
