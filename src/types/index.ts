export interface IField {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    validationMessage: string;
    class: string;
    required: boolean;
}

export interface IColumn {
    text: string;
    sortBy: string;
    sortColumn: boolean;
    class: string;
    model: string;
}