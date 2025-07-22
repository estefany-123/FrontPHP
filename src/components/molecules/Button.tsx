import { Button } from "@heroui/button";


type propsBut = {
    text ?: React.ReactNode
    children? : React.ReactNode
    type? :"button" | "submit" | "reset" | undefined,
    isLoading? : boolean,
    form?:string, 
    className?: string,
    color? : "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    variant? : "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    onPress?: () => void
    disabled?: boolean
}


export default function Buton({text,children,type="button",className="",color,variant="solid",onPress, isLoading, form, disabled}:propsBut){
      const baseClasses = "text-white bg-blue-700"; 
    return(
        <Button form={form} isLoading={isLoading} onPress={onPress} className={`${baseClasses} ${className}`} type={type} color={color} variant={variant} disabled={disabled}>
            {text} {children}
        </Button>
    )
}



