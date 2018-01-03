function Random(){}
	Random.RangeI = function( min,max )
	{
		return( Math.floor( Math.random() * ( 1 + max - min ) ) + min );
	}
	
	Random.RangeF = function( min,max )
	{
		return( ( Math.random() * ( max - min ) ) + min );
	}
	