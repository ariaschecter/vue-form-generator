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
                <div class="flex gap-3">
                    <!-- COPY BUTTON -->
                    <button
                        class="px-4 py-2 rounded-lg bg-slate-600 text-white flex items-center gap-2  hover:bg-slate-700 active:bg-slate-800 transition cursor-pointer"
                        @click="copySingle">
                        <Copy class="w-4 h-4" />
                        Copy
                    </button>

                    <!-- IMPORT BUTTON -->
                    <button
                        class="px-4 py-2 rounded-lg bg-cyan-600 text-white flex items-center gap-2 hover:bg-cyan-700 active:bg-cyan-800 transition cursor-pointer"
                        @click="openModalImport">
                        <Import class="w-4 h-4" />
                        Import
                    </button>
                </div>

            </div>

            <div class="space-y-5 flex-grow p-2">
                <!-- 🔹 Judul Form -->
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Judul Form</label>
                    <input v-model="single.formTitle" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: Riwayat Pembelian" />
                </div>

                <hr class="my-4">

                <!-- 🔹 Store Information -->
                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Nama Store</label>
                    <input v-model="single.storeName" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: FormSubmission" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Prefix API</label>
                    <input v-model="single.prefix" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="api-web" />
                </div>

                <div>
                    <label class="block font-semibold text-gray-700 mb-1">Resource Path</label>
                    <input v-model="single.resource" type="text"
                        class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="/form-submission" />
                </div>

                <hr class="my-4">

                <!-- 🔹 FORM FIELD GENERATOR -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">🧱 Form Fields</h3>
                    </div>

                    <div v-for="(field, i) in single.fields" :key="i"
                        class="border rounded-lg p-4 mb-3 bg-gray-50 hover:bg-gray-100 transition">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-semibold text-gray-700">Field {{ i + 1 }}</h4>
                            <div class="flex space-x-2">
                                <div class="p-1 flex space-x-2 me-5">
                                    <!-- Move Up -->
                                    <button @click="moveUp(i)" v-if="single.fields.length > 1 && i != 0"
                                        class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer"
                                        title="Pindah ke atas">
                                        <MoveUp class="w-4 h-4 text-slate-700" />
                                    </button>

                                    <!-- Move Down -->
                                    <button @click="moveDown(i)"
                                        v-if="single.fields.length > 1 && i != single.fields.length - 1"
                                        class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer"
                                        title="Pindah ke bawah">
                                        <MoveDown class="w-4 h-4 text-slate-700" />
                                    </button>
                                </div>

                                <button @click="duplicateField(i)"
                                    class="text-blue-500 text-sm hover:underline cursor-pointer">
                                    <Copy />
                                </button>
                                <button @click="removeField(i)" v-if="single.fields.length > 1"
                                    class="text-red-500 text-sm hover:underline cursor-pointer">
                                    <Trash2 />
                                </button>
                            </div>
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
                                    <option value="date-range">Daterange</option>
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
                                    class="border border-gray-300 rounded-lg w-full p-2" placeholder="disabled"
                                    disabled />
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-1">Class</label>
                                <input v-model="field.class" type="text"
                                    class="border border-gray-300 rounded-lg w-full p-2" placeholder="col-md-6 mb-5" />
                            </div>
                        </div>

                        <div class="mt-3 flex items-center">
                            <input v-model="field.required" type="checkbox" :id="'required-' + i"
                                class="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer" />
                            <label :for="'required-' + i"
                                class="ml-2 text-sm text-gray-700 cursor-pointer">Required</label>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button @click="addField" class="text-slate-700 text-sm hover:underline cursor-pointer">
                            + Tambah Field
                        </button>
                    </div>
                </div>

                <hr class="my-4">

                <!-- 🔹 Kolom Tabel -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">🧱 Table Columns</h3>
                    </div>

                    <draggable v-model="single.columns" item-key="id" handle=".drag-handle" animation="200"
                        ghost-class="opacity-50" class="space-y-2">
                        <template #item="{ element: col, index: i }">
                            <div
                                class="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto_auto] items-center gap-2 border rounded p-2 bg-gray-50 hover:bg-gray-100 transition">
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
                                <button @click="duplicateColumn(i)"
                                    class="text-blue-500 hover:text-blue-700 transition flex items-center justify-center cursor-pointer"
                                    title="Hapus kolom">
                                    <Copy />
                                </button>
                                <button @click="removeColumn(i)" v-if="single.columns.length > 1"
                                    class="text-red-500 hover:text-red-700 transition flex items-center justify-center cursor-pointer"
                                    title="Hapus kolom">
                                    <X />
                                </button>
                            </div>
                        </template>
                    </draggable>

                    <div class="flex justify-end mt-3">
                        <button @click="addColumn" class="text-slate-700 text-sm hover:underline cursor-pointer">
                            + Tambah Kolom
                        </button>
                    </div>
                </div>

                <hr class="my-4">

                <!-- 🔹 Types Section -->
                <div>
                    <h3 class="font-semibold text-gray-700 mb-2">🧩 Types Generator</h3>

                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-1">Normal Fields</label>
                        <textarea v-model="single.normalFieldsText" rows="10"
                            placeholder="Contoh:\nid string\nname string"
                            class="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"></textarea>
                    </div>

                    <div>
                        <label class="block font-semibold text-gray-700 mb-1">Payload Fields (Types)</label>
                        <textarea v-model="single.payloadFieldsTextType" rows="10" placeholder="Contoh:\nname string"
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
                <MonacoEditor v-if="currentFileContent" :value="currentFileContent" :language="currentFileLanguage"
                    theme="vs-dark" class="absolute inset-0" :options="{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: 'off',
                        automaticLayout: true,
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
                <MonacoEditor v-if="currentFileContent" :value="currentFileContent" :language="currentFileLanguage"
                    theme="vs-dark" class="absolute inset-0" :options="{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        wordWrap: 'off',
                        automaticLayout: true,
                    }" />
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-xl w-[67%] p-6">
                <h2 class="text-xl font-semibold mb-4">Import JSON</h2>

                <!-- Textarea JSON -->
                <textarea ref="jsonInputRef" v-model="jsonInput"
                    class="w-full h-[50vh] border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tempelkan JSON di sini..." autofocus></textarea>

                <!-- Action buttons -->
                <div class="mt-5 flex justify-end gap-3">
                    <button class="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100" @click="closeModal">
                        Batal
                    </button>

                    <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="importJson">
                        Import
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed, reactive, toRaw } from "vue";
import draggable from "vuedraggable";
import MonacoEditor from "monaco-editor-vue3";
import { generateTableBase } from "@/utils/generateTableFile";
import { generateStoreFile } from "@/utils/generateStoreFile";
import { generateTypeFile } from "@/utils/generateTypeFile";
import { generateNewTabFormFile } from "@/utils/generateNewTabFormFile";
import { Copy, Import, MoveDown, MoveUp, Trash2, X } from "lucide-vue-next";
import type { IColumn } from "@/types";
import { toast } from "vue3-toastify";

