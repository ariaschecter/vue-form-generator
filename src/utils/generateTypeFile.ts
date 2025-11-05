/**
 * Generator TypeScript interface untuk entity dan payload (create/edit)
 * Berdasarkan inputan field normal & payload.
 */

export function generateTypeFile(
  name: string,
  normalFields: { name: string; type: string }[],
  payloadFields: { name: string; type: string }[]
): string {
  const formattedName =
    name.charAt(0).toUpperCase() +
    name.slice(1).replace(/-([a-z])/g, (_, g) => g.toUpperCase());

  const kebabName = formattedName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const baseInterface = `import { IDataTable } from "./global"

export interface I${formattedName} {
${normalFields.map((f) => `    ${f.name}: ${f.type}`).join(",\n")}
}

export interface IDataTable${formattedName} extends IDataTable {
    data: I${formattedName}[];
}

export interface I${formattedName}Detail extends I${formattedName} {
    createdAt: string;
}

export interface ICreate${formattedName}Payload {
${payloadFields.map((f) => `    ${f.name}: ${f.type}`).join(",\n")}
}

export interface IEdit${formattedName}Payload {
${payloadFields.map((f) => `    ${f.name}: ${f.type}`).join(",\n")}
}
`;

  return baseInterface;
}
