import type { IColumn, IField } from "@/types";

export function generateReactiveFields(fields: IField[]): string {
    return fields
        .map((f) => {
            const tsType = mapFieldToTsType(f.type);

            return `    ${f.name}: ${tsType},`;
        })
        .join("\n");
}

function mapFieldToTsType(inputType: string): string {
    switch (inputType) {
        case "text":
        case "textarea":
        case "date":
        case "year":
        case "time":
        case "month":
            return "'' as string";
        case "date-range":
            return "['', ''] as [string, string]";
        case "single-select":
            return "{} as ISelectOption";
        case "multiple-select":
            return "[] as ISelectOption[]";

        case "number":
            return "0 as number";

        case "file":
            return "[] as File[]";

        default:
            return "'' as string"; // fallback
    }
}

export function generateValidationRules(fields: IField[]): string {
    return fields
        .map((f) => {
            let text = 'required';
            if (f.type === 'date-range') {
                text = `\n${' '.repeat(12)}0: { required }, \n${' '.repeat(12)}1: { required }\n${' '.repeat(7)}`;
            } else {
                text = 'required';
            }

            return `        ${f.name}: { ${f.required ? text : ''} },`;
        })
        .join("\n");
}

export function generatePayloadContent(fields: IField[]): string {
    return fields
        .map((f) => {
            // ===========================
            // VALUE DEFAULT (switch-case)
            // ===========================
            let text = "";
            switch (f.type) {
                case "text":
                case "textarea":
                case "date":
                case "year":
                case "time":
                case "month":
                case "number":
                    text = `single.${f.name}`;
                    break;

                case "date-range":
                    text = `[single.${f.name}[0], single.${f.name}[1]]`;
                    break;

                case "single-select":
                    text = `single.${f.name}?.id ?? ''`;
                    break;

                case "multiple-select":
                    text = `single.${f.name}?.map(v => v?.id ?? '') ?? []`;
                    break;

                case "file":
                    text = ";";
                    break;

                default:
                    text = `single.${f.name}`;
            }

            return `${' '.repeat(8)}${f.name}: ${text},`;
        })
        .join("\n");
}

export function generateEditAssignments(fields: IField[]): string {
    return fields
        .map((f) => {
            // ===========================
            // VALUE DEFAULT (switch-case)
            // ===========================
            let text = "";
            switch (f.type) {
                case "text":
                case "textarea":
                case "date":
                case "year":
                case "time":
                case "month":
                case "number":
                    text = `data.${f.name}`;
                    break;

                case "date-range":
                    text = `[single.${f.name}[0], single.${f.name}[1]]`;
                    break;

                case "single-select":
                    text = `{id: single.${f.name}?.id ?? '', text: single.${f.name}?.name ?? ''}`;
                    break;

                case "multiple-select":
                    text = `single.${f.name}?.map(v => ({ id: v?.id ?? '', text: v?.name ?? '' })) ?? []`;
                    break;

                case "file":
                    text = ";";
                    break;

                default:
                    text = `data.${f.name}`;
            }

            return `${' '.repeat(8)}single.${f.name} = ${text}`;
        })
        .join("\n");
}

export function generateResetFields(fields: IField[]): string {
    return fields
        .map((f) => {
            // ===========================
            // VALUE DEFAULT (switch-case)
            // ===========================
            let text = "";
            switch (f.type) {
                case "text":
                case "textarea":
                case "date":
                case "year":
                case "time":
                case "month":
                    text = `''`;
                    break;
                case "number":
                    text = `0`;
                    break;

                case "date-range":
                    text = `['', '']`;
                    break;

                case "single-select":
                    text = `{}`;
                    break;

                case "multiple-select":
                    text = `[]`;
                    break;

                case "file":
                    text = "[]";
                    break;

                default:
                    text = "''";
            }

            return `${' '.repeat(4)}single.${f.name} = ${text};`;
        })
        .join("\n");
}

export function generateListTableColumn(columns: IColumn[]): string {
    return columns
        .map((c) => {
            return `${' '.repeat(40)}<td class="text-center">{{ context.${c.model} }}</td>`;
        })
        .join("\n");
}