const isOpen = ref(false);
const jsonInput = ref("");
const jsonInputRef = ref<HTMLTextAreaElement | null>(null);

interface ISingle {
    formTitle: string;
    storeName: string;
    prefix: string;
    resource: string;
    columns: IColumn[];
    fields: Field[];
    normalFieldsText: string;
    payloadFieldsTextType: string;
}

function toSingleLineJSON(obj: any): string {
    const indentUnit = "  ";

    function isPlainObject(v: any) {
        return typeof v === "object" && v !== null && !Array.isArray(v);
    }

    function build(value: any, indentLevel = 0): string {
        const indent = indentUnit.repeat(indentLevel);

        // Array handling
        if (Array.isArray(value)) {
            if (value.length === 0) return "[]";

            const allPlain = value.every((el) => isPlainObject(el));
            if (allPlain) {
                // each object in one line
                const lines = value.map((it) => {
                    const singleLine = JSON.stringify(it);
                    return indentUnit.repeat(indentLevel + 1) + singleLine;
                });
                return "[\n" + lines.join(",\n") + "\n" + indent + "]";
            }

            // mixed arrays: recurse
            const lines = value.map((it) => indentUnit.repeat(indentLevel + 1) + build(it, indentLevel + 1));
            return "[\n" + lines.join(",\n") + "\n" + indent + "]";
        }

        // Object handling
        if (isPlainObject(value)) {
            const keys = Object.keys(value);
            if (keys.length === 0) return "{}";
            const props = keys.map((k) => {
                const v = value[k];
                return `${indentUnit.repeat(indentLevel + 1)}"${k}": ${build(v, indentLevel + 1)}`;
            });
            return "{\n" + props.join(",\n") + "\n" + indent + "}";
        }

        // primitives
        return JSON.stringify(value);
    }

    return build(obj, 0);
}

