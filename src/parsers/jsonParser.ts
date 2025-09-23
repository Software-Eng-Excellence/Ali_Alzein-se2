import{ promises as fs } from 'fs';


export async function parseJson(filepath: string): Promise<string[][]> {
    const data= await fs.readFile(filepath, 'utf8');
    const jsonData= JSON.parse(data);
    if(!Array.isArray(jsonData)){
        throw new Error("JSON data is not an array");
    }
    // return result;
    return jsonData;
}