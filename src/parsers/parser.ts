import { promises as fs} from 'fs';
import {parse as csvParse} from 'csv-parse';
import {stringify as csvStringify} from 'csv-stringify';

/**
 * Reads a CSV file and returns a Promise of 2D string array.
 * @returns Promise resolving to a 2D array of strings.
 * @param [includeHeader=false] Whether to include the header row in the output.
 * @param filePath Path to the CSV file.
 */
export async function readCSVFile(filePath: string, includeHeader: boolean= false): Promise<string[][]> {
    try{
        const fileContent= await fs.readFile(filePath, 'utf8');
        return new Promise((resolve, reject)=>{
            csvParse(fileContent,
                 {trim:true,
                    skip_empty_lines:true
                 },
                  (err, records: string[][])=>{
                    if(err) return reject(err);
                    if(!includeHeader) records.shift();
                    resolve(records);
                });
            });
        } catch(error){
            throw new Error(`Error reading file: ${error}`);
            }
}

/**
 * Writes a 2D string array to a CSV file.
 * @param filePath Path to the output CSV file.
 * @param data 2D array of strings to write.
 */
export async function writeCSVFile(filePath: string, data: string[][]): Promise<void> {
    try{
        const csvContent= await new Promise <string>((resolve, reject)=>{
            csvStringify(data, (err, output)=>{
                if(err) return reject(err);
                resolve(output);
            });
        });
        await fs.writeFile(filePath, csvContent, 'utf8');
    }
    catch(error){
        throw new Error(`Error writing CSV file: ${error}`);
    }
}