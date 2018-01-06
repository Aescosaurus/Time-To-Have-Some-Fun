"use strict";

(function()
{
const gfx = new Graphics();
const kbd = new Keyboard();
const ms = new Mouse();
const sfx = new Audio();

const equips = new EquipmentItems();
const p = new Player( gfx );
const m = new Menu( gfx );
const a = new Area( gfx,equips );
const miningActivity = new GoMining( gfx,p.GetStats(),p.GetResources() );

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
	equips.GenerateItems( gfx );
	p.Start( m,equips );
	a.Start();
}

function Update()
{
	// Update below.
	miningActivity.Update( kbd,ms );
	if( !miningActivity.IsOpen() )
	{
		p.Update( kbd,ms,a,m );
		m.Update( kbd,ms,p );
		a.Update( kbd,ms,p,miningActivity );
	}
}

function Draw()
{
	gfx.DrawRect( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"#000" );
	// Draw below.
	miningActivity.Draw( gfx );
	if( !miningActivity.IsOpen() )
	{
		a.Draw( gfx );
		p.Draw( gfx );
		m.Draw( gfx );
	}
}
})()