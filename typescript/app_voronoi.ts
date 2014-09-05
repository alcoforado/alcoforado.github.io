/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="defines/handlebars.d.ts" />
/// <reference path="defines/ember.d.ts" />
/// <reference path="shaders.ts" />
/// <reference path="voronoi.ts" />


import $ = require("jquery");
import Shapes = require("shapes2d");
import Shaders = require("shaders");
import glut = require("glutils");
import Voronoi = require("voronoi");
//import Handlebars = require("handlebars");
import Ember = require("ember");


export class Main {
    T: any; 
    App: any;
    
    initEmber() {


	
        this.App = Ember.Application.create();
        this.App.Router.map(function () {
            this.resource('points', { path: '/' })
        });
        this.App.PointsRoute = Ember.Route.extend({
            voronoiInput: Ember.Object.extend({pts:[],scanLinePos:0}),
	    model: function() { 
		return this.voronoiInput; 
	    }
        });
	
	this.App.PointsController = Ember.ObjectController.extend({
	    actions: {
		incrementScanLine: function()
		{
		    var model = this.get('model');
		    model.set('scanLinePos',model.get('scanLinePos')+1);
		}
	    }
	});

    }
    

    canvas:HTMLElement;

    InitScreen() {
        var canvas = document.getElementById("canvas");
        var gl = glut.getWebGLContext(canvas,true);

        
        if (!gl) {
            return;
        }
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var shader = new Shaders.ShaderColor2D(gl);
        shader.shapes = [];
        shader.points = [new Shapes.Vector2(0.5, 0.5), new Shapes.Vector2(0, 0)];
        shader.draw();
    }



}