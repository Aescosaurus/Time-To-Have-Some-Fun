"use strict";

(function()
{
const gfx = new Graphics();
const kbd = new Keyboard();
const ms = new Mouse();
const sfx = new Audio();
const timer = new Timer();

const p = new Player( gfx );
const m = new Menu( gfx );
const a = new Area( gfx );

window.onload = function()
{
	Start();
	const fps = 30;
	setInterval( function()
	{
		Update();
		Draw();
	},1000 / fps );
}

function Start()
{
	kbd.Start();
	ms.Start( gfx.GetCanvas() );
	// Initialize below!
	p.Start( m );
	a.Start();
}

function Update()
{
	timer.Update();
	// Update below.
	p.Update( kbd,ms,a,m );
	m.Update( kbd,ms,p );
	a.Update( kbd,ms );
}

function Draw()
{
	gfx.DrawRect( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"#000" );
	// Draw below.
	a.Draw( gfx );
	p.Draw( gfx );
	m.Draw( gfx );
}
})()