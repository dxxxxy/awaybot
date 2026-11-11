export const generateRandomNumberBetweenInclusive = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

//extracts the plain text of a chat component, either as JSON string (old protocols) or NBT object (1.20.3+)
//(e.g. kick reasons, which mineflayer types as string but passes through as NBT on modern versions)
export const chatToPlainText = (component: unknown): string => {
    if (typeof component === "string") {
        if (!component.startsWith("{") && !component.startsWith("[")) return component

        try {
            return chatToPlainText(JSON.parse(component))
        } catch {
            return component
        }
    }

    if (Array.isArray(component)) return component.map(chatToPlainText).join("")
    if (typeof component !== "object" || component === null) return component == null ? "" : String(component)

    const node = component as Record<string, unknown>

    //unwrap NBT tags ({ type: "compound", value: ... }), components themselves never have a string type next to a value
    if (typeof node.type === "string" && "value" in node) return chatToPlainText(node.value)

    return chatToPlainText(node.text ?? "") + chatToPlainText(node.extra ?? "")
}

export const isLoggedInElsewhereKick = (reason: unknown) => chatToPlainText(reason).includes("You logged in from another location!")

export const sleep =(ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

//checks the condition every interval ms until it is true (checks never overlap, even if one takes longer than the interval)
export const waitForeverUntil = async (condition: () => Promise<boolean>, interval: number): Promise<void> => {
    while (true) {
        await sleep(interval)

        if (await condition()) return
    }
}
