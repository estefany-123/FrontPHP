import { getUsuarios } from "@/axios/Usuarios/getUsuarios";
import { postUsuarios } from "@/axios/Usuarios/postUsuario";
import { StateUsuario } from "@/axios/Usuarios/putStateUsuario";
import { updateUsuario } from "@/axios/Usuarios/putUsuario";
import { User, putUser } from "@/types/Usuario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

export function useUsuario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsuarios,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addUserMutation = useMutation({
    mutationFn: postUsuarios,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.log("Error al cargar el usuario", error);
    },
  });

  const getUserById = (id: number, usersList: User[]): User | null => {
    if (!usersList) return null;
    return usersList.find((user) => user.id === id) || null;
  };

  const updateUserMutation = useMutation({
    mutationFn: ({ idUser, data }: { idUser: number; data: putUser }) => {
      const { id, ...resto } = data;
      return updateUsuario(idUser, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateUsuario,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addUser = async (usuario: User) => {
    return addUserMutation.mutateAsync(usuario);
  };

  const updateUser = async (idUser: number, data: putUser) => {
    return updateUserMutation.mutateAsync({ idUser, data });
  };

  const changeState = async (id: number) => {
    return changeStateMutation.mutateAsync(id);
  };

  return {
    users: data,
    isLoading,
    isError,
    error,
    addUser,
    changeState,
    getUserById,
    updateUser,
  };
}
