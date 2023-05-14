module.exports = {
	details : {
		name : 'Ludo'
	},
	logger : {
		logFolder : 'Log', // Change Your Name With Your Custom Folder
		logFilePrefix : 'game',

	},
	defaultUserLogin:{
		email : 'admin@gmail.com',
		password : 'kargan82',
		name : 'ShanKoeMee',
		role : 'admin'
	},
	site_config:{
		url:"https://shan.kohtut.me",
	},
	mailer: {
	     auth: {
			user: 'no-reply@kohtut.me',
	       pass: 'Shree@1204',
	     },
	     defaultFromAddress: 'The Rummy Round <no-reply@kohtut.me>'
	},
	paytm_test:{
		MID:"PROFUS47773646881480",
		WEBSITE:"DEFAULT",
		INDUSTRY_TYPE_ID:"Retail109",
		CHANNEL_ID:"WAP",
		MKEY:"%OKJ3lYL99gNYENO",
		hostname:"securegw-stage.paytm.in",
		process_transaction_url:"https://securegw.paytm.in/order/process",
		transaction_status_url:"https://securegw.paytm.in/order/status",
		CALLBACK_URL : "https://admin.therummyround.com/payment-status",
		PAYTM_FINAL_URL:"https://securegw.paytm.in/order/process",
		PAYTM_STATUS_URL:"https://securegw.paytm.in/order/status"
	}
	
}