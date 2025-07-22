
import { Input } from "@heroui/input";
import { Form } from '@heroui/form';
import { UpPerfil } from '@/types/Usuario';
import { useForm } from 'react-hook-form';
import { patchPerfil } from '@/axios/Usuarios/patchPerfil';
import Buton from '@/components/molecules/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Perfil, PerfilSchema } from '@/schemas/User';


type PropsPerfil = {
    inicialData: UpPerfil;
    onclose: () => void;
}

function FormPerfil({ inicialData, onclose }: PropsPerfil) {
    const { register, handleSubmit, formState: { errors } } = useForm<Perfil>({
        defaultValues: inicialData,
        resolver: zodResolver(PerfilSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: Perfil) => {
        try {
            const response = await patchPerfil(data);
            console.log("datos actualizados",response)
            onclose();
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    };

    return (
        <div>
            <Form
                onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4"
            >
                <Input
                    label="Nombre"
                    placeholder="Nombre"
                    {...register("nombre")}
                    isInvalid={!!errors.nombre}
                    errorMessage={errors.nombre?.message}
                />
                <Input
                    label="Apellido"
                    placeholder="Apellido"
                    {...register("apellido")}
                    isInvalid={!!errors.apellido}
                    errorMessage={errors.apellido?.message}



                />
                <Input
                    label="Edad"
                    placeholder="Edad"
                    type="text"
                    {...register("edad", {valueAsNumber:true})}
                    isInvalid={!!errors.edad}
                    errorMessage={errors.edad?.message}


                />
                <Input
                    label="Telefono"
                    placeholder="Telefono"
                    {...register("telefono")}
                    isInvalid={!!errors.telefono}
                    errorMessage={errors.telefono?.message}


                />
                <Input
                    label="Correo"
                    placeholder="Correo"
                    type="email"
                    {...register("correo")}
                    isInvalid={!!errors.correo}
                    errorMessage={errors.correo?.message}

                />
                <Input
                    label="Password"
                    placeholder="Contraseña"
                    type="password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}

                />
                <Buton type='submit'>Enviar</Buton>

            </Form>
        </div>




    )
}

export default FormPerfil