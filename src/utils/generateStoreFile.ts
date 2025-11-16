/**
 * Generator utilitas untuk membuat kode Pinia Store secara dinamis
 * berdasarkan nama store, prefix API, dan resource path.
 */

export function generateStoreFile(
    name: string,
    prefix: string,
    resource: string,
    columns: {
        text: string;
        sortBy: string;
        sortColumn: boolean;
        class: string;
        model?: string;
    }[] = []
): string {
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const kebabName = name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();

    // ubah awalan storeName jadi huruf kecil (camelCase)
    const camelStoreName = formattedName.charAt(0).toLowerCase() + formattedName.slice(1);

    const columnCode = columns
        .map(
            (col) =>
                `            { text: '${col.text}', sortBy: '${col.sortBy}', sortColumn: ${col.sortColumn}, class: '${col.class}' }`
        )
        .join(",\n");

    return `import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@services/api'
import type { IDataTable${formattedName}, ICreate${formattedName}Payload, IEdit${formattedName}Payload, I${formattedName} } from '@/types/${kebabName}'
import { axiosHandleError } from '@/plugins/global'

const prefix = '${prefix}'
const resource = '${resource}'

export const use${formattedName}Store = defineStore('${camelStoreName}', () => {
    // State
    const table = reactive<IDataTable${formattedName}>({
        column: [
            { text: "NO", sortBy: "id", sortColumn: true, class: "text-center" },
${columnCode},
            { text: "Aksi", sortBy: "", sortColumn: false, class: "text-center" },
        ],
        data: [],
        showPerPage: 10,
        search: '',
        order: 'asc',
        sortBy: 'id',
        totalData: 0,
        currentPage: 1,
        loading: false,
        showSearch: true,
    })

    // Actions
    function setShowPerPage(perPage: number) {
        table.showPerPage = perPage
    }

    function setCurrentPage(page: number) {
        table.currentPage = page
    }

    function setLoading(loading: boolean) {
        table.loading = loading
    }

    function setSearch(value: string) {
        table.search = value
    }

    function setData(data: I${formattedName}[]) {
        table.data = data
    }

    function setOrder(order: string) {
        table.order = order
    }

    function setSortBy(sort: string) {
        table.sortBy = sort
    }

    function setTotalData(total: number) {
        table.totalData = total
    }

    function resetTable() {
        setCurrentPage(1)
        setShowPerPage(10)
        setSearch('')
        setTotalData(0)
        setOrder('asc')
        setSortBy('id')
    }

    async function getData() {
        setLoading(true)
        try {
            const params = {
                page: table.currentPage,
                limit: table.showPerPage,
                orderBy: table.order,
                sortBy: table.sortBy,
                search: table.search
            }
            const res = await api().get(\`\${prefix}\${resource}\`, { params })
            setData(res.data.data.data)
            setTotalData(res.data.data.total)
            return res
        } catch (err) {
            setData([])
            setTotalData(0)
            axiosHandleError(err)
            return err
        } finally {
            setLoading(false)
        }
    }

    async function create(payload: ICreate${formattedName}Payload) {
        return api().post(\`\${prefix}\${resource}\`, payload)
    }

    async function show(id: string | number) {
        return api().get(\`\${prefix}\${resource}/\${id}\`)
    }

    async function update(id: string | number, payload: IEdit${formattedName}Payload) {
        return api().put(\`\${prefix}\${resource}/\${id}\`, payload)
    }

    async function changeStatus(id: string | number) {
        return api().put(\`\${prefix}\${resource}/\${id}/change-status\`)
    }
    
    async function destroy(id: string | number) {
        return api().delete(\`\${prefix}\${resource}/\${id}\`)
    }

    return {
        table,
        setShowPerPage,
        setCurrentPage,
        setLoading,
        setSearch,
        setData,
        setOrder,
        setSortBy,
        setTotalData,
        resetTable,
        getData,
        create,
        show,
        changeStatus,
        update,
        destroy,
    }
})`;
}
