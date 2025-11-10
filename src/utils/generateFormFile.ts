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
    ></textarea>`;

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
            case "month":
            case "year":
            case "time":
                return `
    <app-datepicker
        v-model:value="single.${f.name}"
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
      `;

            case "radio":
            case "checkbox":
            case "select":
                return `
      `;

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
    <div v-if="v$.single.${f.name}.$error" class="text-danger">
        ${f.validationMessage}
    </div>`;

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
