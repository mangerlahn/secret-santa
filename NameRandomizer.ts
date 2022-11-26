import { Santa } from "./types"

export class SantaFinder {
    registeredSantas: { [key: string]: Santa }
    availablePresentees: { [key: string]: Santa }
    constructor(players: Array<Santa>) {
        this.registeredSantas = {}
        this.availablePresentees = {}

        players.forEach(player => {
            this.registeredSantas[player.id] = player
        })

        this.availablePresentees = this.registeredSantas
    }

    findSantas = () => {
        const possiblePresenteesPerSanta: { [key: string]: Array<string> } = {}
        this.getSantaIds().forEach((santaId) => {
            possiblePresenteesPerSanta[santaId] = this.getPossiblePresenteesById(santaId)
        })

        console.log(possiblePresenteesPerSanta)
    
    }
    
    getPossiblePresenteesById = (currentSantaId: string) => {
        return this.getSantaIds().filter(presenteeId => {
            const currentSanta = this.getSantaById(currentSantaId)
            const isPresenteeExcluded = currentSanta.excludedPresentees.includes(presenteeId)
            const isOtherPerson = currentSantaId != presenteeId
            return !isPresenteeExcluded && isOtherPerson
        })
    }
    
    
    getSantaIds = () => {
        return Object.keys(this.registeredSantas)
    }
    
    getSantaById = (id: string) => {
        return this.registeredSantas[id]
    }
    
    setPresentee = (santa: Santa) => {
        return this.registeredSantas[santa.id].presenteeId = santa.presenteeId
    }
    
    
    getRandomInt = (min: number, max: number) => {
        Math.floor(Math.random() * (max - min) + min)
    }
}
