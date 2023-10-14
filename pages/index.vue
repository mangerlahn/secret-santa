<template>
    <div class="h-screen w-screen flex items-center justify-center bg-black font-bold">
        <NuxtLink :to="`/edit/${randomGroupName}`">
            <button class="w-60 h-16 bg-red-500 text-white text-xl rounded-3xl">Start Secret Santa 🫎</button>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

const randomGroupName = Math.round(Math.random() * 100000)
</script>
