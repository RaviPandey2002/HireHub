import { TriangleAlert } from "lucide-react"


interface FromErrorProps{
    message?:string
}

export const FormError = ( { message }: FromErrorProps )=>{
    if(!message) return null;

    return (
        <div className="bg-red-200 shadow-red-500 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 ">
            <TriangleAlert className="h-4 w-4" />
            {message}
        </div>
    )
}