import { Santa, SantaNode } from "./types"

export class SantaFinder {
    santas: Array<Santa>

    availableSantas: Array<string>
    availablePresentees: Array<string>

    constructor(players: Array<Santa>) {
        this.santas = players
        this.availableSantas = players.map((player) => { return player.id })
        this.availablePresentees = this.availableSantas

        this.findSantas()
    }

    private findSantas() {
        // Find our possible presentees for each santa
        this.santas.forEach((santa) => {
            const possiblePresentees = this.getPossiblePresenteesById(santa.id)
            santa.possiblePresentees = possiblePresentees
        })

        // Go through santas until everyone has a presentee
        let currentSanta = this.getNextSanta()
		while (currentSanta) {		
			this.availableSantas = this.availableSantas.filter((santa) => { return santa != currentSanta.santa })
			this.availablePresentees = this.availablePresentees.filter((santa) => { return santa != currentSanta.presentee })
            this.setChosenPresentee(currentSanta.santa, currentSanta.presentee)

            currentSanta = this.getNextSanta()
		}
		
        // Validity check
        if (this.availableSantas.length || this.availablePresentees.length) {
            throw 'UNDEFINED-CIRCLE'
        }
    }

    private getNextSanta() {
        // Find all santas that still need an presentee
        let availableNodes = this.santas
            .map((santa) => {
                if (this.availableSantas.includes(santa.id)) {
                    const presentees = santa.possiblePresentees.filter((presentee: string) => { return this.availablePresentees.includes(presentee) })
                    return { id: santa.id, possiblePresentees: presentees }
                }
            })
            .filter((item): item is SantaNode => !!item)
        
        // We are done
        if (availableNodes.length === 0) {
            return null
        }
        
        // Find presentees who should be prioritized because few santas apply
        const presenteeCounts = availableNodes.flatMap((node) => { return node.possiblePresentees })
            .reduce((acc, curr) => {
                return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
            }, {} as {[id: string]: number; })
        const presentees = Object.entries(presenteeCounts)
            .sort((p1, p2) => { return p1[1] - p2[1] })
    
        // Find santas with least amount of possible presentees
        availableNodes.sort((node1, node2) => {
            return node1.possiblePresentees.length - node2.possiblePresentees.length
        })        
        let count = availableNodes[0].possiblePresentees.length
        availableNodes = availableNodes.filter((node) => {
            return node.possiblePresentees.length === count
        })

        // Choose random santa and presentee (within priority constraints)
        const random = Math.floor(Math.random() * availableNodes.length);
        const node = availableNodes[random]
        const presentee = presentees.filter((presentee) => { return node.possiblePresentees.includes(presentee[0]) })[0]
        
        return {santa: node.id, presentee: presentee[0]}
    }

    getSantas() {
        const santas: { [key: string]: { name: string, presenteeName: string } } = {}
        this.santas.forEach(santa => {
            const presenteeId = santa.chosenPresenteeId
            santas[santa.id] = {
                name: santa.name,
                presenteeName: this.getSantaById(presenteeId).name
            }
        })

        return santas
    }

    private getPossiblePresenteesById(santaId: string) {
        return this.santas.filter(presentee => {
            const currentSanta = this.getSantaById(santaId)
            const isPresenteeExcluded = currentSanta.excludedPresentees.includes(presentee.id)
            const isOtherPerson = santaId != presentee.id
            return !isPresenteeExcluded && isOtherPerson
        }).map((santa) => santa.id)
    }

    getSantaById(id: string) {
        return this.santas.filter((santa) => { return santa.id === id })[0]
    }

    setChosenPresentee(santaId: string, presenteeId: string) {
        return this.getSantaById(santaId).chosenPresenteeId = presenteeId
    }
}
