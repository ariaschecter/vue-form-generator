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
        v-model.number="single.${f.name}"
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
        format="${
          f.type === "time"
            ? "HH:mm"
            : f.type === "year"
            ? "YYYY"
            : f.type === "month"
            ? "MM-YYYY"
            : "DD-MM-YYYY"
        }"
        value-type="${
          f.type === "time"
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
      <FileUpload
        :id="'${f.name}'"
        :title="'Drop files here or click to upload.'"
        :description="getFileUploadDescription(field.metadata || {})"
        :max-files="parseInt(field.metadata?.fileUploadCount?.id ?? '1')"
        :max-size-megabyte="parseInt(field.metadata?.maxFileSize?.id ?? '10')"
        :allowed-extensions="getAllowedExtensions(field.metadata || {})"
        :selected-files="listFile"
      />`;

      case "radio":
      case "checkbox":
      case "select":
        return `
      <div v-if="['radio', 'checkbox', 'select'].includes('${f.type}')">
        <div class="d-flex flex-column gap-2">
          <div
            v-for="(option, i) in field.formFieldOptions"
            :key="i"
            class="d-flex align-items-center border rounded px-3 py-2"
          >
            <div class="me-3 d-flex align-items-center">
              <template v-if="field.type === 'radio'">
                <input class="form-check-input" type="radio" disabled />
              </template>
              <template v-else-if="field.type === 'checkbox'">
                <input class="form-check-input" type="checkbox" disabled />
              </template>
              <template v-else-if="field.type === 'select'">
                <h6 class="my-auto mb-0">{{ i + 1 }}.</h6>
              </template>
            </div>

            <input
              type="text"
              class="form-control border-0 shadow-none flex-grow-1"
              v-model="option.label"
              placeholder="Nama opsi"
            />

            <button
              v-if="field.formFieldOptions.length > 1"
              type="button"
              class="btn btn-link text-danger ms-2 p-0"
              @click="removeOption(field, i)"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-link text-primary mt-2 ps-0"
          @click="addOption(field)"
        >
          + Tambah Pilihan
        </button>
      </div>`;

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
    const errorBlock =`
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
    >
      ${f.label} ${requiredMark}
    </label>
    ${renderInputByType(f)}
    ${errorBlock}
  </div>`;
  };

  const fieldBlocks = fields.map(renderField).join("\n");

  return `<template>${fieldBlocks}
</template>`;
}
