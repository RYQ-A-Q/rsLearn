import { Command } from "./Command";
import { GameActor } from "./GameActor";

export class AttackCommand implements Command {
    execute(actor: GameActor): void {
        actor.attack();
    }
    undo(actor: GameActor): void {
        actor.undoAttack();
    }
}
