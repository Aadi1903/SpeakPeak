// import React from 'react'
// import {FormControl, FormItem, FormLabel,
//     FormMessage} from "@/components/ui/form";
// import {Input} from "@/components/ui/input";
// import {Control, Controller, FieldValues, Path} from "react-hook-form";

// interface FormFieldProps<T extends FieldValues> {
//     control: Control<T>;
//     name: Path<T>;
//     label: string;
//     placeholder?: string;
//     type?: 'text' | 'email' | 'password' | 'file'
// }


// const FormField = <T extends FieldValues>({ control, name, label, placeholder }: FormFieldProps<T>) => (
//     <Controller
//         control={control}
//         name={name}
//         render={({ field }) => (
//             <FormItem>
//                 <FormLabel className="label">{label}</FormLabel>
//                 <FormControl>
//                     <Input 
//                         className="input" 
//                         placeholder={placeholder} 
//                         {...field} 
//                     />
//                 </FormControl>
//                 <FormMessage />
//             </FormItem>
//         )}
//     />
// );


// export default FormField













import React from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldValues, Path } from "react-hook-form"

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'file'
    required?: boolean
}

const FormField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = 'text',
    required = false
}: FormFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="space-y-1">
                    <FormLabel className="label">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input
                            className={`input ${fieldState.error ? 'border-red-500' : ''}`}
                            placeholder={placeholder}
                            type={type}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                </FormItem>
            )}
        />
    )
}

export default FormField