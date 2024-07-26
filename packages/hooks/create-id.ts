import { randomFillSync } from 'node:crypto';

export function createId() {
    const bytes = new Uint8Array(16);
    randomFillSync(bytes);
    return "x-" +Buffer.from(bytes).toString('hex');    
}
