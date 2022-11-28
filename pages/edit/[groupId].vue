<template>
    <div class="h-screen w-screen flex flex-col gap-16 items-center justify-center bg-black text-white">
        <div class="text-2xl">Group-Name: {{ groupId }}</div>
        <button class="w-40 h-40 bg-white rounded-3xl text-black flex items-center justify-center"
            v-if="!showLinks" @click="findSantas">Find santas</button>
        <button class="bg-green-500 rounded-xl p-4" v-if="santasFound && !showLinks" @click="createGroup">Create Group</button>
        <div v-if="showLinks">
            <NuxtLink v-for="link in generatedLinks" :to="link" class="block mb-2">{{link}}</NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { SantaFinder } from '@/SantaFinder'
import { createSanta } from '@/SantaHelper'
import serverConfig from "@/server-config";
const route = useRoute()

const groupId = ref(route.params.groupId)

const players = []
// TODO: remove hardcoded players
players.push(createSanta('Julia', ['oli']))
players.push(createSanta('Oli', ['julia']))
players.push(createSanta('Paul', ['miri']))
players.push(createSanta('Miri', ['paul']))
players.push(createSanta('Iris', ['toralf']))
players.push(createSanta('Toralf', ['iris']))
const SF = new SantaFinder(players)
const santas = ref()

const santasFound = ref(false)
const showLinks = ref(false)

const findSantas = () => {
    santas.value = SF.getRandomSantas()
    santasFound.value = true
}

const generatedLinks = ref()

const createGroup = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(santas.value)
    };
    fetch(`${serverConfig.serverURL}/createGroup/${groupId.value}`, requestOptions).then(res => showLinks.value = true)

    generatedLinks.value = Object.keys(santas.value).map(santa => {
        return `http://${window.location.host}/${groupId.value}/${santa}`
    })
}
</script>