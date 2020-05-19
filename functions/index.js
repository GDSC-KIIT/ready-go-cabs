'use strict';

const {
  dialogflow,
  Suggestions,
  Image,
  BasicCard,
  Button,
  Carousel,
  Place,
  Permission,
  Table,
} = require('actions-on-google');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = dialogflow({ debug: true });

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

const auth = admin.auth();
const db = admin.firestore();

const userRef = db.collection('users');

function findfeature(type) {
	var x = [];
	if(type === 'Free Roam') {
		x = [ 
		{
			cells: [' ', 'No Destination Required', ' ', 'Upto 300km/day', ' '],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹8', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Outstation') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹9', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Rentals') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹9', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Outstate') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹9', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Airport cabs') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹9', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Wedding') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹10', ' '],
			dividerAfter: true,
		},
		];
	}
	else if(type === 'Event') {
		x = [ 
		{
			cells: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
			dividerAfter: true,
		},
		{
			cells: [' ', 'Price per km', ' ', '₹9', ' '],
			dividerAfter: true,
		},
		];
	}
	return x;
}

app.intent('ride now', (conv, params, option) => {
	var type = option;
	conv.data.type = option;
	if (type === 'Local' || type === 'Corporate' || type === 'Kids') {
		conv.ask('We\'re working hard to make this possible. Stay tuned as this feature is going to come soon.');
		conv.ask('For now what else can I interest you in ?');
		conv.ask(new Suggestions(['Ride Now', 'Schedule a Ride', 'Contact']));
	}
	else {
		conv.ask('Nice, now please choose your Cab Segment :');
		conv.ask(new Carousel({
			title: 'Cab Segment',
			items: {
				'Standard': {
					title: 'Standard',
					description: 'Category: Hatchback',
					image: new Image({
						url: 'https://cdn3.iconfinder.com/data/icons/transport-icons-2/512/BT_c3side-512.png',
						alt: 'Standard',
					}),
				},
				'Premium': {
					title: 'Premium',
					description: 'Category: Sedan',
					image: new Image({
						url: 'https://image.flaticon.com/icons/png/512/55/55283.png',
						alt: 'Premium',
					}),
				},
				'Pro': {
					title: 'Pro',
					description: 'Category: SUV, LUV',
					image: new Image({
						url: 'https://png.pngtree.com/svg/20160727/3346c33f9e.png',
						alt: 'Pro',
					}),
				},
				'Royal': {
					title: 'Royal',
					description: 'Category: Luxury',
					image: new Image({
						url: 'https://i.ibb.co/q0Xthwn/Picture1.png',
						alt: 'Royal',
					}),
				},
			},
		}));
	}
});

app.intent('ride now - continue', (conv, params, option) => {
	var segment = option;
	conv.data.segment = option;
	var feature = findfeature(conv.data.type);
	conv.ask('Let me pull up it\'s features.');
	conv.ask(new Table({
		title: `Service : ${conv.data.type}`,
		subtitle: `Car Segment : ${conv.data.segment}`,
		image: new Image({
			url: 'https://pbs.twimg.com/media/DdCpbZ2VQAAuS7i.jpg',
			alt: `ReadyGo Cabs`,
		}),
		columns: [
		{
			header: ' ',
			align: 'CENTER',
		},
		{
			header: ' ',
			align: 'CENTER',
		},
		{
			header: ' ',
			align: 'CENTER',
		},
		{
			header: ' ',
			align: 'CENTER',
		},
		{
			header: ' ',
			align: 'CENTER',
		},
		],
		rows: feature,
	}));
	conv.ask(new Suggestions(['Proceed']));
});

app.intent('get location', (conv) => {
  conv.ask(new Permission({
    context: 'To find a place to pick you up ',
    permissions: 'DEVICE_PRECISE_LOCATION'
  }));
}); 

app.intent('get location - confirmation', (conv, params, permissionGranted) => {
  const {location} = conv.device;
  if (permissionGranted) {
  	const { latitude, longitude } = location.coordinates;
  	conv.ask('I got where to pick you up. What do you wanna do now?');
  	conv.ask(new Suggestions(['Confirm', 'Talk to our executives']));

  }
  else {
		conv.ask(`Sorry I just can't work without location permission, hope you understand it too. `);
		conv.close(`Until next time !`);
	}
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
