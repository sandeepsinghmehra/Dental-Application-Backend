import { Connection } from "mongoose";
import { RateLimiterMongo } from "rate-limiter-flexible";

let rateLimiterMongo: null | RateLimiterMongo = null;

const DURATION = 60;

const POINTS = 10;

const initRateLimiter = ( mongooseConnection: Connection ) => {
    rateLimiterMongo = new RateLimiterMongo({
        storeClient: mongooseConnection,
        points: POINTS,
        duration: DURATION
    })
}

export {
    rateLimiterMongo,
    initRateLimiter
};