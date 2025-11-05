<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- KIRI -->
    <div
      class="md:w-1/2 w-full bg-white flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-gray-200"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          📄 Generate Type File
        </h2>
        <p class="text-gray-500 mb-6 text-sm">
          Isi field untuk membuat interface TypeScript otomatis.
        </p>

        <!-- Nama Entity -->
        <div class="mb-5">
          <label class="block font-semibold text-gray-700 mb-1"
            >Nama Entity</label
          >
          <input
            v-model="entityName"
            type="text"
            class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Contoh: EventCategory"
          />
        </div>

        <!-- Normal Fields -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700">Normal Fields</h3>
            <button
              @click="addNormalField"
              class="text-blue-600 text-sm hover:underline"
            >
              + Tambah Field
            </button>
          </div>
          <div
            v-for="(field, i) in normalFields"
            :key="i"
            class="flex gap-2 mb-2"
          >
            <input
              v-model="field.name"
              placeholder="name"
              class="border p-2 rounded w-1/2"
            />
            <input
              v-model="field.type"
              placeholder="string"
              class="border p-2 rounded w-1/2"
            />
            <button @click="removeNormalField(i)" class="text-red-500">
              ✖
            </button>
          </div>
        </div>

        <!-- Payload Fields -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700">Payload Fields</h3>
            <button
              @click="addPayloadField"
              class="text-blue-600 text-sm hover:underline"
            >
              + Tambah Field
            </button>
          </div>
          <div
            v-for="(field, i) in payloadFields"
            :key="i"
            class="flex gap-2 mb-2"
          >
            <input
              v-model="field.name"
              placeholder="name"
              class="border p-2 rounded w-1/2"
            />
            <input
              v-model="field.type"
              placeholder="string"
              class="border p-2 rounded w-1/2"
            />
            <button @click="removePayloadField(i)" class="text-red-500">
              ✖
            </button>
          </div>
        </div>

        <!-- <button
          @click="generate"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm w-full"
        >
          🚀 Generate
        </button> -->
      </div>
    </div>

    <!-- KANAN -->
    <div class="md:w-1/2 w-full bg-[#1e1e1e] flex flex-col">
      <div
        class="px-5 py-3 border-b border-gray-700 flex items-center justify-between bg-[#252526]"
      >
        <h2 class="text-sm font-semibold text-gray-100">
          🧠 Preview Type File
        </h2>
        <button
          @click="copyCode"
          class="text-xs text-gray-300 hover:text-white transition-all duration-150"
        >
          📋 Copy
        </button>
      </div>

      <MonacoEditor
        v-model:value="generatedCode"
        language="typescript"
        theme="vs-dark"
        class="flex-grow"
        :options="{
          readOnly: true,
          fontSize: 13,
          minimap: { enabled: false },
          wordWrap: 'on',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { generateTypeFile } from "@/utils/generateTypeFile";

const entityName = ref("EventCategory");
const normalFields = ref([
  { name: "id", type: "string" },
  { name: "name", type: "string" },
  { name: "isActive", type: "boolean" },
]);
const payloadFields = ref([{ name: "name", type: "string" }]);
const generatedCode = ref("");

// 🧩 Fungsi generator
function generate() {
  generatedCode.value = generateTypeFile(
    entityName.value,
    normalFields.value,
    payloadFields.value
  );
}

// 🧠 Auto-generate setiap perubahan
watch([entityName, normalFields, payloadFields], generate, {
  deep: true, // biar nested array/object juga ke-detect
  immediate: true, // langsung generate di awal
});

function addNormalField() {
  normalFields.value.push({ name: "", type: "" });
}
function removeNormalField(i: number) {
  normalFields.value.splice(i, 1);
}
function addPayloadField() {
  payloadFields.value.push({ name: "", type: "" });
}
function removePayloadField(i: number) {
  payloadFields.value.splice(i, 1);
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value);
  alert("✅ Kode berhasil disalin!");
}
</script>
