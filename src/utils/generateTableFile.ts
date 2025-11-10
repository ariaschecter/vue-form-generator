import { generateFormFile } from "./generateFormFile";

export function generateTableBase(
    title: string,
    storeName: string,
    columns: {
        text: string;
        sortBy: string;
        sortColumn: boolean;
        class: string;
        model: string;
    }[] = [],
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
    // generate isi reactive `single`
    const reactiveFields = fields
        .map((f) => `    ${f.name}: '' as ${f.type === 'number' ? 'number' : 'string'},`)
        .join("\n");

    // generate validation rules
    const validationRules = fields
        .map((f) => `        ${f.name}: { required },`)
        .join("\n");

    // generate payload content
    const payloadContent = fields
        .map((f) => `        ${f.name}: single.${f.name},`)
        .join("\n");

    // generate edit data assignment
    const editAssignments = fields
        .map((f) => `        single.${f.name} = data.${f.name}`)
        .join("\n");

    // generate reset() clear
    const resetFields = fields
        .map((f) => `    single.${f.name} = '';`)
        .join("\n");

    // generate list data table
    const listTableColumn = columns
        .map((c) => `                                        <td class="text-center">{{ context.${c.model} }}</td>`)
        .join("\n");

    // ubah awalan storeName jadi huruf kecil (camelCase)
    const camelStoreName = storeName.charAt(0).toLowerCase() + storeName.slice(1);

    const kebabStoreName = storeName
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();


    const generatedFormFields = generateFormFile(fields)
        .split('\n')
        .map((line, i) => (i === 0 ? line : ' '.repeat(12) + line))
        .join('\n');

    return `<script setup lang="ts">
import { onMounted, reactive, watch, ref, computed } from 'vue';
import { use${storeName}Store } from "@/stores/${camelStoreName}";
import { CustomModal, DataTable, ModalBody, ModalFooter, SelectSingle } from '@/components/main';
import { axiosHandleError, initializeAppPlugins, loaderHide, loaderShow } from '@/plugins/global';
import { ISelectOption } from '@/types/global';
import { useSelectListStore } from '@/stores/selectList';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';
import { CloseIcon, EditIcon, TrashIcon } from '@/components/icons';
import { I${storeName}Detail } from '@/types/${kebabStoreName}';

const dataStore = use${storeName}Store();
const selectListStore = useSelectListStore();

const modalForm = ref<InstanceType<typeof CustomModal> | null>(null);
const flag = ref<'insert' | 'edit'>('insert');

const single = reactive({
    id: '' as string,
${reactiveFields}
})

const rules = computed(() => ({
    single: {
${validationRules}
    }
}));

const v$ = useVuelidate(rules, { single });

onMounted(() => {
    initializeAppPlugins();
    getTableData();
});

const getTableData = (isFilter: boolean = false) => {
    if (isFilter) {
        // ex: dataStore.table.filter!.type_contract_id = single.contract?.id ?? ''
    }

    dataStore.resetTable()
    dataStore.getData()
}

const showModalAdd = () => {
    reset();
    modalForm.value?.show();
}

const saveData = async () => {
    await v$.value.$validate();
    if (v$.value.$error) return;
    const payload = {
${payloadContent}
    };
    loaderShow()
    try {
        const res =
            flag.value === 'insert' && !single.id
                ? await dataStore.create(payload)
                : await dataStore.update(single.id, payload);

        modalForm.value?.hide();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: res?.data?.meta?.message
        })

        dataStore.setCurrentPage(1);
        dataStore.getData()
    } catch (error) {
        axiosHandleError(error)
    } finally {
        loaderHide()
    }
}

const edit = async (id: string | number) => {
    try {
        loaderShow()

        const res = await dataStore.show(id);
        const data = res.data.data as I${storeName}Detail

        reset();

        flag.value = 'edit';
        single.id = data.id;
${editAssignments}

        modalForm.value?.show();
    } catch (error) {
        axiosHandleError(error)
    } finally {
        loaderHide()
    }
}

const showModalDelete = async (id: string | number) => {
    Swal.fire({
        title: 'Anda yakin akan hapus data?',
        text: "Data tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F64E60',
        cancelButtonColor: '#ddd',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
    }).then(async (result) => {
        if (result.isConfirmed) {
            loaderShow();
            const res = await dataStore.destroy(id);
            loaderHide();

            toast.info(res.data.meta.message);

            dataStore.resetTable();
            dataStore.getData();
        }
    });
}

function reset() {
    v$.value.$reset();
    flag.value = 'insert';
    single.id = '';
${resetFields}
}

// jika ingin setiap ganti select list langsung filter
// watch(
//     () => [single.contract, single.supplier],
//     () => {
//         dataStore.table.filter!.type_contract_id = single.contract?.id ?? ''
//         dataStore.table.filter!.supplier_id = single.supplier?.id ?? ''
//
//         dataStore.resetTable() 
//         dataStore.getData()
//     },
//     { deep: true }
// )
</script>

<template>
    <div class="container-fluid">
        <div class="card mt-8">
            <div class="card-body">
                <div class="card card-flush  mb-5 mb-xl-10" id="kt_profile_details_view">
                    <div class="card card-xl-stretch mb-5 mb-xl-8">
                        <div class="card-header p-0 border-0 align-items-center">
                            <div class="align-items-start flex-column">
                                <p class="card-label mb-2 p-0">${title}</p>
                                <p class="card-desc p-0">Berikut Merupakan ${title}</p>
                            </div>
                            <button type="button" class="btn h-50 btn-primary text-white" @click="showModalAdd">
                                Tambah Data
                            </button>
                        </div>

                        <div class="card-body p-0 pt-5">
                            <DataTable :config="dataStore.table" @get-data="dataStore.getData"
                                @set-order="(order: string) => dataStore.setOrder(order)"
                                @set-page="(page: number) => dataStore.setCurrentPage(page)"
                                @set-search="(search: string) => dataStore.setSearch(search)"
                                @set-show-per-page="(showPerPage: number) => dataStore.setShowPerPage(showPerPage)"
                                @set-sort-by="(sortBy: string) => dataStore.setSortBy(sortBy)" :is-from-store="true">
                                <template v-slot:body>
                                    <tr v-for="(context, index) in dataStore.table.data" :key="context.id">
                                        <td class="text-center">
                                            {{ (dataStore.table.currentPage - 1) * dataStore.table.showPerPage +
                                                index + 1 }}
                                        </td>
${listTableColumn}
                                        <td class="text-center">
                                            <div class="dropdown" style="position:static">
                                                <a class="btn btn-sm btn-secondary dropdown-toggle" href="#"
                                                    role="button" id="dropdownMenuLink" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    Aksi
                                                </a>

                                                <ul class="dropdown-menu dropdown-menu-end"
                                                    aria-labelledby="dropdownMenuLink">
                                                    <li>
                                                        <button class="dropdown-item" @click="edit(context?.id)">
                                                            <span class="svg-icon svg-icon-primary svg-icon-1">
                                                                <EditIcon />
                                                            </span>
                                                            Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button class="dropdown-item"
                                                            @click="showModalDelete(context?.id)">
                                                            <span class="svg-icon svg-icon-danger svg-icon-2x">
                                                                <TrashIcon />
                                                            </span>
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CustomModal ref="modalForm" :title="\`\${flag === 'insert' ? 'Tambah Data ${title}' : 'Edit Data ${title}'}\`" :subtitle="\`Silahkan lengkapi form berikut untuk
                \${flag === 'insert' ? 'menambah' : 'memperbarui'} data\`" size="">
            <ModalBody>
${generatedFormFields}
            </ModalBody>
            <ModalFooter>
                <button type="button" class="btn btn-light text-gray-700" data-bs-dismiss="modal">Batal</button>
                <button class="btn bg-app-primary" type="button" @click="saveData">
                    <span class="indicator-label text-white">Simpan Data</span>
                </button>
            </ModalFooter>
        </CustomModal>
    </div>
</template>

<style scoped>
.card-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 22px;
    line-height: 35px;
    letter-spacing: -0.22px;
    color: #3F4254;
}

.card-desc {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #7E8299;
}
</style>`;
}
