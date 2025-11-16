<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">🏠 Home Page</h1>
        <p class="text-gray-600 mb-6">
            Selamat datang di Form Generator buatan
            <span><a href="https://gitlab.com/arlx" target="_blank" class="text-[#FF0000] underline">arlx</a></span>
            😎
        </p>

        <RouterLink to="/table" class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
            🚀 Buka Generator
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
