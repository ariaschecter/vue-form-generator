<template>
    <div class="min-h-screen flex flex-col md:flex-row overflow-hidden">
        <!-- 🎛️ KIRI: FORM INPUT -->
        <div class="md:w-1/2 w-full bg-white flex flex-col p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">
                        🧩 Generate Vue Form
                    </h2>
                    <p class="text-gray-500 text-sm">
                        Isi informasi di bawah untuk membuat form dinamis.
                    </p>
                </div>
            </div>

            <!-- Form Input -->
            <div class="space-y-5 flex-grow overflow-auto p-2">
                <!-- Judul Form -->
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">
                        Judul Form
                    </label>
                    <input v-model="formTitle" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Riwayat Pembelian" />
                </div>

                <!-- Payload Fields (pakai textarea) -->
                <div class="mb-6">
                    <h3 class="font-semibold text-gray-700 mb-2">Payload Fields</h3>
                    <textarea v-model="payloadFieldsText" rows="4"
                        placeholder="Contoh:\nname string\nsupplier_id number"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                </div>
            </div>
        </div>

        <!-- 🧾 KANAN: PREVIEW -->
        <div class="md:w-1/2 w-full bg-[#1e1e1e] flex flex-col">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Code</h2>
                <button @click="copyCode" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy
                </button>
            </div>

            <MonacoEditor v-model:value="generatedCode" language="html" theme="vs-dark" class="flex-grow" :options="{
                readOnly: true,
                fontSize: 12,
                minimap: { enabled: false },
                lineNumbers: 'on',
                wordWrap: 'on',
            }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { generateFormBase } from "@/utils/generateTableFile";

// Data dasar
const formTitle = ref("Riwayat Pembelian");
const payloadFieldsText = ref("name string\nage number");
const generatedCode = ref("");

// parsing text -> array objek { name, type }
function parseFields(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) => {
            const [name, type] = line.split(/\s+/);
            return { name, type };
        })
        .filter((f): f is { name: string; type: string } => !!(f.name && f.type));
}

// generate otomatis setiap ada perubahan
watch([formTitle, payloadFieldsText], () => {
    const payloadFields = parseFields(payloadFieldsText.value);
    generatedCode.value = generateFormBase(formTitle.value, payloadFields);
}, { immediate: true });

function copyCode() {
    navigator.clipboard.writeText(generatedCode.value);
    alert("✅ Kode berhasil disalin!");
}
</script>
