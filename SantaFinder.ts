import { Santa } from "./types"

export class SantaFinder {
    santas: Array<Santa>

    availableSantaIds: Array<string>
    availablePresenteeIds: Array<string>

    constructor(players: Array<Santa>) {
        this.santas = players
        this.availableSantaIds = players.map((player) => player.id )
        this.availablePresenteeIds = this.availableSantaIds

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
			this.availableSantaIds = this.availableSantaIds.filter((santa) => santa != currentSanta?.santa )
			this.availablePresenteeIds = this.availablePresenteeIds.filter((santa) => santa != currentSanta?.presentee )
            this.setChosenPresentee(currentSanta.santa, currentSanta.presentee)

            currentSanta = this.getNextSanta()
		}
		
        // Validity check
        if (this.availableSantaIds.length || this.availablePresenteeIds.length) {
            throw 'UNDEFINED-CIRCLE'
        }
    }

    private getNextSanta() {
        // Find all santas that still need an presentee
        let availableSantaNodes = this.santas
            .filter(santa => { return this.availableSantaIds.includes(santa.id)})
            .map((santa) => {
                const presentees = santa.possiblePresentees.filter((presentee: string) => { return this.availablePresenteeIds.includes(presentee) })
                return { id: santa.id, possiblePresentees: presentees }
            })
        
        // We are done
        if (availableSantaNodes.length === 0) {
            return null
        }
        
        // Find presentees who should be prioritized because few santas apply
        const presenteeCounts = availableSantaNodes.flatMap((node) => node.possiblePresentees )
            .reduce((acc, curr) => {
                return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
            }, {} as {[id: string]: number; })
        const presentees = Object.entries(presenteeCounts)
            .sort((p1, p2) => { return p1[1] - p2[1] })
            .map(([presentee]) => presentee)
    
        // Find santas with least amount of possible presentees
        availableSantaNodes.sort((node1, node2) => {
            return node1.possiblePresentees.length - node2.possiblePresentees.length
        })        
        const minPresenteeCount = Math.min(...availableSantaNodes.map((node) => node.possiblePresentees.length))
        availableSantaNodes = availableSantaNodes.filter((node) => node.possiblePresentees.length === minPresenteeCount)

        // Choose random santa and presentee (within priority constraints)
        const random = Math.floor(Math.random() * availableSantaNodes.length);
        const node = availableSantaNodes[random]
        const presentee = presentees.find((presentee) => { return node.possiblePresentees.includes(presentee) })
        if (!presentee) throw 'UNDEFINED-CIRCLE'

        return {santa: node.id, presentee: presentee}
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
        return this.santas.find((santa) => santa.id === id ) as Santa
    }

    setChosenPresentee(santaId: string, presenteeId: string) {
        return this.getSantaById(santaId).chosenPresenteeId = presenteeId
    }
}
