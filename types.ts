type Santa = {
    id: string,
    name: string,
    excludedPresentees: Array<string>,
    possiblePresentees: Array<string>,
    chosenPresenteeId: string
}

type SantaNode = {
    id: string,
    possiblePresentees: Array<string>
}

export {Santa, SantaNode}