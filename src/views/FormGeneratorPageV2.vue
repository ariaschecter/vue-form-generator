<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- KIRI -->
        <div
            class="md:w-1/2 w-full bg-white flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    ⚙️ Generate Form Vue
                </h2>
                <p class="text-gray-500 mb-6 text-sm">
                    Isi field di bawah ini untuk membuat template form Vue otomatis.
                </p>

                <!-- Daftar Field -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">Form Fields</h3>
                        <button @click="addField" class="text-blue-600 text-sm hover:underline">
                            + Tambah Field
                        </button>
                    </div>

                    <div v-for="(field, i) in fields" :key="i" class="border rounded-lg p-4 mb-3 bg-gray-50">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-semibold text-gray-700">Field {{ i + 1 }}</h4>
                            <button @click="removeField(i)" class="text-red-500 text-sm hover:underline">
                                ✖ Hapus
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">Name</label>
                                <input v-model="field.name" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2" placeholder="gmapsApiKey" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Label</label>
                                <input v-model="field.label" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2" placeholder="API Key" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Type</label>
                                <select v-model="field.type" class="border border-gray-300 rounded-lg w-full p-2">
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="month">Month</option>
                                    <option value="year">Year</option>
                                    <option value="time">Time</option>
                                    <option value="file">File</option>
                                    <option value="single-select">Single Select</option>
                                    <option value="multiple-select">Multiple Select</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Placeholder</label>
                                <input v-model="field.placeholder" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2"
                                    placeholder="Masukkan Google Maps API Key" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Validation Message</label>
                                <input v-model="field.validationMessage" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2"
                                    placeholder="API Key tidak boleh kosong" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Class</label>
                                <input v-model="field.class" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2" placeholder="col-md-6 mb-5" />
                            </div>
                        </div>

                        <div class="mt-3 flex items-center">
                            <input v-model="field.required" type="checkbox"
                                class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label class="ml-2 text-sm text-gray-700">Required</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- KANAN -->
        <div class="md:w-1/2 w-full bg-[#1e1e1e] flex flex-col">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Vue Code</h2>
                <button @click="copyCode" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy
                </button>
            </div>

            <MonacoEditor v-model:value="generatedCode" language="html" theme="vs-dark" class="flex-grow" :options="{
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
import { generateFormFile } from "@/utils/generateFormFile";

const fields = ref([
    {
        name: "name",
        label: "Nama",
        type: "text",
        placeholder: "Masukkan Nama",
        validationMessage: "Nama tidak boleh kosong",
        class: "col-12",
        required: true,
    },
]);

const generatedCode = ref("");

function generate() {
    generatedCode.value = `<template>${generateFormFile(fields.value)}
</template>
    `;
}

watch([fields], generate, { deep: true, immediate: true });

function addField() {
    fields.value.push({
        name: "",
        label: "",
        type: "text",
        placeholder: "",
        validationMessage: "",
        class: "col-12",
        required: true,
    });
}

function removeField(i: number) {
    fields.value.splice(i, 1);
}

function copyCode() {
    navigator.clipboard.writeText(generatedCode.value);
    alert("✅ Kode berhasil disalin!");
}
</script>
