export const generateRandomNumberBetweenInclusive = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

//checks the condition every interval ms until it is true (checks never overlap, even if one takes longer than the interval)
export const waitForeverUntil = async (condition: () => Promise<boolean>, interval: number): Promise<void> => {
    while (true) {
        await sleep(interval)

        if (await condition()) return
    }
}
