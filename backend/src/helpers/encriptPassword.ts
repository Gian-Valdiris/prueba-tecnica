import { createHash } from 'crypto';

export const stringToSHA1 = (value: string): string => {

    if (value.length === 40) {
        return value;
    }

    return createHash('SHA1').update(value).digest('hex');


}
