/**
 * Generator template Vue form berdasarkan input field dan tipe field.
 * Lebih efisien: label satu kali, bagian field dinamis, required hanya di label.
 */
export function generateFormFile(
    fields: {
        name: string;
        label: string;
        type: string;
        placeholder: string;
        validationMessage: string;
        class: string;
        required: boolean;
    }[]
): string {
    const renderInputByType = (f: any) => {
        switch (f.type) {
            case "textarea":
                return `
    <textarea
        v-model="single.${f.name}"
        id="${f.name}"
        class="form-control"
        rows="5"
        placeholder="${f.placeholder}"
    />`;

            case "number":
                return `
    <input
        v-model="single.${f.name}"
        type="number"
        id="${f.name}"
        class="form-control"
        placeholder="${f.placeholder}"
    />`;

            case "date":
            case "date-range":
            case "month":
            case "year":
            case "time":
                return `
    <app-datepicker
        v-model:value="single.${f.name}"
        ${f.type === "date-range" ? "range" : ""}
        :id="'${f.name}'"
        :placeholder="'${f.placeholder}'"
        format="${f.type === "time"
                        ? "HH:mm"
                        : f.type === "year"
                            ? "YYYY"
                            : f.type === "month"
                                ? "MM-YYYY"
                                : "DD-MM-YYYY"
                    }"
        value-type="${f.type === "time"
                        ? "HH:mm"
                        : f.type === "year"
                            ? "YYYY"
                            : f.type === "month"
                                ? "YYYY-MM"
                                : "YYYY-MM-DD"
                    }"
        type="${f.type}"
    />`;

            case "file":
                return `
    <FileUpload :title="\`Drop files here or click to upload.\`"
        :description="\`${f.placeholder}\`"
        :selected-files="single.${f.name}" @update:selected-files="(file: File[]) => single.${f.name} = file"
        :max-files="10" :allowed-extensions="['.jpg', '.png', '.jpeg']"
        :max-size-megabyte="10" />`;

            case "single-select":
            case "multiple-select":
                const capitalizeFormatted = f.name.charAt(0).toUpperCase() + f.name.slice(1);
                return `
    <${f.type == 'single-select' ? `SelectSingle` : `SelectMultiple`} v-model="single.${f.name}" :placeholder="'${f.placeholder}'"
        :options="selectListStore.selectList${capitalizeFormatted}"
        @on-search="selectListStore.getSelectList${capitalizeFormatted}"
        :loading="selectListStore.selectListLoading" :show_search="true"
        :serverside="true" :show_button_clear="true" />`;

            default:
                // TEXT (default)
                return `
    <input
        v-model="single.${f.name}"
        type="${f.type}"
        id="${f.name}"
        class="form-control"
        placeholder="${f.placeholder}"
        autocomplete="off"
    />`;
        }
    };

    const renderField = (f: any) => {
        const errorBlock = `
    <ErrorFormValidation :vfield="v$.single.${f.name}" label="${f.label}" />`;

        const requiredMark = f.required ? `<span class="text-danger">*</span>` : "";

        return `
<div class="${f.class} mb-5">
    <label
        for="${f.name}"
        class="form-label"
        :class="{ 'text-danger': v$.single.${f.name}.$error }"
    > ${f.label} ${requiredMark}
    </label>${renderInputByType(f)}${errorBlock}
</div>`;
    };

    const fieldBlocks = fields.map(renderField).join("\n");

    return `${fieldBlocks}`;
}
