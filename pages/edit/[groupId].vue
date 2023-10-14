<template>
    <div class="h-screen w-screen bg-black text-white flex flex-col gap-16 items-center justify-center">
        <div v-if="!areLinksVisible" class="h-screen w-screen flex flex-col gap-16 items-center justify-center">
            <div class="text-2xl">Group-Id: {{ groupId }}</div>
            <div v-if="!areLinksReady" class="flex gap-4 h-12">
                <input type="text" v-model="newSantaName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name of the new santa" required>
                <button class="bg-green-500 rounded-xl p-3" :disabled="newSantaName === ''" @click="addSanta">Add</button>
            </div>
            <div>
                <header class="text-2xl">
                    Santas:
                </header>
                <div class="flex flex-col gap-2">
                    <div v-for="player in players" class="flex gap-x-8 w-full justify-between">
                        <div>{{ player.name }}</div>
                        <div>
                            {{ player.excludedPresentees }}
                        </div>
                        <button v-if="!areLinksReady" class="bg-red-500 rounded-xl p-1"
                            @click="() => removeSanta(player.name)">Remove</button>
                    </div>
                </div>
            </div>
            <button class="w-40 h-20 bg-white rounded-3xl text-black flex items-center justify-center"
                v-if="!areLinksReady && players.length >= 3" @click="findSantas">Find santas 🎅🏼</button>
            <button class="bg-green-500 rounded-xl p-3" v-if="areLinksReady && !areLinksVisible" @click="showLinks">Show
                generated
                links</button>
        </div>
        <div v-if="areLinksVisible">
            <NuxtLink v-for="link in generatedLinks" :to="link" class="block mb-2">{{ link }}</NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ref } from "nuxt/dist/app/compat/capi";
import { Santa } from "~~/types";
import { computed, ref } from "vue";
import { SantaFinder } from '@/SantaFinder'
import { createSanta } from '@/SantaHelper'
import serverConfig from "@/server-config";
const route = useRoute()

const groupId = ref(route.params.groupId)

const players: Ref<Santa[]> = ref([]);

// TODO: remove hardcoded players
players.value.push(createSanta('Julia', ['oli']))
players.value.push(createSanta('Oli', ['julia']))
players.value.push(createSanta('Paul', ['miri']))
players.value.push(createSanta('Miri', ['paul']))
players.value.push(createSanta('Iris', ['toralf']))
players.value.push(createSanta('Toralf', ['iris']))

const santas = ref()
const areLinksReady = ref(false)
const areLinksVisible = ref(false)
let newSantaName = ref('')

const findSantas = () => {
    const SF = new SantaFinder(players.value)
    santas.value = SF.getRandomSantas()
    createGroup()
}

const generatedLinks = ref()

const createGroup = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(santas.value)
    };
    fetch(`${serverConfig.serverURL}/createGroup/${groupId.value}`, requestOptions).then(res => areLinksReady.value = true)

    generatedLinks.value = Object.keys(santas.value).map(santa => {
        return `http://${window.location.host}/${groupId.value}/${santa}`
    })
}

const showLinks = () => {
    areLinksVisible.value = true
}

const addSanta = () => {
    const { value } = players;

    if (value.some(player => player.name === newSantaName.value)) {
        console.warn('Player name is already taken');
        return
    }
    value.push(createSanta(`${newSantaName.value}`, []))
}

const testFunction = (test) => {
    console.log(test);
}

const removeSanta = (name: string) => {
    const { value } = players;
    const index = value.findIndex(player => player.name === name)
    value.splice(index, 1)
    console.log(value, index);
}
</script>
