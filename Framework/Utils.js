function Random(){}
	Random.RangeI = function( min,max )
	{
		return( Math.floor( Math.random() * ( 1 + max - min ) ) + min );
	}
	
	Random.RangeF = function( min,max )
	{
		return( ( Math.random() * ( max - min ) ) + min );
	}
// 
function Timer()
{
	function MiniTimer( func,time,repeat )
	{
		this.func = func;
		this.time = time;
		this.repeat = repeat;
		this.dead = false;
		// 
		this.Update = function()
		{
			--this.time;
			
			if( this.time < 1 )
			{
				this.func();
				
				if( !this.repeat )
				{
					this.dead = true;
				}
				else
				{
					this.time = time;
				}
			}
		}
		
		this.IsAlive = function()
		{
			return !this.dead;
		}
	}
	// 
	let timers = [];
	// 
	this.Update = function()
	{
		for( let i = 0; i < timers.length; ++i )
		{
			timers[i].Update();
			
			if( !timers[i].IsAlive() )
			{
				timers.splice( i,1 );
			}
		}
	}
	
	this.Add = function( func,time,repeat = false )
	{
		timers.push( new MiniTimer( func,time,repeat ) );
		return( timers.length - 1 );
	}
	
	this.Remove = function( index )
	{
		timers.splice( index,1 );
	}
}