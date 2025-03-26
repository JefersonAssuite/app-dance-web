// components/ui/Modal.js
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './button'; // Supondo que o Button é um componente existente
import { Input } from './input'; // Supondo que o Input é um componente existente

// Modal universal
const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

        {/* Content */}
        <Dialog.Content className="fixed inset-0 bg-white max-w-lg p-6 mx-auto rounded-lg shadow-lg z-50">
          <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>

          {/* Conteúdo do Modal */}
          {children}

          {/* Botão de Submissão */}
          <Dialog.Close asChild>
            <Button
              onClick={onSubmit}
              className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Salvar
            </Button>
          </Dialog.Close>

          {/* Fechar Modal */}
          <Dialog.Close asChild>
            <Button
              className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Fechar
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
