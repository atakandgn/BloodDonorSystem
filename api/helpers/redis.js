const { createClient } = require('ioredis');

let redisClient;

try {
    console.log('Connecting to Redis...');
    redisClient = createClient({
        username: "default",
        password: 'ZyNwsDg5ebnYbC30TV5aeofbekM0Jsu1',
        socket: {
            host: 'redis-11247.c276.us-east-1-2.ec2.redns.redis-cloud.com',
            port: 11247
        },
        legacyMode: true
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis Server Successfully');
    });

    redisClient.on('error', (err) => {
        console.error('Redis Client Error: ', err);
    });

} catch (error) {
    console.error('Error connecting to Redis: ', error);
}

module.exports = redisClient;
