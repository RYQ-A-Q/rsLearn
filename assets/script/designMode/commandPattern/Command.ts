import { GameActor } from "./GameActor";

export interface Command {
    execute(actor: GameActor): void;
    undo(actor: GameActor): void;
}

