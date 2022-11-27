<template>
  <div class="h-screen w-screen flex items-center justify-center bg-black">
    <div class="w-40 h-40 bg-white rounded-3xl" @click="findSantas">Reset</div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import {SantaFinder} from './SantaFinder'
import {createSanta} from './SantaHelper'

const players = []
players.push(createSanta('Julia',['oli']))
players.push(createSanta('Oli',['julia']))
players.push(createSanta('Paul',['miri']))
players.push(createSanta('Miri',['paul', 'toralf', 'iris', 'julia']))
players.push(createSanta('Iris',['toralf']))
players.push(createSanta('Toralf',['iris']))
const SF = new SantaFinder(players)

const findSantas = () => {
  SF.findSantas()
  console.log(SF.registeredSantas)
}

</script>