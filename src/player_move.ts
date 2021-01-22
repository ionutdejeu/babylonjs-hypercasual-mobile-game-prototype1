

export class PlayerMovement {

} 

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { GameEvent, GameEvents } from './game_events';
import { GameMapTile } from './game_map';
import { Player } from './player';
import { GameSound } from './sound';

export class PlayerMoveEvent{

    trajectory:BABYLON.Curve3;
    trajectoryAnimKeysPosition:Array<BABYLON.IAnimationKey> = []; 
    trajectoryAnimkeysRotation:Array<BABYLON.IAnimationKey> = [];

    construct(p:Player,targetTile:GameMapTile){
        let middlePoint = BABYLON.Vector3.Lerp(p.currentTile.position,targetTile.position,0.5);
        middlePoint=middlePoint.add(BABYLON.Axis.Y.scale(BABYLON.Vector3.Distance(p.currentTile.position,targetTile.position)/2));
        this.trajectory =  BABYLON.Curve3.CreateQuadraticBezier(p.currentTile.position,middlePoint, targetTile.position,10);
        
               
    }
}