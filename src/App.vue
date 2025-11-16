<template>
    <div class="min-h-screen bg-gray-100">
        <nav class="bg-white shadow px-6 py-3 flex gap-4">
            <RouterLink to="/" class="font-semibold text-gray-700 hover:text-blue-600">🏠 Home</RouterLink>
            <RouterLink to="/store" class="font-semibold text-gray-700 hover:text-blue-600">📦 Store</RouterLink>
            <RouterLink to="/type" class="font-semibold text-gray-700 hover:text-blue-600">📄 Type</RouterLink>
            <RouterLink to="/form-v2" class="font-semibold text-gray-700 hover:text-blue-600">⚙️ Form</RouterLink>
            <RouterLink to="/table" class="font-semibold text-gray-700 hover:text-blue-600">🧩 Table</RouterLink>
        </nav>

        <main class="p-6">
            <RouterView />
        </main>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>
