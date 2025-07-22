import {
        Modal,
        ModalContent,
        ModalHeader,
        ModalBody,

} from "@heroui/modal";

type PropsModal = {
        ModalTitle?: string
        children: React.ReactNode
        isOpen?: boolean
        onOpenChange?: () => void
        size?: "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full"
}
export default function Modall({ ModalTitle, children, isOpen, onOpenChange, size }: PropsModal) {


        return (

                <Modal size={ size ?? "md"} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" isDismissable={false} >
                        <ModalContent>

                                <>
                                        <ModalHeader className="flex flex-col gap-1 text-center">{ModalTitle}</ModalHeader>
                                        <ModalBody>{children}</ModalBody>

                                </>

                        </ModalContent>

                </Modal>


        )
}