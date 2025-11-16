<template>
    <div class="min-h-screen flex flex-col md:flex-row overflow-hidden">
        <!-- 🎛️ KIRI: FORM INPUT -->
        <div class="md:w-1/2 w-full bg-white flex flex-col p-10 border-b md:border-b-0 md:border-r border-gray-200">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">
                        📦 Generate Pinia Store
                    </h2>
                    <p class="text-gray-500 text-sm">
                        Isi informasi di bawah untuk generate otomatis.
                    </p>
                </div>
            </div>

            <!-- Form Input -->
            <div class="space-y-5 flex-grow overflow-auto p-2">
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Nama Store</label>
                    <input v-model="storeName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: FormSubmission" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Prefix API</label>
                    <input v-model="prefix" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="api-web" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Resource Path</label>
                    <input v-model="resource" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/form-submission" />
                </div>

                <!-- Kolom Tabel -->
                <div class="mt-6">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">🧱 Table Columns</h3>
                        <button @click="addColumn" class="text-blue-600 text-sm hover:underline">
                            + Tambah Kolom
                        </button>
                    </div>

                    <!-- ✅ draggable area -->
                    <draggable v-model="columns" item-key="id" handle=".drag-handle" animation="200"
                        ghost-class="opacity-50" class="space-y-2">
                        <template #item="{ element: col, index: i }">
                            <div
                                class="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center gap-2 border rounded p-2 bg-gray-50 hover:bg-gray-100 transition">
                                <!-- drag handle -->
                                <span class="drag-handle cursor-move text-gray-400 hover:text-gray-600 select-none"
                                    title="Geser untuk ubah urutan">
                                    ☰
                                </span>

                                <!-- text -->
                                <input v-model="col.text" placeholder="text (contoh: Nama)"
                                    class="border p-2 rounded w-full" />

                                <!-- sortBy -->
                                <input v-model="col.sortBy" placeholder="sortBy" class="border p-2 rounded w-full" />

                                <!-- sortColumn -->
                                <select v-model="col.sortColumn" class="border p-2 rounded bg-white w-full">
                                    <option :value="true">true</option>
                                    <option :value="false">false</option>
                                </select>

                                <!-- class -->
                                <input v-model="col.class" placeholder="class (contoh: text-center)"
                                    class="border p-2 rounded w-full" />

                                <!-- tombol hapus -->
                                <button @click="removeColumn(i)"
                                    class="text-red-500 hover:text-red-700 transition flex items-center justify-center px-3 py-2"
                                    title="Hapus kolom">
                                    ✖
                                </button>
                            </div>
                        </template>
                    </draggable>
                    <!-- end draggable -->
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

            <MonacoEditor v-model:value="generatedCode" language="typescript" theme="vs-dark" class="flex-grow"
                :options="{
                    readOnly: true,
                    fontSize: 13,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import MonacoEditor from "monaco-editor-vue3";
import { generateStoreFile } from "@/utils/generateStoreFile";

const storeName = ref("FormSubmission");
const prefix = ref("api-web");
const resource = ref("/form-submission");

const columns = ref([
    { id: 1, text: "NO", sortBy: "id", sortColumn: true, class: "text-center" },
    { id: 2, text: "Nama", sortBy: "name", sortColumn: true, class: "w-200px" },
    { id: 3, text: "Aksi", sortBy: "", sortColumn: false, class: "text-center" },
]);

const generatedCode = ref("");

// generate code (dengan kolom)
function generate() {
    generatedCode.value = generateStoreFile(
        storeName.value,
        prefix.value,
        resource.value,
        columns.value
    );
}

// auto-update setiap perubahan
watch([storeName, prefix, resource, columns], generate, {
    deep: true,
    immediate: true,
});

function addColumn() {
    columns.value.push({
        id: Date.now(),
        text: "",
        sortBy: "",
        sortColumn: false,
        class: "",
    });
}

function removeColumn(i: number) {
    columns.value.splice(i, 1);
}

function copyCode() {
    navigator.clipboard.writeText(generatedCode.value);
    alert("✅ Kode berhasil disalin!");
}
</script>
