
import { createClient } from 'redis';

export async function runRedis() {
    const client = createClient();

    await client.on('error', err => console.log('Redis Client Error', err));

    await client.connect(
        console.log("running!")
    );
}






