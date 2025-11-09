<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- KIRI -->
        <div
            class="md:w-1/2 w-full bg-white flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    📄 Generate Type File
                </h2>
                <p class="text-gray-500 mb-6 text-sm">
                    Isi field untuk membuat interface TypeScript otomatis.
                </p>

                <!-- Nama Entity -->
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-1">Nama Entity</label>
                    <input v-model="entityName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: EventCategory" />
                </div>

                <!-- Normal Fields (pakai textarea) -->
                <div class="mb-6">
                    <h3 class="font-semibold text-gray-700 mb-2">Normal Fields</h3>
                    <textarea v-model="normalFieldsText" rows="4" placeholder="Contoh:\nid string\nisActive boolean"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                </div>

                <!-- Payload Fields (pakai textarea) -->
                <div class="mb-6">
                    <h3 class="font-semibold text-gray-700 mb-2">Payload Fields</h3>
                    <textarea v-model="payloadFieldsText" rows="3" placeholder="Contoh:\nname string"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                </div>
            </div>
        </div>

        <!-- KANAN -->
        <div class="md:w-1/2 w-full bg-[#1e1e1e] flex flex-col">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Type File</h2>
                <button @click="copyCode" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy
                </button>
            </div>

            <MonacoEditor v-model:value="generatedCode" language="typescript" theme="vs-dark" class="flex-grow"
                :options="{
                    readOnly: true,
                    fontSize: 13,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { generateTypeFile } from "@/utils/generateTypeFile";

const entityName = ref("EventCategory");
const normalFieldsText = ref("id string\nname string\nisActive boolean");
const payloadFieldsText = ref("name string");
const generatedCode = ref("");

function parseFields(text: string) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line) // buang baris kosong
        .map(line => {
            const [name, type] = line.split(/\s+/);
            return { name, type };
        })
        // filter baris yang tidak punya keduanya
        .filter((f): f is { name: string; type: string } => !!(f.name && f.type));
}

function generate() {
    const normalFields = parseFields(normalFieldsText.value);
    const payloadFields = parseFields(payloadFieldsText.value);

    generatedCode.value = generateTypeFile(entityName.value, normalFields, payloadFields);
}

watch([entityName, normalFieldsText, payloadFieldsText], generate, {
    deep: true,
    immediate: true,
});

function copyCode() {
    navigator.clipboard.writeText(generatedCode.value);
    alert("✅ Kode berhasil disalin!");
}
</script>