function isEmptyRow(row: Record<string, any>): boolean {
    return Object.values(row).every((v) => {
        if (v === null || v === undefined) return true;
        if (typeof v === "string") return v.trim() === "";
        if (typeof v === "number") return v === 0;
        if (typeof v === "boolean") return v === false;
        if (Array.isArray(v)) return v.length === 0;
        if (typeof v === "object") return Object.keys(v).length === 0;
        return false;
    });
}

const copySingle = (): void => {
    let raw: any;

    try {
        raw = typeof toRaw === "function" ? toRaw(single) : JSON.parse(JSON.stringify(single));
    } catch {
        try {
            // @ts-ignore structuredClone may or may not exist
            raw = typeof structuredClone === "function" ? structuredClone(single) : JSON.parse(JSON.stringify(single));
        } catch {
            raw = JSON.parse(JSON.stringify(single));
        }
    }

    // hapus row kosong pada columns & fields (jika array)
    if (Array.isArray(raw.columns)) {
        raw.columns = raw.columns.filter((c: any) => !isEmptyRow(c));
    }
    if (Array.isArray(raw.fields)) {
        raw.fields = raw.fields.filter((f: any) => !isEmptyRow(f));
    }

    const payload = toSingleLineJSON(raw);

    navigator.clipboard.writeText(payload)
        .then(() => {
            toast?.success?.("payload berhasil disalin!");
        })
        .catch((err) => {
            console.error("clipboard error:", err);
            toast?.error?.("Gagal menyalin payload");
        });
};

const openModalImport = () => {
    isOpen.value = true;

    // tunggu DOM render → baru fokus
    nextTick(() => {
        jsonInputRef.value?.focus();
    });
};

const closeModal = () => {
    jsonInput.value = "";
    isOpen.value = false;
};

const importJson = () => {
    try {
        const parsed = JSON.parse(jsonInput.value) as Partial<ISingle>;

        (Object.keys(parsed) as (keyof ISingle)[]).forEach(key => {
            const value = parsed[key];

            if (value === undefined) return; // skip undef

            // Jika array
            if (Array.isArray(single[key]) && Array.isArray(value)) {
                single[key] = [...value] as any;
                return;
            }

            // Jika object tapi bukan array
            if (
                typeof single[key] === "object" &&
                single[key] !== null &&
                !Array.isArray(single[key]) &&
                typeof value === "object"
            ) {
                Object.assign(single[key] as any, value);
                return;
            }

            // Primitive value
            single[key] = value as any;
        });

        toast.success("Import JSON berhasil!")
        closeModal();
    } catch (err) {
        toast.error("JSON tidak valid!");
    }
};


onMounted(() => {
    addColumn();
})

