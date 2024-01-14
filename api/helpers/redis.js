const { createClient } = require('ioredis');


let redisClient;

try {
    console.log('Connecting to Redis...');
    redisClient = createClient({
        password: 'xPHXwQpAsKZ6JfoLWzhZSAKmpwhkJ9NY',
        host: 'redis-12475.c323.us-east-1-2.ec2.cloud.redislabs.com',
        port: 12475,
        legacyMode: true
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });

    redisClient.on('error', (err) => {
        console.error('Redis Client Error: ', err);
    });

} catch (error) {
    console.error('Error connecting to Redis: ', error);
}

module.exports = redisClient;
