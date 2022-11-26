import { Santa } from "./types"
import { v4 as uuid } from 'uuid';

const createSanta = (name: string , excludedPresentees: Array<string>): Santa => {
    //TODO: use uuid
    return {
        name,
        id: name.toLowerCase().replace(/\s/g, ""),
        excludedPresentees,
        presenteeId: ''
    }
}

export {createSanta}