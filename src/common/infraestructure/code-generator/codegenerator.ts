import { ICodeGenerator } from "src/common/application/code-generator-interface/code-generator.interface";

export class CodeGenerator implements ICodeGenerator<string>{
    getRandomIntInRange(min: number, max: number): string {
        const minInteger = Math.ceil(min)
        const maxInteger = Math.floor(max)
        const number= Math.floor(Math.random() * (maxInteger - minInteger + 1)) + minInteger;    
        return (number.toString())
    }
    generateCode(length: number): string {
        let code:string[]=[]
        for(let i=1;i<=length;i++){
            let number=Math.random()*13/2
            code.push(Math.floor(number).toString())
        }
        let response=code.join('')
        return(response)
    }

}