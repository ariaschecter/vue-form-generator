import { generateFormFile } from "./generateFormFile";

export function generateNewTabFormFile(
    title: string,
    storeName: string,
    fields: {
        name: string;
        label: string;
        type: string;
        placeholder: string;
        validationMessage: string;
        class: string;
        required: boolean;
    }[]
) {
    // reactive fields
    const reactiveFields = fields
        .map(f => `    ${f.name}: '' as string,`)
        .join("\n");

    // validation rules
    const validationRules = fields
        .map(f => `        ${f.name}: { ${f.required ? "required" : ""} },`)
        .join("\n");

    // form inputs
    const formFields = generateFormFile(fields)
        .split('\n')
        .map((line, i) => (i === 0 ? line : ' '.repeat(24) + line))
        .join('\n');

    // assignments edit mode
    const editAssignments = fields
        .map(f => `        single.${f.name} = data?.${f.name}`)
        .join("\n");

    // payload
    const payload = fields
        .map(f => `        ${f.name}: single.${f.name},`)
        .join("\n");

    // camelCase store
    const camelStoreName = storeName.charAt(0).toLowerCase() + storeName.slice(1);

    // type name
    const modelType = `I${storeName}Detail`;

    return `
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';
import { axiosHandleError, initializeAppPlugins, loaderHide, loaderShow } from '@/plugins/global';
import { SelectSingle, SelectMultiple, FileUpload } from '@/components/main';

import { use${storeName}Store } from '@/stores/${camelStoreName}';
import { useRoute } from 'vue-router';
import router from '@/routes';
import { ArrowBackIcon, SaveIcon } from '@/components/icons';
import { ${modelType} } from '@/types/${camelStoreName}';
import { toast } from 'vue3-toastify';

const dataStore = use${storeName}Store();
const route = useRoute();

const flag = ref<'insert' | 'edit'>('insert');

const single = reactive({
    id: '' as string,
${reactiveFields}
});

const rules = computed(() => ({
    single: {
${validationRules}
    }
}));

const v$ = useVuelidate(rules, { single });

onMounted(() => {
    initializeAppPlugins();

    const id = typeof route.query.id === 'string' ? route.query.id : '';
    single.id = id;

    if (id) {
        flag.value = 'edit';
        detailById(id);
    }
});

const detailById = async (id: string) => {
    try {
        const response = await dataStore.show(id);
        const data = response.data.data as ${modelType};

${editAssignments}
    } catch (error) {
        axiosHandleError(error);
    }
}

async function saveData() {
    await v$.value.$validate();
    if (v$.value.$error) return;

    const payload = {
${payload}
    };

    loaderShow();
    try {
        const res =
            flag.value === 'insert' && !single.id
                ? await dataStore.create(payload)
                : await dataStore.update(single.id, payload);

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: res?.data?.meta?.message
        }).then(function () {
            router.push({ name: '${camelStoreName}-index' });
        });

    } catch (error) {
        axiosHandleError(error);
    } finally {
        loaderHide();
    }
}
</script>

<template>
    <div class="container-fluid">

        <div class="card mt-8">
            <div class="card-body">
                <div class="head d-flex align-items-center justify-content-between">
                    <div>
                        <h1>{{ single.id === '' ? 'Tambah Data Baru untuk ${title}' : 'Edit Data ${title}' }}</h1>
                        <span class="text-muted">{{ single.id === '' ?
                            \`Masukkan informasi untuk data baru\` :
                            \`Perbarui informasi agar tetap akurat.\`
                        }}</span>
                    </div>
                    <div class="d-flex justify-content-end mt-8 me-8 gap-3">
                        <button class="btn btn-secondary btn-sm text-black" type="button"
                            @click="\$router.push({ name: '${camelStoreName}-index' })">
                            <ArrowBackIcon />
                            &ensp;Kembali
                        </button>
                        <button class="btn btn-primary btn-sm text-white" type="button" @click="saveData()">
                            <SaveIcon />
                            &ensp;Simpan Data
                        </button>
                    </div>
                </div>

                <div class="form-group mt-5">
                    <div class="row">

${formFields}


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: #3F4254;
}

.card-desc {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #7E8299;
}
</style>
`;
}
