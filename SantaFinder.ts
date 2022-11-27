import { Santa } from "./types"

export class SantaFinder {
    registeredSantas: { [key: string]: Santa }
    availablePresentees: { [key: string]: Santa }

    constructor(players: Array<Santa>) {
        this.registeredSantas = {}
        this.availablePresentees = {}

        players.forEach(player => {
            this.registeredSantas[player.id] = player
            this.availablePresentees[player.id] = player
        })
    }

    findSantas = () => {
        const santaInfos: Array<{ santaId: string, presentees: Array<string> }> = []

        this.getSantaIds().forEach((santaId) => {
            santaInfos.push({
                santaId,
                presentees: this.getPossiblePresenteesById(santaId)
            })
        })

        santaInfos.sort((a, b) => a.presentees.length - b.presentees.length)

        santaInfos.forEach(({ santaId, presentees }) => {
            const presenteesToChoose = presentees.filter(presenteeId => {
                return this.availablePresentees[presenteeId]
            })
            //TODO: check for empty array
            const randomIndex: number = this.getRandomInt(0, presenteesToChoose.length)
            const chosenPresenteeId = presenteesToChoose[randomIndex]
            this.setPresentee(santaId, chosenPresenteeId)
            delete this.availablePresentees[chosenPresenteeId]
        })
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

    setPresentee = (santaId: string, presenteeId: string) => {
        return this.registeredSantas[santaId].presenteeId = presenteeId
    }

    getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min)
    }
}
