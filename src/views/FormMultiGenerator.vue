<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- KIRI -->
        <div
            class="md:w-1/2 w-full bg-white flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    🧩 Generate Multi File
                </h2>
                <p class="text-gray-500 mb-6 text-sm">
                    Buat beberapa file sekaligus (misal Form.vue, Types.ts, dsb).
                </p>

                <!-- Entity / Form Name -->
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-1">Nama Form</label>
                    <input v-model="formName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: ContactForm" />
                </div>

                <!-- Field Example -->
                <div class="mb-6">
                    <h3 class="font-semibold text-gray-700 mb-2">Form Fields</h3>
                    <div v-for="(field, i) in fields" :key="i" class="border rounded-lg p-3 mb-3 bg-gray-50">
                        <div class="flex justify-between mb-2">
                            <h4 class="font-semibold text-gray-700 text-sm">
                                Field {{ i + 1 }}
                            </h4>
                            <button @click="removeField(i)" class="text-red-500 text-xs hover:underline">
                                ✖ Hapus
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <input v-model="field.name" placeholder="name" class="border p-2 rounded text-sm" />
                            <input v-model="field.label" placeholder="Label" class="border p-2 rounded text-sm" />
                            <input v-model="field.type" placeholder="text/textarea/number"
                                class="border p-2 rounded text-sm" />
                            <input v-model="field.placeholder" placeholder="Placeholder"
                                class="border p-2 rounded text-sm" />
                            <input v-model="field.validationMessage" placeholder="Pesan Validasi"
                                class="border p-2 rounded text-sm" />
                            <input v-model="field.class" placeholder="col-md-6 mb-5"
                                class="border p-2 rounded text-sm" />
                        </div>

                        <div class="mt-2 flex items-center">
                            <input v-model="field.required" type="checkbox"
                                class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label class="ml-2 text-sm text-gray-700">Required</label>
                        </div>
                    </div>

                    <button @click="addField" class="text-blue-600 text-sm hover:underline mt-2">
                        + Tambah Field
                    </button>
                </div>
            </div>
        </div>

        <!-- KANAN -->
        <div class="md:w-1/2 w-full bg-[#1e1e1e] flex flex-col h-screen">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Files</h2>
                <button @click="copyAll" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy All
                </button>
            </div>

            <!-- Tab Navigation -->
            <div class="flex bg-[#252526] border-b border-gray-700 overflow-x-auto">
                <button v-for="(file, i) in generatedFiles" :key="file.filename" @click="activeTab = i"
                    class="px-4 py-2 text-xs whitespace-nowrap transition-all duration-150" :class="activeTab === i
                            ? 'bg-[#1e1e1e] text-white border-t-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-200'
                        ">
                    📄 {{ file.filename }}
                </button>
            </div>

            <!-- Single File Output -->
            <div class="flex-1 relative">
                <MonacoEditor v-if="generatedFiles[activeTab]" :key="generatedFiles[activeTab].filename"
                    v-model:value="generatedFiles[activeTab].content" :language="generatedFiles[activeTab].language"
                    theme="vs-dark" class="absolute inset-0" :options="{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: 'on',
                    }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { generateFormFile } from "@/utils/generateFormFile";
import { generateTypeFile } from "@/utils/generateTypeFile";

const formName = ref("ContactForm");
const fields = ref([
    {
        name: "name",
        label: "Nama",
        type: "text",
        placeholder: "Masukkan Nama",
        validationMessage: "Nama tidak boleh kosong",
        class: "col-md-6 mb-5",
        required: true,
    },
    {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Masukkan Email",
        validationMessage: "Email tidak boleh kosong",
        class: "col-md-6 mb-5",
        required: true,
    },
]);

const generatedFiles = ref<
    { filename: string; language: string; content: string }[]
>([]);
const activeTab = ref(0);

async function generate() {
    const vueContent = generateFormFile(fields.value);
    const typeContent = generateTypeFile(
        formName.value,
        fields.value.map((f) => ({ name: f.name, type: "string" })), // contoh dummy
        fields.value.map((f) => ({ name: f.name, type: "string" }))
    );

    await nextTick();
    generatedFiles.value = [
        {
            filename: `${formName.value}.vue`,
            language: "html",
            content: vueContent,
        },
        {
            filename: `${formName.value}Types.ts`,
            language: "typescript",
            content: typeContent,
        },
    ];
}

watch([formName, fields], generate, { deep: true, immediate: true });

function addField() {
    fields.value.push({
        name: "",
        label: "",
        type: "text",
        placeholder: "",
        validationMessage: "",
        class: "col-md-6 mb-5",
        required: false,
    });
}

function removeField(i: number) {
    fields.value.splice(i, 1);
}

function copyAll() {
    const combined = generatedFiles.value
        .map((file) => `// ===== ${file.filename} =====\n${file.content}`)
        .join("\n\n");
    navigator.clipboard.writeText(combined);
    alert("✅ Semua file berhasil disalin!");
}
</script>