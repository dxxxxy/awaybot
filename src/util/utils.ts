export const waitForeverUntil = (condition: () => Promise<boolean>, interval: number): Promise<void> => {
    return new Promise(resolve => {
        const poller = setInterval(async() => {
            if (await condition()) {
                clearInterval(poller)
                resolve()
            }
        }, interval)
    })
}