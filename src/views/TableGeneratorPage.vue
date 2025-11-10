<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- 🎛️ KIRI: FORM INPUT -->
        <div
            class="md:w-3/5 w-full bg-white flex flex-col p-10 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto md:h-screen">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">
                        🧩 Generate Vue Form + Pinia Store + Types
                    </h2>
                    <p class="text-gray-500 text-sm">
                        Isi informasi di bawah untuk membuat form, store, & type otomatis.
                    </p>
                </div>
            </div>

            <div class="space-y-5 flex-grow p-2">
                <!-- 🔹 Judul Form -->
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Judul Form</label>
                    <input v-model="formTitle" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: Riwayat Pembelian" />
                </div>

                <hr class="my-4">

                <!-- 🔹 Store Information -->
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Nama Store</label>
                    <input v-model="storeName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: FormSubmission" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Prefix API</label>
                    <input v-model="prefix" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="api-web" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Resource Path</label>
                    <input v-model="resource" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="/form-submission" />
                </div>

                <hr class="my-4">

                <!-- 🔹 FORM FIELD GENERATOR -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">🧱 Form Fields</h3>
                        <button @click="addField" class="text-blue-600 text-sm hover:underline">
                            + Tambah Field
                        </button>
                    </div>

                    <div v-for="(field, i) in fields" :key="i"
                        class="border rounded-lg p-4 mb-3 bg-gray-50 hover:bg-gray-100 transition">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-semibold text-gray-700">Field {{ i + 1 }}</h4>
                            <button @click="removeField(i)" class="text-red-500 text-sm hover:underline">✖
                                Hapus</button>
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
                                    <option value="radio">Radio</option>
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

                <hr class="my-4">

                <!-- 🔹 Kolom Tabel -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">🧱 Table Columns</h3>
                        <button @click="addColumn" class="text-blue-600 text-sm hover:underline">
                            + Tambah Kolom
                        </button>
                    </div>

                    <draggable v-model="columns" item-key="id" handle=".drag-handle" animation="200"
                        ghost-class="opacity-50" class="space-y-2">
                        <template #item="{ element: col, index: i }">
                            <div
                                class="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 border rounded p-2 bg-gray-50 hover:bg-gray-100 transition">
                                <span class="drag-handle cursor-move text-gray-400 hover:text-gray-600 select-none"
                                    title="Geser urutan">☰</span>
                                <input v-model="col.text" placeholder="text (contoh: Nama)"
                                    class="border p-2 rounded w-full" />
                                <input v-model="col.sortBy" placeholder="sortBy" class="border p-2 rounded w-full" />
                                <select v-model="col.sortColumn" class="border p-2 rounded bg-white w-full">
                                    <option :value="true">true</option>
                                    <option :value="false">false</option>
                                </select>
                                <input v-model="col.class" placeholder="class (contoh: text-center)"
                                    class="border p-2 rounded w-full" />
                                <input v-model="col.model" placeholder="model (contoh: name)"
                                    class="border p-2 rounded w-full" />
                                <button @click="removeColumn(i)"
                                    class="text-red-500 hover:text-red-700 transition flex items-center justify-center px-3 py-2"
                                    title="Hapus kolom">✖</button>
                            </div>
                        </template>
                    </draggable>
                </div>

                <hr class="my-4">

                <!-- 🔹 Types Section -->
                <div>
                    <h3 class="font-semibold text-gray-700 mb-2">🧩 Types Generator</h3>

                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-1">Normal Fields</label>
                        <textarea v-model="normalFieldsText" rows="4" placeholder="Contoh:\nid string\nname string"
                            class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">Payload Fields (Types)</label>
                        <textarea v-model="payloadFieldsTextType" rows="3" placeholder="Contoh:\nname string"
                            class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🧾 KANAN: PREVIEW DENGAN TAB (FIXED) -->
        <div
            class="hidden md:flex flex-col bg-[#1e1e1e] fixed top-0 right-0 w-[40%] h-screen border-l border-gray-800 z-40">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Files</h2>
                <button @click="copyAll" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy All
                </button>
            </div>

            <div class="flex bg-[#252526] border-b border-gray-700 overflow-x-auto">
                <button v-for="(file, i) in generatedFiles" :key="file.filename" @click="activeTab = i"
                    class="px-4 py-2 text-xs whitespace-nowrap transition-all duration-150" :class="activeTab === i
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-blue-500'
                        : 'text-gray-400 hover:text-gray-200'">
                    📄 {{ file.filename }}
                </button>
            </div>

            <div class="flex-1 relative">
                <MonacoEditor v-if="generatedFiles[activeTab]" :key="generatedFiles[activeTab].filename"
                    v-model:value="generatedFiles[activeTab].content" :language="generatedFiles[activeTab].language"
                    theme="vs-dark" class="absolute inset-0" :options="{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: 'off',
                    }" />
            </div>
        </div>

        <!-- 🧾 MOBILE PREVIEW (bawah) -->
        <div class="md:hidden w-full bg-[#1e1e1e] flex flex-col mt-5">
            <div class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]">
                <h2 class="text-sm font-semibold text-gray-100">🧠 Preview Files</h2>
                <button @click="copyAll" class="text-xs text-gray-300 hover:text-white transition-all duration-150">
                    📋 Copy All
                </button>
            </div>

            <!-- File Tabs -->
            <div class="flex bg-[#252526] border-b border-gray-700 overflow-x-auto">
                <button v-for="(file, i) in generatedFiles" :key="file.filename" @click="activeTab = i"
                    class="px-4 py-2 text-xs whitespace-nowrap transition-all duration-150" :class="activeTab === i
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-blue-500'
                        : 'text-gray-400 hover:text-gray-200'">
                    📄 {{ file.filename }}
                </button>
            </div>

            <div class="relative h-[70vh]">
                <MonacoEditor v-if="generatedFiles[activeTab]" :key="generatedFiles[activeTab].filename"
                    v-model:value="generatedFiles[activeTab].content" :language="generatedFiles[activeTab].language"
                    theme="vs-dark" class="absolute inset-0" :options="{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: 'off',
                    }" />
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import draggable from "vuedraggable";
import MonacoEditor from "monaco-editor-vue3";
import { generateTableBase } from "@/utils/generateTableFile";
import { generatePiniaFull } from "@/utils/generatePiniaFull";
import { generateTypeFile } from "@/utils/generateTypeFile";