const single = reactive({
    formTitle: '' as string,
    storeName: 'Employee' as string,
    prefix: 'api-web' as string,
    resource: '/employee' as string,
    columns: [
        { id: 1, text: "Nama", sortBy: "name", sortColumn: true, class: "w-200px", model: 'name' }
    ] as IColumn[],
    fields: [
        {
            name: "name",
            label: "Nama",
            type: "text",
            placeholder: "Masukkan Nama",
            validationMessage: "",
            class: "col-12",
            required: true,
        }
    ] as Field[],
    normalFieldsText: "id string\nname string\n",
    payloadFieldsTextType: "name string\n",
} as ISingle);

interface Field {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    validationMessage: string;
    class: string;
    required: boolean;
}

// TAB FILES
const generatedFiles = ref<{ filename: string; language: string; content: string }[]>([]);
const activeTab = ref(0);

// ========== COMPUTED FOR MONACO ==========
const currentFileContent = computed(() => {
    const file = generatedFiles.value[activeTab.value];
    return file ? file.content : '';
});

const currentFileLanguage = computed(() => {
    const file = generatedFiles.value[activeTab.value];
    return file ? file.language : 'typescript';
});

// ========== PARSER ==========
function parseFields(text: string) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
            const [name, type] = line.split(/\s+/);
            return {
                name: name ?? "",
                type: type ?? "string",
            };
        })
        .filter(f => f.name !== "");
}


// ========== GENERATE ==========
async function generate() {
    const indexCode = generateTableBase(single.formTitle, single.storeName, single.columns, single.fields);
    const storeCode = generateStoreFile(single.storeName, single.prefix, single.resource, single.columns);

    const normalFields = parseFields(single.normalFieldsText);
    const payloadFields = parseFields(single.payloadFieldsTextType);
    const typeCode = generateTypeFile(single.storeName, normalFields, payloadFields);
    const newFormTab = generateNewTabFormFile(single.formTitle, single.storeName, single.fields);

    await nextTick();
    generatedFiles.value = [
        { filename: `index.vue`, language: "html", content: indexCode },
        { filename: `form.vue`, language: "html", content: newFormTab },
        { filename: `store.ts`, language: "typescript", content: storeCode },
        { filename: `type.ts`, language: "typescript", content: typeCode },
    ];
}

// ========== WATCH ==========
watch(
    [single],
    generate,
    { deep: true, immediate: true }
);

// ========== HELPERS ==========
function addColumn() {
    single.columns.push({ id: Date.now(), text: "", sortBy: "", sortColumn: false, class: "", model: "" });
}
function removeColumn(i: number) {
    single.columns.splice(i, 1);
}

function duplicateColumn(i: number) {
    const original = single.columns[i];
    const duplicated = {
        id: Date.now(),
        text: original?.text ?? '',
        sortBy: original?.sortBy ?? '',
        sortColumn: original?.sortColumn ?? false,
        class: original?.class ?? '',
        model: original?.model ?? '',
    };
    single.columns.push(duplicated);
}

function addField() {
    single.fields.push({
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
    single.fields.splice(i, 1);
}

function duplicateField(i: number) {
    const original = single.fields[i];
    const duplicated = {
        name: original?.name ?? '',
        label: original?.label ?? '',
        type: original?.type ?? '',
        placeholder: original?.placeholder ?? '',
        validationMessage: original?.validationMessage ?? '',
        class: original?.class ?? '',
        required: original?.required ?? true,
    };
    single.fields.push(duplicated);
}

function moveUp(index: number) {
    if (index === 0) return;
    const temp = single.fields[index];
    const prev = single.fields[index - 1];
    if (!temp || !prev) return; // Guard clause
    single.fields[index] = prev;
    single.fields[index - 1] = temp;
}

function moveDown(index: number) {
    if (index === single.fields.length - 1) return;
    const temp = single.fields[index];
    const next = single.fields[index + 1];
    if (!temp || !next) return; // Guard clause
    single.fields[index] = next;
    single.fields[index + 1] = temp;
}

function copyAll() {
    const combined = generatedFiles.value
        .map(file => `// ===== ${file.filename} =====\n${file.content}`)
        .join("\n\n");
    navigator.clipboard.writeText(combined);
    toast.success("Semua file berhasil disalin!")
}
</script>