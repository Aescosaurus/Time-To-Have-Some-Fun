function Example()
{
	GameObject.call( this );
	
	this.Update = function( ms )
	{
		this.pos = ms.GetPos();
	}
	
	this.Draw = function( gfx ) // Overridden.
	{
		gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),this.size,"#0FF" );
	}
}