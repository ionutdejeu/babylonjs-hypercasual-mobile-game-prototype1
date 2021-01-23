import * as BABYLON from '@babylonjs/core'
import {GameMap,GameMapTile} from './game_map';

export class GameEvent{
    scene:BABYLON.Scene
    camera:BABYLON.ArcRotateCamera
    source:BABYLON.Mesh
    tile:GameMapTile
    constructor(
        scene:BABYLON.Scene,
        camera:BABYLON.ArcRotateCamera|null,
        source:BABYLON.Mesh|null,
        tile:GameMapTile| null){
        this.source = source;
        this.scene = scene;
        this.camera = camera;
        this.tile = tile;
    }
}
export class GameEvents {
    public static OnMapTileSelectedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnSpawnPlayerMapObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnPlayerBeginMovementObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnPlayerEndMovementObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();

    public static OnMatchFoundObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGamePausedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGameResumedObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnGameRestartObservable:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
    public static OnLevelCompleted:BABYLON.Observable<GameEvent> = new BABYLON.Observable<GameEvent>();
} 