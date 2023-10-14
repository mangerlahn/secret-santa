import { Santa } from "./types"

const createSanta = (name: string, excludedPresentees: Array<string>): Santa => {
    //TODO: use uuid
    return {
        name,
        id: Math.round(Math.random() * 100000).toString(),
        excludedPresentees,
        possiblePresentees: [],
        chosenPresenteeId: ''
    }
}

export { createSanta }
