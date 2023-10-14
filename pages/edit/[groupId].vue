<template>
    <div class="h-[calc(100dvh)] w-screen bg-black text-white flex flex-col gap-16 items-center p-4">
        <div v-if="!areLinksVisible" class="h-full w-full max-w-4xl flex flex-col gap-16 items-center justify-center">
            <div class="text-2xl w-full">Group-Id: {{ groupId }}</div>
            <form @submit="(event) => addSanta(event)" v-if="!areLinksReady" class="flex gap-2 h-10 w-full">
                <input type="text" v-model="newSantaName"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-xs"
                    placeholder="Name of the new santa">
                <button class="bg-green-500 rounded-xl p-2" :disabled="newSantaName === ''" type="submit">Add</button>
            </form>
            <div class="w-full">
                <header class="text-2xl mb-4" v-if="players.length >= 1">
                    Santas:
                    <p class="text-sm" v-if="players.length >= 2">(Deselect to exclude possible gift receivers)</p>
                </header>
                <div class="flex flex-col gap-2">
                    <div v-for="player in players" class="flex gap-x-8 w-full items-center">
                        <div class="w-28 truncate self-start">{{ player.name }}</div>
                        <div class="flex gap-4 flex-wrap flex-1">
                            <div v-for="presentee in players.filter(({ id }) => id !== player.id)" class="flex gap-1">
                                <input type="checkbox" :disabled="areLinksReady"
                                    :checked="!player.excludedPresentees.some(excludedPresentee => excludedPresentee === presentee.id)"
                                    :id="`checkbox-${player.id}-${presentee.id}`"
                                    @input="event => togglePresentee(player.id, presentee.id)" />
                                <label :for="`checkbox-${player.id}-${presentee.id}`">{{ presentee.name }}</label>
                            </div>
                        </div>
                        <button v-if="!areLinksReady" class="bg-red-500 rounded-full w-10 p-2"
                            @click="() => removeSanta(player.id)">
                            X
                        </button>
                    </div>
                </div>
            </div>
            <button class="p-2 bg-white rounded-xl text-black flex items-center justify-center"
                v-if="!areLinksReady && players.length >= 3" @click="findSantas">Find santas 🎅🏼</button>
            <button class="bg-green-500 rounded-xl p-3" v-if="areLinksReady && !areLinksVisible" @click="showLinks">Show
                generated
                links</button>
        </div>
        <div v-if="areLinksVisible" class="flex flex-col gap-4">
            <header class="text-2xl">Links:</header>
            <div v-for="([key, link]) in generatedLinks.entries()" class="block p">
                <header class="text-lg font-bold">{{ key }}</header>
                <div class="flex gap-4 justify-between items-center">
                    <div>{{ link }}</div>
                    <button class="w-10 h-10 bg-gray-500 text-xl rounded-full"
                        @click="() => shareLink(key, link)">✉️</button>
                </div>
            </div>
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

const santas = ref()
const areLinksReady = ref(false)
const areLinksVisible = ref(false)
let newSantaName = ref('')

const findSantas = () => {
    const SF = new SantaFinder(players.value)
    try {
        santas.value = SF.getRandomSantas()
        createGroup()
    } catch (error) {
        switch (error) {
            case 'UNDEFINED-CIRCLE':
                alert('No valid circle found. Please check if every santa has a possible presentee. - Try again if you think there should be a possible circle.')
                break;
            default:
                alert(error)
        }
    }
}

const generatedLinks = ref(new Map<string, string>)

const createGroup = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(santas.value)
    };
    fetch(`${serverConfig.serverURL}/createGroup/${groupId.value}`, requestOptions).then(res => areLinksReady.value = true)

    Object.keys(santas.value).forEach(santaId => {
        const name = santas.value[santaId].name
        generatedLinks.value.set(name, `http://${window.location.host}/${groupId.value}/${santaId}`)
    })
}

const showLinks = () => {
    areLinksVisible.value = true
}

const togglePresentee = (currentSantaId: string, presenteeId: string) => {
    const { value } = players;
    const index = value.findIndex(santa => santa.id === currentSantaId)
    const isExcluded = value[index].excludedPresentees.some(excludedPresentee => excludedPresentee === presenteeId)
    if (isExcluded) {
        const presenteeIndex = value[index].excludedPresentees.findIndex(excludedPresentee => excludedPresentee === presenteeId)
        value[index].excludedPresentees.splice(presenteeIndex, 1)
    } else {
        value[index].excludedPresentees.push((presenteeId))
    }
}

const addSanta = (event: Event) => {
    event.preventDefault()
    const { value } = players;
    if (!newSantaName.value) return

    if (value.some(player => player.name === newSantaName.value)) {
        console.warn('Player name is already taken');
        return
    }
    value.push(createSanta(`${newSantaName.value}`, []))
    newSantaName.value = ''
}

const removeSanta = (id: string) => {
    const { value } = players;
    const index = value.findIndex(player => player.id === id)
    value.splice(index, 1)
}

const shareLink = async (name: string, url: string) => {
    try {
        await navigator.share({
            title: 'Wichteln',
            text: url,
            url,
        })
        return
    } catch (error) { }

    try {
        navigator.clipboard.writeText(url)
    } catch (error) { }


}
</script>
