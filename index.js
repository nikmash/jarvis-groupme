import GroupMe from 'groupme'
import Jarvis from 'jarvis-node'

const jarvis = new Jarvis('jarvis.ironbay.digital', 'groupme')

const ACCESS_TOKEN = "f05790b02c290133137e459f6eb8b180";
const GROUP_ID = "15713716";
const USER_ID = "30100042"

var API = GroupMe.Stateless;

var iStream = new GroupMe.IncomingStream(ACCESS_TOKEN, USER_ID);

iStream.on('message', function (msg) {
	const context = jarvis.getContext()
	context.identity = msg.data.subject.sender_id
	if (context.identity === USER_ID)
		return

	console.log(msg.data.subject.text, context);

	jarvis.emit('conversation.message', {
		message: msg.data.subject.text
	}, context)
});

iStream.on('disconnected', function() {
	console.log('Reconnecting...')
	setTimeout(reconnect, 3000);
});

async function reconnect() {
	await iStream.connect();
	console.log('Connected to GroupMe')
}

reconnect()

jarvis.forever('conversation.stringable', (ev) => {
	const channel = ev.context.type == 'broadcast' ? 'UgxLnBmKV-j-EB0hlm14AaABAQ' : ev.context.channel
	console.log('what is ev', ev)
	let opts = {
		message: {
			text: '2.0: ' + ev.model.message,
		},
	};

	API.Messages.create(GROUP_ID, opts, function(response) {
		console.log('response: ', response);
	})
})