<template>
    <div class="h-screen w-screen flex items-center justify-center bg-black font-bold">
        <NuxtLink :to="`/edit/${randomGroupName}`">
            <button class="w-40 h-40 bg-white rounded-3xl">New Group</button>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

const randomGroupName = Math.round(Math.random() * 100000)
</script>