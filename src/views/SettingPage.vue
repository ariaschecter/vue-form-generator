<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- KIRI -->
        <div
            class="w-full bg-white flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    📄 Generate Type File
                </h2>
                <p class="text-gray-500 mb-6 text-sm">
                    Isi field untuk membuat interface TypeScript otomatis.
                </p>

                <!-- Nama Aplikasi -->
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-1">Nama Aplikasi</label>
                    <input v-model="appName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: Aplikasi Ios" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { loadAppName, saveAppName } from "@/utils/localStorage";

const appName = ref(loadAppName());

watch(appName, (v) => saveAppName(v));
</script>
