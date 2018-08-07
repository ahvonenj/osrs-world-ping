var ping = require('ping');
var promiseForeach = require('promise-foreach');
var cTable = require('console.table');
var zeroPad = require('zero-pad');

var world_start = 1;
var world_end = 124;
var hosts = [];

for(var i = world_start; i <= world_end; i++)
{
	hosts.push(
	{
		addr: 'oldschool' + i + '.runescape.com',
		world: (i < 100) ? '3' + zeroPad(i) : '4' + i.toString().substring(1)
	});
}

promiseForeach.each(hosts, 
	[
		host => 
		{
			return ping.promise.probe(host.addr);
		}
	],

	(ar, host) =>
	{
		return {
			world: host.world,
			ping: ar[0].time + 'ms'
		}
	},

	(err, nl) =>
	{
		if(err)
		{
			console.error('err');
			return;
		}

		console.table(nl.sort((a, b) =>
		{
			if(parseInt(a.ping) < parseInt(b.ping))
				return -1;
			if(parseInt(a.ping) > parseInt(b.ping))
				return 1;
			return 0;
		}));
	}
);