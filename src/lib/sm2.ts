export type SM2Input = {
    quality: number; // 0-5 rating
    lastInterval: number; // days
    lastEaseFactor: number; // typically starts at 2.5
};

export type SM2Output = {
    interval: number; // days until next review
    easeFactor: number;
};

/**
 * Calculates the next review interval and ease factor using the SM-2 algorithm.
 * @param input - The current state of the card and the user's rating.
 * @returns The new interval and ease factor.
 */
export function calculateSM2({ quality, lastInterval, lastEaseFactor }: SM2Input): SM2Output {
    let newInterval: number;
    let newEaseFactor: number;

    if (quality >= 3) {
        if (lastInterval === 0) {
            newInterval = 1;
        } else if (lastInterval === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(lastInterval * lastEaseFactor);
        }

        newEaseFactor = lastEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
        newInterval = 1;
        newEaseFactor = lastEaseFactor;
    }

    if (newEaseFactor < 1.3) {
        newEaseFactor = 1.3;
    }

    return {
        interval: newInterval,
        easeFactor: newEaseFactor,
    };
}
