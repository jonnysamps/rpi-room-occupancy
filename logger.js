var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    timestamp: true
});
history = new winston.Logger({
    transports: [ new winston.transports.File({
	filename: '/var/log/rpi-room-occupancy/history.log',
	timestamp: true,
	maxsize: 10000000, // 10 MB                                                                                                                                                                                                                                                                              
        maxFiles: 10,
        prettyPrint: true,
        tailable: true,
        showLevel: false
    })]
});

module.exports = {
    history: history,
    console: winston
}
