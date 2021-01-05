

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
    private _pos:BABYLON.Vector3;
    constructor(scene:BABYLON.Scene,index:number){
        this._scene = scene;
        this._index = index;
        this.create(index);
    }
    create(index:number){
        this._m = BABYLON.Mesh.CreateBox("gametile"+this._index,GameMapTile.tileHeight,this._scene);
        this._ag = new BABYLON.AnimationGroup("gametile"+this._index);
        //TODO: to add animations here
        this._pos = this.getPositionByIndex(index);
        this._m.position = this._pos;
        this._m.scaling = new BABYLON.Vector3(1,0.2,1);
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