// ========== STATE ==========
const formTitle = ref("Karyawan");
const storeName = ref("Employee");
const prefix = ref("api-web");
const resource = ref("/employee");
const columns = ref([{ id: 1, text: "Nama", sortBy: "name", sortColumn: true, class: "w-200px", model: 'name' }]);
const normalFieldsText = ref("id string\nname string\nposition string");
const payloadFieldsTextType = ref("name string\nposition string");


onMounted(() => {
    addColumn();
})

// 🔹 Tambahan: Form Fields
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

// TAB FILES
const generatedFiles = ref<{ filename: string; language: string; content: string }[]>([]);
const activeTab = ref(0);

// ========== PARSER ==========
function parseFields(text: string) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
            const [name, type] = line.split(/\s+/);
            return { name, type };
        })
        .filter(f => f.name && f.type);
}

// ========== GENERATE ==========
async function generate() {
    const indexCode = generateTableBase(formTitle.value, storeName.value, columns.value, fields.value);
    const storeCode = generatePiniaFull(storeName.value, prefix.value, resource.value, columns.value);

    const normalFields = parseFields(normalFieldsText.value);
    const payloadFields = parseFields(payloadFieldsTextType.value);
    const typeCode = generateTypeFile(storeName.value, normalFields, payloadFields);

    await nextTick();
    generatedFiles.value = [
        { filename: `index.vue`, language: "html", content: indexCode },
        { filename: `store.ts`, language: "typescript", content: storeCode },
        { filename: `type.ts`, language: "typescript", content: typeCode },
    ];
}

// ========== WATCH ==========
watch(
    [formTitle, storeName, prefix, resource, columns, normalFieldsText, payloadFieldsTextType, fields],
    generate,
    { deep: true, immediate: true }
);

// ========== HELPERS ==========
function addColumn() {
    columns.value.push({ id: Date.now(), text: "", sortBy: "", sortColumn: false, class: "", model: "" });
}
function removeColumn(i: number) {
    columns.value.splice(i, 1);
}
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
function copyAll() {
    const combined = generatedFiles.value
        .map(file => `// ===== ${file.filename} =====\n${file.content}`)
        .join("\n\n");
    navigator.clipboard.writeText(combined);
    alert("✅ Semua file berhasil disalin!");
}
</script>
