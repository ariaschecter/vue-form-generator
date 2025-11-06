/**
 * Generator TypeScript interface untuk entity dan payload (create/edit)
 * Berdasarkan inputan field normal & payload.
 */
export function generateTypeFile(
  name: string,
  normalFields: { name: string; type: string }[],
  payloadFields: { name: string; type: string }[]
): string {
  // Format nama entity, misalnya "event-category" => "EventCategory"
  const formattedName =
    name.charAt(0).toUpperCase() +
    name.slice(1).replace(/-([a-z])/g, (_, g) => g.toUpperCase());

  // Fungsi bantu untuk generate field block
  const renderFields = (fields: { name: string; type: string }[]) =>
    fields.map(f => `    ${f.name}: ${f.type};`).join("\n");

  // Template utama
  const baseInterface = `import { IDataTable } from "./global"

export interface I${formattedName} {
${renderFields(normalFields)}
}

export interface IDataTable${formattedName} extends IDataTable {
    data: I${formattedName}[];
}

export interface I${formattedName}Detail extends I${formattedName} {
    createdAt: string;
}

export interface ICreate${formattedName}Payload {
${renderFields(payloadFields)}
}

export interface IEdit${formattedName}Payload {
${renderFields(payloadFields)}
}
`;

  return baseInterface.trim() + "\n";
}
