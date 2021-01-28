

import * as BABYLON from '@babylonjs/core';
import {Tween} from './tween';
import * as MATERIAL from '@babylonjs/materials';
import * as GUI from '@babylonjs/gui';
import {GameEvents,GameEvent,MapEvents} from './game_events';
import { GameSound } from './sound';




export class GameMapTile{
    
    public static tileWidht = 10;
    public static tileHeight = 10;
    public static tileThickness = 1;

    
    private _m: BABYLON.Mesh;
    private _ag:BABYLON.AnimationGroup;
    private _scene:BABYLON.Scene;
    private _index:number;
    private _material:BABYLON.PBRMaterial;
    position:BABYLON.Vector3;
    isActive:boolean=true;
    private _isEnabled:boolean = true;

    constructor(scene:BABYLON.Scene,index:number){
        this._scene = scene;
        this._index = index;
        this.create(index);
        
                 
    }
    create(index:number){
        this._m = BABYLON.Mesh.CreateBox("gametile"+this._index,GameMapTile.tileHeight,this._scene);
        this._ag = new BABYLON.AnimationGroup("gametile"+this._index);
        this._m.isPickable = true;
        
        //TODO: to add animations here
        this._material =  new BABYLON.PBRMaterial('mat', this._scene);
        this._material.roughness = 1;
        this._material.metallic = 0;

        this.position = this.getPositionByIndex(index);
        this._m.position = this.position;
        this._m.scaling = new BABYLON.Vector3(1,0.2,1);
       

        //Fade animation
        let animFade = new BABYLON.Animation("fadeAnimTile"+index,"visibility",30,BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        let animMove = new BABYLON.Animation("moveTileAnim"+index,"position",30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        let animFadeKeys  = []
        for (let i = 0; i < 29; i++) {
            animFadeKeys.push({
                frame:i,
                value:1/i
            });           
        }
        animFadeKeys.push({
            frame:30,
            value:0
        });
        animFade.setKeys(animFadeKeys);
        
        let targetPos =  this.position.add(this.position.subtract(this.getPositionByIndex(GameMap.getCenterTileIndex())).scaleInPlace(3));
        let posAnimationsFrames = [];
        for (let i = 0; i < 30; i++) {
            posAnimationsFrames.push({
                frame:i,
                value:BABYLON.Vector3.Lerp(this.position,targetPos,1/i)
            }); 
        }
        animMove.setKeys(posAnimationsFrames);
        
        this._ag.addTargetedAnimation(animFade,this._m);
        this._ag.addTargetedAnimation(animMove,this._m);
        this._ag.onAnimationEndObservable.add(()=>{
            this._m.isVisible = this.isActive = false;
            
        });

        // compute the position of the center tile 
        if(GameMap.getCenterTileIndex()!=this._index){
            
        }
        else{
            
        }
        
        //events 
        this._m.actionManager = new BABYLON.ActionManager(this._scene);
        this._m.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, (objsevt)=>{
                    if(this._isEnabled){
                        let m = objsevt.source as BABYLON.Mesh;
                        MapEvents.OnTileSelectedObservable.notifyObservers(this);
                    }
                }
            )
        )
        GameEvents.OnPlayerEndMovementObservable.add((ge:GameEvent)=>{
            this._isEnabled = true;
        });
        GameEvents.OnPlayerBeginMovementObservable.add((ge:GameEvent)=>{
            this._isEnabled = false;        
        });

      
    }

    levelRefreshAnimation(){
        let animScale = new BABYLON.Animation("animationScaleFinalTile","scale",30,BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        let animMove = new BABYLON.Animation("animationMoveFinalTile","position",30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        // 2 elements 
        // 1. Translate to the center of the screen 
        // 2. Scale on x and z to 3.0 the original size
        let animScaleKeys  = []
        
        animScaleKeys.push({
            frame:0,
            value:1
        });           
        animScaleKeys.push({
                frame:60,//2 seconds
                value:3
        });
        animScale.setKeys(animScaleKeys);
        
        let targetPos =  this.getPositionByIndex(GameMap.getCenterTileIndex());
        let posAnimationsFrames = [];
        posAnimationsFrames.push({
            frame:0,
            value:this.position
        }); 
        posAnimationsFrames.push({
            frame:60, // 2 seconds 
            value:targetPos
        }); 
        animMove.setKeys(posAnimationsFrames);
        let endLevelAnimGroup = new BABYLON.AnimationGroup("tileEndGameAnimation"+this._index);
        endLevelAnimGroup.addTargetedAnimation(animMove,this._m);
        endLevelAnimGroup.addTargetedAnimation(animScale,this._m);
        endLevelAnimGroup.play();
    }
    beginFadeAnimation(){
        this._ag.play();
    }
    getPositionByIndex(index:number){
        let x = index%GameMap.witdh*GameMapTile.tileHeight;
        let y = parseInt(String(index/GameMap.height))*GameMapTile.tileWidht; 
        return new BABYLON.Vector3(x,0,y);
        
    }
}

export class GameMap{
    public static witdh = 3;
    public static height = 3;

    public static getCenterTileIndex(){
        return this.witdh/2+this.height/2+1;
    }
    tiles:Array<GameMapTile> = [];
    animations:Array<BABYLON.AnimationGroup> = [];
    private _scene:BABYLON.Scene;


    constructor(scene:BABYLON.Scene){
        this._scene = scene;
        for(let i = 0;i<GameMap.witdh;i++){
            for(let j = 0;j<GameMap.height;j++){
                let t = new GameMapTile(scene,i*GameMap.height+j);
                this.tiles.push(t);
            }
        }
        let ge  = new GameEvent(this._scene,null,null,this.tiles[4]);
        GameEvents.OnSpawnPlayerMapObservable.notifyObservers(ge);
        GameEvents.OnPlayerEndMovementObservable.add((evt:GameEvent)=>{this.checkLastTile()});
    }

    checkLastTile(){
        let foundActiveTile:GameMapTile = null;
        let tileCount = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            const element = this.tiles[i];
            if(element.isActive == true){
                foundActiveTile=element;
                tileCount++;
            }
        }
        if(tileCount == 1){
            //end game 
            foundActiveTile.levelRefreshAnimation();
        }

    }
    
} 