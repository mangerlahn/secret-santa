import { Santa } from "./types"

export class SantaFinder {
    santas: { [key: string]: Santa }
    availablePresentees: { [key: string]: Santa }
    possibleCycles: Array<Array<string>> = []

    constructor(players: Array<Santa>) {
        this.santas = {}
        this.availablePresentees = {}

        players.forEach(player => {
            this.santas[player.id] = player
            this.availablePresentees[player.id] = player
        })

        this.findSantas()
    }

    private findSantas() {
        // Find our possible presentees for each santa
        this.getSantaIds().forEach((santaId) => {
            const possiblePresentees = this.getPossiblePresenteesById(santaId)
            this.setPossiblePresentees(santaId, possiblePresentees)
        })

        /* Create possible santa graphs (only full cycles)
            TODO: Implement multiple cycles? e.g. (a-b-c) (d-e-f) instead of (a-b-c-d-e-f)
         */
        const firstSantaId = this.getSantaIds()[0]
        this.findNextSanta(firstSantaId, this.getSantaById(firstSantaId).possiblePresentees, [])
    }

    chooseRandomCycle() {
        // Choose random cycle
        const randomIndex = this.getRandomInt(0, this.possibleCycles.length)
        const chosenCycle = this.possibleCycles[randomIndex]
        if (!chosenCycle) throw 'UNDEFINED-CIRCLE'

        chosenCycle.forEach((id, i) => {
            const presenteeId = (i + 1) === chosenCycle.length ? chosenCycle[0] : chosenCycle[i + 1]
            this.setChosenPresentee(id, presenteeId)
        })
        console.log(chosenCycle)
    }

    getRandomSantas() {
        this.chooseRandomCycle()

        const santas: { [key: string]: { name: string, presenteeName: string } } = {}
        this.getSantaIds().forEach(santaId => {
            const presenteeId = this.getSantaById(santaId).chosenPresenteeId
            santas[santaId] = {
                name: this.getSantaById(presenteeId).name,
                presenteeName: this.getSantaById(santaId).name
            }
        })
        return santas
    }

    private findNextSanta(nodeId: string, edges: Array<string>, path: Array<string>) {
        const currentPath = [...path]
        currentPath.push(nodeId)

        if (currentPath.length === this.getSantaIds().length) {
            // Does endNode match firstNode
            if (this.santas[nodeId].possiblePresentees.includes(currentPath[0])) {
                this.possibleCycles.push(currentPath)
            }
            return
        }

        edges.forEach(nextNodeId => {
            if (!currentPath.includes(nextNodeId)) {
                this.findNextSanta(nextNodeId, this.santas[nextNodeId].possiblePresentees, currentPath)
            }
        })
    }

    private getPossiblePresenteesById(santaId: string) {
        return this.getSantaIds().filter(presenteeId => {
            const currentSanta = this.getSantaById(santaId)
            const isPresenteeExcluded = currentSanta.excludedPresentees.includes(presenteeId)
            const isOtherPerson = santaId != presenteeId
            return !isPresenteeExcluded && isOtherPerson
        })
    }

    getSantaIds() {
        return Object.keys(this.santas)
    }

    getSantaById(id: string) {
        return this.santas[id]
    }

    setChosenPresentee(santaId: string, presenteeId: string) {
        return this.santas[santaId].chosenPresenteeId = presenteeId
    }

    private setPossiblePresentees(santaId: string, presentees: string[]) {
        return this.santas[santaId].possiblePresentees = presentees
    }

    getRandomInt = (min: number, max: number) => {
        // Increase that max value is also included
        max = max + 1
        return Math.floor(Math.random() * (max - min) + min)
    }
}
