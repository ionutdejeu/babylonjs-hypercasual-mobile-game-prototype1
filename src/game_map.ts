

import * as BABYLON from '@babylonjs/core';
import {Tween} from './tween';
import * as MATERIAL from '@babylonjs/materials';
import * as GUI from '@babylonjs/gui';

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
       
        // compute the position of the center tile 
        if(GameMap.getCenterTileIndex()!=this._index){
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
            this._ag.play(true);
        }
        else{
            
        }
        

        //events 
        this._m.actionManager = new BABYLON.ActionManager(this._scene);
        this._m.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function(bjsevt) {
                    console.log(bjsevt);
                    let m = bjsevt.source as BABYLON.Mesh;
                }
            )
        )
    }
    onTileClikcHandler(){

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
    }
    
} 