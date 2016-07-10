/*
* Copyright (c) 2012 Brandon Jones
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
*    1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
*    2. Altered source versions must be plainly marked as such, and must not
*    be misrepresented as being the original software.
*
*    3. This notice may not be removed or altered from any source
*    distribution.
*/

import Stats from 'stats-js';

import '../css/main.css';

import Renderer from './Renderer.js';
import TouchControls from './TouchControls.js';
import GLContextHelper from './GLContextHelper.js';

// Setup the canvas and GL context, initialize the scene
const canvas = document.getElementById("canvas");
const contextHelper = new GLContextHelper(canvas, document.getElementById("content-frame"));
const renderer = new Renderer(contextHelper.gl, canvas);
const stats = new Stats();
const touchControls = new TouchControls(canvas, renderer);
document.body.appendChild(stats.domElement);

renderer.scale(1);
renderer.moveTo(0, 0);
//renderer.moveTo(42*16, 34*16);

// Get the render loop going
contextHelper.start(renderer, stats);
