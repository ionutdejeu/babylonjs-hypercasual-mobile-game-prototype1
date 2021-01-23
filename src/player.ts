
import * as BABYLON from '@babylonjs/core';
import {Tween} from './tween';
import * as MATERIAL from '@babylonjs/materials';
import * as GUI from '@babylonjs/gui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameMapTile } from './game_map';
import {GameEvents,GameEvent} from './game_events';



export class Player { 

    private _scene:BABYLON.Scene;
    private _idleAnim:BABYLON.Animation;
    private _idleAnimGroup:BABYLON.AnimationGroup;
    private _m:BABYLON.Mesh;
    private _frameRate:number = 10;
    jumpTrajectoryAnimationPosition:BABYLON.Animation;
    jumpTrajectoryAnimationRotation:BABYLON.Animation;
    jumpStartAnimation:BABYLON.Animation;
    jumpLandingAnimation:BABYLON.Animation;
    jumpAnimGroup:BABYLON.AnimationGroup;
    currentTile:GameMapTile;

    constructor(scene:BABYLON.Scene){
        this._m = this.createMesh(scene);
        this._scene = scene;
        this._idleAnim = this.createIdleScaleAnimations();
        let move = this.createIdlBobAnimations();
        //scene.beginDirectAnimation(this._m, [this._idleAnim,move], 0, 2 * this._frameRate, true);
        

        this.createJumpAnimation();
        GameEvents.OnMapTileSelectedObservable.add((ge:GameEvent)=>{
            this.createJumpCurve(ge.tile);
            this.updateAnimationKeys(ge.tile);
            

        });
        GameEvents.OnSpawnPlayerMapObservable.add((ge:GameEvent)=>{
            this.moveToTile(ge.tile);
            this._m.position = ge.tile.position;
        });
        
        
        
    }

    moveToTile(t:GameMapTile){
        this.currentTile = t;
    }
    computPath(target:GameMapTile):BABYLON.Curve3{
        let middlePoint = BABYLON.Vector3.Lerp(this.currentTile.position,target.position,0.5);
        middlePoint=middlePoint.add(BABYLON.Axis.Y.scale(BABYLON.Vector3.Distance(this.currentTile.position,target.position)));
        return BABYLON.Curve3.CreateQuadraticBezier(this.currentTile.position,middlePoint, target.position,10);
    }
    createJumpCurve(target:GameMapTile){
        let meshOfCurve = BABYLON.Mesh.CreateLines("playerMoveToTile_to_", this.computPath(target).getPoints(), this._scene);
        meshOfCurve.color = new BABYLON.Color3(1, 1, 0.5);
        meshOfCurve.edgesWidth = 1123;
        
    }
    private updateAnimationKeys(target:GameMapTile){
        let curve = this.computPath(target);
        let posKeys = []
        let rotationKeys = []
        let path3d = new BABYLON.Path3D(curve.getPoints());
        for(let p = 0; p < curve.getPoints().length; p++) {
            posKeys.push({
                frame: p,
                value: curve.getPoints()[p]
            });
    
            rotationKeys.push({
                frame: p,
                value: BABYLON.Vector3.RotationFromAxis(path3d.getNormals()[p], path3d.getBinormals()[p], path3d.getTangents()[p])
            });
        }
        let animPos = new BABYLON.Animation("animPos", "position", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        let animRot = new BABYLON.Animation("animRot", "rotation", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        
        
        animPos.setKeys(posKeys);
        animRot.setKeys(rotationKeys);
        if(this.jumpAnimGroup!=undefined){
            this.jumpAnimGroup.stop();
            this.jumpAnimGroup.dispose();
            this.jumpAnimGroup = undefined;
        }
        this.jumpAnimGroup = new BABYLON.AnimationGroup("PlayerJump");
        this.jumpAnimGroup.addTargetedAnimation(animPos,this._m);
        this.jumpAnimGroup.addTargetedAnimation(animRot,this._m);

        this.jumpAnimGroup.onAnimationGroupEndObservable.add(()=>{
            this._m.position = target.position;
            this.moveToTile(target);
        });
        this.jumpAnimGroup.play();
    }
    private createJumpAnimation(){
        //this.jumpTrajectoryAnimationRotation = new BABYLON.Animation("animPos", "position", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        //this.jumpTrajectoryAnimationPosition = new BABYLON.Animation("animRot", "rotation", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
    }
    

    public createIdleScaleAnimations():BABYLON.Animation{
        //this._idleAnim = Tween.createTween(this._scene,this._m,"scale.x")
        let idle_animation =   new BABYLON.Animation("player_idle_animation", "scaling.y", this._frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesR = []; 

        keyFramesR.push({
            frame: 0,
            value: 1
        });
    
        keyFramesR.push({
            frame: this._frameRate,
            value: 1.2
        });
    
        keyFramesR.push({
            frame: 2 * this._frameRate,
            value: 1
        });
    
    
        idle_animation.setKeys(keyFramesR);

        return idle_animation;
    
    }

    public createIdlBobAnimations():BABYLON.Animation{
        //this._idleAnim = Tween.createTween(this._scene,this._m,"scale.x")
        let idle_animation =   new BABYLON.Animation("player_idle_animation_movement", "position.y", this._frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesR = []; 

        keyFramesR.push({
            frame: 0,
            value: 1
        });
    
        keyFramesR.push({
            frame: this._frameRate,
            value: 1.2
        });
    
        keyFramesR.push({
            frame: 2 * this._frameRate,
            value: 1
        });
    
    
        idle_animation.setKeys(keyFramesR);

        return idle_animation;
    
    }

    
    public createMesh(scene:BABYLON.Scene):BABYLON.Mesh{
        let player = BABYLON.Mesh.CreateSphere("playerSphere",10,4,scene);
        var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
        pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        pbr.metallic = 0;
        pbr.roughness = 1.0;
        player.material = pbr;

        var trail = new BABYLON.TrailMesh('orb trail', player, scene, 2, 20, true);
        var sourceMat = new BABYLON.StandardMaterial('sourceMat', scene);
        var color = new BABYLON.Color3(1.0, 0.766, 0.336);
        sourceMat.emissiveColor = sourceMat.diffuseColor = color;
        sourceMat.specularColor = BABYLON.Color3.Black();
        trail.material = sourceMat;

        return player;
    }



}