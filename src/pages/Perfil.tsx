import Card1 from '@/components/molecules/Card';
import { usePerfil } from '@/hooks/Usuarios/usePerfil';
import { Avatar, Spinner } from '@heroui/react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import FormPerfil from '@/components/organismos/Usuarios/FormPerfil';
import Modall from '@/components/organismos/modal';
import { useQueryClient } from '@tanstack/react-query';

function Perfil() {
  const queryClient = useQueryClient();
  const { perfilInfo, isLoading, error, updatefoto } = usePerfil();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { setPerfil: setperfilcontext } = useAuth();

  if (isLoading) return <div><Spinner className="flex justify-center" /></div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!perfilInfo) return <div>No se encontraron datos del perfil</div>;

  function handleEditFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

   
    const tempUrl = URL.createObjectURL(file);
    queryClient.setQueryData(['perfil'], { ...perfilInfo, perfil: tempUrl });
    updatefoto.mutate(file, {
      onSuccess: (updated) => {
        setperfilcontext(updated.perfil);
        queryClient.setQueryData(['perfil'], updated);
       
      }
    });
  }

  const handleClose = () => setIsOpenModal(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark:text-white">
      <Card1 className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative dark:text-white">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsOpenModal(true)}
            className="absolute top-3 right-3 p-1 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <PencilIcon className="w-6 h-6 text-gray-600" />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center dark:text-white">
            {perfilInfo?.rol}
          </h1>

          <div className='relative w-32 h-32 rounded-full mb-4 border-4 border-blue-200 group'>
            <Avatar
              src={`http://127.0.0.1:8000/storage/${perfilInfo.perfil || 'users/defaultPerfil.png'}`}
              className="w-full h-full group-hover:opacity-70 transition duration-200"
            />
            
            <PencilIcon
              color='#fff'
              className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full p-6 opacity-0 group-hover:opacity-100 transition duration-200'
            />
            <input
              onChange={handleEditFoto}
              className='absolute top-0 left-0 w-full h-full rounded-full opacity-0'
              type='file'
              accept='image/png, image/jpeg'
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center dark:text-white">
            {perfilInfo.nombre} {perfilInfo.apellido}
          </h1>

          <div className="w-full space-y-3 text-gray-600 dark:text-white">
            <div className="flex justify-between">
              <span className="font-semibold">Documento:</span>
              <span>{perfilInfo.documento}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Edad:</span>
              <span>{perfilInfo.edad || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Teléfono:</span>
              <span>{perfilInfo.telefono || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Correo:</span>
              <span>{perfilInfo.correo}</span>
            </div>
          </div>
        </div>
      </Card1>

      <Modall ModalTitle='Editar Perfil' onOpenChange={handleClose} isOpen={isOpenModal}>
        <FormPerfil
          inicialData={{
            nombre: perfilInfo.nombre,
            apellido: perfilInfo.apellido,
            edad: perfilInfo.edad,
            telefono: perfilInfo.telefono,
            correo: perfilInfo.correo,
            password: ""
          }}
          onclose={() => setIsOpenModal(false)}
        />
      </Modall>
    </div>
  );
}

export default Perfil;
