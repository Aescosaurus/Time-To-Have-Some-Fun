function Audio()
{
	let sounds = [];
	let curSound = 0;
	//
	this.LoadSound=( source )=>
	{
		const nowSound = curSound;
		++curSound;
		sounds[nowSound] = new Audio( source );
		return nowSound;
	}

	this.PlaySound=( id )=>
	{
		sounds[id].currentTime = 0;
		sounds[id].play();
	}

	this.StopAll=()=>
	{
		for( let i in sounds )
		{
			sounds[i].stop();
			sounds[i].currentTime = 0;
		}
	}
}